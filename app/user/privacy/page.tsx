"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Shield, Eye, Lock, UserX, AlertTriangle } from "lucide-react";

type VisibilityOption = "everyone" | "matches" | "premium";

export default function PrivacyPage() {
  const router = useRouter();
  const [profileVisibility, setProfileVisibility] = useState<VisibilityOption>("everyone");
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLastActive, setShowLastActive] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [whoCanMessage, setWhoCanMessage] = useState<VisibilityOption>("matches");

  const handleSave = () => {
    console.log("Saving privacy settings:", {
      profileVisibility,
      showOnlineStatus,
      showLastActive,
      incognitoMode,
      whoCanMessage,
    });
    alert("Privacy settings saved!");
  };

  const handleBlockUser = () => {
    alert("Block user functionality - coming soon!");
  };

  const handleReportUser = () => {
    alert("Report user functionality - coming soon!");
  };

  const visibilityOptions = [
    {
      value: "everyone" as VisibilityOption,
      label: "Everyone",
      description: "Anyone can see your profile",
    },
    {
      value: "matches" as VisibilityOption,
      label: "Matches",
      description: "Only people you match with",
    },
    {
      value: "premium" as VisibilityOption,
      label: "Premium",
      description: "Only premium members",
    },
  ];

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Privacy & Safety</h1>
              <p className="text-sm text-gray-400">Control who can see and contact you</p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Profile Visibility</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Who can see my profile
              </label>
              <div className="space-y-3">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setProfileVisibility(option.value)}
                    className={`w-full rounded-xl p-4 text-left transition ${
                      profileVisibility === option.value
                        ? "bg-red-500/10 border-2 border-red-500"
                        : "bg-gray-800 border-2 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Status */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <h2 className="mb-4 text-lg font-bold text-white">Activity Status</h2>

            <div className="space-y-4">
              {/* Show Online Status */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Show Online Status</div>
                  <div className="text-sm text-gray-400">
                    Let others see when you&apos;re online
                  </div>
                </div>
                <button
                  onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    showOnlineStatus ? "bg-red-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      showOnlineStatus ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Show Last Active */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Show Last Active</div>
                  <div className="text-sm text-gray-400">
                    Display when you were last online
                  </div>
                </div>
                <button
                  onClick={() => setShowLastActive(!showLastActive)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    showLastActive ? "bg-red-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      showLastActive ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Incognito Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Incognito Mode</div>
                  <div className="text-sm text-gray-400">
                    Browse profiles without being seen
                  </div>
                </div>
                <button
                  onClick={() => setIncognitoMode(!incognitoMode)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    incognitoMode ? "bg-red-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      incognitoMode ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Messaging */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Messaging</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Who can message me
              </label>
              <div className="space-y-3">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setWhoCanMessage(option.value)}
                    className={`w-full rounded-xl p-4 text-left transition ${
                      whoCanMessage === option.value
                        ? "bg-red-500/10 border-2 border-red-500"
                        : "bg-gray-800 border-2 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-medium text-white">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blocked Users */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Blocked Users</h2>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400">No blocked users</p>
            </div>

            <button
              onClick={handleBlockUser}
              className="w-full rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-gray-100"
            >
              Block User
            </button>
          </div>

          {/* Report User */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Report User</h2>
            </div>

            <button
              onClick={handleReportUser}
              className="w-full rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-gray-100"
            >
              Report a User
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-red-500 px-6 py-4 font-bold text-white transition hover:bg-red-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
