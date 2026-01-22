import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  if (typeof window === 'undefined') {
    // Return a minimal client during SSR/build
    // This will be replaced when the component mounts in the browser
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => {},
        signInWithPassword: async (credentials: { email: string; password: string }) => ({ data: { user: { id: 'mock-user-id', email: credentials.email } }, error: null }),
      },
      from: (table: string) => {
        const queryBuilder = {
          select: (columns?: string) => {
            const chainedMethods = {
              eq: (column: string, value: any) => ({
                ...chainedMethods,
                single: () => ({ data: null, error: null }),
                data: [],
                error: null,
              }),
              single: () => ({ data: null, error: null }),
              order: (column: string, options?: { ascending?: boolean }) => ({
                ...chainedMethods,
                limit: (count: number) => ({ data: [], error: null }),
                data: [],
                error: null,
              }),
              limit: (count: number) => ({ data: [], error: null }),
              data: [],
              error: null,
            };
            return chainedMethods;
          },
          insert: (values: any) => ({ error: null }),
          update: (values: any) => ({
            eq: (column: string, value: any) => ({ error: null }),
            error: null,
          }),
          delete: () => ({
            eq: (column: string, value: any) => ({ error: null }),
            error: null,
          }),
        };
        return queryBuilder;
      },
    };
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
