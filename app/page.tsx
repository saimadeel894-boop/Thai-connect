import Link from "next/link";
import Image from "next/image";
import { UserCheck, MessageCircle, Shield, Sparkles } from "lucide-react";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import FeatureCard from "@/components/user/FeatureCard";
import StatItem from "@/components/user/StatItem";
import ProfileCard from "@/components/user/ProfileCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-900 bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-thai.png"
              alt="ThaiConnect"
              width={150}
              height={96}
              className="h-24 w-auto"
              priority
            />
          </Link>

          {/* Sign In Button */}
          <Link href="/user">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <Badge icon="💕">
                #1 Thai Dating Platform
              </Badge>

              <h1 className="mt-8 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Find Your
                <br />
                <span className="text-red-500">Perfect Match</span>
              </h1>

              <p className="mt-6 text-lg text-gray-400 sm:text-xl">
                Connect with thousands of verified Thai singles looking for
                genuine relationships. Start your journey to find love today.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free →
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gray-800 pt-8">
                <StatItem value="50K+" label="Active Members" />
                <StatItem value="10K+" label="Success Stories" />
                <StatItem value="24/7" label="Support" />
              </div>
            </div>

            {/* Right Content - Profile Cards */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <ProfileCard
                    name="Ploy"
                    age={24}
                    location="Bangkok"
                    image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop"
                    isOnline={true}
                  />
                </div>
                <div className="space-y-6">
                  <ProfileCard
                    name="Nisa"
                    age={26}
                    location="Chiang Mai"
                    image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop"
                    isOnline={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold sm:text-5xl">
              Why Choose ThaiConnect?
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Everything you need to find meaningful connections
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<UserCheck className="h-10 w-10" />}
              title="Verified Profiles"
              description="Connect with real, verified Thai singles"
            />
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10" />}
              title="Instant Chat"
              description="Start conversations immediately"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Safe & Secure"
              description="Your privacy is our priority"
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10" />}
              title="Smart Matching"
              description="Find your perfect match faster"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-gradient-to-r from-red-600 to-red-500 p-12 text-center sm:p-16">
            <h2 className="text-4xl font-bold sm:text-5xl">
              Ready to Find Love?
            </h2>
            <p className="mt-4 text-lg text-red-50 sm:text-xl">
              Join thousands of singles who found their perfect match on
              ThaiConnect
            </p>
            <Link href="/signup" className="mt-8 inline-block">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-900"
              >
                Start Your Journey Now →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-thai.png"
                  alt="ThaiConnect"
                  width={150}
                  height={96}
                  className="h-24 w-auto"
                />
              </Link>
              <p className="mt-4 text-sm text-gray-400">
                The most trusted Thai dating platform connecting hearts
                worldwide.
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 font-semibold text-white">Company</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 font-semibold text-white">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 font-semibold text-white">Legal</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-900 pt-8 text-center text-sm text-gray-400">
            © 2024 ThaiConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
