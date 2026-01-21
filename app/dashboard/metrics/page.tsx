"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
        date: new Date(Entry.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
        weight: Entry.weight,
        waist: Entry.waist
    })) : [];

    return (
        <div className="max-w-md mx-auto space-y-8 pb-24">
            <h2 className="text-2xl font-bold">Body Metrics</h2>

            {/* Input Form */}
            <form onSubmit={handleSave} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-400 text-sm">Log for:</span>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-zinc-800 rounded p-1 text-sm text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-zinc-500 block mb-1">Weight (kg)</label>
                        <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-zinc-800 rounded p-2" placeholder="0.0" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 block mb-1">Waist (cm)</label>
                        <input type="number" step="0.1" value={waist} onChange={e => setWaist(e.target.value)} className="w-full bg-zinc-800 rounded p-2" placeholder="Optional" />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 rounded py-2 font-bold hover:bg-blue-500">Save Entry</button>
            </form>

            {/* Chart */}
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 min-h-[300px]">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4">Weight Trend</h3>
                {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="date" stroke="#52525b" fontSize={12} />
                            <YAxis stroke="#52525b" fontSize={12} domain={['auto', 'auto']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                        Need at least 2 entries to show trend.
                    </div>
                )}
            </div>

            {/* History List */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">History</h3>
                {history?.map(entry => (
                    <div key={entry._id} className="flex justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm">
                        <span className="text-zinc-400">{new Date(entry.date).toLocaleDateString()}</span>
                        <div>
                            <span className="font-bold">{entry.weight} kg</span>
                            {entry.waist && <span className="text-zinc-500 ml-3">{entry.waist} cm</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
