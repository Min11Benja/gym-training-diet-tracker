"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Home,
  Dumbbell,
  UtensilsCrossed,
  ChartLine,
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const mergeProfile = useMutation(api.users.mergeProfile);

  useEffect(() => {
    if (user && (user as any).hasLegacyProfile) {
      console.log("Legacy profile detected, merging...");
      mergeProfile();
    }
  }, [user, mergeProfile]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const tabs = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
    { name: "Nutrition", href: "/dashboard/nutrition", icon: UtensilsCrossed },
    { name: "Metrics", href: "/dashboard/metrics", icon: ChartLine },
    { name: "Progress", href: "/dashboard/progress", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white flex transition-colors">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 hidden md:flex flex-col fixed inset-y-0 left-0">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 bg-emerald-600 dark:bg-[#B2FF59] rounded-lg flex items-center justify-center font-bold text-white dark:text-black shadow-lg shadow-emerald-500/20 dark:shadow-[#B2FF59]/20">
              <LayoutDashboard size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
              CoachEnControl
            </span>
          </div>

          {/* Theme Toggle & Language - Matched to Coach UI */}
          <div className="flex gap-2 mb-4">
            <ThemeToggle />
            <select className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] cursor-pointer">
              <option value="en">🇺🇸 ENGLISH</option>
              <option value="es">🇲🇽 ESPAÑOL</option>
            </select>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black shadow-lg"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive ? "" : "group-hover:scale-110 transition-transform"
                  }
                />
                <span className="font-semibold text-sm">{tab.name}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 w-full text-left rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-semibold text-sm"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900">
        <h1 className="font-bold text-lg tracking-tight">CoachEnControl</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-h-screen">
        <div className="p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-900 flex justify-around px-2 py-3 pb-6 z-50">
        {tabs.map((tab) => {
          // Exact match for dashboard, startswith for others
          const isActive =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href);

          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? "text-emerald-600 dark:text-[#B2FF59]"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
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
