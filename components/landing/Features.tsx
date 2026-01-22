"use client";

import { Utensils, Dumbbell, BarChart3, MessageCircle } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function Features() {
    const { language } = useLanguage();
    const t = content[language].features;

    const icons = [Utensils, Dumbbell, BarChart3, MessageCircle];

    return (
        <section id="features" className="py-24 bg-[#101010] ">
            <div className="container px-6 mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white  mb-6">
                        {t.heading}
                    </h2>
                    <p className="text-gray-400 dark:text-zinc-400">
                        {t.subheading}
                    </p>
                </div>

                <div className="space-y-24">
                    {t.items.map((key, i) => (
                        <FeatureBlock
                            key={i}
                            icon={icons[i]}
                            title={key.title}
                            subtitle={key.subtitle}
                            description={key.description}
                            result={key.result}
                            points={key.points}
                            align={i % 2 === 0 ? "left" : "right"}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface FeatureBlockProps {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    description: string;
    result: string;
    points: string[];
    align?: "left" | "right";
}

function FeatureBlock({ icon: Icon, title, subtitle, description, result, points, align = "left" }: FeatureBlockProps) {
    return (
        <div className={`flex flex-col md:flex-row gap-12 items-center ${align === "right" ? "md:flex-row-reverse" : ""}`}>
            <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 text-indigo-400 font-semibold tracking-wide uppercase text-sm">
                    <Icon className="h-5 w-5" />
                    {subtitle}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white ">{title}</h3>
                <p className="text-lg text-gray-400 dark:text-zinc-400 leading-relaxed">
                    {description}
                </p>
                <div className="pl-6 border-l-2 border-indigo-500/30 space-y-4">
                    <p className="text-white  font-medium">Result: <span className="text-gray-400 dark:text-zinc-400 font-normal">{result}</span></p>
                </div>
                <ul className="grid gap-3">
                    {points.map((point: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            {point}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Visual Placeholder for Feature UI */}
            <div className="flex-1 w-full bg-white/5 dark:bg-zinc-900 border border-white/10 dark:border-zinc-800 rounded-2xl aspect-square md:aspect-[4/3] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="text-gray-500 dark:text-gray-400 font-mono text-sm border border-white/10 dark:border-zinc-800 p-4 rounded bg-[#101010]/50 /50 backdrop-blur">
                    UI Preview: {title}
                </div>
            </div>
        </div>
    )
}
