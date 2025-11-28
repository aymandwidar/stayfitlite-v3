import { DeepSeekClient } from '../utils/AI/DeepSeekClient.js';
import { GroqClient } from '../utils/AI/GroqClient.js';
import { GeminiClient } from '../utils/AI/GeminiClient.js';

export const AIRouter = {
    /**
     * Routes task to the most appropriate AI model based on task type
     * @param {string} taskType - Type of AI task
     * @param {object} payload - Task-specific data
     * @returns {Promise} - AI response
     */
    async route(taskType, payload) {
        try {
            switch (taskType) {
                // DEEPSEEK: Complex reasoning tasks (free + powerful)
                case 'workout_generation':
                    return await DeepSeekClient.generateWorkoutPlan(
                        payload.userProfile,
                        payload.recoveryScore,
                        payload.psychologicalState,
                        payload.memory,
                        payload.timeContext
                    );

                case 'progression_analysis':
                    return await DeepSeekClient.analyzeProgressionPattern(payload.exerciseHistory);

                case 'pattern_detection':
                    return await DeepSeekClient.detectPsychologicalPattern(
                        payload.motivationLogs,
                        payload.stressLogs
                    );

                case 'exercise_negotiation':
                    // Use DeepSeek-Coder for filtering exercise database logic
                    return await DeepSeekClient.findExerciseAlternatives(payload.exercise, payload.constraints);

                // GROQ: Speed-critical tasks (ultra-fast responses)
                case 'chat':
                case 'proactive_message':
                case 'quick_response':
                    return await GroqClient.chat(payload.messages);

                case 'daily_tip':
                    return await GroqClient.getDailyTip(payload.goal);

                // GEMINI: Multimodal tasks (images, visual content)
                case 'image_generation':
                case 'exercise_visualization':
                    return await GeminiClient.generateImageDescription(payload.prompt);

                case 'workout_estimation':
                    return await GeminiClient.estimateWorkout(payload.workoutData);

                default:
                    // Unknown task type, default to Groq
                    return await GroqClient.chat(payload.messages || [
                        { role: 'user', content: JSON.stringify(payload) }
                    ]);
            }
        } catch (error) {
            return this.fallback(taskType, payload, error);
        }
    },

    /**
     * Fallback logic if primary model fails
     * Ensures 99.9% uptime by trying alternate models
     */
    async fallback(taskType, payload, originalError) {

        // If DeepSeek fails, try Groq for reasoning tasks
        if (['workout_generation', 'progression_analysis', 'pattern_detection'].includes(taskType)) {
            try {
                return await GroqClient.chat([
                    { role: 'system', content: 'You are Coach Adam, an expert fitness AI.' },
                    { role: 'user', content: JSON.stringify(payload) }
                ]);
            } catch (groqError) {
                return {
                    error: 'All AI services unavailable',
                    fallback: true,
                    message: 'AI services are temporarily unavailable. Please try again in a moment.'
                };
            }
        }

        // If Groq fails for chat, try Gemini
        if (['chat', 'proactive_message', 'quick_response'].includes(taskType)) {
            try {
                return await GeminiClient.generateTextResponse(payload.messages);
            } catch (geminiError) {
                return {
                    error: 'Chat service unavailable',
                    fallback: true,
                    message: 'Chat is temporarily unavailable. Please try again.'
                };
            }
        }

        // Last resort: return graceful error
        return {
            error: 'Service unavailable',
            details: originalError.message,
            taskType,
            message: 'This feature is temporarily unavailable. Please try again in a moment.'
        };
    },

    /**
     * Health check for all AI services
     * Useful for showing user which services are available
     */
    async healthCheck() {
        const status = {
            deepseek: 'unknown',
            groq: 'unknown',
            gemini: 'unknown'
        };

        // Check DeepSeek
        try {
            await DeepSeekClient.analyzeProgressionPattern([]);
            status.deepseek = 'online';
        } catch (error) {
            status.deepseek = 'offline';
        }

        // Check Groq
        try {
            await GroqClient.chat([{ role: 'user', content: 'test' }]);
            status.groq = 'online';
        } catch (error) {
            status.groq = 'offline';
        }

        // Check Gemini
        try {
            await GeminiClient.generateImageDescription('test');
            status.gemini = 'online';
        } catch (error) {
            status.gemini = 'offline';
        }

        return status;
    }
};

/**
 * Example Usage:
 * 
 * // Generate workout
 * const workout = await AIRouter.route('workout_generation', {
 *   userProfile: { age: 28, weight: 75, goal: 'muscle_gain', level: 'intermediate' },
 *   recoveryScore: 85,
 *   psychologicalState: { motivation: 'high', stress: 2 },
 *   memory: { disliked_exercises: ['Burpees'], loved_exercises: ['Deadlifts'] },
 *   timeContext: { period: 'morning', suggestedIntensity: 'high' }
 * });
 * 
 * // Chat with AI
 * const response = await AIRouter.route('chat', {
 *   messages: [
 *     { role: 'user', content: 'I want to build muscle' }
 *   ]
 * });
 */
