"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function ClientDetailPage() {
    const params = useParams();
    const clientId = params.id as Id<"users">;

    const data = useQuery(api.coach.getClientDetails, { clientId });

    if (!data) {
        return <div className="p-8 text-center">Loading client data...</div>;
    }

    const { client, workouts, latestMetric } = data;

    if (!client) return <div className="p-8">Client not found</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
                <div>
                    <h2 className="text-3xl font-bold">{client.name || "Unnamed Client"}</h2>
                    <p className="text-zinc-400 mt-1">{client.email}</p>
                    <div className="flex gap-4 mt-4 text-sm">
                        <span className="bg-zinc-800 px-3 py-1 rounded-full">Goal: {client.goal?.replace("_", " ")}</span>
                        <span className="bg-zinc-800 px-3 py-1 rounded-full">Height: {client.height}cm</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-zinc-400">Current Weight</div>
                    <div className="text-2xl font-bold">{latestMetric?.weight || "--"} kg</div>
                    <div className="mt-4 flex justify-end">
                        <a
                            href={`https://wa.me/?text=Hi ${client.name}, let's talk about your progress.`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm bg-green-600 px-3 py-2 rounded-full hover:bg-green-500 font-bold inline-block"
                        >
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Workouts */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <h3 className="text-xl font-bold mb-4">Recent Workouts</h3>
                    <div className="space-y-4">
                        {workouts.length === 0 && <p className="text-zinc-500">No workouts logged.</p>}
                        {workouts.map(workout => (
                            <div key={workout._id} className="border-b border-zinc-800 last:border-0 pb-4 last:pb-0">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-blue-400">{new Date(workout.date).toLocaleDateString()}</span>
                                    <span className="text-xs bg-zinc-800 px-2 py-1 rounded capitalize">{workout.exercises[0]?.effort || 'N/A'}</span>
                                </div>
                                <p className="text-sm text-zinc-400">{workout.exercises.length} exercises performed</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nutrition / Compliance Placeholder */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <h3 className="text-xl font-bold mb-4">Compliance</h3>
                    <div className="h-40 flex items-center justify-center bg-zinc-800/50 rounded-lg border border-dashed border-zinc-700">
                        <p className="text-zinc-500">Nutrition data visualization coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
