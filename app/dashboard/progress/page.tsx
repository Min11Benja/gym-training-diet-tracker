"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ProgressPage() {
    const generateUploadUrl = useMutation(api.progress.generateUploadUrl);
    const saveProgress = useMutation(api.progress.saveProgress);
    const entries = useQuery(api.progress.getProgress);

    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handeUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedImage) return;

        setIsUploading(true);
        try {
            // Step 1: Get URL
            const postUrl = await generateUploadUrl();

            // Step 2: Upload File
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedImage.type },
                body: selectedImage,
            });
            const { storageId } = await result.json();

            // Step 3: Save Record
            await saveProgress({
                storageId,
                date,
                notes: "Uploaded via CoachTrack"
            });

            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            alert("Photo uploaded!");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-8 pb-24">
            <h2 className="text-2xl font-bold">Progress Photos</h2>

            <form onSubmit={handeUpload} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400">Upload New Photo</h3>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-zinc-800 rounded p-2 text-white block mb-4" />

                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {selectedImage ? (
                        <p className="text-blue-500">{selectedImage.name}</p>
                    ) : (
                        <p className="text-zinc-500">Click to upload photo</p>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                </div>

                <button
                    type="submit"
                    disabled={!selectedImage || isUploading}
                    className="w-full bg-blue-600 rounded py-2 font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? "Uploading..." : "Save Photo"}
                </button>
            </form>

            <div className="space-y-4">
                {entries?.map((entry) => (
                    <div key={entry._id} className="space-y-2">
                        <p className="text-sm text-zinc-400">{new Date(entry.date).toLocaleDateString()}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {entry.photos.map((url, i) => (
                                url && (
                                    <div key={i} className="relative aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border border-zinc-800">
                                        <Image
                                            src={url}
                                            alt="Progress"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
