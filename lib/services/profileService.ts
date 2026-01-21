import { createClient as createServerClient } from "@/lib/supabase/server";
import { Profile } from "@/types";
import { Member } from "@/components/user/MemberCard";

/**
 * Options for fetching profiles for the feed
 */
export interface GetProfilesOptions {
  limit?: number;
  offset?: number;
  excludeUserId?: string | null;
  sortBy?: "newest" | "online" | "popular";
  onlineOnly?: boolean;
  ageMin?: number;
  ageMax?: number;
  location?: string;
  gender?: string;
}

/**
 * Format last_seen timestamp to human-readable string
 */
function formatLastSeen(last_seen: string, online: boolean): string {
  if (online) return "Active now";

  const now = new Date();
  const lastSeen = new Date(last_seen);
  const diffMs = now.getTime() - lastSeen.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return lastSeen.toLocaleDateString();
}

/**
 * Convert Supabase Profile to Member format for UI
 */
export function profileToMember(profile: Profile): Member {
  return {
    id: profile.id,
    name: profile.name || "Unknown",
    email: profile.email,
    age: profile.age,
    gender: (profile.gender as "Male" | "Female" | "Other") || "Other",
    location: profile.location || "Unknown",
    distance: 0, // Skip distance calculation per requirements
    online: profile.online || false,
    lastSeen: formatLastSeen(profile.last_seen, profile.online || false),
    image: profile.profile_image || "",
    bio: profile.bio || "No bio yet",
    hasPhotos: (profile.photos?.length || 0) > 0,
    height: profile.height,
    createdAt: new Date(profile.created_at),
    popularity: 0, // Skip popularity calculation per requirements
  };
}

/**
 * Get profiles for the browse feed from Supabase
 */
export async function getProfilesForFeed(
  options: GetProfilesOptions = {}
): Promise<Member[]> {
  try {
    const {
      limit = 50,
      offset = 0,
      excludeUserId = null,
      sortBy = "online",
      onlineOnly = false,
      ageMin,
      ageMax,
      location,
      gender,
    } = options;

    // Try to create Supabase client
    let supabase;
    try {
      supabase = await createServerClient();
    } catch (clientError) {
      console.error("getProfilesForFeed: Failed to create Supabase client. Check env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local", clientError);
      return [];
    }

    if (!supabase) {
      console.error("getProfilesForFeed: Supabase client is null");
      return [];
    }

    let query = supabase.from("profiles").select("*");

    // Exclude current user
    if (excludeUserId) {
      query = query.neq("id", excludeUserId);
    }

    // Apply filters
    if (onlineOnly) {
      query = query.eq("online", true);
    }

    if (ageMin !== undefined) {
      query = query.gte("age", ageMin);
    }

    if (ageMax !== undefined) {
      query = query.lte("age", ageMax);
    }

    if (location && location !== "All Thailand") {
      query = query.eq("location", location);
    }

    if (gender && gender !== "All") {
      query = query.eq("gender", gender);
    }

    // Apply sorting
    if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "online") {
      query = query.order("online", { ascending: false }).order("created_at", {
        ascending: false,
      });
    } else if (sortBy === "popular") {
      // Since we don't have popularity field, sort by created_at as fallback
      query = query.order("created_at", { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("getProfilesForFeed: Supabase query error", error);
      return [];
    }

    if (!data) {
      console.log("getProfilesForFeed: No data returned from Supabase (database might be empty)");
      return [];
    }

    // Convert to Member format
    return data.map(profileToMember);
  } catch (error) {
    console.error("getProfilesForFeed: Unexpected error", error);
    return [];
  }
}

/**
 * Get a single profile by ID
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    let supabase;
    try {
      supabase = await createServerClient();
    } catch (clientError) {
      console.error("getProfileById: Failed to create Supabase client", clientError);
      return null;
    }

    if (!supabase) {
      console.error("getProfileById: Supabase client is null");
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("getProfileById: Supabase query error", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("getProfileById: Unexpected error", error);
    return null;
  }
}
