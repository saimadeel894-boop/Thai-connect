"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, MapPin, Navigation, Globe } from "lucide-react";

const cities = [
  "Bangkok",
  "Chiang Mai",
  "Phuket",
  "Pattaya",
  "Krabi",
  "Hua Hin",
  "Koh Samui",
  "Ayutthaya",
  "Chiang Rai",
  "Khon Kaen",
];

export default function LocationSettingsPage() {
  const router = useRouter();
  const [city, setCity] = useState("Bangkok");
  const [searchRadius, setSearchRadius] = useState(50);
  const [showDistance, setShowDistance] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);

  const handleSave = () => {
    // TODO: Save to Supabase profile
    console.log("Saving location settings:", {
      city,
      searchRadius,
      showDistance,
      showLocation,
      autoUpdate,
    });
    alert("Location settings saved!");
  };

  const handleUseCurrentLocation = () => {
    // TODO: Use geolocation API
    alert("Getting current location - Geolocation API coming soon!");
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Location Settings</h1>
              <p className="text-sm text-gray-400">Manage your location preferences</p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Current Location */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Current Location</h2>
            </div>

            <div className="space-y-4">
              {/* City Dropdown */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white transition focus:border-red-500 focus:outline-none"
                >
                  {cities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Use Current Location Button */}
              <button
                onClick={handleUseCurrentLocation}
                className="w-full rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Use Current Location
              </button>
            </div>
          </div>

          {/* Search Radius */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Search Radius</h2>
            </div>

            <div className="space-y-4">
              {/* Distance Label */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">Distance</span>
                <span className="text-lg font-bold text-white">{searchRadius} km</span>
              </div>

              {/* Range Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                  className="range-slider w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((searchRadius - 5) / (200 - 5)) * 100}%, #1f2937 ${((searchRadius - 5) / (200 - 5)) * 100}%, #1f2937 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 km</span>
                  <span>200 km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <h2 className="mb-4 text-lg font-bold text-white">Privacy</h2>

            <div className="space-y-4">
              {/* Show Distance Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Show Distance</div>
                  <div className="text-sm text-gray-400">
                    Let others see how far away you are
                  </div>
                </div>
                <button
                  onClick={() => setShowDistance(!showDistance)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    showDistance ? "bg-red-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      showDistance ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Show My Location Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Show My Location</div>
                  <div className="text-sm text-gray-400">
                    Display your city on your profile
                  </div>
                </div>
                <button
                  onClick={() => setShowLocation(!showLocation)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    showLocation ? "bg-red-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      showLocation ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Auto-Update Location Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Auto-Update Location</div>
                  <div className="text-sm text-gray-400">
                    Update location when you travel
                  </div>
                </div>
                <button
                  onClick={() => setAutoUpdate(!autoUpdate)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    autoUpdate ? "bg-red-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      autoUpdate ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-red-500 px-6 py-4 font-bold text-white transition hover:bg-red-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
