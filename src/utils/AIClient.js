import { generateDailyWorkout as generateLocalWorkout } from './workoutGenerator';

// Mock AI Service for now, can be expanded to use Gemini API
export const AIClient = {
    /**
     * Generates a workout based on user profile and preferences.
     * @param {Object} user - The user profile object.
     * @param {string} [apiKey] - Optional API key for LLM generation.
     * @returns {Promise<Object>} - The generated workout object.
     */
    generateWorkout: async (user, apiKey = null) => {
        // Simulate network delay for "AI" feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (apiKey) {
            // TODO: Implement Gemini API call here
            console.log("Using Gemini API with key:", apiKey);
            // For now, fallback to local
            return generateLocalWorkout(user);
        } else {
            // Use local heuristic engine
            console.log("Using Local Heuristic Engine");
            return generateLocalWorkout(user);
        }
    },

    /**
     * Adapts the next workout based on feedback.
     * @param {Object} user - User profile.
     * @param {string} feedback - 'too_easy', 'perfect', 'too_hard'
     */
    adaptDifficulty: (user, feedback) => {
        // This would ideally update the user's internal "level score"
        // For now, we just log it
        console.log(`Adapting difficulty based on feedback: ${feedback}`);
        // In a real app, we'd adjust weights or reps for the next generation
    }
};
