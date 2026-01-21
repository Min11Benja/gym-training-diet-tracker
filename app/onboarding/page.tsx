"use client";

import { useState } from "react";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();
    // We'll assume we access the current user via a query, but we haven't created it yet. 
    // For now, we'll just build the form.

    const [role, setRole] = useState<"coach" | "client">("client");
    const [height, setHeight] = useState("");
    const [goal, setGoal] = useState("fat_loss");

    // Placeholder for mutation
    // const updateUser = useMutation(api.users.updateProfile);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementation pending backend mutation availability
        console.log("Saving profile", { role, height, goal });
        // Simulate redirect
        router.push(role === "coach" ? "/coach/dashboard" : "/dashboard/workouts");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-8 border border-zinc-800">
                <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">I am a...</label>
                        <div className="mt-2 flex gap-4">
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-md ${role === "coach" ? "bg-blue-600" : "bg-zinc-800"}`}
                                onClick={() => setRole("coach")}
                            >
                                Coach
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-md ${role === "client" ? "bg-blue-600" : "bg-zinc-800"}`}
                                onClick={() => setRole("client")}
                            >
                                Client
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Height (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 text-white px-3 py-2"
                            placeholder="175"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Goal</label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 text-white px-3 py-2"
                        >
                            <option value="fat_loss">Fat Loss</option>
                            <option value="muscle_gain">Muscle Gain</option>
                            <option value="recomp">Recomposition</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 py-2 rounded-md font-semibold hover:bg-blue-500"
                    >
                        Get Started
                    </button>
                </form>
            </div>
        </div>
    );
}
