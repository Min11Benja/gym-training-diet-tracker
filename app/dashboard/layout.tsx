"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuthActions();

    const tabs = [
        { name: "Workouts", href: "/dashboard/workouts" },
        { name: "Nutrition", href: "/dashboard/nutrition" },
        { name: "Metrics", href: "/dashboard/metrics" },
        { name: "Progress", href: "/dashboard/progress" },
    ];

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <header className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950">
                <h1 className="font-bold text-xl">CoachTrack</h1>
                <button onClick={() => signOut()} className="text-sm text-zinc-400 hover:text-white">Sign Out</button>
            </header>
            <main className="p-4">{children}</main>
            <nav className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-900 flex justify-around p-4 safe-area-bottom">
                {tabs.map((tab) => {
                    const isActive = pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`text-sm font-medium ${isActive ? "text-blue-500" : "text-zinc-500"}`}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
