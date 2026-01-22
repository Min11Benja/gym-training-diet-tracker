"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ArrowLeft, Calendar, Dumbbell } from "lucide-react";

export default function WorkoutHistoryPage() {
    const workouts = useQuery(api.workouts.getWorkouts);

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/workouts" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white border border-zinc-800">
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="text-2xl font-bold">History</h2>
            </div>

            <div className="space-y-4">
                {workouts?.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                        <Dumbbell size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No logged workouts yet.</p>
                    </div>
                )}

                {workouts?.map((workout) => (
                    <div key={workout._id} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Calendar size={16} />
                                <span className="text-sm font-medium text-white">{new Date(workout.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 font-medium capitalize">

                                {workout.status || 'completed'}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {workout.exercises.slice(0, 3).map((ex: any, i: number) => (
                                <div key={i} className="flex justify-between items-baseline text-sm">
                                    <span className="font-medium text-zinc-200">{ex.name}</span>
                                    <span className="text-zinc-500 font-mono text-xs">{ex.sets} × {ex.reps} • {ex.weight}kg</span>
                                </div>
                            ))}
                            {workout.exercises.length > 3 && (
                                <p className="text-xs text-zinc-500 pt-2 text-center border-t border-zinc-800/50 mt-2">
                                    +{workout.exercises.length - 3} more exercises
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
