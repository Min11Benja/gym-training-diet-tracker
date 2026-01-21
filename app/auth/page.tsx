"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
    const { signIn } = useAuthActions();
    const [step, setStep] = useState<"signIn" | "signUp">("signIn");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get("role") || "client";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (step === "signIn") {
                await signIn("password", { email, password, flow: "signIn" });
            } else {
                await signIn("password", { email, password, flow: "signUp", role }); // custom field 'role'
            }
            // Redirect handled by middleware or automatic
            router.push(role === 'coach' ? '/coach/dashboard' : '/dashboard/workouts');
        } catch (err) {
            setError("Authentication failed. Please check your credentials.");
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-8 border border-zinc-800">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
                        {step === "signIn" ? "Sign in to your account" : "Create your account"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-zinc-400">
                        {step === "signIn"
                            ? "Welcome back to CoachTrack"
                            : `Join as a ${role === "coach" ? "Coach" : "Client"}`}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                type="email"
                                required
                                className="relative block w-full rounded-t-md border-0 bg-zinc-800 py-1.5 text-white ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="relative block w-full rounded-b-md border-0 bg-zinc-800 py-1.5 text-white ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            {step === "signIn" ? "Sign in" : "Sign up"}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
                        className="text-sm font-medium text-blue-500 hover:text-blue-400"
                    >
                        {step === "signIn"
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
