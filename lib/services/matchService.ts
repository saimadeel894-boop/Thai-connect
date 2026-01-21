import { createClient } from "@/lib/supabase/client";

/**
 * Get or create a match between two users
 * Uses the create_match SQL function which handles ordering and deduplication
 */
export async function getOrCreateMatch(
  currentUserId: string,
  targetUserId: string
): Promise<string | null> {
  try {
    const supabase = createClient();

    // Call the create_match function
    const { data, error } = await supabase.rpc("create_match", {
      target_user_id: targetUserId,
      initiator_user_id: currentUserId,
    });

    if (error) {
      console.error("Error creating match:", error);
      return null;
    }

    return data as string; // Returns match ID
  } catch (error) {
    console.error("Error in getOrCreateMatch:", error);
    return null;
  }
}

/**
 * Get all matches for a user
 */
export async function getUserMatches(userId: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .eq("status", "accepted");

    if (error) {
      console.error("Error getting matches:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserMatches:", error);
    return [];
  }
}
