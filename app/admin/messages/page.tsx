"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, Trash2 } from "lucide-react";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAdminAccess();
    loadMessages();
  }, []);

  const checkAdminAccess = async () => {
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
  };

  const loadMessages = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id(name, email),
        receiver:receiver_id(name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    setMessages(data || []);
    setLoading(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (error) {
      alert("Failed to delete message: " + error.message);
    } else {
      alert("Message deleted successfully");
      loadMessages();
    }
  };

  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.sender?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.receiver?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-red-500"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="mt-2 text-gray-400">
            View and moderate all messages on the platform
          </p>
        </div>
        <div className="text-2xl font-bold text-white">
          {filteredMessages.length} Messages
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        />
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Sender & Receiver */}
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <span className="font-medium text-white">
                    {msg.sender?.name || "Unknown"}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="font-medium text-white">
                    {msg.receiver?.name || "Unknown"}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Message Content */}
                <div className="text-gray-300">{msg.content}</div>

                {/* Email Info */}
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>{msg.sender?.email}</span>
                  <span>→</span>
                  <span>{msg.receiver?.email}</span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="rounded-lg bg-red-500/10 p-2 text-red-500 transition hover:bg-red-500/20"
                title="Delete message"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-950 py-12 text-center text-gray-400">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
}
