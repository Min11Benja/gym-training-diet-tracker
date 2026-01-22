"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Dumbbell, TrendingUp, Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default function ClientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.clientId as Id<"users">;

    const clientDetails = useQuery(api.workoutPlans.getClientDetails, { clientId });

    if (!clientDetails) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-zinc-500 dark:text-zinc-400">Loading client details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/coach/clients"
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-zinc-600 dark:text-zinc-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                            {clientDetails.name || "Client"}
                        </h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{clientDetails.email}</p>
                    </div>
                </div>
                <Link
                    href={`/coach/clients/${clientId}/assign-workout`}
                    className="bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 shadow-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Assign Workout
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <Dumbbell size={20} />
                        </div>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase">Active Plan</p>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {clientDetails.workoutPlan?.name || "None"}
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase">Latest Weight</p>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {clientDetails.latestMetrics?.weight || "N/A"} {clientDetails.latestMetrics?.weight && "kg"}
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                            <Calendar size={20} />
                        </div>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase">Workouts This Week</p>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {clientDetails.recentWorkouts?.filter((w) => w.completedAt).length || 0}
                    </p>
                </div>
            </div>

            {/* Recent Workouts */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
                <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Recent Workouts</h2>
                </div>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {clientDetails.recentWorkouts && clientDetails.recentWorkouts.length > 0 ? (
                        clientDetails.recentWorkouts.map((workout) => (
                            <div key={workout._id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <div className="flex-1">
                                    <p className="font-medium text-zinc-900 dark:text-white">{workout.date}</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {workout.exercises.length} exercises
                                    </p>
                                </div>
                                {workout.completedAt ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Pending</span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                            No workouts logged yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
