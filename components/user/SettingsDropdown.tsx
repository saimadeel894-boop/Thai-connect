"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Crown,
  CreditCard,
  MapPin,
  Shield,
  User as UserIcon,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SettingsDropdownProps {
  onOpenPremium?: () => void;
}

export default function SettingsDropdown({ onOpenPremium }: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile && profile.role === "admin") {
          setIsAdmin(true);
        }
      }
    };
    checkAdmin();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: Crown,
      label: "Upgrade to Premium",
      onClick: () => {
        if (onOpenPremium) {
          onOpenPremium();
        }
        setIsOpen(false);
      },
      className: "text-yellow-500",
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      onClick: () => {
        router.push("/user/payment");
        setIsOpen(false);
      },
    },
    {
      icon: MapPin,
      label: "Location Settings",
      onClick: () => {
        router.push("/user/location");
        setIsOpen(false);
      },
    },
    {
      icon: Shield,
      label: "Privacy & Safety",
      onClick: () => {
        router.push("/user/privacy");
        setIsOpen(false);
      },
    },
    {
      icon: UserIcon,
      label: "Account Settings",
      onClick: () => {
        router.push("/user/account");
        setIsOpen(false);
      },
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      {/* Settings icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-800 text-white transition hover:border-gray-700 sm:flex"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-lg border border-gray-800 bg-black shadow-2xl">
          {/* Menu Items */}
          <div className="divide-y divide-gray-800">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-900"
              >
                <item.icon
                  className={`h-5 w-5 ${item.className || "text-gray-400"}`}
                />
                <span className="text-sm font-medium text-white">
                  {item.label}
                </span>
              </button>
            ))}

            {/* Admin Link - Only for admins */}
            {isAdmin && (
              <button
                onClick={() => {
                  router.push("/admin");
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-900"
              >
                <ShieldCheck className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-red-500">
                  Go Admin
                </span>
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-900"
            >
              <LogOut className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-red-500">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
