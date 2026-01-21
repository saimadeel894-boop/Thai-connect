import { createClient } from "@/lib/supabase/client";
import { Message, MessageInsert } from "@/types";

export async function sendMessage(
  matchId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<Message> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      match_id: matchId,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("messages")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("id", messageId);

  if (error) throw error;
}

export async function markConversationAsRead(
  matchId: string,
  userId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("messages")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("match_id", matchId)
    .eq("receiver_id", userId)
    .eq("read", false);

  if (error) throw error;
}

export async function getOrCreateMatch(
  userId: string,
  targetUserId: string
): Promise<string> {
  const supabase = createClient();

  // Check if match already exists
  const orderedUserA = userId < targetUserId ? userId : targetUserId;
  const orderedUserB = userId < targetUserId ? targetUserId : userId;

  const { data: existingMatches, error: fetchError } = await supabase
    .from("matches")
    .select("id")
    .eq("user_a", orderedUserA)
    .eq("user_b", orderedUserB);

  if (fetchError) {
    console.error("Error fetching match:", fetchError);
    throw new Error(`Failed to fetch match: ${fetchError.message}`);
  }

  if (existingMatches && existingMatches.length > 0) {
    return existingMatches[0].id;
  }

  // Create new match
  const { data: newMatch, error } = await supabase
    .from("matches")
    .insert({
      user_a: orderedUserA,
      user_b: orderedUserB,
      initiated_by: userId,
      status: "accepted", // Auto-accept for now
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating match:", error);
    throw new Error(`Failed to create match: ${error.message}`);
  }
  
  return newMatch.id;
}
