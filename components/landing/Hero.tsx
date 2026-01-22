"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function Hero() {
    const { language } = useLanguage();
    const t = content[language].hero;
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {t.badge}
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 max-w-4xl mx-auto">
                    {t.title.line1} <span className="text-zinc-500">{t.title.highlight1}</span> <br className="hidden md:block" />
                    {t.title.line2} <span className="text-indigo-500">{t.title.highlight2}</span>
                </h1>

                <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {t.subtitle.text}
                    <strong className="text-zinc-900 dark:text-zinc-100 block mt-2">
                        {t.subtitle.strong}
                    </strong>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 w-full sm:w-auto" asChild>
                        <Link href="#cta">
                            {t.cta.primary} <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 w-full sm:w-auto" asChild>
                        <Link href="#solution">
                            <TrendingUp className="mr-2 h-5 w-5 text-zinc-500" />
                            {t.cta.secondary}
                        </Link>
                    </Button>
                </div>

                <div className="mt-16 pt-8 border-t border-zinc-200/50 dark:border-zinc-900/50 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 text-center">
                    {t.socialProof.map((item: string, i: number) => (
                        <div key={i} className="text-zinc-500 font-medium text-sm md:text-base">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
