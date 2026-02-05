"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Message, Profile } from "@/types";
import { formatDistanceToNow } from "@/lib/utils/dateUtils";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  otherUser?: Profile;
  loading?: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  otherUser,
  loading = false,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-red-500"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4 text-6xl">💬</div>
          <h3 className="mb-2 text-xl font-bold text-white">No messages yet</h3>
          <p className="text-gray-400">
            Send a message to start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      style={{ scrollBehavior: "smooth" }}
    >
      {messages.map((message, index) => {
        const isCurrentUser = message.sender_id === currentUserId;
        const showTimestamp =
          index === 0 ||
          new Date(message.created_at).getTime() -
          new Date(messages[index - 1].created_at).getTime() >
          300000; // 5 minutes

        return (
          <div key={message.id}>
            {/* Timestamp divider */}
            {showTimestamp && (
              <div className="mb-4 flex justify-center">
                <span className="rounded-full bg-gray-900 px-3 py-1 text-xs text-gray-400">
                  {formatDistanceToNow(new Date(message.created_at))}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[70%] items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                {/* Avatar (only for other user) */}
                {!isCurrentUser && otherUser && (
                  <div className="mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full">
                    {otherUser.profile_image ? (
                      <Image
                        src={otherUser.profile_image}
                        alt={otherUser.name}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-red-500 text-white text-sm font-medium">
                        {otherUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                {/* Message content */}
                <div
                  className={`rounded-2xl px-4 py-2 ${isCurrentUser
                      ? "bg-red-500 text-white"
                      : "bg-gray-800 text-white"
                    }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {message.content}
                  </p>

                  {/* Read status for sent messages */}
                  {isCurrentUser && (
                    <div className="mt-1 flex justify-end">
                      <span className="text-xs opacity-70">
                        {message.read ? "Read" : "Sent"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
