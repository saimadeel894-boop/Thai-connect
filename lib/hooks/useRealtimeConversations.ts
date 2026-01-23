import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Conversation, Match, Profile, Message } from "@/types";

export function useRealtimeConversations(currentUserId: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!currentUserId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const loadConversations = async () => {
      setLoading(true);
      try {
        // Get all matches for current user
        const { data: matches, error: matchesError } = await supabase
          .from("matches")
          .select("*")
          .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
          .eq("status", "accepted");

        if (matchesError) {
          console.error("Error loading matches:", matchesError);
          setConversations([]);
          setLoading(false);
          return;
        }

        if (!matches || matches.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        // Get profiles and last messages for each match
        const conversationsData = await Promise.all(
          matches.map(async (match: any) => {
            const otherUserId =
              match.user_a === currentUserId ? match.user_b : match.user_a;

            // Get other user's profile
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", otherUserId)
              .single();

            // Get last message
            const { data: lastMessage } = await supabase
              .from("messages")
              .select("*")
              .eq("match_id", match.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            // Get unread count
            const { count: unreadCount } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("match_id", match.id)
              .eq("receiver_id", currentUserId)
              .eq("read", false);

            return {
              match,
              otherUser: profile as Profile,
              lastMessage: lastMessage as Message | undefined,
              unreadCount: unreadCount || 0,
            } as Conversation;
          })
        );

        // Sort by last message time
        conversationsData.sort((a, b) => {
          const aTime = a.lastMessage?.created_at || a.match.created_at;
          const bTime = b.lastMessage?.created_at || b.match.created_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });

        setConversations(conversationsData);
      } catch (error) {
        console.error("Error loading conversations:", error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          // Reload conversations when messages change
          loadConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
        },
        () => {
          // Reload conversations when matches change
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return { conversations, loading };
}
