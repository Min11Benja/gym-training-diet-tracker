"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, Calendar } from "lucide-react";

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
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedImage.type },
                body: selectedImage,
            });
            const { storageId } = await result.json();

            await saveProgress({
                storageId,
                date,
                notes: "Uploaded via CoachEnControl"
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
            <h2 className="text-2xl font-bold tracking-tight">Progress Photos</h2>

            <form onSubmit={handeUpload} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-5 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                        <Camera size={16} />
                        Upload New Photo
                    </h3>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-zinc-950 rounded-lg px-2 py-1 text-xs text-white border border-zinc-800" />
                </div>

                <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 h-40 ${selectedImage ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {selectedImage ? (
                        <>
                            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                <CheckIcon size={20} />
                            </div>
                            <p className="text-blue-500 font-medium text-sm truncate max-w-full px-4">{selectedImage.name}</p>
                        </>
                    ) : (
                        <>
                            <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                                <Upload size={20} />
                            </div>
                            <p className="text-zinc-500 text-sm">Tap to select photo</p>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                </div>

                <button
                    type="submit"
                    disabled={!selectedImage || isUploading}
                    className="w-full bg-blue-600 rounded-2xl py-4 font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                >
                    {isUploading ? "Uploading..." : "Save Photo"}
                </button>
            </form>

            <div className="space-y-6">
                {entries?.map((entry) => (
                    <div key={entry._id} className="space-y-3">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm pl-1">
                            <Calendar size={14} />
                            <p className="font-medium">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {entry.photos.map((url, i) => (
                                url && (
                                    <div key={i} className="relative aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-sm group">
                                        <Image
                                            src={url}
                                            alt="Progress"
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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

function CheckIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    )
}
