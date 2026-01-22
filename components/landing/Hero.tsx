"use client";

import Link from "next/link";
import { ArrowRight, Play, ArrowUpRight, Asterisk } from "lucide-react";
import { motion, Variants } from "framer-motion";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 20 },
    },
};

const revealTextVariants: Variants = {
    hidden: { y: '100%' },
    visible: {
        y: '0%',
        transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
    },
};

export default function Hero() {
    const { language } = useLanguage();
    const t = content[language].hero;

    return (
        <section className="bg-[#101010] text-white min-h-[calc(100vh-80px)] pt-32 pb-12 px-4 md:px-8 font-sans overflow-hidden">
            <motion.div
                className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                {/* --- LEFT COLUMN (Image & Purple Card) --- */}
                <div className="lg:col-span-5 flex flex-col gap-4 order-2 lg:order-1">

                    {/* Main Image Card */}
                    <motion.div
                        variants={itemVariants}
                        className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden group"
                    >
                        {/* The "Cut Corner" Effect */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#101010] z-10 transform rotate-45 translate-x-12 -translate-y-12" />

                        <img
                            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2670&auto=format&fit=crop"
                            alt="Training"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                        />
                    </motion.div>

                    {/* CTA Card Replace 93% Stat */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-[#8f8f8f] text-white rounded-2xl p-8 flex flex-col justify-center gap-4 h-auto min-h-[220px] relative overflow-hidden"
                    >
                        {/* Decorative Notch */}
                        <div className="absolute left-[-20px] top-[50%] w-8 h-8 bg-[#101010] rotate-45 transform -translate-y-1/2" />
                        <div className="absolute right-[-20px] top-[50%] w-8 h-8 bg-[#101010] rotate-45 transform -translate-y-1/2" />

                        <div>
                            <h3 className="font-bold text-lg mb-3">{t.benefits.title}</h3>
                            <ul className="space-y-2 mb-4">
                                {t.benefits.list.map((item: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF59]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-white/60 pt-3 border-t border-white/20">
                                {t.benefits.footer}
                            </p>
                        </div>

                    </motion.div>
                </div>

                {/* --- RIGHT COLUMN (Typography & Actions) --- */}
                <div className="lg:col-span-7 flex flex-col relative order-1 lg:order-2">

                    {/* Rotating Badge */}
                    <motion.div
                        className="absolute top-0 right-0 z-20 hidden md:block"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <motion.svg
                                className="w-full h-full absolute inset-0"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                                viewBox="0 0 100 100"
                            >
                                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                <text className="text-[10px] uppercase font-bold tracking-widest fill-[#8f8f8f]">
                                    <textPath href="#circlePath" startOffset="0%">
                                        Start Now • Start Now • Start Now •
                                    </textPath>
                                </text>
                            </motion.svg>
                            <div className="w-12 h-12 bg-[#8f8f8f] rounded-full flex items-center justify-center">
                                <Play size={16} fill="white" className="ml-1" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Heading with "Masked Reveal" effect */}
                    <div className="mt-8 lg:mt-24 mb-12 relative z-10">
                        <span className="text-gray-400 text-sm mb-4 block flex items-center gap-2">
                            {t.badge} <div className="h-[1px] w-8 bg-gray-600"></div>
                        </span>

                        <div className="overflow-hidden">
                            <motion.h1 variants={revealTextVariants} className="text-6xl md:text-8xl font-bold uppercase leading-[0.9]">
                                {t.title.line1}
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden">
                            <motion.h1 variants={revealTextVariants} className="text-6xl md:text-8xl font-bold uppercase leading-[0.9] text-gray-500">
                                {t.title.highlight1}
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden">
                            <motion.h1 variants={revealTextVariants} className="text-6xl md:text-8xl font-bold uppercase leading-[0.9]">
                                {t.title.line2}
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden">
                            <motion.h1 variants={revealTextVariants} className="text-6xl md:text-8xl font-bold uppercase leading-[0.9] text-[#B2FF59]">
                                {t.title.highlight2}
                            </motion.h1>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mt-auto pb-8">

                        {/* Buttons */}
                        <div className="flex flex-col gap-4">
                            <Link href="#cta" className="group">
                                <div className="bg-white text-black hover:bg-[#B2FF59] hover:text-black font-bold p-4 rounded-xl flex items-center gap-4 transition-all duration-300 shadow-lg shadow-white/5 group-hover:shadow-[#B2FF59]/20 group-hover:-translate-y-1">
                                    <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center group-hover:bg-black/80">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <span className="text-lg">👉 {t.cta.primary}</span>
                                </div>
                            </Link>

                            <Link href="#solution" className="group">
                                <div className="border border-white/20 text-white hover:bg-white/5 font-medium p-4 rounded-xl flex items-center gap-4 transition-all duration-300 group-hover:-translate-y-1">
                                    <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center">
                                        <Asterisk size={20} />
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white">📈 {t.cta.secondary}</span>
                                </div>
                            </Link>
                        </div>

                        {/* Bottom Right Testimonial/Info */}
                        <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                            <div className="bg-white/10 p-2 rounded-lg text-white">
                                <ArrowRight className="rotate-45" />
                            </div>
                            <p className="text-sm text-gray-400 max-w-[200px]">
                                {t.subtitle.text} {t.subtitle.strong}
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-[#B2FF59] text-black flex items-center justify-center font-bold text-sm">
                                    4.9
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>

            </motion.div>
        </section>
    );
}
