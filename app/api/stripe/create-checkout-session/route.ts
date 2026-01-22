import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const { priceId, planType } = await req.json();

    if (!priceId || !planType) {
      return NextResponse.json({ error: 'Missing priceId or planType' }, { status: 400 });
    }

    // Get or create Stripe customer
    let customerId: string;

    // Check if user already has a Stripe customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Get user profile for email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', user.id)
        .single();

      // Dynamically import and create Stripe instance
      const { stripe } = await import('@/lib/stripe/server');
          
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });

      customerId = customer.id;
    }

    // Create Checkout Session
    const { stripe } = await import('@/lib/stripe/server');
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/user/payment/cancel`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
