"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Checkbox from "@/components/shared/Checkbox";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Success - redirect to user page
      router.push("/user");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
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
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Welcome Back
            </h1>
            <p className="mt-2 text-gray-400">
              Sign in to continue to ThaiConnect
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
              <Input
                type="email"
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-white">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-sm text-red-500 hover:text-red-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-0"
                />
              </div>

              {/* Remember Me */}
              <Checkbox id="remember" label="Remember me" />

              {/* Sign In Button */}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-red-500 hover:text-red-400">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
