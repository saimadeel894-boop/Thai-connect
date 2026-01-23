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
        const createQueryBuilder = () => ({
          select: (columns?: string) => {
            const self = {
              eq: (column: string, value: any) => self, // Return self for chaining
              neq: (column: string, value: any) => self,
              gt: (column: string, value: any) => self,
              gte: (column: string, value: any) => self,
              lt: (column: string, value: any) => self,
              lte: (column: string, value: any) => self,
              like: (column: string, pattern: string) => self,
              ilike: (column: string, pattern: string) => self,
              in: (column: string, values: any[]) => self,
              contains: (column: string, value: any) => self,
              range: (start: number, end: number) => self,
              order: (column: string, options?: { ascending?: boolean }) => self,
              limit: (count: number) => self,
              offset: (count: number) => self,
              single: () => ({ data: null, error: null }), // Specific method that returns data
              maybeSingle: () => ({ data: null, error: null }),
              data: [],
              error: null,
            };
            return self;
          },
          insert: (values: any) => ({ error: null }),
          update: (values: any) => {
            const self = {
              eq: (column: string, value: any) => self,
              error: null,
            };
            return self;
          },
          delete: () => {
            const self = {
              eq: (column: string, value: any) => self,
              error: null,
            };
            return self;
          },
        });
        return createQueryBuilder();
      },
    };
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
