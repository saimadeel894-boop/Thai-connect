import Toggle from "@/components/shared/Toggle";
import RangeSlider from "@/components/shared/RangeSlider";
import Dropdown from "@/components/shared/Dropdown";
import Button from "@/components/shared/Button";

export interface FilterState {
  onlineOnly: boolean;
  ageRange: [number, number];
  maxDistance: number;
  location: string;
  gender: string;
  withPhotosOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onShowAll: () => void;
  onReset: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onShowAll,
  onReset,
}: FilterSidebarProps) {
  const locations = [
    "All Thailand",
    "Bangkok",
    "Chiang Mai",
    "Phuket",
    "Pattaya",
    "Krabi",
    "Hua Hin",
  ];

  const genders = ["All", "Female", "Male", "Other"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-white">Filters</h2>

      {/* Online Only */}
      <Toggle
        label="Online Only"
        enabled={filters.onlineOnly}
        onChange={(enabled) =>
          onFilterChange({ ...filters, onlineOnly: enabled })
        }
      />

      {/* Age Range */}
      <RangeSlider
        label="Age Range"
        min={18}
        max={65}
        value={filters.ageRange}
        onChange={(range) => onFilterChange({ ...filters, ageRange: range })}
      />

      {/* Distance */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-white">
            Within {filters.maxDistance} km
          </label>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={filters.maxDistance}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              maxDistance: parseInt(e.target.value),
            })
          }
          className="range-slider w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((filters.maxDistance - 1) / (100 - 1)) * 100}%, #1f2937 ${((filters.maxDistance - 1) / (100 - 1)) * 100}%, #1f2937 100%)`,
          }}
        />
      </div>

      {/* Location */}
      <Dropdown
        label="Location"
        value={filters.location}
        options={locations}
        onChange={(location) => onFilterChange({ ...filters, location })}
      />

      {/* Gender */}
      <Dropdown
        label="Gender"
        value={filters.gender}
        options={genders}
        onChange={(gender) => onFilterChange({ ...filters, gender })}
      />

      {/* With Photos */}
      <Toggle
        label="With Photos"
        enabled={filters.withPhotosOnly}
        onChange={(enabled) =>
          onFilterChange({ ...filters, withPhotosOnly: enabled })
        }
      />

      {/* Actions */}
      <div className="space-y-3">
        <Button onClick={onShowAll} className="w-full">
          Show All
        </Button>
        <button
          onClick={onReset}
          className="w-full text-sm text-gray-400 transition hover:text-white"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
