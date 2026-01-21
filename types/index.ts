// Shared types for the application
import { Database } from "./supabase";

export type UserRole = "user" | "admin";
export type MatchStatus = "pending" | "accepted" | "rejected";
export type BodyType = "Slim" | "Athletic" | "Average" | "Curvy" | "Muscular" | "Plus-size";
export type EducationLevel = "High School" | "Bachelor's Degree" | "Master's Degree" | "PhD" | "Other";
export type SmokingStatus = "Non-smoker" | "Social smoker" | "Regular smoker";
export type DrinkingStatus = "Non-drinker" | "Social drinker" | "Regular drinker";

// Database types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Match = Database["public"]["Tables"]["matches"]["Row"];
export type MatchInsert = Database["public"]["Tables"]["matches"]["Insert"];
export type MatchUpdate = Database["public"]["Tables"]["matches"]["Update"];

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

// Extended types for UI
export interface ProfileWithDistance extends Profile {
  distance?: number;
  hasPhotos?: boolean;
  popularity?: number;
}

export interface MessageWithProfile extends Message {
  sender?: Profile;
  receiver?: Profile;
}

export interface MatchWithProfiles extends Match {
  profile_a?: Profile;
  profile_b?: Profile;
}

export interface Conversation {
  match: Match;
  otherUser: Profile;
  lastMessage?: Message;
  unreadCount: number;
}

// Legacy User type for backward compatibility
export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

// Payment Method type
export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

// Premium Plan types
export type PremiumPlan = "monthly" | "yearly";

export interface PricingPlan {
  id: PremiumPlan;
  name: string;
  price: number;
  interval: string;
  savings?: string;
  annualPrice?: number;
}

// Privacy & Safety types
export type VisibilityOption = "everyone" | "matches" | "premium";

export interface PrivacySettings {
  profileVisibility: VisibilityOption;
  showOnlineStatus: boolean;
  showLastActive: boolean;
  incognitoMode: boolean;
  whoCanMessage: VisibilityOption;
  blockedUsers: string[];
}

// Account Settings types
export interface AccountSettings {
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  lastPasswordChange: string;
  connectedAccounts: {
    facebook: boolean;
    google: boolean;
  };
}

// ChatBot types
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}
