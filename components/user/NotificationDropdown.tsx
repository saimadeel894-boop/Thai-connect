"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Heart, MessageCircle, Users } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils/dateUtils";

export interface Notification {
  id: string;
  type: "match" | "like" | "message" | "view";
  content: string;
  relatedUserName: string;
  relatedUserImage?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "match":
        return <Users className="h-5 w-5 text-red-500" />;
      case "like":
        return <Heart className="h-5 w-5 text-pink-500" />;
      case "message":
        return <MessageCircle className="h-5 w-5 text-red-500" />;
      case "view":
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800 text-white transition hover:border-gray-700"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-lg border border-gray-800 bg-black shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-800 bg-black p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <>
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {unreadCount} new
                    </span>
                    {onMarkAllAsRead && (
                      <button
                        onClick={onMarkAllAsRead}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Mark all read
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {recentNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read && onMarkAsRead) {
                        onMarkAsRead(notification.id);
                      }
                    }}
                    className={`w-full p-4 text-left transition hover:bg-gray-900 ${!notification.read ? "bg-gray-900/30" : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm ${!notification.read
                              ? "font-medium text-white"
                              : "text-gray-300"
                            }`}
                        >
                          {notification.content}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt))}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="mb-3 h-12 w-12 text-gray-700" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
