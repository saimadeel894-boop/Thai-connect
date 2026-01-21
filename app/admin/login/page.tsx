"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check admin code first
      if (adminCode !== "Random001") {
        throw new Error("Invalid admin code");
      }

      const supabase = createClient();
      
      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Check if user profile exists and get role
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id);

      if (profileError) {
        console.error("Profile query error:", profileError);
        throw new Error("Could not verify admin status");
      }

      // If no profile exists, create one for admin
      if (!profiles || profiles.length === 0) {
        console.log("No profile found - creating admin profile");
        const { error: createError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.email?.split("@")[0] || "Admin",
            age: 30,
            gender: "Other",
            location: "Bangkok",
            role: "admin",
            online: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (createError) {
          console.error("Profile creation error:", createError);
          throw new Error(`Could not create admin profile: ${createError.message}`);
        }
      } else {
        const profile = profiles[0];

        // Update to admin if not already admin
        if (profile.role !== "admin") {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", data.user.id);

          if (updateError) {
            console.error("Role update error:", updateError);
            throw new Error("Could not update admin role");
          }
        }
      }

      // Success - redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to sign in as admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Header */}
      <header className="border-b border-gray-900 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/logo-thai.png" 
              alt="ThaiConnect" 
              className="h-24 w-auto"
            />
          </Link>

          {/* Back to Home */}
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Admin Access
            </h1>
            <p className="mt-2 text-gray-400">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-red-500 bg-gray-950 p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4 text-sm text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Admin Email
                </label>
                <input
                  type="email"
                  placeholder="admin@thaiconnect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Admin Code */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Admin Code
                </label>
                <input
                  type="password"
                  placeholder="Enter admin code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-500 px-6 py-4 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
