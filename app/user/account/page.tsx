"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Settings, Mail, Phone, Lock, Trash2, AlertCircle } from "lucide-react";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("john.smith@example.com");
  const [phone, setPhone] = useState("+66 81 234 5678");
  const [facebookConnected, setFacebookConnected] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);

  const handleSave = () => {
    console.log("Saving account settings:", { email, phone, facebookConnected, googleConnected });
    alert("Account settings saved!");
  };

  const handleChangePassword = () => {
    alert("Change password - coming soon!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
      alert("Delete account - coming soon!");
    }
  };

  const handleToggleFacebook = () => {
    if (facebookConnected) {
      if (window.confirm("Disconnect Facebook account?")) {
        setFacebookConnected(false);
      }
    } else {
      alert("Connect Facebook - OAuth integration coming soon!");
      setFacebookConnected(true);
    }
  };

  const handleToggleGoogle = () => {
    if (googleConnected) {
      if (window.confirm("Disconnect Google account?")) {
        setGoogleConnected(false);
      }
    } else {
      alert("Connect Google - OAuth integration coming soon!");
      setGoogleConnected(true);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
              <p className="text-sm text-gray-400">Manage your account information</p>
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
          {/* Email Address */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Email Address</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white transition focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>You&apos;ll receive a verification email when you change your email address</span>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Phone Number</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white transition focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block rounded bg-green-500/20 px-2 py-1 text-xs font-bold text-green-500">
                  Verified
                </span>
                <span className="text-sm text-gray-400">Phone number verified</span>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Password</h2>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Last changed: 2 months ago</p>
              <button
                onClick={handleChangePassword}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <h2 className="mb-4 text-lg font-bold text-white">Connected Accounts</h2>

            <div className="space-y-3">
              {/* Facebook */}
              <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                    <span className="text-lg font-bold text-white">F</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Facebook</div>
                    <div className="text-sm text-gray-400">
                      {facebookConnected ? "Connected" : "Not connected"}
                    </div>
                  </div>
                </div>
                {facebookConnected ? (
                  <button
                    onClick={handleToggleFacebook}
                    className="text-sm font-medium text-red-500 transition hover:text-red-400"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleToggleFacebook}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100"
                  >
                    Connect
                  </button>
                )}
              </div>

              {/* Google */}
              <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                    <span className="text-lg font-bold text-white">G</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Google</div>
                    <div className="text-sm text-gray-400">
                      {googleConnected ? "Connected" : "Not connected"}
                    </div>
                  </div>
                </div>
                {googleConnected ? (
                  <button
                    onClick={handleToggleGoogle}
                    className="text-sm font-medium text-red-500 transition hover:text-red-400"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleToggleGoogle}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl bg-gray-900 p-6 border-2 border-red-500/50">
            <div className="mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-red-500">Danger Zone</h2>
            </div>

            <p className="mb-4 text-sm text-gray-400">
              Once you delete your account, there is no going back. Please be certain.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="w-full rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-red-50 hover:text-red-600"
            >
              Delete My Account
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
