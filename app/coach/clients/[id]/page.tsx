"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import * as Tabs from "@radix-ui/react-tabs";
import { Dumbbell, Utensils, TrendingUp, Image as ImageIcon, Plus, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ClientDetailPage() {
    const params = useParams();
    const clientId = params.id as Id<"users">;

    const data = useQuery(api.coach.getClientDetails, { clientId });

    if (!data) return <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">Loading client data...</div>;

    const { client, workouts, metrics, nutrition, progress } = data;

    if (!client) return <div className="p-8 text-zinc-900 dark:text-white">Client not found</div>;

    const latestWeight = metrics?.[0]?.weight || "--";
    const latestWaist = metrics?.[0]?.waist || "--";

    return (
        <div className="space-y-6 pb-24">
            {/* Header / Profile Card */}
            <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-zinc-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-emerald-600/20 dark:bg-[#B2FF59]/20 text-emerald-600 dark:text-[#B2FF59] rounded-full flex items-center justify-center text-2xl font-bold">
                        {client.name?.[0] || "C"}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{client.name || "Unnamed Client"}</h2>
                        <div className="flex gap-2 text-sm text-zinc-600 dark:text-gray-400 mt-1 font-medium">
                            <span className="capitalize">{client.sex}</span>
                            <span>•</span>
                            <span>{client.age} yrs</span>
                            <span>•</span>
                            <span>{client.height}cm</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-6 text-center">
                    <div>
                        <p className="text-3xl font-bold text-zinc-900 dark:text-white">{latestWeight}<span className="text-sm font-normal text-zinc-500 dark:text-gray-500 ml-0.5">kg</span></p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-gray-500 mt-1 font-bold">Weight</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-zinc-900 dark:text-white">{latestWaist}<span className="text-sm font-normal text-zinc-500 dark:text-gray-500 ml-0.5">cm</span></p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-gray-500 mt-1 font-bold">Waist</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-[#B2FF59]">85%</p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-gray-500 mt-1 font-bold">Adherence</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link href={`/coach/clients/${clientId}/assign`} className="bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg">
                    <Plus size={18} /> Assign Workout
                </Link>
                <Link href={`/coach/clients/${clientId}/diet`} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm">
                    <Utensils size={18} /> Assign Diet
                </Link>
                <a href={`https://wa.me/?text=Hi ${client.name}`} target="_blank" rel="noreferrer" className="bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg">
                    Chat on WhatsApp
                </a>
            </div>

            {/* Tabs */}
            <Tabs.Root defaultValue="workouts" className="space-y-6">
                <Tabs.List className="flex bg-white dark:bg-[#151515] p-1 rounded-2xl border border-zinc-200 dark:border-white/10">
                    <Tabs.Trigger value="workouts" className="flex-1 py-2 rounded-xl text-sm font-medium text-zinc-500 dark:text-gray-400 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-[#B2FF59] transition-all flex items-center justify-center gap-2">
                        <Dumbbell size={16} /> Workouts
                    </Tabs.Trigger>
                    <Tabs.Trigger value="nutrition" className="flex-1 py-2 rounded-xl text-sm font-medium text-zinc-500 dark:text-gray-400 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-[#B2FF59] transition-all flex items-center justify-center gap-2">
                        <Utensils size={16} /> Nutrition
                    </Tabs.Trigger>
                    <Tabs.Trigger value="metrics" className="flex-1 py-2 rounded-xl text-sm font-medium text-zinc-500 dark:text-gray-400 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-[#B2FF59] transition-all flex items-center justify-center gap-2">
                        <TrendingUp size={16} /> Metrics
                    </Tabs.Trigger>
                    <Tabs.Trigger value="progress" className="flex-1 py-2 rounded-xl text-sm font-medium text-zinc-500 dark:text-gray-400 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-[#B2FF59] transition-all flex items-center justify-center gap-2">
                        <ImageIcon size={16} /> Photos
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="workouts" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Recent Workouts</h3>
                    {workouts.map(workout => (
                        <div key={workout._id} className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 font-medium">
                                    <Calendar size={16} className="text-emerald-600 dark:text-[#B2FF59]" />
                                    {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-lg font-bold capitalize ${workout.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>{workout.status || 'Planned'}</span>
                            </div>
                            <div className="space-y-2">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {workout.exercises.map((ex: any, i: number) => (
                                    <div key={i} className="flex justify-between text-sm text-zinc-600 dark:text-gray-400 border-b border-zinc-100 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                                        <span className="font-medium text-zinc-900 dark:text-zinc-200">{ex.name}</span>
                                        <span className="font-mono text-zinc-500 dark:text-gray-500">{ex.sets} x {ex.reps} @ {ex.weight}kg</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {workouts.length === 0 && <p className="text-center text-zinc-500 dark:text-zinc-400 py-10">No workouts logged.</p>}
                </Tabs.Content>

                <Tabs.Content value="nutrition" className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Recent Food Logs</h3>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {nutrition?.map((log: any) => (
                        <div key={log._id} className="bg-white dark:bg-[#151515] p-4 rounded-2xl border border-zinc-200 dark:border-white/10 flex justify-between items-center shadow-sm">
                            <div>
                                <p className="font-bold text-zinc-900 dark:text-zinc-200">{log.item.food}</p>
                                <p className="text-xs text-zinc-500 dark:text-gray-500 font-medium">{new Date(log.date).toLocaleDateString()} • {log.item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-zinc-900 dark:text-white">{log.item.calories} <span className="text-[10px] font-normal text-zinc-500 dark:text-gray-500">kcal</span></p>
                                <p className="text-xs text-emerald-600 dark:text-[#B2FF59] font-bold">{log.item.protein}g protein</p>
                            </div>
                        </div>
                    ))}
                    {nutrition?.length === 0 && <p className="text-center text-zinc-500 dark:text-zinc-400 py-10">No nutrition data recorded.</p>}
                </Tabs.Content>

                <Tabs.Content value="metrics" className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Metrics History</h3>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {metrics?.map((m: any) => (
                        <div key={m._id} className="flex justify-between items-center bg-white dark:bg-[#151515] p-4 rounded-2xl border border-zinc-200 dark:border-white/10 text-sm shadow-sm">
                            <span className="text-zinc-600 dark:text-gray-400 font-medium">{new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <div className="flex gap-8">
                                <span className="font-bold text-base text-zinc-900 dark:text-white">{m.weight} <span className="text-xs font-normal text-zinc-500 dark:text-gray-500">kg</span></span>
                                {m.waist && <span className="text-zinc-600 dark:text-zinc-400 font-medium">{m.waist} <span className="text-xs text-zinc-400 dark:text-zinc-600">cm</span></span>}
                            </div>
                        </div>
                    ))}
                    {metrics?.length === 0 && <p className="text-center text-zinc-500 dark:text-zinc-400 py-10">No metrics logged yet.</p>}
                </Tabs.Content>

                <Tabs.Content value="progress" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {progress?.map((entry: any) => (
                            entry.photos.map((url: string, i: number) => (
                                url && (
                                    <div key={`${entry._id}-${i}`} className="relative aspect-[3/4] bg-white dark:bg-[#151515] rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10 group shadow-sm">
                                        <Image src={url} alt="User Progress" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
                                            <p className="text-[10px] text-white font-bold uppercase tracking-wider">{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                )
                            ))
                        ))}
                    </div>
                    {(!progress || progress.length === 0) && <p className="text-center text-zinc-500 dark:text-zinc-400 py-10 font-medium">No progress photos found.</p>}
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
