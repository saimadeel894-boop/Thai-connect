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
          (payload: { new: Record<string, unknown> }) => {
            const newMsg = payload.new as unknown as Message;
            console.log("New message received via realtime:", newMsg);
            setMessages((current) => {
              // Avoid duplicates
              const exists = current.some(msg => msg.id === newMsg.id);
              if (exists) return current;
              return [...current, newMsg];
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
          (payload: { new: Record<string, unknown> }) => {
            const updatedMsg = payload.new as unknown as Message;
            console.log("Message updated via realtime:", updatedMsg);
            setMessages((current) =>
              current.map((msg) =>
                msg.id === updatedMsg.id ? updatedMsg : msg
              )
            );
          }
        )
        .subscribe((status: string) => {
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
