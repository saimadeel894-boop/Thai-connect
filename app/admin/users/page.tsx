"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Trash2,
  Ban,
  Check,
  X,
  Filter,
  Eye,
  UserX,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Clock,
  MessageSquare,
  DollarSign,
  Heart,
  FileText,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  profile_image?: string;
  created_at: string;
  role: string;
  // Mock fields - will be added to DB later
  status?: "active" | "suspended" | "deleted";
  verified?: boolean;
  phone?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "history" | "notes">("info");

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  useEffect(() => {
    checkAdminAccess();
    loadUsers();
  }, []);

  const checkAdminAccess = async () => {
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
  };

  const loadUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Add mock status and verification (will be real DB fields later)
    const usersWithMockData = (data || []).map((user: any, index: number) => ({
      ...user,
      status: index % 5 === 0 ? "suspended" : "active",
      verified: index % 3 !== 0,
      phone: `+45 ${20 + index} ${10 + index} ${20 + index} ${30 + index}`,
    }));

    setUsers(usersWithMockData);
    setLoading(false);
  };

  // Mock data for user history
  const mockActivity = [
    { id: 1, action: "Login", timestamp: "2024-01-16 14:32", ip: "192.168.1.1" },
    { id: 2, action: "Profile updated", timestamp: "2024-01-15 10:22", ip: "192.168.1.1" },
    { id: 3, action: "Message sent", timestamp: "2024-01-15 09:15", ip: "192.168.1.1" },
    { id: 4, action: "Match created", timestamp: "2024-01-14 18:45", ip: "192.168.1.1" },
  ];

  const mockPayments = [
    { id: 1, amount: "299 ฿", type: "Premium Monthly", date: "2024-01-10", status: "Completed" },
    { id: 2, amount: "299 ฿", type: "Premium Monthly", date: "2023-12-10", status: "Completed" },
    { id: 3, amount: "2500 ฿", type: "Premium Yearly", date: "2023-11-05", status: "Completed" },
  ];

  const mockNotes = [
    { id: 1, admin: "Admin John", note: "User reported inappropriate behavior - warned", date: "2024-01-12" },
    { id: 2, admin: "Admin Sarah", note: "Verified identity documents", date: "2024-01-05" },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && user.verified) ||
      (verificationFilter === "unverified" && !user.verified);
    const matchesLocation = locationFilter === "all" || user.location === locationFilter;

    return matchesSearch && matchesStatus && matchesVerification && matchesLocation;
  });

  const uniqueLocations = Array.from(new Set(users.map((u) => u.location)));

  const handleSuspendUser = (userId: string) => {
    if (confirm("Er du sikker på du vil suspendere denne bruger?")) {
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u
        )
      );
      if (selectedUser?.id === userId) {
        setSelectedUser({
          ...selectedUser,
          status: selectedUser.status === "suspended" ? "active" : "suspended",
        });
      }
      alert("Bruger status opdateret!");
    }
  };

  const handleVerifyUser = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, verified: !u.verified } : u)));
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, verified: !selectedUser.verified });
    }
    alert("Verifikation status opdateret!");
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Er du sikker på du vil slette denne bruger? Dette kan ikke fortrydes."
      )
    ) {
      return;
    }

    try {
      const supabase = createClient();

      // Delete from Supabase (cascades to related data)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      // Update UI
      setUsers(users.filter((u) => u.id !== userId));
      setSelectedUser(null);
      alert("Bruger slettet fra database!");

      // Reload users to ensure sync
      loadUsers();
    } catch (error: unknown) {
      console.error("Delete error:", error);
      const message = error instanceof Error ? error.message : "Kunne ikke slette bruger";
      alert(message);
    }
  };

  const handleResetAccess = (userId: string) => {
    if (confirm("Reset brugerens adgang? Dette vil logge brugeren ud.")) {
      alert("Adgang nulstillet! Brugeren vil blive logget ud.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-red-500"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Brugeradministration</h1>
          <p className="mt-2 text-gray-400">
            Administrer brugere, verificér konti, og håndtér suspenderinger
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {filteredUsers.length} Brugere
          </div>
          <div className="text-sm text-gray-400">
            {users.filter((u) => u.status === "active").length} aktive
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Søg efter navn, email, telefon eller ID..."
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
          <div className="grid gap-4 rounded-lg border border-gray-800 bg-gray-950 p-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Alle</option>
                <option value="active">Aktiv</option>
                <option value="suspended">Suspenderet</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Verifikation
              </label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Alle</option>
                <option value="verified">Verificeret</option>
                <option value="unverified">Ikke Verificeret</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black px-3 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Alle</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-800 bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="p-4 font-medium">Bruger</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Telefon</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Verifikation</th>
                <th className="p-4 font-medium">Tilmeldt</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800/50 transition hover:bg-gray-900/50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.profile_image ? (
                        <Image
                          src={user.profile_image}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.age} år</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4 text-gray-400">{user.phone}</td>
                  <td className="p-4 text-gray-400">{user.location}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${user.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                        }`}
                    >
                      {user.status === "active" ? (
                        <UserCheck className="h-3 w-3" />
                      ) : (
                        <UserX className="h-3 w-3" />
                      )}
                      {user.status === "active" ? "Aktiv" : "Suspenderet"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${user.verified
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-gray-800 text-gray-400"
                        }`}
                    >
                      {user.verified ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <ShieldAlert className="h-3 w-3" />
                      )}
                      {user.verified ? "Verificeret" : "Ikke Verificeret"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString("da-DK")}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="rounded-lg bg-gray-800 p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
                        title="Se detaljer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-400">Ingen brugere fundet</div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 p-6">
              <div className="flex items-center gap-4">
                {selectedUser.profile_image ? (
                  <Image
                    src={selectedUser.profile_image}
                    alt={selectedUser.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-xl font-medium text-white">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 px-6 py-3 font-medium transition ${activeTab === "info"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                Information
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 px-6 py-3 font-medium transition ${activeTab === "history"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                Historik
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 px-6 py-3 font-medium transition ${activeTab === "notes"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                Admin Noter
              </button>
            </div>

            {/* Tab Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {/* Info Tab */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Status Cards */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                      <div className="mb-2 text-sm text-gray-400">Konto Status</div>
                      <div
                        className={`text-lg font-bold ${selectedUser.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                          }`}
                      >
                        {selectedUser.status === "active" ? "Aktiv" : "Suspenderet"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                      <div className="mb-2 text-sm text-gray-400">Verifikation</div>
                      <div
                        className={`text-lg font-bold ${selectedUser.verified ? "text-blue-500" : "text-gray-400"
                          }`}
                      >
                        {selectedUser.verified ? "Verificeret" : "Ikke Verificeret"}
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-white">
                      Personlige Oplysninger
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between rounded-lg border border-gray-800 bg-black/30 p-3">
                        <span className="text-gray-400">ID</span>
                        <span className="font-mono text-sm text-white">
                          {selectedUser.id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex justify-between rounded-lg border border-gray-800 bg-black/30 p-3">
                        <span className="text-gray-400">Alder</span>
                        <span className="text-white">{selectedUser.age} år</span>
                      </div>
                      <div className="flex justify-between rounded-lg border border-gray-800 bg-black/30 p-3">
                        <span className="text-gray-400">Telefon</span>
                        <span className="text-white">{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between rounded-lg border border-gray-800 bg-black/30 p-3">
                        <span className="text-gray-400">Location</span>
                        <span className="text-white">{selectedUser.location}</span>
                      </div>
                      <div className="flex justify-between rounded-lg border border-gray-800 bg-black/30 p-3">
                        <span className="text-gray-400">Tilmeldt</span>
                        <span className="text-white">
                          {new Date(selectedUser.created_at).toLocaleDateString("da-DK")}
                        </span>
                      </div>
                      <div className="flex justify-between rounded-lg border border-gray-800 bg-black/30 p-3">
                        <span className="text-gray-400">Role</span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${selectedUser.role === "admin"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-gray-800 text-gray-400"
                            }`}
                        >
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-white">Handlinger</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => handleSuspendUser(selectedUser.id)}
                        className={`flex items-center justify-center gap-2 rounded-lg border p-3 font-medium transition ${selectedUser.status === "suspended"
                            ? "border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                            : "border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          }`}
                      >
                        {selectedUser.status === "suspended" ? (
                          <>
                            <UserCheck className="h-5 w-5" />
                            Genåbn Konto
                          </>
                        ) : (
                          <>
                            <UserX className="h-5 w-5" />
                            Suspendér Konto
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleVerifyUser(selectedUser.id)}
                        className={`flex items-center justify-center gap-2 rounded-lg border p-3 font-medium transition ${selectedUser.verified
                            ? "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                            : "border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                          }`}
                      >
                        {selectedUser.verified ? (
                          <>
                            <ShieldAlert className="h-5 w-5" />
                            Fjern Verifikation
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-5 w-5" />
                            Verificér Bruger
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleResetAccess(selectedUser.id)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 p-3 font-medium text-gray-400 transition hover:bg-gray-700 hover:text-white"
                      >
                        <RotateCcw className="h-5 w-5" />
                        Reset Adgang
                      </button>
                      <button
                        onClick={() => handleDeleteUser(selectedUser.id)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-medium text-red-500 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-5 w-5" />
                        Slet Bruger
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  {/* Activity Log */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                      <Clock className="h-5 w-5" />
                      Aktivitet
                    </h3>
                    <div className="space-y-2">
                      {mockActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between rounded-lg border border-gray-800 bg-black/30 p-3"
                        >
                          <div>
                            <div className="font-medium text-white">{activity.action}</div>
                            <div className="text-xs text-gray-400">IP: {activity.ip}</div>
                          </div>
                          <div className="text-sm text-gray-400">{activity.timestamp}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payments */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                      <DollarSign className="h-5 w-5" />
                      Betalinger
                    </h3>
                    <div className="space-y-2">
                      {mockPayments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between rounded-lg border border-gray-800 bg-black/30 p-3"
                        >
                          <div>
                            <div className="font-medium text-white">{payment.type}</div>
                            <div className="text-xs text-gray-400">{payment.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-500">{payment.amount}</div>
                            <div className="text-xs text-gray-400">{payment.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  {/* Add Note */}
                  <div className="rounded-lg border border-gray-800 bg-black/30 p-4">
                    <textarea
                      placeholder="Skriv en intern admin note..."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-gray-800 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    ></textarea>
                    <button className="mt-2 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600">
                      Gem Note
                    </button>
                  </div>

                  {/* Notes List */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                      <FileText className="h-5 w-5" />
                      Eksisterende Noter
                    </h3>
                    <div className="space-y-3">
                      {mockNotes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-lg border border-gray-800 bg-black/30 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium text-white">{note.admin}</span>
                            <span className="text-sm text-gray-400">{note.date}</span>
                          </div>
                          <p className="text-gray-300">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
