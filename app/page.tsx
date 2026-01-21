import Link from "next/link";
import { Dumbbell, Users, TrendingUp, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl w-full space-y-20">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6">
            <Dumbbell size={16} className="text-blue-500" />
            CoachTrack MVP
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            Master Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Training
            </span>
          </h1>

          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate platform for coaches to monitor clients, adjust nutrition, and track progress with real-time data.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/auth?role=coach"
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative space-y-5">
              <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Users className="text-blue-500" size={28} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  Are you a Coach?
                  <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Manage clients, assign routines, and track compliance with powerful analytics.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">Client Management</span>
                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">Analytics</span>
              </div>
            </div>
          </Link>

          <Link
            href="/auth?role=client"
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative space-y-5">
              <div className="h-14 w-14 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="text-green-500" size={28} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  Are you a Client?
                  <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Log workouts, track calories, and monitor your progress with detailed insights.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">Workout Logs</span>
                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">Nutrition</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Real-time</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-500 font-medium">Data Sync</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">WhatsApp</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-500 font-medium">Integration</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">Mobile</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-500 font-medium">First Design</div>
          </div>
        </div>
      </div>
    </main>
  );
}
