"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { User, Ruler, Target, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function OnboardingPage() {
    const router = useRouter();
    const updateProfile = useMutation(api.users.updateProfile);
    const currentUser = useQuery(api.users.currentUser);

    const [role, setRole] = useState<"coach" | "client">("client");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("male");
    const [height, setHeight] = useState("");
    const [goal, setGoal] = useState("fat_loss");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect to auth if not authenticated
    useEffect(() => {
        if (currentUser === null) {
            router.push("/auth");
        }
    }, [currentUser, router]);

    // Show loading while checking auth
    if (currentUser === undefined) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-zinc-500">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirecting to auth
    if (currentUser === null) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !height) {
            alert("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await updateProfile({
                name,
                role,
                age: age ? Number(age) : undefined,
                sex,
                height: Number(height),
                goal: goal as "fat_loss" | "muscle_gain" | "recomp"
            });
            router.push(role === "coach" ? "/coach/dashboard" : "/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to save profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-4">
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">Welcome to CoachTrack</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Let&apos;s set up your profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">I am a...</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className={`py-4 rounded-2xl font-bold transition-all ${role === "coach" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30 scale-[1.02]" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                                onClick={() => setRole("coach")}
                            >
                                Coach
                            </button>
                            <button
                                type="button"
                                className={`py-4 rounded-2xl font-bold transition-all ${role === "client" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30 scale-[1.02]" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                                onClick={() => setRole("client")}
                            >
                                Client
                            </button>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 ml-1 mb-2">Full Name *</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-zinc-950 rounded-2xl p-4 pl-12 border border-zinc-800 focus:outline-none focus:border-blue-500 font-semibold"
                                placeholder="John Doe"
                                required
                            />
                            <User className="absolute left-4 top-4 text-zinc-600" size={20} />
                        </div>
                    </div>

                    {/* Age & Sex */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 ml-1 mb-2">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full bg-zinc-950 rounded-2xl p-4 border border-zinc-800 focus:outline-none focus:border-blue-500 text-center font-bold"
                                placeholder="25"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 ml-1 mb-2">Sex</label>
                            <select
                                value={sex}
                                onChange={(e) => setSex(e.target.value)}
                                className="w-full bg-zinc-950 rounded-2xl p-4 border border-zinc-800 focus:outline-none focus:border-blue-500 font-semibold appearance-none text-center"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Height */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 ml-1 mb-2">Height (cm) *</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full bg-zinc-950 rounded-2xl p-4 pl-12 border border-zinc-800 focus:outline-none focus:border-blue-500 font-bold text-xl"
                                placeholder="175"
                                required
                            />
                            <Ruler className="absolute left-4 top-4 text-zinc-600" size={20} />
                        </div>
                    </div>

                    {/* Goal */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 ml-1 mb-2">Primary Goal</label>
                        <div className="relative">
                            <select
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="w-full bg-zinc-950 rounded-2xl p-4 pl-12 border border-zinc-800 focus:outline-none focus:border-blue-500 font-semibold appearance-none"
                            >
                                <option value="fat_loss">Fat Loss</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="recomp">Recomposition</option>
                            </select>
                            <Target className="absolute left-4 top-4 text-zinc-600" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "Saving..." : "Get Started"}
                        {!isSubmitting && <ArrowRight size={20} />}
                    </button>
                </form>

                <p className="text-center text-xs text-zinc-600">
                    Your information is secure and will only be used to personalize your experience.
                </p>
            </div>
        </div>
    );
}
