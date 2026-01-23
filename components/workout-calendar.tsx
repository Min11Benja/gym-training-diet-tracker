"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Workout {
  _id: string;
  date: string;
  status?: string;
}

interface WorkoutCalendarProps {
  workouts: Workout[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function WorkoutCalendar({
  workouts,
  selectedDate,
  onDateSelect,
}: WorkoutCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toLocaleDateString("en-CA");

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const monthName = viewDate.toLocaleString("default", { month: "long" });

  const calendarDays = [];
  // Padding for first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getWorkoutForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return workouts.filter((w) => w.date === dateStr);
  };

  const getStatusColor = (workout: Workout) => {
    if (workout.status === "completed") return "bg-green-500";

    const workoutDate = new Date(workout.date + "T00:00:00");
    if (workoutDate < today) return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className="bg-white dark:bg-[#151515] rounded-3xl border border-zinc-200 dark:border-white/10 p-5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          {monthName} <span className="text-zinc-400 font-medium">{year}</span>
        </h3>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-zinc-500"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-zinc-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div
            key={d}
            className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 text-center uppercase tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          if (day === null)
            return <div key={`empty-${i}`} className="aspect-square" />;

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;
          const dailyWorkouts = getWorkoutForDate(day);

          return (
            <button
              key={day}
              onClick={() => onDateSelect(dateStr)}
              className={`aspect-square relative flex flex-col items-center justify-center rounded-xl transition-all ${
                isSelected
                  ? "bg-emerald-600 dark:bg-[#B2FF59] text-white dark:text-black font-bold shadow-lg"
                  : isToday
                    ? "bg-zinc-100 dark:bg-zinc-900 text-emerald-600 dark:text-[#B2FF59] font-bold"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-400"
              }`}
            >
              <span className="text-sm">{day}</span>
              <div className="flex gap-0.5 absolute bottom-1.5">
                {dailyWorkouts.slice(0, 3).map((w) => (
                  <div
                    key={w._id}
                    className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/80 dark:bg-black/80" : getStatusColor(w)}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-white/5 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
            Done
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
            Pending
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
            Skipped
          </span>
        </div>
      </div>
    </div>
  );
}
