"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calculator, Save } from "lucide-react";
import Link from "next/link";

export default function MacroCalculatorPage() {
    const router = useRouter();
    const saveGoals = useMutation(api.nutrition.saveGoals);

    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("male");
    const [activity, setActivity] = useState("1.2");
    const [goal, setGoal] = useState("maintenance");

    const [result, setResult] = useState<{ calories: number; protein: number } | null>(null);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const w = Number(weight);
        const h = Number(height);
        const a = Number(age);

        // Mifflin-St Jeor
        let bmr = (10 * w) + (6.25 * h) - (5 * a);
        bmr += sex === "male" ? 5 : -161;

        let tdee = bmr * Number(activity);

        if (goal === "cut") tdee -= 500;
        if (goal === "bulk") tdee += 300;

        // Protein: 2g per kg (approx 1g per lb)
        const protein = Math.round(w * 2);

        setResult({
            calories: Math.round(tdee),
            protein
        });
    };

    const handleSave = async () => {
        if (!result) return;
        try {
            await saveGoals(result);
            router.push("/dashboard/nutrition");
        } catch (err) {
            console.error(err);
            alert("Failed to save goals");
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4 mb-2">
                <Link href="/dashboard/nutrition" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white border border-zinc-800">
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="text-2xl font-bold tracking-tight">Calculator</h2>
            </div>

            <form onSubmit={calculate} className="space-y-6">
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Weight (kg)</label>
                            <input type="number" required value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500 font-bold text-lg" placeholder="--" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Height (cm)</label>
                            <input type="number" required value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500 font-bold text-lg" placeholder="--" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Age</label>
                            <input type="number" required value={age} onChange={e => setAge(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500 font-bold text-lg" placeholder="--" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sex</label>
                            <div className="flex bg-zinc-950 rounded-xl border border-zinc-800 p-1">
                                <button type="button" onClick={() => setSex("male")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${sex === "male" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}>M</button>
                                <button type="button" onClick={() => setSex("female")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${sex === "female" ? "bg-zinc-800 text-white" : "text-zinc-500"}`}>F</button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activity Level</label>
                        <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500 text-sm">
                            <option value="1.2">Sedentary (Office job)</option>
                            <option value="1.375">Light Exercise (1-2 days/week)</option>
                            <option value="1.55">Moderate Exercise (3-5 days/week)</option>
                            <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Goal</label>
                        <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500 text-sm">
                            <option value="maintenance">Maintenance</option>
                            <option value="cut">Fat Loss (-500 kcal)</option>
                            <option value="bulk">Muscle Gain (+300 kcal)</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="w-full bg-zinc-100 text-black rounded-2xl py-4 font-bold hover:bg-white flex items-center justify-center gap-2">
                    <Calculator size={20} />
                    Calculate Macros
                </button>
            </form>

            {result && (
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 text-center space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
                    <div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-4">Recommended Daily Targets</h3>
                        <div className="flex justify-center gap-4">
                            <div className="flex-1 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                                <p className="text-3xl font-bold text-blue-500">{result.calories}</p>
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">Calories</p>
                            </div>
                            <div className="flex-1 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                                <p className="text-3xl font-bold text-green-500">{result.protein}g</p>
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">Protein</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleSave} className="w-full bg-blue-600 rounded-2xl py-4 font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Save size={20} />
                        Update My Goals
                    </button>
                </div>
            )}
        </div>
    );
}
