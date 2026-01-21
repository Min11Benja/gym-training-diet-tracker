"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CoachDashboardPage() {
    const clients = useQuery(api.coach.getClients);

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-zinc-400 text-sm font-medium">Total Clients</h3>
                    <p className="text-4xl font-bold mt-2">{clients?.length || 0}</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-zinc-400 text-sm font-medium">Workouts This Week</h3>
                    <p className="text-4xl font-bold mt-2 text-blue-500">-</p> {/* Todo: Aggregation */}
                </div>
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <h3 className="text-zinc-400 text-sm font-medium">Pending Check-ins</h3>
                    <p className="text-4xl font-bold mt-2 text-yellow-500">-</p>
                </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <p className="text-zinc-500">No recent activity.</p>
            </div>
        </div>
    );
}
