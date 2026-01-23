"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Settings as SettingsIcon } from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();

  const checkAdminAccess = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-gray-400">
          Configure platform settings and preferences
        </p>
      </div>

      {/* Coming Soon */}
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-800 bg-gray-950">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
            <SettingsIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Coming Soon</h3>
          <p className="text-gray-400">
            Settings feature will be available soon
          </p>
        </div>
      </div>
    </div>
  );
}
