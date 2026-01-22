"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSmartForm, SmartFormData } from "@/app/actions";
import { Loader2, CheckCircle2 } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { content } from "@/lib/translations";

export default function SmartForm() {
    const { language } = useLanguage();
    const t = content[language].form;
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Initialize with values that satisfy the type or cast initially
    const [formData, setFormData] = useState<SmartFormData>({
        name: "",
        email: "",
        instagram: "",
        country: "",
        clients: "1-10",
        price: "<$50",
        problem: "Abandono de clientes",
        trackingMethod: "WhatsApp",
        intention: "Sí",
        utm_source: "",
        utm_campaign: "",
        utm_medium: "",
        utm_content: ""
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            utm_source: searchParams.get("utm_source") || "",
            utm_campaign: searchParams.get("utm_campaign") || "",
            utm_medium: searchParams.get("utm_medium") || "",
            utm_content: searchParams.get("utm_content") || ""
        }));
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(prev => prev + 1);

    // Simple validation for step 1
    const canNext = step === 1
        ? formData.name && formData.email && formData.instagram && formData.country
        : true;


    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitSmartForm(formData);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-6">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.success.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                    {t.success.message}
                </p>
            </div>
        );
    }

    return (
        <section id="apply" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
            <div className="container px-6 mx-auto max-w-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{t.heading}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {t.subheading}
                    </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 md:p-10 relative">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-t-2xl overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    <div className="space-y-6 mt-4">

                        {/* STEP 1: CONTEXT */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">{t.progress.context}</h3>

                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">{t.steps[1].name}</Label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Alex Hormozi"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">{t.steps[1].email}</Label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="alex@gymlaunch.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">{t.steps[1].instagram}</Label>
                                        <Input
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                            placeholder="@hormozi"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-700 dark:text-zinc-300">{t.steps[1].country}</Label>
                                        <Input
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="USA"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button onClick={handleNext} disabled={!canNext} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                        {t.steps[1].next}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: QUALIFICATION */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">{t.progress.qualification}</h3>

                                <div>
                                    <Label className="block mb-2">{t.steps[2].clients}</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["1-10", "11-30", "31-100", "+100"].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData(prev => ({ ...prev, clients: opt as SmartFormData['clients'] }))}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.clients === opt ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="block mb-2">{t.steps[2].price}</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["<$50", "$50-100", "$100-200", "+$200"].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData(prev => ({ ...prev, price: opt as SmartFormData['price'] }))}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.price === opt ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="block mb-2">{t.steps[2].problem}</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {t.steps[2].options.problem.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData(prev => ({ ...prev, problem: opt as SmartFormData['problem'] }))}
                                                className={`p-3 rounded-lg border text-sm font-medium text-left transition-all ${formData.problem === opt ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="block mb-2">{t.steps[2].tracking}</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {t.steps[2].options.tracking.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData(prev => ({ ...prev, trackingMethod: opt as SmartFormData['trackingMethod'] }))}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.trackingMethod === opt ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between">
                                    <Button variant="ghost" onClick={() => setStep(1)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                                        {t.steps[2].back}
                                    </Button>
                                    <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                        {t.steps[2].next}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: INTENTION */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">{t.progress.intention}</h3>

                                <div>
                                    <Label className="block mb-4 text-base text-zinc-700 dark:text-zinc-200">{t.steps[3].intention}</Label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {t.steps[3].options.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData(prev => ({ ...prev, intention: opt as SmartFormData['intention'] }))}
                                                className={`p-4 rounded-xl border text-lg font-medium transition-all ${formData.intention === opt ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-between">
                                    <Button variant="ghost" onClick={() => setStep(2)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                                        {t.steps[3].back}
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 h-12 px-8 text-lg font-bold w-full md:w-auto"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : t.steps[3].submit}
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
