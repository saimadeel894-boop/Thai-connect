"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Create minimal profile after signup (will be completed in onboarding)
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            email: email,
            name: name, // Temporary - user completes in onboarding
            age: 25, // Placeholder - will be updated
            gender: "Other", // Placeholder - will be updated
            location: "Bangkok", // Placeholder - will be updated
            bio: null, // NULL - nothing set yet
            profile_image: null, // NULL - no image
            phone: null,
            height: null,
            weight: null,
            interests: [],
            online: true,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't throw - auth succeeded, profile can be created later
        }

        // Ensure user is logged in (sign in with same credentials)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error("Auto sign-in error:", signInError);
          // Still redirect to onboarding - they can log in manually if needed
        }
      }

      // Success - redirect to onboarding page
      router.push("/user/onboarding");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to sign up");
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
              Create Account
            </h1>
            <p className="mt-2 text-gray-400">
              Start your journey to find love today
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
              {/* Name */}
              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

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
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Confirm Password */}
              <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {/* Terms */}
              <p className="text-xs text-gray-400">
                By signing up, you agree to our{" "}
                <Link href="#" className="text-red-500 hover:text-red-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-red-500 hover:text-red-400">
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Sign Up Button */}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </div>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-red-500 hover:text-red-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
