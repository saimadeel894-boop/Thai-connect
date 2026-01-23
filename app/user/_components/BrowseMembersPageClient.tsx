"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  User,
  X,
  ShieldCheck,
} from "lucide-react";
import MemberCard, { Member } from "@/components/user/MemberCard";
import FilterSidebar, {
  FilterState,
} from "@/components/user/FilterSidebar";
import ChatDropdown from "@/components/user/ChatDropdown";
import ChatPopup from "@/components/user/ChatPopup";
import ProfileDetail from "@/components/user/ProfileDetail";
import NotificationDropdown from "@/components/user/NotificationDropdown";
import SettingsDropdown from "@/components/user/SettingsDropdown";
import PremiumModal from "@/components/user/PremiumModal";
import ChatBot from "@/components/user/ChatBot";
import ChatBotButton from "@/components/user/ChatBotButton";
import Image from "next/image";
import { Notification } from "@/components/user/NotificationDropdown";
import { Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeConversations } from "@/lib/hooks/useRealtimeConversations";
import { usePollingMessages } from "@/lib/hooks/usePollingMessages"; // Using polling until Realtime is enabled
import {
  getOrCreateMatch,
  sendMessage as sendMessageService,
} from "@/lib/services/messageService";

type SortBy = "newest" | "online" | "popular";

const defaultFilters: FilterState = {
  onlineOnly: false,
  ageRange: [18, 65],
  maxDistance: 50,
  location: "All Thailand",
  gender: "All",
  withPhotosOnly: false,
};

interface BrowseMembersPageClientProps {
  initialMembers: Member[];
}

