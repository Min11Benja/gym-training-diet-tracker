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
    const todaysWorkout = useQuery(api.workoutPlans.getTodaysWorkout);

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
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
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

            {/* Assigned Workout from Coach */}
            {todaysWorkout?.todaysWorkout && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                                Assigned by Coach
                            </p>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                                {todaysWorkout.plan.name}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                {todaysWorkout.todaysWorkout.dayName}'s Workout
                            </p>
                        </div>
                        {todaysWorkout.alreadyLogged && (
                            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={24} />
                        )}
                    </div>

                    <div className="space-y-3">
                        {todaysWorkout.todaysWorkout.exercises.map((exercise: { name: string; sets: number; reps: string; weight?: number; equipment?: string; notes?: string }, idx: number) => (
                            <div key={idx} className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold text-zinc-900 dark:text-white">{exercise.name}</p>
                                        {exercise.equipment && (
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{exercise.equipment}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-zinc-900 dark:text-white">
                                            {exercise.sets} × {exercise.reps}
                                        </p>
                                        {exercise.weight && (
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400">{exercise.weight} kg</p>
                                        )}
                                    </div>
                                </div>
                                {exercise.notes && (
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 italic">
                                        💡 {exercise.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/dashboard/workouts"
                        className="mt-4 w-full block text-center bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
                    >
                        {todaysWorkout.alreadyLogged ? "View Logged Workout" : "Start Workout"}
                    </Link>
                </div>
            )}


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
