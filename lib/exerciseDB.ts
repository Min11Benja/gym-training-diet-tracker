// ExerciseDB API Integration
// API Base: https://exercisedb-api.vercel.app

export interface Exercise {
    id: string;
    name: string;
    gifUrl: string;
    instructions: string[];
    primaryMuscles: string[];
    secondaryMuscles: string[];
    equipment: string;
    bodyPart: string;
    target: string;
}

export interface ExerciseSearchResult {
    id: string;
    name: string;
    equipment: string;
    bodyPart: string;
    target: string;
    gifUrl: string;
}

const API_BASE = "https://exercisedb-api.vercel.app";

/**
 * Search for exercises by name
 */
export async function searchExercises(query: string): Promise<ExerciseSearchResult[]> {
    try {
        const response = await fetch(`${API_BASE}/api/v1/exercises?name=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch exercises");
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error searching exercises:", error);
        return [];
    }
}

/**
 * Get exercise details by ID
 */
export async function getExerciseById(id: string): Promise<Exercise | null> {
    try {
        const response = await fetch(`${API_BASE}/api/v1/exercises/${id}`);
        if (!response.ok) throw new Error("Failed to fetch exercise");
        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error("Error fetching exercise:", error);
        return null;
    }
}

/**
 * Get exercises by body part
 */
export async function getExercisesByBodyPart(bodyPart: string): Promise<ExerciseSearchResult[]> {
    try {
        const response = await fetch(`${API_BASE}/api/v1/exercises?bodyPart=${encodeURIComponent(bodyPart)}`);
        if (!response.ok) throw new Error("Failed to fetch exercises");
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching exercises by body part:", error);
        return [];
    }
}

/**
 * Get exercises by equipment
 */
export async function getExercisesByEquipment(equipment: string): Promise<ExerciseSearchResult[]> {
    try {
        const response = await fetch(`${API_BASE}/api/v1/exercises?equipment=${encodeURIComponent(equipment)}`);
        if (!response.ok) throw new Error("Failed to fetch exercises");
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching exercises by equipment:", error);
        return [];
    }
}

/**
 * Get list of all body parts
 */
export async function getBodyParts(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE}/api/v1/bodyparts`);
        if (!response.ok) throw new Error("Failed to fetch body parts");
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching body parts:", error);
        return [];
    }
}

/**
 * Get list of all equipment types
 */
export async function getEquipmentTypes(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE}/api/v1/equipments`);
        if (!response.ok) throw new Error("Failed to fetch equipment types");
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching equipment types:", error);
        return [];
    }
}
