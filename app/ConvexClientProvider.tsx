"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function ConvexClientProvider({
    children,
}: {
    children: ReactNode;
}) {
    if (!convex) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <div className="p-8 bg-zinc-900 rounded-xl border border-red-900/50">
                    <h2 className="text-xl font-bold text-red-500 mb-4">Configuration Missing</h2>
                    <p className="mb-2">The <code>NEXT_PUBLIC_CONVEX_URL</code> environment variable is missing.</p>
                    <p className="text-zinc-400 text-sm">Please make sure <code>npx convex dev</code> is running and has completed the setup in your terminal.</p>
                </div>
            </div>
        );
    }
    return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
