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
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#101010]/80 backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white hover:opacity-90 transition-opacity">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8f8f8f] text-white shadow-lg shadow-[#8f8f8f]/20">
                        <LayoutDashboard size={18} />
                    </div>
                    <span>{t.brand}</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <Link href="#how-it-works" className="hover:text-white transition-colors">{t.links.howItWorks}</Link>
                    <Link href="#problem" className="hover:text-white transition-colors">{t.links.problem}</Link>
                    <Link href="#solution" className="hover:text-white transition-colors">{t.links.solution}</Link>
                    <Link href="#features" className="hover:text-white transition-colors">{t.links.features}</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">{t.links.pricing}</Link>
                    <Link href="#faq" className="hover:text-white transition-colors">{t.links.faq}</Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white">
                        <ModeToggle />
                        <LanguageSelector />
                    </div>
                    <div className="hidden md:flex">
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10" asChild>
                            <Link href="/login">{t.cta.login}</Link>
                        </Button>
                    </div>
                    <Button asChild className="bg-white text-black hover:bg-[#B2FF59] hover:text-black font-semibold shadow-xl shadow-white/5 disabled:opacity-50 transition-colors duration-300">
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
