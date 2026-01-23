"use client";

import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { MessageCircle, Mail } from "lucide-react";
import { Conversation } from "@/types";
import { formatMessageTime } from "@/lib/utils/dateUtils";

interface ChatDropdownProps {
  conversations: Conversation[];
  unreadCount: number;
}

export default function ChatDropdown({
  conversations,
  unreadCount,
}: ChatDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const recentConversations = conversations.slice(0, 5);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Chat icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800 text-white transition hover:border-gray-700"
      >
        <MessageCircle className="h-5 w-5" />
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
              <h3 className="font-semibold text-white">Messages</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Conversations */}
          <div className="max-h-96 overflow-y-auto">
            {recentConversations.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {recentConversations.map((conversation) => {
                  const hasUnread = conversation.unreadCount > 0;

                  return (
                    <button
                      key={conversation.match.id}
                      onClick={() => {
                        router.push("/user/messages");
                        setIsOpen(false);
                      }}
                      className="w-full p-4 text-left transition hover:bg-gray-900"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                          {conversation.otherUser.profile_image ? (
                            <NextImage
                              src={conversation.otherUser.profile_image}
                              alt={conversation.otherUser.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-red-500 text-white font-medium">
                              {conversation.otherUser.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                          {conversation.otherUser.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-950 bg-green-500" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-baseline justify-between gap-2">
                            <h4
                              className={`truncate text-sm font-semibold ${hasUnread ? "text-white" : "text-gray-300"
                                }`}
                            >
                              {conversation.otherUser.name}
                            </h4>
                            {conversation.lastMessage && (
                              <span className="shrink-0 text-xs text-gray-500">
                                {formatMessageTime(
                                  new Date(conversation.lastMessage.created_at)
                                )}
                              </span>
                            )}
                          </div>
                          <p
                            className={`truncate text-sm ${hasUnread
                              ? "font-medium text-white"
                              : "text-gray-400"
                              }`}
                          >
                            {conversation.lastMessage
                              ? conversation.lastMessage.content
                              : "No messages yet"}
                          </p>
                        </div>

                        {/* Unread badge */}
                        {hasUnread && (
                          <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Mail className="mb-3 h-12 w-12 text-gray-700" />
                <p className="text-sm text-gray-400">No messages yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800 bg-black p-3">
            <button
              onClick={() => {
                router.push("/user/messages");
                setIsOpen(false);
              }}
              className="w-full rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Open Inbox
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
