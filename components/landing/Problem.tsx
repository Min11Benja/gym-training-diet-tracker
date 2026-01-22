"use client";

import { XCircle, AlertTriangle } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function Problem() {
    const { language } = useLanguage();
    const t = content[language].problem;

    return (
        <section id="problem" className="py-24 bg-white/5  relative border-t border-white/10 dark:border-white/5">
            <div className="container px-6 mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {t.heading.title} <br />
                        <span className="text-zinc-400 dark:text-gray-400">{t.heading.subtitle}</span>
                    </h2>
                    <p className="text-gray-400 dark:text-zinc-400 text-lg">
                        {t.description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
                    {/* Left Col: The Pain */}
                    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8 md:p-10 space-y-8">
                        <h3 className="text-xl font-semibold text-red-500 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            {t.leftCol.title}
                        </h3>
                        <ul className="space-y-4">
                            {t.leftCol.items.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300">
                                    <XCircle className="h-6 w-6 text-red-500/50 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Col: The Failed Fix */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-white dark:text-zinc-100 mb-4">{t.rightCol.title}</h3>
                            <ul className="space-y-3">
                                {t.rightCol.items.map((item: string, i: number) => (
                                    <li key={i} className="p-4 bg-[#101010] dark:bg-zinc-900 rounded-lg border border-white/10 dark:border-zinc-800 text-gray-400 dark:text-zinc-400">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 bg-[#101010] dark:bg-zinc-900/50 rounded-xl border border-white/10 dark:border-zinc-800 text-center">
                            <p className="text-xl font-medium text-white  mb-2">{t.rightCol.footer}</p>
                            <p className="text-red-400 font-bold uppercase tracking-wider text-sm">{t.rightCol.tagline}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
