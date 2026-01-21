"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function MacroCalculatorPage() {
    const router = useRouter();
    const saveGoals = useMutation(api.nutrition.saveGoals);

    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("male");
    const [activity, setActivity] = useState("1.2"); // Sedentary
    const [goal, setGoal] = useState("maintenance"); // maintenance, cut, bulk

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
            alert("Goals updated!");
            router.push("/dashboard/nutrition");
        } catch (err) {
            console.error(err);
            alert("Failed to save goals");
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-8">
            <h2 className="text-2xl font-bold">Macro Calculator</h2>

            <form onSubmit={calculate} className="space-y-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-zinc-400">Weight (kg)</label>
                        <input type="number" required value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-400">Height (cm)</label>
                        <input type="number" required value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-400">Age</label>
                        <input type="number" required value={age} onChange={e => setAge(e.target.value)} className="w-full bg-zinc-800 rounded p-2" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-400">Sex</label>
                        <select value={sex} onChange={e => setSex(e.target.value)} className="w-full bg-zinc-800 rounded p-2">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-zinc-400">Activity Level</label>
                    <select value={activity} onChange={e => setActivity(e.target.value)} className="w-full bg-zinc-800 rounded p-2">
                        <option value="1.2">Sedentary (Office job)</option>
                        <option value="1.375">Light Exercise (1-2 days/week)</option>
                        <option value="1.55">Moderate Exercise (3-5 days/week)</option>
                        <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs text-zinc-400">Goal</label>
                    <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-zinc-800 rounded p-2">
                        <option value="maintenance">Maintenance</option>
                        <option value="cut">Fat Loss (-500 kcal)</option>
                        <option value="bulk">Muscle Gain (+300 kcal)</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-600 rounded py-2 font-bold hover:bg-blue-500">Calculate</button>
            </form>

            {result && (
                <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 text-center space-y-4">
                    <h3 className="text-xl font-bold">Your Recommended Macros</h3>
                    <div className="flex justify-center gap-8">
                        <div>
                            <p className="text-3xl font-bold text-blue-500">{result.calories}</p>
                            <p className="text-sm text-zinc-400">Calories</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-blue-500">{result.protein}g</p>
                            <p className="text-sm text-zinc-400">Protein</p>
                        </div>
                    </div>
                    <button onClick={handleSave} className="w-full bg-green-600 rounded py-2 font-bold hover:bg-green-500">
                        Save to Goals
                    </button>
                </div>
            )}
        </div>
    );
}
