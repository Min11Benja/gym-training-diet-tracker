"use client";

import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function FAQ() {
    const { language } = useLanguage();
    const t = content[language].faq;

    return (
        <section id="faq" className="py-24 bg-[#101010]  border-t border-white/10 dark:border-white/5">
            <div className="container px-6 mx-auto max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white  mb-12 text-center">
                    {t.heading}
                </h2>

                <div className="space-y-4">
                    {t.items.map((faq: { q: string, a: string }, i: number) => (
                        <details key={i} className="group bg-white/5 dark:bg-zinc-900/50 border border-white/10 dark:border-zinc-800 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium text-white dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                                {faq.q}
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 dark:text-zinc-400 leading-relaxed">
                                <p>{faq.a}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
