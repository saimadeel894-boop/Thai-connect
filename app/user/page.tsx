import { getProfilesForFeed } from "@/lib/services/profileService";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BrowseMembersPageClient from "./_components/BrowseMembersPageClient";

// Mark as dynamic since we use cookies for auth
export const dynamic = "force-dynamic";

export default async function BrowseMembersPage() {
  // Get current user ID to exclude from feed (best-effort)
  let currentUserId: string | null = null;
  let needsOnboarding = false;

  try {
    const supabase = await createClient();
    if (supabase) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        currentUserId = user?.id || null;

        // Check if user has completed onboarding
        if (currentUserId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("age, gender, location")
            .eq("id", currentUserId)
            .single();

          // If profile has placeholder values, redirect to onboarding
          if (profile && profile.age === 25 && profile.gender === "Other") {
            needsOnboarding = true;
          }
        }
      } catch (authError) {
        console.error(
          "BrowseMembersPage: Auth error (user might not be logged in)",
          authError
        );
        // Continue without user ID
      }
    }
  } catch (error) {
    console.error(
      "BrowseMembersPage: Failed to create Supabase client. Check .env.local for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      error
    );
    // Continue without user ID - will show all profiles
  }

  // Redirect to onboarding if profile incomplete
  if (needsOnboarding) {
    redirect("/user/onboarding");
  }

  // Fetch profiles from Supabase (fail-soft: returns [] on error)
  let members: Awaited<ReturnType<typeof getProfilesForFeed>> = [];
  try {
    members = await getProfilesForFeed({
      limit: 100, // Increased to show more profiles
      excludeUserId: currentUserId,
      sortBy: "newest", // Changed to newest so all profiles show
    });
  } catch (error) {
    console.error("BrowseMembersPage: Failed to fetch profiles", error);
    // members remains []
  }

  // Ensure we always pass an array
  const initialMembers = Array.isArray(members) ? members : [];

  return <BrowseMembersPageClient initialMembers={initialMembers} />;
}
