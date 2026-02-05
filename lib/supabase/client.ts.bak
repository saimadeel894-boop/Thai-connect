import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  if (typeof window === 'undefined') {
    // Return a minimal client during SSR/build
    // This will be replaced when the component mounts in the browser
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => {},
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        eq: () => ({ select: () => ({ data: [], error: null }) }),
        insert: () => ({ error: null }),
        update: () => ({ error: null }),
      }),
    };
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
