"use client";

import Link from "next/link";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function NutritionPage() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const data = useQuery(api.nutrition.getNutrition, { date });
    const logFood = useMutation(api.nutrition.logFood);

    const [food, setFood] = useState("");
    const [quantity, setQuantity] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");

    if (!data) return <div className="p-4">Loading nutrition data...</div>;

    const { goals, logs } = data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalCalories = logs.reduce((acc: number, item: any) => acc + item.calories, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalProtein = logs.reduce((acc: number, item: any) => acc + item.protein, 0);

    const remainingCalories = goals.calories - totalCalories;
    // const remainingProtein = goals.protein - totalProtein;

    const handleLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!food || !calories) return;

        await logFood({
            date,
            item: {
                food,
                quantity: quantity || "1 serving",
                calories: Number(calories),
                protein: Number(protein)
            }
        });

        setFood("");
        setQuantity("");
        setCalories("");
        setProtein("");
    };

    return (
        <div className="max-w-md mx-auto space-y-8 pb-24">
            <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold">Nutrition</h2>
                    <Link href="/dashboard/nutrition/calculator" className="text-xs text-blue-500 hover:underline">Set Goals</Link>
                </div>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-zinc-800 rounded p-2 text-white" />
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${remainingCalories < 0 ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-zinc-800'}`}>
                    <p className="text-xs text-zinc-400 mb-1">Calories</p>
                    <p className="text-2xl font-bold">{totalCalories} <span className="text-sm font-normal text-zinc-500">/ {goals.calories}</span></p>
                </div>
                <div className="p-4 rounded-xl border bg-zinc-900 border-zinc-800">
                    <p className="text-xs text-zinc-400 mb-1">Protein</p>
                    <p className="text-2xl font-bold">{totalProtein}g <span className="text-sm font-normal text-zinc-500">/ {goals.protein}g</span></p>
                </div>
            </div>

            {/* Log Form */}
            <form onSubmit={handleLog} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3">
                <h3 className="font-semibold text-sm text-zinc-400">Add Meal</h3>
                <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Food Name" value={food} onChange={e => setFood(e.target.value)} className="col-span-2 bg-zinc-800 rounded p-2" />
                    <input placeholder="Qty (e.g. 100g)" value={quantity} onChange={e => setQuantity(e.target.value)} className="bg-zinc-800 rounded p-2" />
                    <input type="number" placeholder="Calories" value={calories} onChange={e => setCalories(e.target.value)} className="bg-zinc-800 rounded p-2" />
                    <input type="number" placeholder="Protein (g)" value={protein} onChange={e => setProtein(e.target.value)} className="bg-zinc-800 rounded p-2" />
                </div>
                <button type="submit" className="w-full bg-blue-600 rounded py-2 font-semibold text-sm mt-2">Log Food</button>
            </form>

            {/* Food Log List */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Today&apos;s Meals</h3>
                {logs.length === 0 && <p className="text-zinc-500 text-sm">No meals logged yet.</p>}
                {logs.map((item: any, i: number) => (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <div key={i} className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                        <div>
                            <p className="font-medium">{item.food}</p>
                            <p className="text-xs text-zinc-500">{item.quantity}</p>
                        </div>
                        <div className="text-right text-sm">
                            <p>{item.calories} kcal</p>
                            <p className="text-zinc-500">{item.protein}g protein</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
