"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";

export default function CoachLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuthActions();

    const navItems = [
        { name: "Overview", href: "/coach/dashboard" },
        { name: "Clients", href: "/coach/clients" },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            <aside className="w-64 border-r border-zinc-900 bg-zinc-950 p-6 hidden md:block">
                <h1 className="font-bold text-2xl mb-8">CoachTrack <span className="text-xs text-blue-500">PRO</span></h1>
                <nav className="space-y-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-2 rounded-md ${isActive ? "bg-blue-600/10 text-blue-500" : "text-zinc-400 hover:text-white"}`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-6">
                    <button onClick={() => signOut()} className="text-sm text-zinc-500 hover:text-white">Sign Out</button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
    );
}
