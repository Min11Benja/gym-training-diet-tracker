"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function Footer() {
    const { language } = useLanguage();
    const t = content[language].footer;

    return (
        <footer className="bg-[#101010]  border-t border-white/10 dark:border-zinc-800">
            {/* Final CTA */}
            <div id="cta" className="py-24 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-indigo-500/10 blur-[100px] pointer-events-none" />

                <div className="container px-6 mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white  mb-6">
                        {t.cta.heading}
                    </h2>
                    <p className="text-xl text-gray-400 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
                        {t.cta.subheading.line1} <br />
                        {t.cta.subheading.line2} <span className="text-white  font-semibold">{t.cta.highlight}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-8 text-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-[#101010] dark:text-zinc-950 dark:hover:bg-zinc-200">
                            {t.cta.primary}
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 dark:border-zinc-800 text-gray-400 dark:text-zinc-300 hover:text-white dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900">
                            {t.cta.secondary}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container px-6 mx-auto py-12 border-t border-white/10 dark:border-zinc-900">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white ">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                            <LayoutDashboard size={18} />
                        </div>
                        <span>CoachTrack</span>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-500">
                        <span>© {new Date().getFullYear()} {content[language].navbar.brand}</span>
                        <Link href="#" className="hover:text-white dark:hover:text-zinc-300 transition-colors">{t.legal.privacy}</Link>
                        <Link href="#" className="hover:text-white dark:hover:text-zinc-300 transition-colors">{t.legal.terms}</Link>
                        <Link href="#" className="hover:text-white dark:hover:text-zinc-300 transition-colors">{t.legal.contact}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
