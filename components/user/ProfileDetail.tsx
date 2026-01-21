"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowLeft, Flag, Heart, MessageCircle, MapPin, Edit } from "lucide-react";
import { Profile } from "@/types";

interface ProfileDetailProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onMessage?: (profileId: string) => void;
  onLike?: (profileId: string) => void;
  currentUserId?: string;
  distance?: number;
  isOwnProfile?: boolean;
  onSave?: (updatedProfile: Profile) => void;
}

export default function ProfileDetail({
  profile,
  isOpen,
  onClose,
  onMessage,
  onLike,
  currentUserId,
  distance = 5,
  isOwnProfile = false,
  onSave,
}: ProfileDetailProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!profile) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(profile.id);
  };

  const handleMessage = () => {
    onMessage?.(profile.id);
  };


  // Mock interests if not available
  const interests = profile.interests.length > 0 
    ? profile.interests 
    : ["Travel", "Photography", "Cooking", "Yoga", "Music", "Movies"];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto bg-gray-950 shadow-2xl transition-transform duration-300 md:w-[600px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[500px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${profile.profile_image || profile.photos[0]})`,
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
          </div>

          {/* Top Bar */}
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              aria-label="Report"
            >
              <Flag className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                {profile.gender}
              </span>
              {profile.online && (
                <span className="flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Online Now
                </span>
              )}
            </div>

            <h1 className="mb-2 text-4xl font-bold text-white">
              {profile.name}, {profile.age}
            </h1>

            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">
                {profile.location} • {distance} km away
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-950 p-6">
          {/* Action Buttons */}
          {isOwnProfile ? (
            <div className="mb-8 flex gap-3">
              <button
                onClick={() => router.push("/user/profile/edit")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-3.5 font-semibold text-white transition hover:bg-red-600"
              >
                <Edit className="h-5 w-5" />
                Rediger Profil
              </button>
            </div>
          ) : (
            <div className="mb-8 flex gap-3">
              <button
                onClick={handleMessage}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 py-3.5 font-semibold text-white transition hover:bg-red-600"
              >
                <MessageCircle className="h-5 w-5" />
                Send Message
              </button>
              <button
                onClick={handleLike}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-3.5 font-semibold transition ${
                  isLiked
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-white/20 bg-transparent text-white hover:border-red-500 hover:bg-red-500/10"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-white" : ""}`} />
                Like Profile
              </button>
            </div>
          )}

          {/* Profile Details */}
          {(profile.height || profile.weight || profile.phone) && (
            <div className="mb-8 rounded-2xl bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Profil Detaljer</h2>
              <div className="space-y-3">
                {profile.height && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Højde</span>
                    <span className="font-medium text-white">{profile.height} cm</span>
                  </div>
                )}
                {profile.weight && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vægt</span>
                    <span className="font-medium text-white">{profile.weight} kg</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Telefon</span>
                    <span className="font-medium text-white">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* Stay Safe Warning */}
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500">
                <span className="text-lg">⚠️</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-red-400">Stay Safe</h3>
                <p className="text-sm text-gray-300">
                  Never send money or share financial information. Report suspicious behavior.
                </p>
              </div>
            </div>
          </div>

          {/* About Me */}
          {profile.bio && (
            <div className="mb-8 rounded-2xl bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Om mig</h2>
              <p className="leading-relaxed text-gray-300">{profile.bio}</p>
            </div>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div className="mb-8 rounded-2xl bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Interesser</h2>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:border-red-500 hover:bg-red-500/10"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {profile.photos && profile.photos.length > 0 && (
            <div className="rounded-2xl bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Flere billeder</h2>
              <div className="grid grid-cols-2 gap-4">
                {profile.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={photo}
                      alt={`${profile.name} photo ${index + 1}`}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
