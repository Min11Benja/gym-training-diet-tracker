"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import {
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Calendar,
  Settings,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  Info,
  Check,
  LayoutGrid,
  Target,
  Zap,
  UserCircle2,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { searchExercises, ExerciseSearchResult } from "@/lib/exerciseDB";
import { Reorder } from "framer-motion";

const STEPS = [
  {
    id: 1,
    name: "Basics & Split",
    icon: Calendar,
    description: "Choose your path",
  },
  {
    id: 2,
    name: "Refine Routine",
    icon: Dumbbell,
    description: "Exercises list",
  },
  {
    id: 3,
    name: "Set Parameters",
    icon: Settings,
    description: "Reps, sets & weight",
  },
  {
    id: 4,
    name: "Final Review",
    icon: CheckCircle2,
    description: "Confirm assignment",
  },
];

const SPLIT_TEMPLATES = [
  {
    id: "full_body",
    name: "Full Body Foundation",
    description: "Squats, Bench, Deadlift, Press, Pullups",
    icon: LayoutGrid,
    color: "bg-blue-500",
    exercises: [
      { name: "Barbell Squat", sets: 3, reps: "8-10", weight: 60 },
      { name: "Barbell Bench Press", sets: 3, reps: "8-10", weight: 40 },
      { name: "Barbell Deadlift", sets: 2, reps: "5", weight: 80 },
      { name: "Overhead Press", sets: 3, reps: "10-12", weight: 20 },
      { name: "Pull Ups", sets: 3, reps: "Max", weight: 0 },
    ],
  },
  {
    id: "push",
    name: "Push Power",
    description: "Chest, Shoulders, and Triceps focus",
    icon: Zap,
    color: "bg-orange-500",
    exercises: [
      { name: "Barbell Bench Press", sets: 3, reps: "8-10", weight: 40 },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: 15 },
      { name: "Shoulder Press", sets: 3, reps: "8-10", weight: 12 },
      { name: "Lateral Raises", sets: 3, reps: "12-15", weight: 5 },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15", weight: 15 },
    ],
  },
  {
    id: "pull",
    name: "Pull Strength",
    description: "Back and Biceps specialized routine",
    icon: Target,
    color: "bg-emerald-500",
    exercises: [
      { name: "Barbell Row", sets: 3, reps: "8-10", weight: 40 },
      { name: "Lat Pulldown", sets: 3, reps: "10-12", weight: 35 },
      { name: "Face Pulls", sets: 3, reps: "15-20", weight: 10 },
      { name: "Barbell Bicep Curls", sets: 3, reps: "10-12", weight: 20 },
      { name: "Hammer Curls", sets: 3, reps: "12-15", weight: 10 },
    ],
  },
  {
    id: "legs",
    name: "Leg Day Alpha",
    description: "Quads, Hamstrings, and Calves powerhouse",
    icon: Dumbbell,
    color: "bg-purple-500",
    exercises: [
      { name: "Barbell Squat", sets: 3, reps: "8-10", weight: 60 },
      { name: "Leg Press", sets: 3, reps: "10-12", weight: 100 },
      { name: "Leg Extensions", sets: 3, reps: "12-15", weight: 40 },
      { name: "Leg Curls", sets: 3, reps: "12-15", weight: 30 },
      { name: "Seated Calf Raises", sets: 3, reps: "15-20", weight: 40 },
    ],
  },
];

