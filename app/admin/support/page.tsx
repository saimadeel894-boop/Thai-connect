"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Filter,
  Clock,
  AlertCircle,
  Bot,
  User,
  Send,
  X,
  MessageSquare,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface SupportTicket {
  id: string;
  user_name: string;
  user_email: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "closed";
  assignedTo: "AI" | string;
  created_at: string;
  last_activity: string;
  messages_count: number;
  escalated: boolean;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messageInput, setMessageInput] = useState("");

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");

  const checkAdminAccess = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
    setTimeout(() => setLoading(false), 800);
  }, [checkAdminAccess]);

  // Mock support tickets - will be replaced with real data later
  const mockTickets: SupportTicket[] = [
    {
      id: "1",
      user_name: "Sarah Jensen",
      user_email: "sarah@example.com",
      subject: "Kan ikke logge ind på min konto",
      category: "Login",
      priority: "high",
      status: "open",
      assignedTo: "AI",
      created_at: "2024-01-17T10:30:00",
      last_activity: "2024-01-17T10:35:00",
      messages_count: 3,
      escalated: true, // ALARM! Bruger vil snakke med menneske
    },
    {
      id: "2",
      user_name: "Michael Hansen",
      user_email: "michael@example.com",
      subject: "Betaling blev ikke gennemført",
      category: "Betaling",
      priority: "high",
      status: "in_progress",
      assignedTo: "Admin John",
      created_at: "2024-01-17T09:15:00",
      last_activity: "2024-01-17T10:20:00",
      messages_count: 5,
      escalated: false,
    },
    {
      id: "3",
      user_name: "Emma Petersen",
      user_email: "emma@example.com",
      subject: "Hvordan sletter jeg min profil?",
      category: "Teknisk",
      priority: "low",
      status: "open",
      assignedTo: "AI",
      created_at: "2024-01-17T08:45:00",
      last_activity: "2024-01-17T08:50:00",
      messages_count: 2,
      escalated: false,
    },
    {
      id: "4",
      user_name: "Lars Nielsen",
      user_email: "lars@example.com",
      subject: "Rapportér en bruger",
      category: "Rapport",
      priority: "medium",
      status: "in_progress",
      assignedTo: "AI",
      created_at: "2024-01-16T16:20:00",
      last_activity: "2024-01-16T17:30:00",
      messages_count: 4,
      escalated: false,
    },
  ];

  // Mock chat messages
  const mockChatMessages = [
    {
      id: "1",
      sender: "user",
      message: "Hej, jeg kan ikke logge ind på min konto!",
      timestamp: "10:30",
    },
    {
      id: "2",
      sender: "ai",
      message: "Hej Sarah! Jeg er virkelig ked af at høre det. Lad mig hjælpe dig. Har du prøvet at nulstille dit password?",
      timestamp: "10:31",
    },
    {
      id: "3",
      sender: "user",
      message: "Ja, men jeg modtager ikke nogen email. Jeg vil gerne tale med et menneske!",
      timestamp: "10:35",
      escalation_trigger: true,
    },
  ];

  // Mock stats
  const stats = [
    {
      name: "Total Support Sager",
      value: "127",
      change: "+18",
      trend: "up",
      icon: MessageSquare,
    },
    {
      name: "Åbne Sager",
      value: "12",
      change: "+4",
      trend: "up",
      icon: Clock,
    },
    {
      name: "Gennemsnitlig Svartid",
      value: "2.3 min",
      change: "-0.5 min",
      trend: "down",
      icon: Zap,
    },
    {
      name: "AI Løsningsprocent",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Bot,
    },
  ];

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesAssigned =
      assignedFilter === "all" ||
      (assignedFilter === "ai" && ticket.assignedTo === "AI") ||
      (assignedFilter === "human" && ticket.assignedTo !== "AI");

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssigned;
  });

  const handleTakeOver = (ticketId: string) => {
    alert(`Overtager sag ${ticketId} fra AI til dig!`);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      alert(`Besked sendt: ${messageInput}`);
      setMessageInput("");
    }
  };

  const handleCloseTicket = (ticketId: string) => {
    if (confirm("Er du sikker på du vil lukke denne sag?")) {
      alert(`Sag ${ticketId} lukket!`);
      setSelectedTicket(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-500/10 text-red-500";
    if (priority === "medium") return "bg-yellow-500/10 text-yellow-500";
    return "bg-gray-800 text-gray-400";
  };

  const getStatusColor = (status: string) => {
    if (status === "open") return "bg-blue-500/10 text-blue-500";
    if (status === "in_progress") return "bg-yellow-500/10 text-yellow-500";
    return "bg-green-500/10 text-green-500";
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-red-500"></div>
          <p className="text-gray-400">Loading support...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Support</h1>
          <p className="mt-2 text-gray-400">Administrer support sager og AI support</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{filteredTickets.length} Sager</div>
          <div className="text-sm text-gray-400">
            {mockTickets.filter((t) => t.escalated).length} kræver opmærksomhed
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                <div
                  className={`mt-2 flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Søg efter bruger, email eller emne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition ${showFilters
                ? "border-red-500 bg-red-500/10 text-red-500"
                : "border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700 hover:text-white"
              }`}
          >
            <Filter className="h-5 w-5" />
            Filtre
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid gap-4 rounded-lg border border-gray-800 bg-gray-950 p-4 sm:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Alle</option>
                <option value="open">Åben</option>
                <option value="in_progress">I gang</option>
                <option value="closed">Lukket</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">Prioritet</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Alle</option>
                <option value="high">Høj</option>
                <option value="medium">Medium</option>
                <option value="low">Lav</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">Kategori</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Alle</option>
                <option value="Login">Login</option>
                <option value="Betaling">Betaling</option>
                <option value="Rapport">Rapport</option>
                <option value="Teknisk">Teknisk</option>
                <option value="Andet">Andet</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">Tildelt til</label>
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Alle</option>
                <option value="ai">AI Support</option>
                <option value="human">Menneskelig Support</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Support Tickets Table */}
      <div className="rounded-2xl border border-gray-800 bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="p-4 font-medium">Bruger</th>
                <th className="p-4 font-medium">Emne</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Prioritet</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Tildelt til</th>
                <th className="p-4 font-medium">Oprettet</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className={`border-b border-gray-800/50 transition hover:bg-gray-900/50 ${ticket.escalated ? "bg-red-500/5" : ""
                    }`}
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{ticket.user_name}</div>
                      <div className="text-xs text-gray-400">{ticket.user_email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {ticket.escalated && (
                        <div className="relative">
                          <AlertCircle className="h-5 w-5 animate-pulse text-red-500" />
                          <div className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-red-500"></div>
                        </div>
                      )}
                      <span>{ticket.subject}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-800 px-2 py-1 text-xs">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === "high" && "Høj"}
                      {ticket.priority === "medium" && "Medium"}
                      {ticket.priority === "low" && "Lav"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status === "open" && "Åben"}
                      {ticket.status === "in_progress" && "I gang"}
                      {ticket.status === "closed" && "Lukket"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {ticket.assignedTo === "AI" ? (
                        <Bot className="h-4 w-4 text-blue-500" />
                      ) : (
                        <User className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-gray-400">{ticket.assignedTo}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(ticket.created_at).toLocaleString("da-DK", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="rounded-lg bg-gray-800 px-3 py-1 text-sm font-medium text-white transition hover:bg-gray-700"
                      >
                        Åbn
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTickets.length === 0 && (
            <div className="py-12 text-center text-gray-400">Ingen sager fundet</div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-800 p-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{selectedTicket.user_name}</h2>
                  {selectedTicket.escalated && (
                    <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500">
                      <AlertCircle className="h-4 w-4 animate-pulse" />
                      Vil tale med menneske!
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    {selectedTicket.assignedTo === "AI" ? (
                      <>
                        <Bot className="h-4 w-4 text-blue-500" />
                        AI Support
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 text-green-500" />
                        {selectedTicket.assignedTo}
                      </>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-gray-400">{selectedTicket.subject}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {mockChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${msg.sender === "user"
                        ? "bg-red-500 text-white"
                        : "border border-gray-800 bg-gray-900 text-white"
                      }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="mb-2 flex items-center gap-2 text-xs text-blue-400">
                        <Bot className="h-3 w-3" />
                        AI Support
                      </div>
                    )}
                    <p>{msg.message}</p>
                    <div className="mt-2 text-xs opacity-70">{msg.timestamp}</div>
                    {msg.escalation_trigger && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-yellow-300">
                        <AlertCircle className="h-3 w-3" />
                        Trigger: Ønsker menneskelig support
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Actions */}
            <div className="border-t border-gray-800 p-4">
              {selectedTicket.assignedTo === "AI" && (
                <div className="mb-4">
                  <button
                    onClick={() => handleTakeOver(selectedTicket.id)}
                    className="w-full rounded-lg border border-red-500 bg-red-500/10 px-4 py-2 font-medium text-red-500 transition hover:bg-red-500/20"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User className="h-5 w-5" />
                      Overtag fra AI
                    </div>
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Skriv en besked..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <button
                  onClick={handleSendMessage}
                  className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-600"
                >
                  <Send className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleCloseTicket(selectedTicket.id)}
                  className="rounded-lg border border-gray-800 bg-gray-900 px-6 py-3 font-medium text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >
                  Luk Sag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
