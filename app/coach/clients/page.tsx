"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function ClientsPage() {
    const clients = useQuery(api.coach.getClients);
    // Fallback for demo if no clients assigned
    const allClients = useQuery(api.coach.getAllClientsForDemo);

    const displayClients = (clients && clients.length > 0) ? clients : allClients;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">My Clients</h2>
                <button className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500">
                    + Invite Client
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayClients?.map((client) => (
                    <Link
                        key={client._id}
                        href={`/coach/clients/${client._id}`}
                        className="block p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-blue-500 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-zinc-700 flex items-center justify-center text-xl font-bold">
                                {client.name?.[0] || client.email[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{client.name || "Unnamed Client"}</h3>
                                <p className="text-sm text-zinc-400">{client.email}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-zinc-500">
                            <span>Goal: {client.goal?.replace("_", " ") || "N/A"}</span>
                            <span>Status: <span className="text-green-500">Active</span></span>
                        </div>
                    </Link>
                ))}

                {displayClients?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-zinc-500">
                        No clients found. Invite someone to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
