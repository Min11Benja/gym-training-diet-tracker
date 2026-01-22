"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Save, History, Calendar, Trash2 } from "lucide-react";

export default function WorkoutLogPage() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const workout = useQuery(api.workouts.getWorkoutByDate, { date });
    const logWorkout = useMutation(api.workouts.logWorkout);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [exercises, setExercises] = useState<any[]>([]);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (workout) {
            setExercises(workout.exercises);
            setNotes(workout.notes || "");
        } else {
            setExercises([]);
            setNotes("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout]);

    const addExercise = () => {
        setExercises([...exercises, { name: "", sets: 3, reps: "10", weight: 0, effort: "medium" }]);
    };

    const removeExercise = (index: number) => {
        const newEx = [...exercises];
        newEx.splice(index, 1);
        setExercises(newEx);
    };

    const updateExercise = (index: number, field: string, value: string | number) => {
        const newEx = [...exercises];

        newEx[index][field] = value;
        setExercises(newEx);
    };

    const handleSave = async () => {
        try {
            await logWorkout({
                date,
                exercises: exercises.map(e => ({
                    name: e.name,
                    sets: Number(e.sets),
                    reps: String(e.reps),
                    weight: Number(e.weight),
                    effort: e.effort,
                    notes: e.notes
                })),
                notes,
                status: "completed"
            });
            alert("Workout saved!");
        } catch (err) {
            console.error(err);
            alert("Failed to save workout");
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6 pb-32">
            <div className="flex justify-between items-center sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur pb-2 pt-2 border-b border-zinc-200 dark:border-zinc-900 -mx-4 px-4 mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Log Workout</h2>
                <div className="flex gap-3">
                    <Link href="/dashboard/workouts/history" className="p-2 bg-white dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800">
                        <History size={20} />
                    </Link>
                    <div className="relative">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-white dark:bg-[#151515] text-zinc-900 dark:text-white text-sm rounded-full px-3 py-2 border border-zinc-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] w-[130px]" />
                        <Calendar size={16} className="absolute right-3 top-2.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {exercises.map((ex, i) => (
                    <div key={i} className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-start">
                            <input
                                placeholder="Exercise Name"
                                value={ex.name}
                                onChange={e => updateExercise(i, 'name', e.target.value)}
                                className="w-full bg-transparent text-lg font-bold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:text-emerald-600 dark:focus:text-[#B2FF59]"
                            />
                            <button onClick={() => removeExercise(i)} className="text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-500 p-1">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-white/10">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1 text-center">Sets</label>
                                <input type="number" value={ex.sets} onChange={e => updateExercise(i, 'sets', e.target.value)} className="w-full bg-transparent text-center font-bold text-lg text-zinc-900 dark:text-white focus:outline-none" />
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-white/10">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1 text-center">Reps</label>
                                <input value={ex.reps} onChange={e => updateExercise(i, 'reps', e.target.value)} className="w-full bg-transparent text-center font-bold text-lg text-zinc-900 dark:text-white focus:outline-none" />
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-white/10">
                                <label className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-1 text-center">Weight</label>
                                <div className="flex items-center justify-center gap-1">
                                    <input type="number" value={ex.weight} onChange={e => updateExercise(i, 'weight', e.target.value)} className="w-2/3 bg-transparent text-right font-bold text-lg text-zinc-900 dark:text-white focus:outline-none" />
                                    <span className="text-xs text-zinc-500 dark:text-zinc-600 mt-1">kg</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block mb-2">Perceived Effort</label>
                            <div className="flex bg-zinc-50 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-white/10">
                                {['easy', 'medium', 'hard'].map(effort => (
                                    <button
                                        key={effort}
                                        onClick={() => updateExercise(i, 'effort', effort)}
                                        className={`flex-1 text-xs py-2 rounded-lg capitalize font-medium transition-all ${ex.effort === effort ?
                                            (effort === 'hard' ? 'bg-red-500 text-white shadow-md' : effort === 'medium' ? 'bg-yellow-500 text-black shadow-md' : 'bg-green-500 text-black shadow-md')
                                            : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                    >
                                        {effort}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={addExercise} className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 py-4 rounded-2xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all flex items-center justify-center gap-2">
                <Plus size={20} />
                <span>Add Exercise</span>
            </button>

            <div className="pt-2">
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Notes (optional)..."
                    className="w-full bg-white dark:bg-[#151515] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-2xl p-4 border border-zinc-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] text-sm"
                    rows={3}
                />
            </div>

            <button onClick={handleSave} className="fixed bottom-24 left-4 right-4 bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black py-4 rounded-2xl font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 z-40 max-w-lg mx-auto">
                <Save size={20} />
                <span>Save Workout</span>
            </button>
        </div>
    );
}
