"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

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
        <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold">Assign Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-800 rounded p-2 text-white" />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Exercises</h3>
                    {exercises.map((ex, i) => (
                        <div key={i} className="grid grid-cols-2 gap-4 p-4 bg-zinc-800 rounded border border-zinc-700">
                            <div className="col-span-2">
                                <input placeholder="Exercise Name" value={ex.name} onChange={e => updateExercise(i, "name", e.target.value)} className="w-full bg-zinc-900 rounded p-2" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400">Sets</label>
                                <input type="number" value={ex.sets} onChange={e => updateExercise(i, "sets", e.target.value)} className="w-full bg-zinc-900 rounded p-2" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400">Reps</label>
                                <input value={ex.reps} onChange={e => updateExercise(i, "reps", e.target.value)} className="w-full bg-zinc-900 rounded p-2" />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addExercise} className="text-blue-500 text-sm hover:underline">+ Add Exercise</button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-zinc-800 rounded p-2 text-white" />
                </div>

                <button type="submit" className="w-full bg-blue-600 py-3 rounded-md font-bold hover:bg-blue-500">
                    Assign Workout
                </button>
            </form>
        </div>
    );
}
