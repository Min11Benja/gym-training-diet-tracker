/**
 * Workout Parser - Parses Apple Notes workout format
 * 
 * Example format:
 * monday 19-1-26
 * 
 * - [x] hang70/70 sec
 * - [x] walk w2:00 - 3:00 jog - 3:00 walk
 * 
 * upper bench press (4) 4:45
 * - [x] BO + 40 kg x 9/8
 * - [x] BO + 40 kg x 8/6
 */

export interface ParsedWorkout {
    date: string; // YYYY-MM-DD
    warmup: string[];
    exercises: {
        name: string;
        sets: {
            weight?: number;
            reps: number | { left: number; right: number };
            notes?: string;
        }[];
    }[];
    rawText: string;
    parseWarnings: string[];
}

/**
 * Parse workout text from Apple Notes format
 */
export function parseWorkoutText(text: string): ParsedWorkout[] {
    const lines = text.split('\n').map(line => line.trim());
    const workouts: ParsedWorkout[] = [];
    let currentWorkout: ParsedWorkout | null = null;
    let currentExercise: ParsedWorkout['exercises'][0] | null = null;
    let isInWarmup = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines
        if (!line) {
            // Empty line might signal end of warmup section
            if (isInWarmup && currentWorkout) {
                isInWarmup = false;
            }
            continue;
        }

        // Try to parse date header (e.g., "monday 19-1-26")
        const dateMatch = line.match(/^(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(\d{1,2})-(\d{1,2})-(\d{2,4})/i);
        if (dateMatch) {
            // Save previous workout
            if (currentWorkout) {
                workouts.push(currentWorkout);
            }

            // Start new workout
            const [, day, month, year] = dateMatch;
            const fullYear = year.length === 2 ? `20${year}` : year;
            const date = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

            currentWorkout = {
                date,
                warmup: [],
                exercises: [],
                rawText: text,
                parseWarnings: [],
            };
            currentExercise = null;
            isInWarmup = true;
            continue;
        }

        if (!currentWorkout) continue;

        // Warmup lines (checkbox items before first exercise)
        if (line.startsWith('- [x]') || line.startsWith('- [ ]')) {
            const warmupText = line.replace(/^- \[[x ]\]\s*/, '');
            if (isInWarmup) {
                currentWorkout.warmup.push(warmupText);
            }
            // If we're in an exercise, this might be a set
            else if (currentExercise) {
                const set = parseSetLine(warmupText);
                if (set) {
                    currentExercise.sets.push(set);
                } else {
                    currentWorkout.parseWarnings.push(`Could not parse set: ${warmupText}`);
                }
            }
            continue;
        }

        // Exercise header (doesn't start with -, has text)
        // If we were in warmup, this signals exercises are starting
        if (!line.startsWith('-')) {
            isInWarmup = false;

            // Save previous exercise
            if (currentExercise) {
                currentWorkout.exercises.push(currentExercise);
            }

            // Start new exercise
            const exerciseName = line
                .replace(/\s*\(\d+\)\s*/g, '') // Remove (4)
                .replace(/\s+\d+:\d+\s*$/g, '') // Remove 4:45 timestamp
                .trim();

            currentExercise = {
                name: exerciseName,
                sets: [],
            };
            continue;
        }
    }

    // Save last exercise and workout
    if (currentExercise && currentWorkout) {
        currentWorkout.exercises.push(currentExercise);
    }
    if (currentWorkout) {
        workouts.push(currentWorkout);
    }

    return workouts;
}

/**
 * Parse a single set line
 * Examples:
 * - "BO + 40 kg x 9/8" → { weight: 40, reps: { left: 9, right: 8 } }
 * - "160 x 15/15 hard" → { weight: 160, reps: { left: 15, right: 15 }, notes: "hard" }
 * - "7 kg db x 15+ 8 + 8 + 8" → { weight: 7, reps: 39, notes: "drop set" }
 */
function parseSetLine(line: string): { weight?: number; reps: number | { left: number; right: number }; notes?: string } | null {
    // Remove checkbox markers
    const clean = line.replace(/^- \[[x ]\]\s*/, '').trim();

    // Extract notes (text at end)
    const noteMatch = clean.match(/\s+(hard|barely|hard af|gf|easy|medium|difficult|tough)(?:\s+\w+)?$/i);
    const notes = noteMatch ? noteMatch[1] : undefined;
    const withoutNotes = noteMatch ? clean.substring(0, noteMatch.index) : clean;

    // Extract weight
    let weight: number | undefined;
    const weightMatch = withoutNotes.match(/(\d+)\s*kg|block\s+(\d+)|BO\s*\+\s*(\d+)/i);
    if (weightMatch) {
        weight = parseInt(weightMatch[1] || weightMatch[2] || weightMatch[3]);
    }

    // Extract reps (look for "x 9/8" or "x 15")
    const repsMatch = withoutNotes.match(/x\s*(\d+)(?:\/(\d+))?/i);
    if (repsMatch) {
        const left = parseInt(repsMatch[1]);
        const right = repsMatch[2] ? parseInt(repsMatch[2]) : undefined;

        const reps = right !== undefined ? { left, right } : left;

        return { weight, reps, notes };
    }

    // Try alternative format: "15/15" without x
    const slashMatch = withoutNotes.match(/(\d+)\/(\d+)/);
    if (slashMatch) {
        const left = parseInt(slashMatch[1]);
        const right = parseInt(slashMatch[2]);
        return { weight, reps: { left, right }, notes };
    }

    // Single number might be reps
    const singleMatch = withoutNotes.match(/(\d+)/);
    if (singleMatch) {
        return { weight, reps: parseInt(singleMatch[1]), notes };
    }

    return null;
}
