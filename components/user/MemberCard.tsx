import { Heart, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";

export interface Member {
  id: string;
  name: string;
  email?: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  location: string;
  distance: number;
  online: boolean;
  lastSeen: string;
  image: string;
  bio: string;
  hasPhotos: boolean;
  createdAt: Date;
  popularity: number;
  height?: number | null;
}

interface MemberCardProps {
  member: Member;
  onLike?: (memberId: string) => void;
  onMessage?: (memberId: string) => void;
  onClick?: (memberId: string) => void;
  isLiked?: boolean;
}

export default function MemberCard({
  member,
  onLike,
  onMessage,
  onClick,
  isLiked = false,
}: MemberCardProps) {
  const [liked, setLiked] = useState(isLiked);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    onLike?.(member.id);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMessage?.(member.id);
  };

  const handleCardClick = () => {
    onClick?.(member.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all hover:border-gray-700 cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
        <span className="rounded-full bg-gray-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {member.gender}
        </span>
        {member.online && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-white" />
            Online
          </span>
        )}
      </div>

      {/* Last Seen Badge (if not online) */}
      {!member.online && member.lastSeen && (
        <div className="absolute right-4 top-4 z-10">
          <span className="rounded-full bg-gray-900/80 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur-sm">
            {member.lastSeen}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-800">
        {member.image ? (
          <div
            className="h-full w-full bg-cover bg-center transition-transform group-hover:scale-105"
            style={{
              backgroundImage: `url(${member.image})`,
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800">
            <div className="text-center">
              <div className="mb-2 text-6xl">👤</div>
              <p className="text-sm text-gray-400">Intet billede</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-16">
        <h3 className="text-lg font-bold text-white">
          {member.name}, {member.age}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-300">
          <MapPin className="h-4 w-4" />
          <span>
            {member.location} • {member.distance} km away
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-gray-400">{member.bio}</p>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleLike}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-2.5 font-medium transition ${
              liked
                ? "border-red-500 bg-red-500 text-white"
                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-white" : ""}`}
            />
            Like
          </button>
          <button
            onClick={handleMessage}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            <MessageCircle className="h-5 w-5" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
