"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Scale, Ruler, History } from "lucide-react";

export default function MetricsPage() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [weight, setWeight] = useState("");
    const [waist, setWaist] = useState("");

    const logMetrics = useMutation(api.metrics.logMetrics);
    const history = useQuery(api.metrics.getMetrics);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weight) return;

        await logMetrics({
            date,
            weight: Number(weight),
            waist: waist ? Number(waist) : undefined
        });
        setWeight("");
        setWaist("");
        alert("Metrics saved");
    };

    // Prepare chart data (reverse to chronological)
    const chartData = history ? [...history].reverse().map(Entry => ({
        date: new Date(Entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        weight: Entry.weight,
        waist: Entry.waist
    })) : [];

    return (
        <div className="max-w-md mx-auto space-y-8 pb-24">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Body Metrics</h2>

            {/* Input Form */}
            <form onSubmit={handleSave} className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-zinc-200 dark:border-white/10 space-y-6 shadow-sm dark:shadow-none">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Log for:</span>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg px-3 py-1 text-sm border border-zinc-200 dark:border-white/10" />
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1 mb-1 block">Weight (kg)</label>
                        <div className="relative">
                            <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl p-4 pl-12 border border-zinc-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] font-bold text-xl" placeholder="0.0" />
                            <Scale className="absolute left-4 top-4 text-zinc-400 dark:text-zinc-600" size={24} />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1 mb-1 block">Waist (cm)</label>
                        <div className="relative">
                            <input type="number" step="0.1" value={waist} onChange={e => setWaist(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl p-4 pl-12 border border-zinc-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] font-bold text-xl" placeholder="Optional" />
                            <Ruler className="absolute left-4 top-4 text-zinc-400 dark:text-zinc-600" size={24} />
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-full bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black rounded-2xl py-4 font-bold hover:opacity-90 shadow-lg active:scale-95 transition-all">Save Entry</button>
            </form>

            {/* Chart */}
            <div className="bg-white dark:bg-[#151515] p-5 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-4 flex items-center gap-2">
                    <History size={16} />
                    Weight Trend
                </h3>
                <div className="h-[250px] w-full">
                    {chartData.length > 1 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3} className="dark:stop-color-[#B2FF59]" />
                                        <stop offset="95%" stopColor="#059669" stopOpacity={0} className="dark:stop-color-[#B2FF59]" />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#71717a" className="dark:stroke-zinc-600" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" className="dark:stroke-zinc-600" fontSize={10} domain={['auto', 'auto']} tickLine={false} axisLine={false} width={30} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px' }}
                                    itemStyle={{ color: '#18181b', fontSize: '12px' }}
                                    labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="weight" stroke="#059669" className="dark:stroke-[#B2FF59]" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 text-sm gap-2">
                            <Scale size={32} className="opacity-20" />
                            <p>Log 2+ entries to see trend</p>
                        </div>
                    )}
                </div>
            </div>

            {/* History List */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold px-1 text-zinc-900 dark:text-white">Recent Logs</h3>
                {history?.map(entry => (
                    <div key={entry._id} className="flex justify-between items-center p-4 bg-white dark:bg-[#151515] border border-zinc-200 dark:border-white/10 rounded-2xl text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <span className="text-zinc-600 dark:text-zinc-400 font-medium">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <div className="flex gap-6">
                            <span className="font-bold text-base text-zinc-900 dark:text-white">{entry.weight} <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">kg</span></span>
                            {entry.waist && <span className="text-zinc-600 dark:text-zinc-400">{entry.waist} <span className="text-xs text-zinc-500 dark:text-zinc-600">cm</span></span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
