import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types";

/**
 * Polling-based messages hook (fallback when realtime doesn't work)
 * Checks for new messages every 2 seconds
 */
export function usePollingMessages(matchId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!matchId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("match_id", matchId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    };

    // Load initially
    loadMessages();

    // Poll every 2 seconds
    const interval = setInterval(loadMessages, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [matchId, supabase]);

  return { messages, loading };
}
