import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  if (typeof window === 'undefined') {
    // Return a minimal client during SSR/build
    // This will be replaced when the component mounts in the browser
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async (credentials: { email: string }) => ({
          data: { user: { id: 'mock-user-id', email: credentials.email } },
          error: null
        }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      },
      from: (_table: string) => {
        const createMockChain = () => {
          const mockChain: Record<string, any> = {
            then: (resolve: (value: any) => void) => resolve({ data: [], error: null, count: 0 }),
            select: () => mockChain,
            insert: () => mockChain,
            update: () => mockChain,
            upsert: () => mockChain,
            delete: () => mockChain,
            eq: () => mockChain,
            neq: () => mockChain,
            gt: () => mockChain,
            gte: () => mockChain,
            lt: () => mockChain,
            lte: () => mockChain,
            like: () => mockChain,
            ilike: () => mockChain,
            in: () => mockChain,
            contains: () => mockChain,
            range: () => mockChain,
            order: () => mockChain,
            limit: () => mockChain,
            offset: () => mockChain,
            single: () => mockChain,
            maybeSingle: () => mockChain,
            csv: () => mockChain,
          };
          return mockChain;
        };
        return createMockChain();
      },
      channel: () => ({
        on: () => ({
          subscribe: () => ({ unsubscribe: () => { } })
        }),
        subscribe: () => ({ unsubscribe: () => { } })
      }),
      removeChannel: async () => { },
      removeAllChannels: async () => { },
    } as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
