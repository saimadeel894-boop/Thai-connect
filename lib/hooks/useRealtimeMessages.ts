import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types";
import { RealtimeChannel } from "@supabase/supabase-js";

export function useRealtimeMessages(matchId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!matchId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("match_id", matchId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        console.log("Loaded messages:", data);
        setMessages(data || []);
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    const setupRealtimeSubscription = () => {
      console.log("Setting up realtime subscription for match:", matchId);
      
      channel = supabase
        .channel(`messages:${matchId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `match_id=eq.${matchId}`,
          },
          (payload) => {
            console.log("New message received via realtime:", payload.new);
            setMessages((current) => {
              // Avoid duplicates
              const exists = current.some(msg => msg.id === payload.new.id);
              if (exists) return current;
              return [...current, payload.new as Message];
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `match_id=eq.${matchId}`,
          },
          (payload) => {
            console.log("Message updated via realtime:", payload.new);
            setMessages((current) =>
              current.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            );
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
        });
    };

    loadMessages();
    setupRealtimeSubscription();

    return () => {
      console.log("Cleaning up realtime subscription");
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [matchId, supabase]);

  return { messages, loading, setMessages };
}
