"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
    onUpload: (url: string) => void;
    label?: string;
    currentImage?: string;
}

export default function ImageUpload({
    onUpload,
    label,
    currentImage,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const supabase = createClient();

            // Check if user is logged in
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`; // Upload directly to avatars bucket

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage.from("avatars").getPublicUrl(filePath);

            setPreview(publicUrl);
            onUpload(publicUrl);
        } catch (error: any) {
            console.error("Error uploading image:", error.message);
            alert("Error uploading image: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {label && (
                <label className="block text-sm font-medium text-white">{label}</label>
            )}
            <div className="flex flex-col items-center gap-4">
                <div className="group relative">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-gray-800 bg-gray-900 transition-colors group-hover:border-red-500">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-600">
                                <Upload className="h-8 w-8" />
                            </div>
                        )}
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 rounded-full bg-red-500 p-2 text-white shadow-lg transition hover:bg-red-600"
                        disabled={uploading}
                    >
                        <Upload className="h-4 w-4" />
                    </button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    className="hidden"
                />
                <p className="text-xs text-gray-400">Anbefalet: 400x400px (Max 5MB)</p>
            </div>
        </div>
    );
}
