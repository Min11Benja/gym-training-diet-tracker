"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CoachLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuthActions();

    const navItems = [
        { name: "Overview", href: "/coach/dashboard", icon: LayoutDashboard },
        { name: "Clients", href: "/coach/clients", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white flex transition-colors">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-zinc-900 bg-zinc-950 p-6 hidden md:flex flex-col">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">CT</div>
                        <span className="font-bold text-xl tracking-tight">CoachTrack</span>
                    </div>
                    <ThemeToggle />
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-zinc-900 space-y-2">
                    <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white w-full text-left rounded-xl hover:bg-zinc-900 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Coach) */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 p-4 z-50 flex justify-between items-center">
                <span className="font-bold">CoachTrack Pro</span>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button onClick={() => signOut()} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <main className="flex-1 p-6 md:p-10 overflow-auto pt-20 md:pt-10">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
