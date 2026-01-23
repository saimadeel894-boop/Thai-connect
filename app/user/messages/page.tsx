"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Profile } from "@/types";
import ConversationList from "@/components/user/ConversationList";
import MessageList from "@/components/user/MessageList";
import MessageInput from "@/components/user/MessageInput";
import MessageFilters, { MessageFilterType } from "@/components/user/MessageFilters";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeConversations } from "@/lib/hooks/useRealtimeConversations";
import { useRealtimeMessages } from "@/lib/hooks/useRealtimeMessages";
import { sendMessage as sendMessageService, markConversationAsRead } from "@/lib/services/messageService";

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageFilter, setMessageFilter] = useState<MessageFilterType>("all");

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Load conversations with realtime
  const { conversations, loading } = useRealtimeConversations(currentUserId);

  // Load messages for selected conversation with realtime
  const { messages, loading: messagesLoading } = useRealtimeMessages(
    selectedConversationId
  );

  // Update selected user when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      const conversation = conversations.find(
        (c) => c.match.id === selectedConversationId
      );
      if (conversation) {
        setSelectedUser(conversation.otherUser);

        // Mark conversation as read
        if (currentUserId) {
          markConversationAsRead(selectedConversationId, currentUserId).catch(
            (error) => console.error("Error marking as read:", error)
          );
        }
      }
    }
  }, [selectedConversationId, conversations, currentUserId]);

  // Send message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !currentUserId || !selectedUser) return;

    try {
      await sendMessageService(
        selectedConversationId,
        currentUserId,
        selectedUser.id,
        content
      );
      // Message will be added via realtime subscription
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter((conv) =>
        conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Message filter
    switch (messageFilter) {
      case "unread":
        result = result.filter((conv) => conv.unreadCount > 0);
        break;
      case "newest":
        result.sort((a, b) => {
          const aTime = a.lastMessage?.created_at || a.match.created_at;
          const bTime = b.lastMessage?.created_at || b.match.created_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
        break;
      case "oldest":
        result.sort((a, b) => {
          const aTime = a.lastMessage?.created_at || a.match.created_at;
          const bTime = b.lastMessage?.created_at || b.match.created_at;
          return new Date(aTime).getTime() - new Date(bTime).getTime();
        });
        break;
      case "all":
      default:
        // Default sort by newest
        result.sort((a, b) => {
          const aTime = a.lastMessage?.created_at || a.match.created_at;
          const bTime = b.lastMessage?.created_at || b.match.created_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
        break;
    }

    return result;
  }, [conversations, searchQuery, messageFilter]);

  // Count unread messages
  const unreadCount = useMemo(
    () => conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
    [conversations]
  );

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Header */}
      <header className="border-b border-gray-900 bg-black">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/user"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">Messages</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="flex w-full flex-col border-r border-gray-900 bg-black md:w-96">
          {/* Search */}
          <div className="border-b border-gray-900 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* Message Filters */}
          <MessageFilters
            activeFilter={messageFilter}
            onFilterChange={setMessageFilter}
            unreadCount={unreadCount}
          />

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={filteredConversations}
              selectedConversationId={selectedConversationId || undefined}
              onSelectConversation={setSelectedConversationId}
              loading={loading}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden flex-1 flex-col bg-gray-950 md:flex">
          {selectedConversationId && selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-gray-900 bg-black p-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  {selectedUser.profile_image ? (
                    <Image
                      src={selectedUser.profile_image}
                      alt={selectedUser.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-red-500 text-white text-lg font-medium">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {selectedUser.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-green-500" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-white">
                    {selectedUser.name}, {selectedUser.age}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {selectedUser.online ? "Online now" : "Offline"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
                otherUser={selectedUser}
                loading={messagesLoading}
              />

              {/* Input */}
              <MessageInput
                onSend={handleSendMessage}
                placeholder={`Message ${selectedUser.name}...`}
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl">💬</div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  Select a conversation
                </h3>
                <p className="text-gray-400">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
