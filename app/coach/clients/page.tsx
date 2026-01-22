"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, MoreHorizontal, MessageCircle } from "lucide-react";

export default function ClientsPage() {
    const clients = useQuery(api.coach.getClients);
    // Fallback for demo if no clients assigned
    const allClients = useQuery(api.coach.getAllClientsForDemo);

    const displayClients = (clients && clients.length > 0) ? clients : allClients;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur sticky top-0 z-10 py-4 border-b border-zinc-200 dark:border-zinc-900">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Clients</h2>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-500" size={18} />
                        <input placeholder="Search clients..." className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] w-64" />
                    </div>
                    <button
                        onClick={() => alert("Add Client feature coming soon!")}
                        className="bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 shadow-lg"
                    >
                        + Add Client
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm dark:shadow-none">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400">Client</th>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400">Goal</th>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400">Compliance</th>
                            <th className="p-4 font-medium text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {displayClients?.map((client) => (
                            <tr key={client._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                <td className="p-4">
                                    <Link href={`/coach/clients/${client._id}`} className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-sm">
                                            {client.name?.[0] || client.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white group-hover:text-blue-500 transition-colors">{client.name || "Unnamed Client"}</p>
                                            <p className="text-xs text-zinc-500">{client.email}</p>
                                        </div>
                                    </Link>
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                        Active
                                    </span>
                                </td>
                                <td className="p-4 capitalize text-zinc-300">
                                    {client.goal?.replace("_", " ") || "N/A"}
                                </td>
                                <td className="p-4">
                                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[85%]"></div>
                                    </div>
                                    <span className="text-xs text-zinc-500 mt-1 block">85% Adherence</span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 text-zinc-400">
                                        <button className="p-2 hover:bg-zinc-800 rounded-lg hover:text-white transition-colors">
                                            <MessageCircle size={18} />
                                        </button>
                                        <Link href={`/coach/clients/${client._id}`} className="p-2 hover:bg-zinc-800 rounded-lg hover:text-white transition-colors">
                                            <MoreHorizontal size={18} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {displayClients?.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                        No clients found.
                    </div>
                )}
            </div>
        </div>
    );
}
