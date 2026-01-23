"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  // Form fields - REQUIRED
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [interestedIn, setInterestedIn] = useState<string[]>([]);

  // Form fields - OPTIONAL
  const [phone, setPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const checkAuth = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Auth error:", userError);
      router.push("/login");
      return;
    }

    if (!user) {
      console.error("No user found - redirecting to login");
      router.push("/login");
      return;
    }

    console.log("User authenticated:", user.id);
    setUserId(user.id);

    // Check if profile already completed
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, age, gender")
      .eq("id", user.id)
      .single();

    // If profile has real data (not defaults), redirect to main page
    if (profile && profile.name && profile.age && profile.age !== 25 && profile.gender) {
      router.push("/user");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleInterestedInToggle = (value: string) => {
    if (interestedIn.includes(value)) {
      setInterestedIn(interestedIn.filter((g) => g !== value));
    } else {
      setInterestedIn([...interestedIn, value]);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProfileImage(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Check userId first
    if (!userId) {
      setError("Ingen bruger fundet. Prøv at logge ind igen.");
      return;
    }

    console.log("Starting profile update for user:", userId);

    // Validate required fields
    if (!name.trim()) {
      setError("Navn er påkrævet");
      return;
    }

    if (!gender) {
      setError("Køn er påkrævet");
      return;
    }

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      setError("Alder skal være mellem 18 og 100");
      return;
    }

    if (!location.trim()) {
      setError("Lokation er påkrævet");
      return;
    }

    if (interestedIn.length === 0) {
      setError("Du skal vælge mindst ét køn du er interesseret i");
      return;
    }

    console.log("All validations passed");
    setLoading(true);

    try {
      const supabase = createClient();

      // Update profile with onboarding data
      const profileData: Record<string, any> = {
        name: name.trim(),
        gender,
        age: ageNum,
        location: location.trim(),
        interested_in_genders: interestedIn,
        bio: bio.trim() || null, // Null if not provided
        interests: interests.length > 0 ? interests : [], // Empty array if none
        online: true,
        updated_at: new Date().toISOString(),
      };

      // Add optional fields - only if provided, otherwise null
      profileData.phone = phone.trim() || null;

      if (height) {
        const heightNum = parseInt(height);
        profileData.height = !isNaN(heightNum) ? heightNum : null;
      } else {
        profileData.height = null;
      }

      if (weight) {
        const weightNum = parseInt(weight);
        profileData.weight = !isNaN(weightNum) ? weightNum : null;
      } else {
        profileData.weight = null;
      }

      profileData.profile_image = profileImage.trim() || null;

      console.log("Updating profile for user:", userId);
      console.log("Profile data:", profileData);

      const { data: updateResult, error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId)
        .select();

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      console.log("Profile updated successfully:", updateResult);

      // TODO: Create free subscription when payment system is implemented
      // Skipped for now - not critical for onboarding

      // Success - redirect to main page
      console.log("Onboarding complete! Redirecting to /user");
      router.push("/user");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Kunne ikke gemme profil";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Header */}
      <header className="border-b border-gray-900 px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-white">Fuldfør din profil</h1>
          <p className="mt-1 text-sm text-gray-400">
            Udfyld dine oplysninger for at komme i gang
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-500 bg-gray-950 p-6 sm:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4 text-sm text-red-500">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                // Prevent Enter key from submitting form accidentally
                if (e.key === 'Enter' && e.currentTarget.tagName !== 'TEXTAREA') {
                  e.preventDefault();
                }
              }}
              className="space-y-6"
            >
              {/* Required Section */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">
                  Påkrævet information
                </h2>

                {/* Name */}
                <Input
                  type="text"
                  label="Navn"
                  placeholder="Dit fulde navn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Køn <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  >
                    <option value="">Vælg køn</option>
                    <option value="Male">Mand</option>
                    <option value="Female">Kvinde</option>
                    <option value="Other">Andet</option>
                  </select>
                </div>

                {/* Age */}
                <Input
                  type="number"
                  label="Alder"
                  placeholder="Din alder"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="100"
                  required
                />

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Lokation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  >
                    <option value="">Vælg lokation</option>
                    <option value="Bangkok">Bangkok</option>
                    <option value="Chiang Mai">Chiang Mai</option>
                    <option value="Phuket">Phuket</option>
                    <option value="Pattaya">Pattaya</option>
                    <option value="Krabi">Krabi</option>
                    <option value="Hua Hin">Hua Hin</option>
                    <option value="Koh Samui">Koh Samui</option>
                    <option value="Other">Andet</option>
                  </select>
                </div>

                {/* Interested In */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Interesseret i <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interestedIn.includes("Male")}
                        onChange={() => handleInterestedInToggle("Male")}
                        className="h-5 w-5 rounded border-gray-800 bg-black text-red-500 focus:ring-2 focus:ring-red-500/20"
                      />
                      <span className="text-white">Mænd</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interestedIn.includes("Female")}
                        onChange={() => handleInterestedInToggle("Female")}
                        className="h-5 w-5 rounded border-gray-800 bg-black text-red-500 focus:ring-2 focus:ring-red-500/20"
                      />
                      <span className="text-white">Kvinder</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interestedIn.includes("Other")}
                        onChange={() => handleInterestedInToggle("Other")}
                        className="h-5 w-5 rounded border-gray-800 bg-black text-red-500 focus:ring-2 focus:ring-red-500/20"
                      />
                      <span className="text-white">Andet</span>
                    </label>
                  </div>
                  {interestedIn.length > 0 && (
                    <p className="mt-2 text-xs text-gray-400">
                      Valgt: {interestedIn.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Section */}
              <div className="space-y-6 border-t border-gray-800 pt-6">
                <h2 className="text-lg font-semibold text-white">
                  Valgfri information
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    (kan udfyldes senere)
                  </span>
                </h2>

                {/* Phone */}
                <Input
                  type="tel"
                  label="Telefonnummer"
                  placeholder="+45 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                {/* Height */}
                <Input
                  type="number"
                  label="Højde (cm)"
                  placeholder="Fx 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="100"
                  max="250"
                />

                {/* Weight */}
                <Input
                  type="number"
                  label="Vægt (kg)"
                  placeholder="Fx 65"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="30"
                  max="300"
                />

                {/* Bio */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Om mig
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Fortæl lidt om dig selv..."
                    rows={4}
                    className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    maxLength={500}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    {bio.length}/500 tegn
                  </p>
                </div>

                {/* Interests */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Interesser
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInterest();
                        }
                      }}
                      placeholder="Tilføj interesse (tryk Enter)"
                      className="flex-1 rounded-lg border border-gray-800 bg-black px-4 py-2 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                      Tilføj
                    </button>
                  </div>
                  {interests.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-500"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(interest)}
                            className="text-red-500 hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile Image */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Profilbillede (URL)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={profileImage}
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 rounded-lg object-cover"
                        onError={() => setImagePreview("")}
                      />
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    Indsæt et link til dit profilbillede
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 border-t border-gray-800 pt-6">
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Gemmer..." : "Fuldfør profil"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
