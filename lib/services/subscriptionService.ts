import { createClient } from "@/lib/supabase/client";

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: "free" | "premium" | "premium_plus";
  status: "active" | "cancelled" | "expired" | "past_due" | "trialing";
  price_per_month: number;
  currency: string;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
}

/**
 * Check if user has active premium subscription
 */
export async function checkPremiumStatus(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, plan_type, current_period_end")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error || !data) {
      return false;
    }

    // Check if subscription is expired
    if (data.current_period_end) {
      const endDate = new Date(data.current_period_end);
      if (endDate < new Date()) {
        return false;
      }
    }

    // Check if plan is premium
    return data.plan_type === "premium" || data.plan_type === "premium_plus";
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
}

/**
 * Get user's subscription
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Subscription;
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
}

/**
 * Create a free subscription for new users
 */
export async function createFreeSubscription(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_type: "free",
        status: "active",
        price_per_month: 0,
        currency: "DKK",
        start_date: new Date().toISOString(),
      });

    if (error) {
      console.error("Error creating free subscription:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating free subscription:", error);
    return false;
  }
}
