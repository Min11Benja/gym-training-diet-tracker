"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { parseWorkoutText, ParsedWorkout } from "@/lib/workoutParser";
import { FileText, Upload, Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ImportWorkoutsPage() {
    const [inputText, setInputText] = useState("");
    const [parsedWorkouts, setParsedWorkouts] = useState<ParsedWorkout[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ imported: number; total: number } | null>(null);

    const importWorkouts = useMutation(api.workouts.importWorkouts);
    const router = useRouter();

    const handleParse = () => {
        if (!inputText.trim()) return;
        const workouts = parseWorkoutText(inputText);
        setParsedWorkouts(workouts);
        setImportResult(null);
    };

    const handleImport = async () => {
        setIsImporting(true);
        try {
            const result = await importWorkouts({ workouts: parsedWorkouts });
            setImportResult(result);
            setInputText("");
            setParsedWorkouts([]);

            // Redirect to history after 2 seconds
            setTimeout(() => {
                router.push("/dashboard/workouts");
            }, 2000);
        } catch (error) {
            console.error("Import failed:", error);
            alert("Import failed. Please try again.");
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Import Workout History</h2>
                <FileText className="text-zinc-400" size={32} />
            </div>

            {/* Instructions */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    How to Import
                </h3>
                <ol className="text-sm text-emerald-800 dark:text-emerald-400 space-y-1 list-decimal list-inside">
                    <li>Copy your workout notes from Apple Notes</li>
                    <li>Paste them into the text area below</li>
                    <li>Click "Parse Workouts" to review</li>
                    <li>Edit if needed, then click "Import All"</li>
                </ol>
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-[#151515] border border-zinc-200 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-none">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Paste Your Workout Notes
                </label>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`monday 19-1-26

- [x] hang70/70 sec
- [x] walk w2:00 - 3:00 jog

upper bench press (4) 4:45
- [x] BO + 40 kg x 9/8
- [x] BO + 40 kg x 8/6`}
                    className="w-full h-64 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 rounded-2xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] resize-none"
                />
                <button
                    onClick={handleParse}
                    disabled={!inputText.trim()}
                    className="w-full bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black rounded-2xl py-3 font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Upload size={20} />
                    Parse Workouts
                </button>
            </div>

            {/* Preview */}
            {parsedWorkouts.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                            Parsed Workouts ({parsedWorkouts.length})
                        </h3>
                        <button
                            onClick={handleImport}
                            disabled={isImporting}
                            className="bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black rounded-xl px-6 py-2 font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-all flex items-center gap-2"
                        >
                            {isImporting ? "Importing..." : "Import All"}
                            <Check size={18} />
                        </button>
                    </div>

                    {parsedWorkouts.map((workout, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-[#151515] border border-zinc-200 dark:border-white/10 rounded-2xl p-5 space-y-3 shadow-sm dark:shadow-none"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-zinc-900 dark:text-white">{workout.date}</h4>
                                {workout.parseWarnings.length > 0 && (
                                    <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {workout.parseWarnings.length} warnings
                                    </span>
                                )}
                            </div>

                            {/* Warmup */}
                            {workout.warmup.length > 0 && (
                                <div className="text-sm">
                                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Warmup:</span>
                                    <ul className="list-disc list-inside ml-2 text-zinc-700 dark:text-zinc-300">
                                        {workout.warmup.map((w, i) => (
                                            <li key={i}>{w}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Exercises */}
                            <div className="space-y-2">
                                {workout.exercises.map((exercise, exIdx) => (
                                    <div key={exIdx} className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3">
                                        <h5 className="font-semibold text-zinc-900 dark:text-white mb-1">{exercise.name}</h5>
                                        <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
                                            {exercise.sets.map((set, setIdx) => (
                                                <div key={setIdx}>
                                                    Set {setIdx + 1}:{" "}
                                                    {set.weight && `${set.weight}kg × `}
                                                    {typeof set.reps === 'number' ?
                                                        `${set.reps} reps` :
                                                        `${set.reps.left}/${set.reps.right} reps`}
                                                    {set.notes && ` (${set.notes})`}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Warnings */}
                            {workout.parseWarnings.length > 0 && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-2 text-xs text-amber-800 dark:text-amber-400">
                                    <strong>Warnings:</strong>
                                    <ul className="list-disc list-inside ml-2">
                                        {workout.parseWarnings.map((warning, wIdx) => (
                                            <li key={wIdx}>{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Success Message */}
            {importResult && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 flex items-center gap-3">
                    <Check className="text-emerald-600 dark:text-emerald-400" size={24} />
                    <div>
                        <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                            Import Successful!
                        </p>
                        <p className="text-sm text-emerald-800 dark:text-emerald-400">
                            Imported {importResult.imported} of {importResult.total} workouts. Redirecting...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
