"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { X, Trash2 } from "lucide-react";
import ImageUpload from "@/components/user/ImageUpload";
import Image from "next/image";

export default function EditProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");

  // Images
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/login");
          return;
        }

        setUserId(user.id);

        // Load existing profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Failed to load profile:", profileError);
          setError("Kunne ikke indlæse profil");
          return;
        }

        if (profile) {
          setName(profile.name || "");
          setGender(profile.gender || "");
          setAge(profile.age?.toString() || "");
          setLocation(profile.location || "");
          setInterestedIn(profile.interested_in_genders || []);
          setPhone(profile.phone || "");
          setHeight(profile.height?.toString() || "");
          setWeight(profile.weight?.toString() || "");
          setBio(profile.bio || "");
          setInterests(profile.interests || []);
          setProfileImage(profile.profile_image || "");
          setProfileImagePreview(profile.profile_image || "");
          setPhotos(profile.photos || []);
        }
      } catch (err: unknown) {
        console.error("Error loading profile:", err);
        setError(err instanceof Error ? err.message : "Kunne ikke indlæse profil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleInterestedInToggle = (value: string) => {
    if (interestedIn.includes(value)) {
      setInterestedIn(interestedIn.filter((g) => g !== value));
    } else {
      setInterestedIn([...interestedIn, value]);
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleProfileImageUploaded = (url: string) => {
    setProfileImage(url);
    setProfileImagePreview(url);
  };

  const handlePhotoUploaded = (url: string) => {
    if (url && !photos.includes(url) && photos.length < 6) {
      setPhotos([...photos, url]);
    }
  };

  const handleRemovePhoto = (photoUrl: string) => {
    setPhotos(photos.filter((p) => p !== photoUrl));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Ingen bruger fundet");
      return;
    }

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

    setSaving(true);

    try {
      const supabase = createClient();

      const profileData = {
        name: name.trim(),
        gender,
        age: ageNum,
        location: location.trim(),
        interested_in_genders: interestedIn,
        bio: bio.trim() || null,
        interests: interests.length > 0 ? interests : [],
        phone: phone.trim() || null,
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        profile_image: profileImage.trim() || null,
        photos: photos.length > 0 ? photos : [],
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      // Success - redirect back
      router.push("/user");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Kunne ikke gemme profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Indlæser...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Header */}
      <header className="border-b border-gray-900 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Rediger profil</h1>
            <p className="mt-1 text-sm text-gray-400">
              Opdater dine oplysninger og billeder
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4 text-sm text-red-500">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
              className="space-y-6"
            >
              {/* Profile Image Section */}
              <div className="space-y-4 rounded-xl border border-gray-800 bg-black p-6">
                <h2 className="text-lg font-semibold text-white">
                  Profilbillede
                </h2>

                <ImageUpload
                  currentImage={profileImagePreview}
                  onUpload={handleProfileImageUploaded}
                />
                <p className="text-center text-xs text-gray-400">
                  Upload et profilbillede fra din enhed
                </p>
              </div>

              {/* Photo Gallery Section */}
              <div className="space-y-4 rounded-xl border border-gray-800 bg-black p-6">
                <h2 className="text-lg font-semibold text-white">
                  Flere billeder ({photos.length}/6)
                </h2>

                {/* Current Photos */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="group relative">
                        <Image
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          width={300}
                          height={300}
                          className="aspect-square w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo)}
                          className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Photo */}
                {photos.length < 6 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-800 p-6 transition hover:border-red-500/50">
                    <ImageUpload onUpload={handlePhotoUploaded} />
                    <p className="mt-2 text-xs text-gray-400">
                      Du kan tilføje op til 6 billeder i alt
                    </p>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">
                  Basis information
                </h2>

                <Input
                  type="text"
                  label="Navn"
                  placeholder="Dit fulde navn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

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
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={interestedIn.includes("Male")}
                        onChange={() => handleInterestedInToggle("Male")}
                        className="h-5 w-5 rounded border-gray-800 bg-black text-red-500 focus:ring-2 focus:ring-red-500/20"
                      />
                      <span className="text-white">Mænd</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={interestedIn.includes("Female")}
                        onChange={() => handleInterestedInToggle("Female")}
                        className="h-5 w-5 rounded border-gray-800 bg-black text-red-500 focus:ring-2 focus:ring-red-500/20"
                      />
                      <span className="text-white">Kvinder</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={interestedIn.includes("Other")}
                        onChange={() => handleInterestedInToggle("Other")}
                        className="h-5 w-5 rounded border-gray-800 bg-black text-red-500 focus:ring-2 focus:ring-red-500/20"
                      />
                      <span className="text-white">Andet</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-6 border-t border-gray-800 pt-6">
                <h2 className="text-lg font-semibold text-white">
                  Yderligere information
                </h2>

                <Input
                  type="tel"
                  label="Telefonnummer"
                  placeholder="+45 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                  type="number"
                  label="Højde (cm)"
                  placeholder="Fx 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="100"
                  max="250"
                />

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
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 border-t border-gray-800 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 rounded-xl border border-gray-800 px-6 py-4 font-bold text-white transition hover:bg-gray-900"
                  disabled={saving}
                >
                  Annuller
                </button>
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  disabled={saving}
                >
                  {saving ? "Gemmer..." : "Gem ændringer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
