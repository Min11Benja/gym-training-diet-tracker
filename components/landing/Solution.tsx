"use client";

import { CheckCircle2, RefreshCcw } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function Solution() {
    const { language } = useLanguage();
    const t = content[language].solution;
    return (
        <section id="solution" className="py-24 bg-white dark:bg-zinc-900 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container px-6 mx-auto relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
                        <RefreshCcw className="h-4 w-4" />
                        {t.badge}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                        {t.heading}
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        {t.subheading}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Comparison 1 */}
                    <ComparisonCard
                        bad={t.cards.card1.bad}
                        good={t.cards.card1.good}
                    />
                    {/* Comparison 2 */}
                    <ComparisonCard
                        bad={t.cards.card2.bad}
                        good={t.cards.card2.good}
                    />
                </div>

                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white max-w-2xl mx-auto">
                        {t.footer.line1} <br />
                        <span className="text-indigo-400">{t.footer.highlight}</span>
                    </h3>
                </div>
            </div>
        </section>
    );
}

function ComparisonCard({ bad, good }: { bad: { quote: string, label: string }, good: { quote: string, label: string } }) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1 overflow-hidden">
            <div className="p-6 bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{bad.label}</span>
                <p className="text-zinc-600 dark:text-zinc-400 italic mt-2 text-lg">{bad.quote}</p>
            </div>
            <div className="p-6 bg-indigo-500/5">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {good.label}
                </span>
                <p className="text-zinc-900 dark:text-white font-medium mt-2 text-lg">{good.quote}</p>
            </div>
        </div>
    )
}
