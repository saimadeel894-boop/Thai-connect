"use client";

import { useState } from "react";
import { Conversation } from "@/types";
import { formatMessageTime } from "@/lib/utils/dateUtils";
import { MessageCircle, MoreVertical, Ban, Flag } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  loading?: boolean;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  loading = false,
}: ConversationListProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleBlock = (conversationId: string) => {
    console.log("Blocking conversation:", conversationId);
    alert("User blocked");
    setOpenDropdownId(null);
  };

  const handleReport = (conversationId: string) => {
    console.log("Reporting conversation:", conversationId);
    alert("User reported");
    setOpenDropdownId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-red-500"></div>
          <p className="text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <MessageCircle className="mb-4 h-16 w-16 text-gray-700" />
        <h3 className="mb-2 text-xl font-bold text-white">No conversations yet</h3>
        <p className="text-gray-400">
          Start browsing members and send a message to connect!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800">
      {conversations.map((conversation) => {
        const isSelected = selectedConversationId === conversation.match.id;
        const hasUnread = conversation.unreadCount > 0;
        const isDropdownOpen = openDropdownId === conversation.match.id;

        return (
          <div
            key={conversation.match.id}
            className={`relative w-full p-4 transition hover:bg-gray-900 ${
              isSelected ? "bg-red-500" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <button
                onClick={() => onSelectConversation(conversation.match.id)}
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full"
              >
                {conversation.otherUser.profile_image ? (
                  <img
                    src={conversation.otherUser.profile_image}
                    alt={conversation.otherUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-red-500 text-white text-lg font-medium">
                    {conversation.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Online indicator */}
                {conversation.otherUser.online && (
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-gray-950 bg-green-500" />
                )}
              </button>

              {/* Content */}
              <button
                onClick={() => onSelectConversation(conversation.match.id)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <h3
                    className={`truncate font-semibold ${
                      hasUnread ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {conversation.otherUser.name}, {conversation.otherUser.age}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="shrink-0 text-xs text-gray-500">
                      {formatMessageTime(
                        new Date(conversation.lastMessage.created_at)
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`truncate text-sm ${
                      hasUnread ? "font-medium text-white" : "text-gray-400"
                    }`}
                  >
                    {conversation.lastMessage
                      ? conversation.lastMessage.content
                      : "No messages yet"}
                  </p>
                  {hasUnread && (
                    <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {conversation.otherUser.location}
                </p>
              </button>

              {/* Three Dots Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(isDropdownOpen ? null : conversation.match.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenDropdownId(null)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-lg border border-gray-800 bg-black shadow-2xl">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlock(conversation.match.id);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition hover:bg-gray-900"
                      >
                        <Ban className="h-4 w-4 text-gray-400" />
                        <span>Bloker</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReport(conversation.match.id);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition hover:bg-gray-900"
                      >
                        <Flag className="h-4 w-4 text-gray-400" />
                        <span>Anmeld</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
