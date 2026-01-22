"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { searchExercises, getExerciseById, type ExerciseSearchResult, type Exercise } from "@/lib/exerciseDB";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface ExerciseWithDetails {
    name: string;
    sets: number;
    reps: string;
    weight?: number;
    notes?: string;
    exerciseId?: string;
    gifUrl?: string;
    instructions?: string[];
    primaryMuscles?: string[];
    equipment?: string;
}

interface DayWorkout {
    dayOfWeek: number;
    dayName: string;
    exercises: ExerciseWithDetails[];
}

export default function AssignWorkoutPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.clientId as Id<"users">;

    const assignWorkoutPlan = useMutation(api.workoutPlans.assignWorkoutPlan);

    const [planName, setPlanName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [weeklyPlan, setWeeklyPlan] = useState<DayWorkout[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Exercise search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ExerciseSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        const results = await searchExercises(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
    };

    const handleAddDay = (dayIndex: number) => {
        const existing = weeklyPlan.find((d) => d.dayOfWeek === dayIndex);
        if (!existing) {
            setWeeklyPlan([
                ...weeklyPlan,
                {
                    dayOfWeek: dayIndex,
                    dayName: DAYS[dayIndex],
                    exercises: [],
                },
            ]);
        }
        setSelectedDay(dayIndex);
    };

    const handleAddExercise = async (exerciseResult: ExerciseSearchResult, dayIndex: number) => {
        // Fetch full exercise details
        const exerciseDetails = await getExerciseById(exerciseResult.id);

        const newExercise: ExerciseWithDetails = {
            name: exerciseResult.name,
            sets: 3,
            reps: "8-12",
            exerciseId: exerciseResult.id,
            gifUrl: exerciseDetails?.gifUrl,
            instructions: exerciseDetails?.instructions,
            primaryMuscles: exerciseDetails?.primaryMuscles,
            equipment: exerciseResult.equipment,
        };

        setWeeklyPlan((prev) =>
            prev.map((day) =>
                day.dayOfWeek === dayIndex
                    ? { ...day, exercises: [...day.exercises, newExercise] }
                    : day
            )
        );
        setSearchResults([]);
        setSearchQuery("");
    };

    const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
        setWeeklyPlan((prev) =>
            prev.map((day) =>
                day.dayOfWeek === dayIndex
                    ? { ...day, exercises: day.exercises.filter((_, i) => i !== exerciseIndex) }
                    : day
            )
        );
    };

    const handleUpdateExercise = (dayIndex: number, exerciseIndex: number, field: string, value: string | number) => {
        setWeeklyPlan((prev) =>
            prev.map((day) =>
                day.dayOfWeek === dayIndex
                    ? {
                        ...day,
                        exercises: day.exercises.map((ex, i) =>
                            i === exerciseIndex ? { ...ex, [field]: value } : ex
                        ),
                    }
                    : day
            )
        );
    };

    const handleSubmit = async () => {
        if (!planName.trim() || weeklyPlan.length === 0) {
            alert("Please provide a plan name and at least one workout day");
            return;
        }

        setIsSubmitting(true);
        try {
            await assignWorkoutPlan({
                clientId,
                name: planName,
                description: description || undefined,
                startDate,
                weeklyPlan,
            });
            router.push(`/coach/clients/${clientId}`);
        } catch (error) {
            console.error("Failed to assign workout:", error);
            alert("Failed to assign workout. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href={`/coach/clients/${clientId}`}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-zinc-600 dark:text-zinc-400" />
                </Link>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Assign Workout Plan</h1>
            </div>

            {/* Plan Details */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Plan Name *
                    </label>
                    <input
                        type="text"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        placeholder="e.g., 4-Week Strength Program"
                        className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional notes about this plan..."
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59]"
                    />
                </div>
            </div>

            {/* Day Selector */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                <h2 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Weekly Schedule</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {DAYS.map((day, index) => {
                        const hasWorkout = weeklyPlan.some((d) => d.dayOfWeek === index);
                        return (
                            <button
                                key={day}
                                onClick={() => handleAddDay(index)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${hasWorkout
                                        ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500 dark:border-emerald-600"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                {day.slice(0, 3)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Workout Days */}
            {weeklyPlan.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((day) => (
                <div
                    key={day.dayOfWeek}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none space-y-4"
                >
                    <h3 className="font-bold text-xl text-zinc-900 dark:text-white">{day.dayName}</h3>

                    {/* Exercise Search */}
                    {selectedDay === day.dayOfWeek && (
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder="Search exercises (e.g., 'bench press')"
                                    className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="px-4 py-2 bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black rounded-lg font-medium hover:opacity-90 flex items-center gap-2"
                                >
                                    <Search size={18} />
                                    {isSearching ? "..." : "Search"}
                                </button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {searchResults.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleAddExercise(result, day.dayOfWeek)}
                                            className="w-full text-left px-4 py-3 bg-white dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                        >
                                            <p className="font-medium text-zinc-900 dark:text-white">{result.name}</p>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                {result.equipment} • {result.bodyPart}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Exercises List */}
                    <div className="space-y-3">
                        {day.exercises.map((exercise, exIndex) => (
                            <div
                                key={exIndex}
                                className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl space-y-3"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-zinc-900 dark:text-white">{exercise.name}</p>
                                        {exercise.equipment && (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                {exercise.equipment}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveExercise(day.dayOfWeek, exIndex)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                            Sets
                                        </label>
                                        <input
                                            type="number"
                                            value={exercise.sets}
                                            onChange={(e) =>
                                                handleUpdateExercise(day.dayOfWeek, exIndex, "sets", parseInt(e.target.value))
                                            }
                                            min="1"
                                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                            Reps
                                        </label>
                                        <input
                                            type="text"
                                            value={exercise.reps}
                                            onChange={(e) =>
                                                handleUpdateExercise(day.dayOfWeek, exIndex, "reps", e.target.value)
                                            }
                                            placeholder="8-12"
                                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            value={exercise.weight || ""}
                                            onChange={(e) =>
                                                handleUpdateExercise(
                                                    day.dayOfWeek,
                                                    exIndex,
                                                    "weight",
                                                    e.target.value ? parseFloat(e.target.value) : 0
                                                )
                                            }
                                            placeholder="Optional"
                                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                        Notes
                                    </label>
                                    <input
                                        type="text"
                                        value={exercise.notes || ""}
                                        onChange={(e) =>
                                            handleUpdateExercise(day.dayOfWeek, exIndex, "notes", e.target.value)
                                        }
                                        placeholder="e.g., Focus on form, pause at bottom"
                                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => setSelectedDay(day.dayOfWeek)}
                            className="w-full px-4 py-2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 hover:border-emerald-500 dark:hover:border-[#B2FF59] hover:text-emerald-600 dark:hover:text-[#B2FF59] transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Exercise
                        </button>
                    </div>
                </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
                <Link
                    href={`/coach/clients/${clientId}`}
                    className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !planName.trim() || weeklyPlan.length === 0}
                    className="px-6 py-3 bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black rounded-xl font-bold hover:opacity-90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Assigning..." : "Assign Plan"}
                </button>
            </div>
        </div>
    );
}