export default function BrowseMembersPageClient({
  initialMembers = [],
}: BrowseMembersPageClientProps) {
  const members = useMemo(() => Array.isArray(initialMembers) ? initialMembers : [], [initialMembers]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortBy>("online");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<Profile | null>(null);
  const [activeChatMatchId, setActiveChatMatchId] = useState<string>("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Load messages with polling (updates every 2 seconds)
  const { messages: chatMessages } = usePollingMessages(activeChatMatchId || null);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatBotMinimized, setChatBotMinimized] = useState(false);

  // Get current user and check if admin
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);

        // Check if admin
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
    getCurrentUser();
  }, []);

  // Load conversations with realtime
  const { conversations } = useRealtimeConversations(currentUserId);

  // Calculate unread counts
  const unreadCount = useMemo(
    () => conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
    [conversations]
  );

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Filtering logic
  const filteredMembers = useMemo(() => {
    if (!Array.isArray(members) || members.length === 0) {
      return [];
    }
    let result = [...members];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.location.toLowerCase().includes(query) ||
          member.bio.toLowerCase().includes(query)
      );
    }

    // Online only
    if (filters.onlineOnly) {
      result = result.filter((member) => member.online);
    }

    // Age range
    result = result.filter(
      (member) =>
        member.age >= filters.ageRange[0] && member.age <= filters.ageRange[1]
    );

    // Distance (skip for now since we don't calculate it)
    // result = result.filter((member) => member.distance <= filters.maxDistance);

    // Location
    if (filters.location !== "All Thailand") {
      result = result.filter((member) => member.location === filters.location);
    }

    // Gender
    if (filters.gender !== "All") {
      result = result.filter((member) => member.gender === filters.gender);
    }

    // With photos
    if (filters.withPhotosOnly) {
      result = result.filter((member) => member.hasPhotos);
    }

    return result;
  }, [filters, searchQuery, members]);

  // Sorting logic
  const sortedMembers = useMemo(() => {
    if (!Array.isArray(filteredMembers) || filteredMembers.length === 0) {
      return [];
    }
    const sorted = [...filteredMembers];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      case "online":
        return sorted.sort((a, b) => {
          if (a.online === b.online) {
            return b.createdAt.getTime() - a.createdAt.getTime();
          }
          return a.online ? -1 : 1;
        });
      case "popular":
        // Since we skip popularity, sort by newest as fallback
        return sorted.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      default:
        return sorted;
    }
  }, [filteredMembers, sortBy]);

  // Count online members
  const onlineCount = useMemo(
    () => (Array.isArray(sortedMembers) ? sortedMembers.filter((m) => m.online).length : 0),
    [sortedMembers]
  );

  // Handlers
  const handleShowAll = () => {
    setFilters(defaultFilters);
    setSearchQuery("");
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleMessage = async (memberId: string) => {
    // Find the member
    if (!Array.isArray(members)) return;
    const member = members.find((m) => m.id === memberId);
    if (!member || !currentUserId) {
      alert("Please log in to send messages.");
      return;
    }

    try {
      // Get or create match (using messageService which doesn't rely on RPC)
      console.log("Creating match between", currentUserId, "and", memberId);
      const matchId = await getOrCreateMatch(currentUserId, memberId);
      console.log("Match created:", matchId);

      if (!matchId) {
        alert("Failed to create match. Please try again.");
        return;
      }

      // Convert member to profile
      const profile: Profile = {
        id: member.id,
        email: member.email || `${member.name.toLowerCase()}@example.com`,
        role: "user",
        name: member.name,
        age: member.age,
        gender: member.gender,
        bio: member.bio,
        location: member.location,
        height: member.height || null,
        body_type: null,
        education: null,
        work: null,
        children: null,
        smoking: null,
        drinking: null,
        looking_for: null,
        languages: [],
        interests: [],
        profile_image: member.image,
        photos: [],
        online: member.online,
        last_seen: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone: null,
        weight: null,
        interested_in_genders: null,
      };

      setActiveChatUser(profile);
      setActiveChatMatchId(matchId);
    } catch (error) {
      console.error("Error opening chat:", error);
      alert("Failed to open chat. Please try again.");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChatUser || !activeChatMatchId || !currentUserId) return;

    try {
      // Send message via Supabase (realtime hook will update UI automatically)
      await sendMessageService(
        activeChatMatchId,
        currentUserId,
        activeChatUser.id,
        content
      );
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      throw error;
    }
  };

  const handleCloseChatPopup = () => {
    setActiveChatUser(null);
    setActiveChatMatchId("");
  };

  const handleProfileClick = (memberId: string) => {
    if (!Array.isArray(members)) return;
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    // Convert Member to Profile
    const profile: Profile = {
      id: member.id,
      email: `${member.name.toLowerCase()}@example.com`,
      role: "user",
      name: member.name,
      age: member.age,
      gender: member.gender,
      bio: member.bio,
      location: member.location,
      height: 165,
      body_type: "Slim",
      education: "Bachelor's Degree",
      work: "Marketing Manager",
      children: "No children",
      smoking: "Non-smoker",
      drinking: "Social drinker",
      looking_for: "Serious relationship",
      languages: ["Thai", "English"],
      interests: ["Travel", "Photography", "Cooking", "Yoga", "Music", "Movies"],
      profile_image: member.image,
      photos: [member.image],
      online: member.online,
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      phone: null,
      weight: null,
      interested_in_genders: null,
    };

    setSelectedProfile(profile);
    setIsOwnProfile(false);
    setShowProfileDetail(true);
  };

  const handleOwnProfileClick = async () => {
    // Load current user's profile from Supabase
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to view your profile");
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setSelectedProfile(profile as Profile);
        setIsOwnProfile(true);
        setShowProfileDetail(true);
      }
    } catch (error) {
      console.error("Error loading own profile:", error);
      alert("Failed to load your profile. Please try again.");
    }
  };

  const handleProfileLike = (profileId: string) => {
    console.log("Liked profile:", profileId);
    // TODO: Implement like functionality with Supabase
  };

  const handleProfileMessage = (profileId: string) => {
    setShowProfileDetail(false);
    handleMessage(profileId);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-900 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo-thai.png"
              alt="ThaiConnect"
              width={150}
              height={96}
              className="h-24 w-auto"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location, age..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800 text-white transition hover:border-gray-700 lg:hidden"
            >
              {showFilters ? (
                <X className="h-5 w-5" />
              ) : (
                <SlidersHorizontal className="h-5 w-5" />
              )}
            </button>
            <ChatDropdown
              conversations={conversations}
              unreadCount={unreadCount}
            />
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadNotificationCount}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            />
            <SettingsDropdown onOpenPremium={() => setShowPremiumModal(true)} />
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden h-10 w-10 items-center justify-center rounded-lg border border-red-500 bg-red-500/10 text-red-500 transition hover:border-red-400 hover:bg-red-500/20 sm:flex"
                title="Go Admin"
              >
                <ShieldCheck className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={handleOwnProfileClick}
              className="hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-800 text-white transition hover:border-gray-700 sm:flex"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onShowAll={handleShowAll}
              onReset={handleReset}
            />
          </div>
        </aside>

        {/* Filter Sidebar - Mobile (Overlay) */}
        {showFilters && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden">
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-gray-800 bg-gray-950 p-6">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onShowAll={() => {
                  handleShowAll();
                  setShowFilters(false);
                }}
                onReset={handleReset}
              />
            </div>
          </div>
        )}

        {/* Members Grid */}
        <main className="flex-1">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Browse Members</h1>
            <p className="mt-1 text-gray-400">
              {onlineCount} {onlineCount === 1 ? "member" : "members"} online
              now
            </p>
          </div>

          {/* Sorting Tabs */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setSortBy("newest")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${sortBy === "newest"
                ? "bg-red-500 text-white"
                : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy("online")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${sortBy === "online"
                ? "bg-red-500 text-white"
                : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
            >
              Online
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${sortBy === "popular"
                ? "bg-red-500 text-white"
                : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
            >
              Popular
            </button>
          </div>

          {/* Members Grid */}
          {sortedMembers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onMessage={handleMessage}
                  onClick={handleProfileClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-xl font-bold text-white">
                No members found
              </h3>
              <p className="mb-6 text-gray-400">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={handleShowAll}
                className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-600"
              >
                Show All Members
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Chat Popup */}
      {activeChatUser && (
        <ChatPopup
          otherUser={activeChatUser}
          currentUserId={currentUserId}
          onClose={handleCloseChatPopup}
          onSendMessage={handleSendMessage}
          messages={chatMessages}
        />
      )}

      {/* Profile Detail Slide Panel */}
      <ProfileDetail
        profile={selectedProfile}
        isOpen={showProfileDetail}
        onClose={() => {
          setShowProfileDetail(false);
          setIsOwnProfile(false);
        }}
        onMessage={handleProfileMessage}
        onLike={handleProfileLike}
        distance={
          selectedProfile && Array.isArray(members) ? members.find((m) => m.id === selectedProfile.id)?.distance : 5
        }
        isOwnProfile={isOwnProfile}
      />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />

      {/* ChatBot */}
      {showChatBot ? (
        <ChatBot
          isOpen={showChatBot}
          onClose={() => {
            setShowChatBot(false);
            setChatBotMinimized(false);
          }}
          onMinimize={() => setChatBotMinimized(!chatBotMinimized)}
          isMinimized={chatBotMinimized}
        />
      ) : (
        <ChatBotButton onClick={() => setShowChatBot(true)} />
      )}
    </div>
  );
}
