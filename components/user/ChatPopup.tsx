"use client";

import { useState } from "react";
import NextImage from "next/image";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { Profile, Message } from "@/types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatPopupProps {
  otherUser: Profile;
  currentUserId: string;
  onClose: () => void;
  onSendMessage: (content: string) => Promise<void>;
  messages: Message[];
  loading?: boolean;
}

export default function ChatPopup({
  otherUser,
  currentUserId,
  onClose,
  onSendMessage,
  messages,
  loading = false,
}: ChatPopupProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (content: string) => {
    setIsSending(true);
    try {
      await onSendMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-950 shadow-2xl transition-all ${isMinimized ? "h-16 w-80" : "h-[600px] w-96"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            {otherUser.profile_image ? (
              <NextImage
                src={otherUser.profile_image}
                alt={otherUser.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-red-500 text-white font-medium">
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Online indicator */}
            {otherUser.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500" />
            )}
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-semibold text-white">
              {otherUser.name}
            </h3>
            <p className="text-xs text-gray-400">
              {otherUser.online ? "Online now" : "Offline"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat content (hidden when minimized) */}
      {!isMinimized && (
        <>
          {/* Messages */}
          <MessageList
            messages={messages}
            currentUserId={currentUserId}
            otherUser={otherUser}
            loading={loading}
          />

          {/* Input */}
          <MessageInput
            onSend={handleSend}
            disabled={isSending}
            placeholder={`Message ${otherUser.name}...`}
          />
        </>
      )}
    </div>
  );
}
