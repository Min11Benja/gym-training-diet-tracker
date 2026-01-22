"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Home, Dumbbell, UtensilsCrossed, ChartLine, Image as ImageIcon, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuthActions();

    const tabs = [
        { name: "Home", href: "/dashboard", icon: Home },
        { name: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
        { name: "Nutrition", href: "/dashboard/nutrition", icon: UtensilsCrossed },
        { name: "Metrics", href: "/dashboard/metrics", icon: ChartLine },
        { name: "Progress", href: "/dashboard/progress", icon: ImageIcon },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pb-24">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900">
                <h1 className="font-bold text-lg tracking-tight">CoachTrack</h1>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button onClick={() => signOut()} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="p-4 max-w-lg mx-auto animate-in fade-in duration-300">
                {children}
            </main>

            {/* Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900 flex justify-between px-6 py-3 pb-6 safe-area-bottom z-50">
                {tabs.map((tab) => {
                    // Exact match for dashboard, startswith for others
                    const isActive = tab.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(tab.href);

                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-blue-600 dark:text-blue-500" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                }`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{tab.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
