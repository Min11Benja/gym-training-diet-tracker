"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function Pricing() {
    const { language } = useLanguage();
    const t = content[language].pricing;

    return (
        <section id="pricing" className="py-24 bg-zinc-50 dark:bg-zinc-950 relative">
            <div className="container px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                        {t.heading}
                    </h2>
                    <p className="text-lg text-indigo-400 font-medium max-w-2xl mx-auto">
                        {t.subheading}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                    {/* Starter */}
                    <PricingCard
                        title={t.cards.starter.title}
                        price={t.cards.starter.price}
                        description={t.cards.starter.description}
                        features={t.cards.starter.features}
                        cta={t.cards.starter.cta}
                    />

                    {/* Pro - Highlighted */}
                    <PricingCard
                        title={t.cards.pro.title}
                        price={t.cards.pro.price}
                        description={t.cards.pro.description}
                        features={t.cards.pro.features}
                        highlighted
                        badge={t.cards.pro.badge}
                        cta={t.cards.pro.cta}
                    />

                    {/* Teams */}
                    <PricingCard
                        title={t.cards.teams.title}
                        price={t.cards.teams.price}
                        description={t.cards.teams.description}
                        features={t.cards.teams.features}
                        cta={t.cards.teams.cta}
                    />
                </div>
            </div>
        </section>
    );
}

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    highlighted?: boolean;
    badge?: string;
    cta: string;
}

function PricingCard({ title, price, description, features, highlighted = false, badge, cta }: PricingCardProps) {
    return (
        <div className={`
            relative p-8 rounded-2xl border flex flex-col h-full
            ${highlighted
                ? "bg-white dark:bg-zinc-900 border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-105 z-10"
                : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            }
        `}>
            {highlighted && badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold uppercase py-1 px-3 rounded-full">
                    {badge}
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">{price}</span>
                    <span className="text-zinc-500 text-sm">/month</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{description}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
                        <CheckCircle2 className={`h-4 w-4 ${highlighted ? "text-indigo-500" : "text-zinc-400 dark:text-zinc-600"}`} />
                        {feature}
                    </li>
                ))}
            </ul>

            <Button
                className={`w-full ${highlighted ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"}`}
                asChild
            >
                <Link href="#cta">
                    {cta}
                </Link>
            </Button>
        </div>
    )
}
