"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadUserData();

    // Redirect to main page after 5 seconds
    const timeout = setTimeout(() => {
      router.push("/user");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  const loadUserData = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserName(profile.name);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div className="absolute -right-2 -top-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                <Crown className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="mb-2 text-3xl font-bold text-white">
          Velkommen til Premium!
        </h1>
        <p className="mb-8 text-lg text-gray-400">
          {userName ? `Tak, ${userName}! ` : ""}
          Din betaling er gennemført
        </p>

        {/* Premium Benefits */}
        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left">
          <h2 className="mb-4 text-lg font-bold text-white">
            Du har nu adgang til:
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Ubegrænsede matches og beskeder</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Se hvem der har liket dig</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Avancerede filtre</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Læsekvitteringer</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>Ingen annoncer</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/user")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-4 font-bold text-white transition hover:bg-red-600"
        >
          Start med at browse
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Auto redirect notice */}
        <p className="mt-4 text-sm text-gray-500">
          Du bliver automatisk sendt videre om et øjeblik...
        </p>
      </div>
    </div>
  );
}
