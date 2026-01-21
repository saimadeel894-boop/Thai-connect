"use client";

import { useState, useEffect } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
  suffix?: string;
}

export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  label,
  suffix = "",
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    const newValue: [number, number] = [
      Math.min(newMin, localValue[1]),
      localValue[1],
    ];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    const newValue: [number, number] = [
      localValue[0],
      Math.max(newMax, localValue[0]),
    ];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-white">{label}</label>
          <span className="text-sm text-gray-400">
            {localValue[0]}
            {suffix} - {localValue[1]}
            {suffix}
          </span>
        </div>
      )}
      <div className="relative h-6">
        {/* Track background */}
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-700" />

        {/* Active track */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-red-500"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={handleMinChange}
          className="range-slider absolute top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="range-slider absolute top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
