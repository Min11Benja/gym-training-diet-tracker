"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertCircle, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export default function CoachDashboardPage() {
    const clients = useQuery(api.coach.getClients);

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Coach Dashboard</h2>
                <p className="text-zinc-400">Welcome back. Here&apos;s what needs your attention today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">{clients?.length || 0}</p>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Total Clients</p>
                </div>
                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">85%</p>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Compliance Rate</p>
                </div>
                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">3</p>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Pending Check-ins</p>
                </div>
                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white">12</p>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Workouts Logged</p>
                </div>
            </div>

            {/* Alerts Panel */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <AlertCircle size={18} className="text-red-500" />
                            Needs Attention
                        </h3>
                    </div>
                    <div className="divide-y divide-zinc-800">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                <div>
                                    <p className="font-semibold text-sm">Missed Workout - Sarah J.</p>
                                    <p className="text-xs text-zinc-500">Scheduled for yesterday (Leg Day)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <TrendingUp size={18} className="text-blue-500" />
                            Recent Wins
                        </h3>
                    </div>
                    <div className="divide-y divide-zinc-800">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                                <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">PR</div>
                                <div>
                                    <p className="font-semibold text-sm">New Bench Press PR - Mike T.</p>
                                    <p className="text-xs text-zinc-500">Hit 100kg x 5 reps</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
