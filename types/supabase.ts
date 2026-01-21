// This file contains Supabase types for the database schema
// Auto-generated types - DO NOT EDIT MANUALLY

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin";
export type MatchStatus = "pending" | "accepted" | "rejected";
export type BodyType = "Slim" | "Athletic" | "Average" | "Curvy" | "Muscular" | "Plus-size";
export type EducationLevel = "High School" | "Bachelor's Degree" | "Master's Degree" | "PhD" | "Other";
export type SmokingStatus = "Non-smoker" | "Social smoker" | "Regular smoker";
export type DrinkingStatus = "Non-drinker" | "Social drinker" | "Regular drinker";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          name: string;
          age: number;
          gender: string;
          bio: string | null;
          location: string;
          height: number | null;
          body_type: BodyType | null;
          education: EducationLevel | null;
          work: string | null;
          children: string | null;
          smoking: SmokingStatus | null;
          drinking: DrinkingStatus | null;
          looking_for: string | null;
          languages: string[];
          interests: string[];
          profile_image: string | null;
          photos: string[];
          online: boolean;
          last_seen: string;
          created_at: string;
          updated_at: string;
          phone: string | null;
          weight: number | null;
          interested_in_genders: string[] | null;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          name: string;
          age: number;
          gender: string;
          bio?: string | null;
          location: string;
          height?: number | null;
          body_type?: BodyType | null;
          education?: EducationLevel | null;
          work?: string | null;
          children?: string | null;
          smoking?: SmokingStatus | null;
          drinking?: DrinkingStatus | null;
          looking_for?: string | null;
          languages?: string[];
          interests?: string[];
          profile_image?: string | null;
          photos?: string[];
          online?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
          phone?: string | null;
          weight?: number | null;
          interested_in_genders?: string[] | null;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          name?: string;
          age?: number;
          gender?: string;
          bio?: string | null;
          location?: string;
          height?: number | null;
          body_type?: BodyType | null;
          education?: EducationLevel | null;
          work?: string | null;
          children?: string | null;
          smoking?: SmokingStatus | null;
          drinking?: DrinkingStatus | null;
          looking_for?: string | null;
          languages?: string[];
          interests?: string[];
          profile_image?: string | null;
          photos?: string[];
          online?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
          phone?: string | null;
          weight?: number | null;
          interested_in_genders?: string[] | null;
        };
      };
      matches: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          status: MatchStatus;
          initiated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_a: string;
          user_b: string;
          status?: MatchStatus;
          initiated_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_a?: string;
          user_b?: string;
          status?: MatchStatus;
          initiated_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          match_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read: boolean;
          read_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read?: boolean;
          read_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          read?: boolean;
          read_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      // Add your view types here
    };
    Functions: {
      create_match: {
        Args: {
          target_user_id: string;
          initiator_user_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      match_status: MatchStatus;
      body_type: BodyType;
      education_level: EducationLevel;
      smoking_status: SmokingStatus;
      drinking_status: DrinkingStatus;
    };
  };
}
