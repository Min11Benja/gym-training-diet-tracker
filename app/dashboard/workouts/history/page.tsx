"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function WorkoutHistoryPage() {
    const workouts = useQuery(api.workouts.getWorkouts);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Workout History</h2>
                <Link href="/dashboard/workouts" className="text-blue-500 text-sm">Log New Workout</Link>
            </div>

            <div className="space-y-4">
                {workouts?.length === 0 && <p className="text-zinc-500">No workouts found.</p>}
                {workouts?.map((workout) => (
                    <div key={workout._id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-blue-400">{new Date(workout.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            {/* @ts-expect-error status field added recently */}
                            <span className={`text-xs px-2 py-1 rounded capitalize ${workout.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                {/* @ts-expect-error status field added recently */}
                                {workout.status || 'completed'}
                            </span>
                        </div>

                        <div className="space-y-1">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {workout.exercises.slice(0, 3).map((ex: any, i: number) => (
                                <div key={i} className="text-sm flex justify-between">
                                    <span>{ex.name}</span>
                                    <span className="text-zinc-500">{ex.sets} x {ex.reps} @ {ex.weight}kg</span>
                                </div>
                            ))}
                            {workout.exercises.length > 3 && (
                                <p className="text-xs text-zinc-500 pt-1">+{workout.exercises.length - 3} more exercises</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
