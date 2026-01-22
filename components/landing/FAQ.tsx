"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function FAQ() {
    const { language } = useLanguage();
    const t = content[language].faq;

    return (
        <section id="faq" className="py-24 bg-white dark:bg-[#101010]  border-t border-zinc-200 dark:border-white/10 dark:border-white/5">
            <div className="container px-6 mx-auto max-w-3xl">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold text-zinc-600 dark:text-gray-400 mb-12 text-center"
                >
                    {t.heading}
                </motion.h2>

                <div className="space-y-4">
                    {t.items.map((faq: { q: string, a: string }, i: number) => (
                        <motion.details
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group bg-white dark:bg-[#151515] shadow-sm hover:shadow-md border border-zinc-200 dark:border-white/10 dark:border-zinc-800 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium text-zinc-600 dark:text-gray-400 dark:text-zinc-100 group-hover:text-emerald-700 dark:text-[#B2FF59] dark:group-hover:text-zinc-600 dark:text-gray-400 transition-colors">
                                {faq.q}
                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 dark:text-zinc-400 leading-relaxed">
                                <p>{faq.a}</p>
                            </div>
                        </motion.details>
                    ))}
                </div>
            </div>
        </section>
    );
}
