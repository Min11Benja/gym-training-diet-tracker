"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AssignWorkoutPage() {
    const params = useParams();
    const clientId = params.id as Id<"users">;
    const router = useRouter();

    const assignWorkout = useMutation(api.coach.assignWorkout);

    const [date, setDate] = useState("");
    const [exercises, setExercises] = useState([{ name: "", sets: 3, reps: "10-12", weight: 0 }]);
    const [notes, setNotes] = useState("");

    const addExercise = () => {
        setExercises([...exercises, { name: "", sets: 3, reps: "10-12", weight: 0 }]);
    };

    const removeExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const updateExercise = (index: number, field: string, value: string | number) => {
        const newExercises = [...exercises];
        // @ts-expect-error dynamic field assignment
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return alert("Please select a date");

        try {
            await assignWorkout({
                clientId,
                date,
                exercises: exercises.map(e => ({
                    name: e.name,
                    sets: Number(e.sets),
                    reps: e.reps,
                    weight: Number(e.weight)
                })),
                notes
            });
            router.push(`/coach/clients/${clientId}`);
        } catch (err) {
            console.error(err);
            alert("Failed to assign workout");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href={`/coach/clients/${clientId}`} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white border border-zinc-800">
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Assign Workout</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Scheduled Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 text-white border border-zinc-800 focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold">Exercise Plan</h3>
                            <button type="button" onClick={addExercise} className="text-blue-500 text-sm font-medium hover:text-blue-400 flex items-center gap-1">
                                <Plus size={16} /> Add Exercise
                            </button>
                        </div>

                        {exercises.map((ex, i) => (
                            <div key={i} className="space-y-3 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-zinc-500">#{i + 1}</span>
                                    <button type="button" onClick={() => removeExercise(i)} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                                <div className="grid gap-3">
                                    <input placeholder="Exercise Name" value={ex.name} onChange={e => updateExercise(i, "name", e.target.value)} className="w-full bg-zinc-900 rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-blue-500 font-semibold" />
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[10px] uppercase text-zinc-500 mb-1 block">Sets</label>
                                            <input type="number" value={ex.sets} onChange={e => updateExercise(i, "sets", e.target.value)} className="w-full bg-zinc-900 rounded-xl p-2 text-center border border-zinc-800 focus:outline-none focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-zinc-500 mb-1 block">Reps</label>
                                            <input value={ex.reps} onChange={e => updateExercise(i, "reps", e.target.value)} className="w-full bg-zinc-900 rounded-xl p-2 text-center border border-zinc-800 focus:outline-none focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-zinc-500 mb-1 block">Kg</label>
                                            <input type="number" value={ex.weight} onChange={e => updateExercise(i, "weight", e.target.value)} className="w-full bg-zinc-900 rounded-xl p-2 text-center border border-zinc-800 focus:outline-none focus:border-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Coach Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-zinc-950 rounded-xl p-3 text-white border border-zinc-800 focus:outline-none focus:border-blue-500" rows={3} placeholder="Instructions for the client..." />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Save size={20} />
                    Assign Workout
                </button>
            </form>
        </div>
    );
}
