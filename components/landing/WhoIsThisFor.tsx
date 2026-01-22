"use client";

import { Check } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function WhoIsThisFor() {
    const { language } = useLanguage();
    const t = content[language].whoIsThisFor;
    return (
        <section className="py-24 bg-white dark:bg-[#101010]  border-t border-zinc-200 dark:border-white/10 dark:border-white/5">
            <div className="container px-6 mx-auto">
                <div className="max-w-4xl mx-auto bg-zinc-50 dark:bg-white/5 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 dark:border-zinc-800 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold text-zinc-600 dark:text-gray-400  mb-8">
                        {t.heading}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
                        {t.items.map((item: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-[#101010]  border border-zinc-200 dark:border-white/10 dark:border-zinc-800 rounded-xl">
                                <Check className="h-5 w-5 text-emerald-600 dark:text-[#B2FF59] shrink-0" />
                                <span className="text-zinc-700 dark:text-zinc-200 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-[#B2FF59]">
                        {t.footer}
                    </p>
                </div>
            </div>
        </section>
    );
}
