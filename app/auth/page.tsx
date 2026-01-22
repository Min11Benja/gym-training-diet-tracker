"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthPage() {
    const { signIn } = useAuthActions();
    const [step, setStep] = useState<"signIn" | "signUp">("signIn");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get("role") || "client";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await signIn("password", { email, password, flow: step === "signIn" ? "signIn" : "signUp" });

            // Wait a moment for the session to be established
            await new Promise(resolve => setTimeout(resolve, 500));

            // Redirect after auth is complete
            if (step === "signUp") {
                router.push("/onboarding");
            } else {
                router.push(role === 'coach' ? '/coach/dashboard' : '/dashboard');
            }
        } catch (err) {
            setError("Authentication failed. Please check your credentials.");
            console.error(err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-4">
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">CoachTrack</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {step === "signIn"
                            ? "Welcome back! Sign in to continue."
                            : `Create your ${role === "coach" ? "Coach" : "Client"} account`}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                    {step === "signUp" && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-start gap-3">
                            <User className="text-blue-500 mt-0.5" size={20} />
                            <div className="text-sm">
                                <p className="font-semibold text-blue-400">Joining as a {role === "coach" ? "Coach" : "Client"}</p>
                                <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">You&apos;ll complete your profile after signing up.</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-500 ml-1 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 rounded-2xl p-4 pl-12 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 font-semibold text-zinc-900 dark:text-white"
                                    placeholder="you@example.com"
                                />
                                <Mail className="absolute left-4 top-4 text-zinc-400 dark:text-zinc-600" size={20} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-500 ml-1 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 rounded-2xl p-4 pl-12 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 font-semibold text-zinc-900 dark:text-white"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-4 top-4 text-zinc-400 dark:text-zinc-600" size={20} />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-white"
                    >
                        {isSubmitting ? "Loading..." : (step === "signIn" ? "Sign In" : "Create Account")}
                        {!isSubmitting && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
                        className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        {step === "signIn"
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Sign in"}
                    </button>
                </div>

                <p className="text-center text-xs text-zinc-500 dark:text-zinc-700">
                    By continuing, you agree to CoachTrack&apos;s Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
