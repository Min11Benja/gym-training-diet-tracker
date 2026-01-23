"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useAuthActions } from "@convex-dev/auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting sign-in for:", email);
      await signIn("password", { email, password, flow: "signIn" });
      console.log("Sign-in successful, redirecting...");
      // Use hard redirect to ensure cookies are fresh and state is clean
      const isCoach =
        email.includes("coach") || email === "coach@coachencontrol.com";
      window.location.href = isCoach ? "/coach/dashboard" : "/dashboard";
    } catch (err) {
      console.warn("Sign-in failed, attempting auto-registration...");
      try {
        // If sign-in fails, attempt sign-up (this handles the first-time login for pre-registered clients)
        await signIn("password", { email, password, flow: "signUp" });
        console.log("Auto-registration successful, redirecting...");
        const isCoach =
          email.includes("coach") || email === "coach@coachencontrol.com";
        window.location.href = isCoach ? "/coach/dashboard" : "/dashboard";
        return;
      } catch (signUpErr) {
        console.error("SignUp failed", signUpErr);
        setError(
          "Invalid credentials or account already exists with a different password.",
        );
      }
      setIsLoading(false);
    }
  };

  const fillDemo = async (role: "coach" | "client") => {
    const demoEmail =
      role === "coach"
        ? "coach@coachencontrol.com"
        : "client@coachencontrol.com";
    const demoPassword = role === "coach" ? "admin123" : "client123";

    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    setError("");

    try {
      console.log(`Demo ${role} login attempt...`);
      await signIn("password", {
        email: demoEmail,
        password: demoPassword,
        flow: "signIn",
      });
      console.log("Demo login successful");
      window.location.href =
        role === "coach" ? "/coach/dashboard" : "/dashboard";
    } catch (err) {
      try {
        console.log(`Demo ${role} signup attempt...`);
        await signIn("password", {
          email: demoEmail,
          password: demoPassword,
          flow: "signUp",
        });
        console.log("Demo signup successful");
        window.location.href =
          role === "coach" ? "/coach/dashboard" : "/dashboard";
      } catch (e) {
        console.error("Demo auth failed", e);
        setError("Demo authentication failed. Check server logs.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-[#101010]">
      {/* --- LEFT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        {/* Top Right Toggles */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
          <ModeToggle />
          <LanguageSelector />
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center lg:text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-8 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black shadow-lg shadow-emerald-500/20 dark:shadow-[#B2FF59]/20 group-hover:scale-105 transition-transform">
                <LayoutDashboard size={18} />
              </div>
              <span className="font-bold text-xl text-zinc-900 dark:text-white tracking-tight">
                CoachEnControl
              </span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#151515] border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400"
                  required
                  autoComplete="off"
                  name="login_email_random_id"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-emerald-600 dark:text-[#B2FF59] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#151515] border border-zinc-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400"
                  required
                  autoComplete="new-password"
                  name="login_password_random_id"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/10 dark:shadow-none"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#101010] px-2 text-zinc-500">
                Or continue with demo
              </span>
            </div>
          </div>

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => fillDemo("coach")}
              className="flex items-center justify-center gap-2 p-3 bg-emerald-50 dark:bg-[#B2FF59]/10 border border-emerald-200 dark:border-[#B2FF59]/20 rounded-xl text-emerald-700 dark:text-[#B2FF59] hover:bg-emerald-100 dark:hover:bg-[#B2FF59]/20 transition-colors font-medium text-sm"
            >
              <Shield size={16} />
              Login as Coach
            </button>
            <button
              onClick={() => fillDemo("client")}
              className="flex items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors font-medium text-sm"
            >
              <User size={16} />
              Login as Client
            </button>
          </div>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/#apply"
              className="font-semibold text-emerald-600 dark:text-[#B2FF59] hover:underline"
            >
              Get Access
            </Link>
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: IMAGE --- */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2940&auto=format&fit=crop"
            alt="Gym Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-12 left-12 right-12 text-white">
            <blockquote className="text-2xl font-bold mb-4 leading-tight">
              "This platform completely transformed how I manage my online
              clients. Retention is at an all-time high."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black">
                JD
              </div>
              <div>
                <div className="font-semibold">John Doe</div>
                <div className="text-sm text-emerald-400">
                  Head Coach, Iron Fitness
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
