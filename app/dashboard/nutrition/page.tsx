"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Plus, X, Flame, AlertCircle, ChevronRight, Utensils } from "lucide-react";

export default function NutritionPage() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const data = useQuery(api.nutrition.getNutrition, { date });
    const logFood = useMutation(api.nutrition.logFood);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [food, setFood] = useState("");
    const [quantity, setQuantity] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");

    if (!data) return <div className="p-8 text-center text-zinc-500">Loading nutrition data...</div>;

    const { goals, logs } = data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalCalories = logs.reduce((acc: number, item: any) => acc + item.calories, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalProtein = logs.reduce((acc: number, item: any) => acc + item.protein, 0);

    const remainingCalories = goals.calories - totalCalories;
    const isOverCalories = remainingCalories < 0;

    const calPercent = Math.min(100, (totalCalories / goals.calories) * 100);
    const proPercent = Math.min(100, (totalProtein / goals.protein) * 100);

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
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-md mx-auto pb-24 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-zinc-950/80 backdrop-blur pb-2 sticky top-0 z-10 pt-2 border-b border-zinc-900 -mx-4 px-4 mb-2">
                <h2 className="text-2xl font-bold tracking-tight">Nutrition</h2>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-zinc-900 text-white text-sm rounded-full px-3 py-2 border border-zinc-800 focus:outline-none focus:border-blue-500 w-[130px]" />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border relative overflow-hidden group ${isOverCalories ? 'bg-red-500/10 border-red-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isOverCalories ? 'text-red-400' : 'text-zinc-400'}`}>Calories</span>
                        {isOverCalories && <AlertCircle size={14} className="text-red-500" />}
                    </div>
                    <div className="relative z-10">
                        <span className={`text-3xl font-bold ${isOverCalories ? 'text-red-500' : 'text-white'}`}>{totalCalories}</span>
                        <span className="text-xs text-zinc-500 ml-1">/ {goals.calories}</span>
                    </div>
                    {/* Progress Bar Background */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800/50">
                        <div className={`h-full transition-all duration-1000 ${isOverCalories ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${calPercent}%` }}></div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl border bg-zinc-900 border-zinc-800 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">Protein</span>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-bold text-white">{totalProtein}</span>
                        <span className="text-xs text-zinc-500 ml-1">/ {goals.protein}g</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800/50">
                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${proPercent}%` }}></div>
                    </div>
                </div>
            </div>

            <Link href="/dashboard/nutrition/calculator" className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:bg-zinc-900 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                        <Flame size={18} />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Macro Goals</p>
                        <p className="text-xs text-zinc-500">Recalculate BMR & TDEE</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-zinc-600 group-hover:text-zinc-400" />
            </Link>

            {/* Food Logs */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Today&apos;s Logs</h3>
                    <button onClick={() => setIsModalOpen(true)} className="text-blue-500 text-sm font-medium hover:text-blue-400 flex items-center gap-1">
                        <Plus size={16} /> Add Food
                    </button>
                </div>

                {logs.length === 0 && (
                    <div className="text-center py-10 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
                        <Utensils size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No food logged yet.</p>
                    </div>
                )}

                <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {logs.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-sm">
                            <div>
                                <p className="font-semibold text-zinc-200">{item.food}</p>
                                <p className="text-xs text-zinc-500">{item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{item.calories} <span className="text-[10px] font-normal text-zinc-500">kcal</span></p>
                                <p className="text-xs text-green-500 font-medium">{item.protein}g pro</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Food Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 w-full max-w-sm rounded-3xl p-6 border border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Add Meal</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleLog} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-zinc-500 ml-1 mb-1 block">Food Name</label>
                                <input placeholder="e.g. Chicken Breast" autoFocus value={food} onChange={e => setFood(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-zinc-500 ml-1 mb-1 block">Quantity</label>
                                    <input placeholder="e.g. 200g" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-500 ml-1 mb-1 block">Calories</label>
                                    <input type="number" placeholder="0" value={calories} onChange={e => setCalories(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-zinc-500 ml-1 mb-1 block">Protein (g)</label>
                                <input type="number" placeholder="0" value={protein} onChange={e => setProtein(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500" />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 rounded-xl py-4 font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all mt-2">
                                Log Food
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
