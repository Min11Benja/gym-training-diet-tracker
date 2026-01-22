"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSelector } from "@/components/language-selector";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function Navbar() {
    const { language } = useLanguage();
    const t = content[language].navbar;
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white hover:opacity-90 transition-opacity">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                        <LayoutDashboard size={18} />
                    </div>
                    <span>{t.brand}</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <Link href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{t.links.howItWorks}</Link>
                    <Link href="#problem" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{t.links.problem}</Link>
                    <Link href="#solution" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{t.links.solution}</Link>
                    <Link href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{t.links.features}</Link>
                    <Link href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{t.links.pricing}</Link>
                    <Link href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">{t.links.faq}</Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <LanguageSelector />
                    </div>
                    <div className="hidden md:flex">
                        <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800" asChild>
                            <Link href="/login">{t.cta.login}</Link>
                        </Button>
                    </div>
                    <Button asChild className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-xl shadow-zinc-900/5 dark:shadow-white/5 disabled:opacity-50">
                        <Link href="#apply">{t.cta.earlyAccess}</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}

// Temporary Button component if shadcn/ui is not fully setup, but usually I should check first.
// I will create a simple button wrapper or assume standard HTML button with tailwind if Button is missing.
// However, the user plan mentioned "No external UI library (like shadcn/ui) is fully installed", so I should probably stick to standard HTML or create a basic UI kit. 
// Let's create a temporary UI kit file for Button if needed, or just use standard HTML in the next steps. 
// For this file, I imported Button from @/components/ui/button. I'll check if it exists in the next turn.
