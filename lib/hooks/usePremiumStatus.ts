import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { checkPremiumStatus } from "@/lib/services/subscriptionService";

/**
 * Hook to check if current user has premium subscription
 */
export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      setUserId(user.id);
      const premium = await checkPremiumStatus(user.id);
      setIsPremium(premium);
    } catch (error) {
      console.error("Error checking premium status:", error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  return { isPremium, loading, userId, refresh: checkStatus };
}
