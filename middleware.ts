import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Only apply Supabase middleware to auth routes
  // Skip for all other routes to allow development without Supabase credentials
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Only apply middleware to login, signup, and admin pages
    '/login',
    '/signup',
    '/admin/:path*',
  ],
};