export default function AssignWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as Id<"users">;
  const client = useQuery(api.coach.getClientDetails, { clientId });
  const assignMutation = useMutation(api.coach.assignWorkout);

  const [currentStep, setCurrentStep] = useState(1);
  const [workoutMode, setWorkoutMode] = useState<"custom" | "template">(
    "custom",
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [workoutData, setWorkoutData] = useState({
    date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD local format
    notes: "",
    exercises: [] as {
      name: string;
      sets: number;
      reps: string;
      weight?: number;
      gifUrl?: string;
    }[],
  });

  const [exerciseSearch, setExerciseSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ExerciseSearchResult[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSelectTemplate = (templateId: string) => {
    const template = SPLIT_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setWorkoutData({
        ...workoutData,
        exercises: [...template.exercises],
      });
      setWorkoutMode("template");
    }
  };

  const handleSearch = async (val: string) => {
    setExerciseSearch(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchExercises(val);
      setSearchResults(results.slice(0, 20)); // Show more results
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReorder = (newExercises: typeof workoutData.exercises) => {
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const handleAddExercise = (name: string, gifUrl?: string) => {
    if (!workoutData.exercises.some((e) => e.name === name)) {
      setWorkoutData({
        ...workoutData,
        exercises: [
          ...workoutData.exercises,
          { name, sets: 3, reps: "10-12", weight: 0, gifUrl },
        ],
      });
    }
  };

  const handleRemoveExercise = (index: number) => {
    const newEx = [...workoutData.exercises];
    newEx.splice(index, 1);
    setWorkoutData({ ...workoutData, exercises: newEx });
  };

  const handleUpdateExercise = (index: number, field: string, value: any) => {
    const newEx = [...workoutData.exercises];
    newEx[index] = { ...newEx[index], [field]: value };
    setWorkoutData({ ...workoutData, exercises: newEx });
  };

  const handleSubmit = async () => {
    try {
      await assignMutation({
        clientId,
        date: workoutData.date,
        exercises: workoutData.exercises,
        notes: workoutData.notes,
      });
      router.push(`/coach/clients/${clientId}`);
    } catch (error) {
      alert(
        "Error assigning workout: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  if (!client) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-100px)] gap-8">
      {/* Left Sidebar Timeline */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-8">
          <div className="bg-white dark:bg-[#151515] p-6 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm">
            <div className="space-y-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-zinc-100 dark:bg-zinc-800" />

              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div
                    key={step.id}
                    className="relative flex items-start gap-4 group"
                  >
                    <div
                      className={`
                                            relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                            ${
                                              isActive
                                                ? "bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black scale-110 shadow-lg"
                                                : isCompleted
                                                  ? "bg-emerald-500/20 text-emerald-600 dark:text-[#B2FF59]"
                                                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
                                            }
                                        `}
                    >
                      {isCompleted ? (
                        <Check size={20} strokeWidth={3} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p
                        className={`text-sm font-bold ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}
                      >
                        {step.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-500/5 dark:bg-[#B2FF59]/5 border border-emerald-500/10 dark:border-[#B2FF59]/10 p-5 rounded-2xl">
            <p className="text-xs text-zinc-500 dark:text-gray-400 italic flex gap-2">
              <Info
                size={14}
                className="flex-shrink-0 text-emerald-500 dark:text-[#B2FF59]"
              />
              Assigning to {client.client.name}. The client will see this in
              their scheduled workouts.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex-1 max-w-4xl">
        <div className="bg-white dark:bg-[#151515] p-8 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm min-h-[500px] flex flex-col">
          {/* Step Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              {STEPS[currentStep - 1].name}
            </h1>
            <p className="text-zinc-500 dark:text-gray-400">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>

          {/* Step Content */}
          <div className="flex-1">
            <>
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Workout Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={workoutData.date}
                      onChange={(e) =>
                        setWorkoutData({ ...workoutData, date: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] outline-none text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Choose Workout Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          setWorkoutMode("custom");
                          setSelectedTemplate(null);
                          setWorkoutData((prev) => ({
                            ...prev,
                            exercises: [],
                          }));
                        }}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center ${
                          workoutMode === "custom"
                            ? "bg-emerald-500/10 border-emerald-500 dark:border-[#B2FF59] text-emerald-600 dark:text-[#B2FF59]"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl ${workoutMode === "custom" ? "bg-emerald-500 dark:bg-[#B2FF59] text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}
                        >
                          <UserCircle2 size={24} />
                        </div>
                        <div>
                          <p className="font-bold">Custom Build</p>
                          <p className="text-[10px] uppercase mt-1">
                            Manual Selection
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => setWorkoutMode("template")}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center ${
                          workoutMode === "template"
                            ? "bg-emerald-500/10 border-emerald-500 dark:border-[#B2FF59] text-emerald-600 dark:text-[#B2FF59]"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl ${workoutMode === "template" ? "bg-emerald-500 dark:bg-[#B2FF59] text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}
                        >
                          <LayoutGrid size={24} />
                        </div>
                        <div>
                          <p className="font-bold">Use Templates</p>
                          <p className="text-[10px] uppercase mt-1">
                            Proven Splits
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {workoutMode === "template" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        Select a Popular Split
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SPLIT_TEMPLATES.map((template) => {
                          const Icon = template.icon;
                          return (
                            <button
                              key={template.id}
                              onClick={() => handleSelectTemplate(template.id)}
                              className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                                selectedTemplate === template.id
                                  ? "bg-emerald-500/10 border-emerald-500 scale-[1.02]"
                                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.color} text-white`}
                              >
                                <Icon size={20} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold dark:text-white">
                                  {template.name}
                                </p>
                                <p className="text-[10px] text-zinc-500 line-clamp-1">
                                  {template.description}
                                </p>
                              </div>
                              {selectedTemplate === template.id && (
                                <Check size={16} className="text-emerald-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Coach Notes (Internal)
                    </label>
                    <textarea
                      placeholder="Add any specific instructions for the client..."
                      rows={3}
                      value={workoutData.notes}
                      onChange={(e) =>
                        setWorkoutData({
                          ...workoutData,
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] outline-none text-zinc-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/5 dark:bg-[#B2FF59]/5 border border-emerald-500/10 dark:border-[#B2FF59]/10 rounded-2xl flex-1">
                      <Info size={16} className="text-emerald-500" />
                      <p className="text-xs text-zinc-600 dark:text-gray-400">
                        {workoutMode === "template"
                          ? "Template loaded. Use the search to add more or refine with images."
                          : "Search exercises. Use Grid view to see movement images."}
                      </p>
                    </div>
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit self-end">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-[#B2FF59] shadow-sm" : "text-zinc-400"}`}
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-[#B2FF59] shadow-sm" : "text-zinc-400"}`}
                      >
                        <Search size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search
                      className="absolute left-3 top-3.5 text-zinc-400"
                      size={18}
                    />
                    <input
                      placeholder="Search exercises (e.g. 'Bench Press')..."
                      value={exerciseSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full px-10 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] outline-none text-zinc-900 dark:text-white font-medium"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-3.5">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent" />
                      </div>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div
                      className={`grid gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
                    >
                      {searchResults.map((ex, idx) => {
                        const isAdded = workoutData.exercises.some(
                          (e) => e.name === ex.name,
                        );
                        return (
                          <button
                            key={ex.id + idx}
                            onClick={() =>
                              isAdded
                                ? null
                                : handleAddExercise(ex.name, ex.gifUrl)
                            }
                            className={`overflow-hidden rounded-2xl border transition-all hover:scale-[1.02] flex ${
                              viewMode === "grid"
                                ? "flex-col"
                                : "flex-row items-center p-2"
                            } ${
                              isAdded
                                ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50"
                            }`}
                          >
                            <div
                              className={`${viewMode === "grid" ? "w-full aspect-square" : "w-16 h-16"} bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 relative`}
                            >
                              {ex.gifUrl && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={ex.gifUrl}
                                  alt={ex.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {isAdded && (
                                <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center backdrop-blur-[2px]">
                                  <Check
                                    className="text-white"
                                    size={24}
                                    strokeWidth={4}
                                  />
                                </div>
                              )}
                            </div>
                            <div
                              className={`text-left ${viewMode === "grid" ? "p-3" : "flex-1 px-4"}`}
                            >
                              <p className="font-bold capitalize text-sm dark:text-white line-clamp-1">
                                {ex.name}
                              </p>
                              <p className="text-[10px] text-zinc-500 uppercase font-medium mt-0.5">
                                {ex.target} • {ex.equipment}
                              </p>
                            </div>
                            {viewMode === "list" && !isAdded && (
                              <div className="p-2 mr-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-400">
                                <Plus size={18} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Dumbbell size={16} className="text-emerald-500" />
                      Your Routine ({workoutData.exercises.length})
                    </h3>
                    <Reorder.Group
                      axis="y"
                      values={workoutData.exercises}
                      onReorder={handleReorder}
                      className="space-y-3"
                    >
                      {workoutData.exercises.map((ex, idx) => (
                        <Reorder.Item
                          key={ex.name + idx}
                          value={ex}
                          className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 group transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-zinc-300 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors">
                              <GripVertical size={20} />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                              {ex.gifUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={ex.gifUrl}
                                  alt={ex.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                  {idx + 1}
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-bold capitalize block">
                                {ex.name}
                              </span>
                              <span className="text-[10px] text-zinc-500 uppercase">
                                Movement {idx + 1}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveExercise(idx)}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                    {workoutData.exercises.length === 0 &&
                      !isSearching &&
                      exerciseSearch.length < 2 && (
                        <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                          <Search
                            size={24}
                            className="mx-auto text-zinc-300 mb-2"
                          />
                          <p className="text-xs text-zinc-500 italic">
                            No exercises added yet. Search above to start
                            building.
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  {workoutData.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4"
                    >
                      <h4 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        {ex.name}
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">
                            Sets
                          </label>
                          <input
                            type="number"
                            value={ex.sets}
                            onChange={(e) =>
                              handleUpdateExercise(
                                idx,
                                "sets",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">
                            Reps <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={ex.reps}
                            placeholder="8-12"
                            required
                            onChange={(e) =>
                              handleUpdateExercise(idx, "reps", e.target.value)
                            }
                            className={`w-full p-2 bg-white dark:bg-zinc-800 border rounded-lg text-sm transition-colors ${!ex.reps || ex.reps.trim() === "" ? "border-red-500/50" : "border-zinc-200 dark:border-zinc-700"}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">
                            Weight (kg) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={
                              ex.weight === undefined ||
                              isNaN(ex.weight as number)
                                ? ""
                                : ex.weight
                            }
                            placeholder="0"
                            required
                            onChange={(e) =>
                              handleUpdateExercise(
                                idx,
                                "weight",
                                e.target.value === ""
                                  ? NaN
                                  : parseFloat(e.target.value),
                              )
                            }
                            className={`w-full p-2 bg-white dark:bg-zinc-800 border rounded-lg text-sm transition-colors ${ex.weight === undefined || isNaN(ex.weight as number) ? "border-red-500/50" : "border-zinc-200 dark:border-zinc-700"}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {workoutData.exercises.length === 0 && (
                    <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                      <p className="text-zinc-500 italic">
                        Go back and select some exercises first.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">
                        Date
                      </p>
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {new Date(workoutData.date).toLocaleDateString(
                          undefined,
                          { weekday: "long", month: "long", day: "numeric" },
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">
                        Total Exercises
                      </p>
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {workoutData.exercises.length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest">
                      Exercise List
                    </h3>
                    {workoutData.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                      >
                        <div>
                          <p className="font-bold text-sm text-zinc-900 dark:text-white">
                            {ex.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {ex.sets} sets x {ex.reps} reps
                          </p>
                        </div>
                        <p className="font-mono text-xs text-emerald-600 dark:text-[#B2FF59] font-bold">
                          {ex.weight || 0}kg
                        </p>
                      </div>
                    ))}
                  </div>

                  {workoutData.notes && (
                    <div className="p-4 bg-emerald-500/5 dark:bg-[#B2FF59]/5 border border-emerald-500/10 dark:border-[#B2FF59]/10 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-[#B2FF59] mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                        {workoutData.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          </div>

          {/* Footer Nav */}
          <div className="mt-12 flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-colors ${
                currentStep === 1
                  ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <ChevronLeft size={18} /> Back
            </button>

            {currentStep < STEPS.length ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 2 && workoutData.exercises.length === 0) ||
                  (currentStep === 3 &&
                    workoutData.exercises.some(
                      (ex) =>
                        !ex.reps ||
                        ex.reps.trim() === "" ||
                        ex.weight === undefined ||
                        isNaN(ex.weight as number),
                    ))
                }
                className="bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
              >
                Assign Workout <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
