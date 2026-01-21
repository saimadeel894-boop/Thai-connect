"use client";

import { useState } from "react";
import { X, Crown, Eye, Heart, Zap, Star, MessageCircle, Ban, Filter, CheckCheck } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlanType = "monthly" | "yearly";

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");

  if (!isOpen) return null;

  const handleUpgrade = () => {
    // Redirect to Stripe Payment Link
    const paymentLink = selectedPlan === "monthly"
      ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PAYMENT_LINK || "https://buy.stripe.com/aFa3cv4IndrC5o76NJ6Na02"
      : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PAYMENT_LINK || "https://buy.stripe.com/3cI28r7Uz2MY2bVegb6Na03";
    
    window.location.href = paymentLink;
  };

  const premiumFeatures = [
    { icon: Eye, label: "See who liked you", color: "text-red-500" },
    { icon: MessageCircle, label: "Unlimited messages", color: "text-gray-400" },
    { icon: Heart, label: "Unlimited likes", color: "text-gray-400" },
    { icon: Zap, label: "5 Super Likes per day", color: "text-gray-400" },
    { icon: Star, label: "Boost your profile monthly", color: "text-gray-400" },
    { icon: Ban, label: "No ads", color: "text-gray-400" },
    { icon: Filter, label: "Advanced filters", color: "text-gray-400" },
    { icon: CheckCheck, label: "Read receipts", color: "text-gray-400" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-black border border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-gray-800 p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
              <Crown className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Upgrade to Premium</h2>
              <p className="text-sm text-gray-400">Get unlimited access to all features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Plan */}
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`relative rounded-2xl p-6 text-left transition ${
                selectedPlan === "monthly"
                  ? "bg-red-500/10 border-2 border-red-500"
                  : "bg-gray-900 border-2 border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-400">Monthly</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">299</span>
                  <span className="text-gray-400">DKK/month</span>
                </div>
              </div>
            </button>

            {/* Yearly Plan */}
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`relative rounded-2xl p-6 text-left transition ${
                selectedPlan === "yearly"
                  ? "bg-red-500/10 border-2 border-red-500"
                  : "bg-gray-900 border-2 border-gray-800 hover:border-gray-700"
              }`}
            >
              {/* Save Badge */}
              <div className="absolute -top-2 -right-2">
                <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  Save 30%
                </span>
              </div>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-400">Yearly</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">2,499</span>
                  <span className="text-gray-400">DKK</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">Billed annually</div>
              </div>
            </button>
          </div>

          {/* Premium Features */}
          <div className="rounded-2xl bg-gray-900 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Premium Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  <span className="text-sm font-medium text-white">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Button */}
          <button
            onClick={handleUpgrade}
            className="w-full rounded-xl bg-red-500 px-6 py-4 font-bold text-white transition hover:bg-red-600 flex items-center justify-center gap-2"
          >
            <Crown className="h-5 w-5" />
            Upgrade Now
          </button>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500">
            Cancel anytime. Your subscription will renew automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
