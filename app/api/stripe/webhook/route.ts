import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

/**
 * Runtime-safe helpers:
 * Stripe typing may differ depending on SDK version / wrapper types.
 * So we read fields defensively.
 */
function getSubscriptionPeriodStart(sub: Stripe.Subscription): number | null {
  const anySub = sub as any;
  return typeof anySub.current_period_start === 'number' ? anySub.current_period_start : null;
}

function getSubscriptionPeriodEnd(sub: Stripe.Subscription): number | null {
  const anySub = sub as any;
  return typeof anySub.current_period_end === 'number' ? anySub.current_period_end : null;
}

function unwrapStripeSubscription(maybeWrapped: any): Stripe.Subscription {
  // Some wrappers return { data: Subscription } or Response<Subscription>
  if (maybeWrapped && typeof maybeWrapped === 'object' && 'data' in maybeWrapped) {
    return maybeWrapped.data as Stripe.Subscription;
  }
  return maybeWrapped as Stripe.Subscription;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        const userId = session.metadata?.user_id;
        const planType = session.metadata?.plan_type || 'premium';

        if (!userId) {
          console.error('No user_id in session metadata');
          break;
        }

        // Get subscription details from Stripe (runtime-safe unwrap)
        const stripeSubscriptionRes = await stripe.subscriptions.retrieve(subscriptionId);
        const stripeSubscription = unwrapStripeSubscription(stripeSubscriptionRes);

        const periodStart = getSubscriptionPeriodStart(stripeSubscription);
        const periodEnd = getSubscriptionPeriodEnd(stripeSubscription);

        // Calculate price per month
        let pricePerMonth = 0;
        if (stripeSubscription.items?.data?.[0]) {
          const price = stripeSubscription.items.data[0].price;
          const unitAmount = price.unit_amount || 0;

          if (price.recurring?.interval === 'year') {
            pricePerMonth = unitAmount / 100 / 12;
          } else {
            pricePerMonth = unitAmount / 100;
          }
        }

        // Upsert subscription in DB
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_type: planType,
            status: 'active',
            price_per_month: pricePerMonth,
            currency: 'DKK',
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
            current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            start_date: periodStart ? new Date(periodStart * 1000).toISOString() : null,
          });

        if (subError) {
          console.error('Error creating/updating subscription:', subError);
        }

        // Create transaction record
        const { error: txError } = await supabase.from('transactions').insert({
          user_id: userId,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: 'DKK',
          status: 'succeeded',
          type: 'subscription',
          description: `${planType} subscription payment`,
          plan_name: planType,
          stripe_payment_intent_id: session.payment_intent as string,
        });

        if (txError) {
          console.error('Error creating transaction:', txError);
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        const periodStart = getSubscriptionPeriodStart(subscription);
        const periodEnd = getSubscriptionPeriodEnd(subscription);

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status as any,
            current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
            current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription:', error);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            ended_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error cancelling subscription:', error);
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('user_id, plan_type')
            .eq('stripe_subscription_id', invoice.subscription as string)
            .single();

          if (sub) {
            const { error } = await supabase.from('transactions').insert({
              user_id: sub.user_id,
              amount: invoice.amount_paid / 100,
              currency: 'DKK',
              status: 'succeeded',
              type: 'subscription',
              description: `${sub.plan_type} subscription renewal`,
              plan_name: sub.plan_type,
              stripe_invoice_id: invoice.id,
              stripe_charge_id: invoice.charge as string,
              invoice_url: invoice.hosted_invoice_url,
            });

            if (error) {
              console.error('Error creating renewal transaction:', error);
            }
          }
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const { error } = await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string);

          if (error) {
            console.error('Error setting subscription to past_due:', error);
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
