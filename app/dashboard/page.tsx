"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { CheckCircle2, Circle, Flame, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function DashboardPage() {
    const today = new Date().toISOString().split("T")[0];
    const nutrition = useQuery(api.nutrition.getNutrition, { date: today });
    const workout = useQuery(api.workouts.getWorkoutByDate, { date: today });
    const metrics = useQuery(api.metrics.getMetrics); // Fetches last 30

    // --- Derived State ---
    const caloriesGoal = nutrition?.goals.calories || 2500;
    const proteinGoal = nutrition?.goals.protein || 180;

    const logs = nutrition?.logs || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const caloriesConsumed = logs.reduce((acc: number, item: any) => acc + item.calories, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proteinConsumed = logs.reduce((acc: number, item: any) => acc + item.protein, 0);

    const calPercent = Math.min(100, Math.round((caloriesConsumed / caloriesGoal) * 100));
    const proPercent = Math.min(100, Math.round((proteinConsumed / proteinGoal) * 100));

    const workoutStatus = workout?.status === "completed" ? "Done" : "Pending";

    // Weight Sparkline Data
    const weightData = metrics ? [...metrics].reverse().map(m => ({ w: m.weight })) : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-zinc-600 dark:text-gray-400 text-sm uppercase tracking-wider font-semibold">Today&apos;s Overview</p>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
            </div>

            {/* Nutrition Cards */}
            <div className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/nutrition" className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-zinc-200 dark:border-white/10 relative overflow-hidden group hover:shadow-md dark:hover:shadow-none transition-shadow">
                    <div className="absolute top-0 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800">
                        <div className="h-full bg-emerald-600 dark:bg-[#B2FF59] transition-all duration-1000" style={{ width: `${calPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                        <Flame className="text-emerald-600 dark:text-[#B2FF59]" size={20} fill={calPercent > 100 ? "currentColor" : "none"} />
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{caloriesGoal - caloriesConsumed} left</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">{caloriesConsumed}</span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 ml-1">kcal</span>
                    </div>
                </Link>

                <Link href="/dashboard/nutrition" className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-zinc-200 dark:border-white/10 relative overflow-hidden hover:shadow-md dark:hover:shadow-none transition-shadow">
                    <div className="absolute top-0 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800">
                        <div className="h-full bg-emerald-600 dark:bg-[#B2FF59] transition-all duration-1000" style={{ width: `${proPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-[#B2FF59] tracking-wider">PROTEIN</span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{proteinGoal - proteinConsumed}g left</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">{proteinConsumed}</span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 ml-1">g</span>
                    </div>
                </Link>
            </div>

            {/* Workout Status Card */}
            <Link href="/dashboard/workouts" className="block bg-white dark:bg-[#151515] p-5 rounded-2xl border border-zinc-200 dark:border-white/10 flex items-center justify-between hover:shadow-md dark:hover:shadow-none transition-shadow">
                <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Today&apos;s Workout</h3>
                    {workout ? (
                        <p className="text-sm text-zinc-600 dark:text-gray-400">{workout.exercises.length} Exercises Scheduled</p>
                    ) : (
                        <p className="text-sm text-zinc-600 dark:text-gray-400">Rest Day / No Plan</p>
                    )}
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${workoutStatus === "Done" ? "bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"}`}>
                    {workoutStatus === "Done" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
            </Link>

            {/* Weight Trend */}
            <Link href="/dashboard/metrics" className="block bg-white dark:bg-[#151515] p-5 rounded-2xl border border-zinc-200 dark:border-white/10 hover:shadow-md dark:hover:shadow-none transition-shadow">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={16} className="text-zinc-600 dark:text-zinc-400" />
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Weight Trend</span>
                        </div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                            {metrics?.[0]?.weight || "--"} <span className="text-sm font-normal text-zinc-600 dark:text-zinc-400">kg</span>
                        </div>
                    </div>
                    <div className="h-16 w-24">
                        {weightData.length > 1 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightData}>
                                    <Line type="monotone" dataKey="w" stroke="#059669" strokeWidth={2} dot={false} className="dark:stroke-[#B2FF59]" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-600">Not enough data</div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
