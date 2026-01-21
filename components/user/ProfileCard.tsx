interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  image: string;
  isOnline?: boolean;
}

export default function ProfileCard({
  name,
  age,
  location,
  image,
  isOnline = false,
}: ProfileCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-gray-900 backdrop-blur-sm transition-all hover:border-red-500/50 hover:scale-105">
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-800">
        <div
          className="h-full w-full bg-cover bg-center transition-transform group-hover:scale-110"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">
                {name}, {age}
              </span>
              {isOnline && (
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              )}
            </div>
            <div className="text-sm text-gray-300">{location}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
