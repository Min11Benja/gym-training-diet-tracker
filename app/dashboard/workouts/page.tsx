"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";

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
        <div className="max-w-md mx-auto space-y-6 pb-24">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Log Workout</h2>
                <div className="flex gap-4">
                    <Link href="/dashboard/workouts/history" className="text-sm text-zinc-400 hover:text-white">History</Link>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-zinc-800 rounded p-2 text-white" />
                </div>
            </div>

            <div className="space-y-4">
                {exercises.map((ex, i) => (
                    <div key={i} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3">
                        <input
                            placeholder="Exercise (e.g. Bench Press)"
                            value={ex.name}
                            onChange={e => updateExercise(i, 'name', e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-700 pb-1 font-semibold focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-xs text-zinc-500">Sets</label>
                                <input type="number" value={ex.sets} onChange={e => updateExercise(i, 'sets', e.target.value)} className="w-full bg-zinc-800 rounded p-2 text-center" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-zinc-500">Reps</label>
                                <input value={ex.reps} onChange={e => updateExercise(i, 'reps', e.target.value)} className="w-full bg-zinc-800 rounded p-2 text-center" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-zinc-500">Kg</label>
                                <input type="number" value={ex.weight} onChange={e => updateExercise(i, 'weight', e.target.value)} className="w-full bg-zinc-800 rounded p-2 text-center" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 block mb-1">Effort</label>
                            <div className="flex bg-zinc-800 rounded p-1">
                                {['easy', 'medium', 'hard'].map(effort => (
                                    <button
                                        key={effort}
                                        onClick={() => updateExercise(i, 'effort', effort)}
                                        className={`flex-1 text-xs py-1 rounded capitalize ${ex.effort === effort ?
                                            (effort === 'hard' ? 'bg-red-500/20 text-red-500' : effort === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500')
                                            : 'text-zinc-500'}`}
                                    >
                                        {effort}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={addExercise} className="w-full is-dashed border border-zinc-700 py-3 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500">
                + Add Exercise
            </button>

            <div className="pt-4">
                <label className="text-sm text-zinc-400 block mb-2">Workout Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-zinc-900 rounded-lg p-3 border border-zinc-800" rows={3} />
            </div>

            <button onClick={handleSave} className="fixed bottom-20 left-4 right-4 bg-blue-600 py-3 rounded-lg font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 md:static md:w-full md:shadow-none">
                Save Workout
            </button>
        </div>
    );
}
