"use client";

export type MessageFilterType = "all" | "unread" | "newest" | "oldest";

interface MessageFiltersProps {
  activeFilter: MessageFilterType;
  onFilterChange: (filter: MessageFilterType) => void;
  unreadCount?: number;
}

export default function MessageFilters({
  activeFilter,
  onFilterChange,
  unreadCount = 0,
}: MessageFiltersProps) {
  const filters: { id: MessageFilterType; label: string; count?: number }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "newest", label: "Newest" },
    { id: "oldest", label: "Oldest" },
  ];

  return (
    <div className="border-b border-gray-900 px-4 py-3">
      <div className="flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeFilter === filter.id
                ? "bg-red-500 text-white"
                : "bg-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            {filter.label}
            {filter.count !== undefined && filter.count > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
