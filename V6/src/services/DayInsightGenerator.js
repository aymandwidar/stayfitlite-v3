import { GeminiClient } from '../utils/AI/GeminiClient';

/**
 * DayInsightGenerator - Uses SONNET 4.5 (Gemini) to generate daily insights
 * and tomorrow's plan with structured JSON output
 */
export const DayInsightGenerator = {
    /**
     * Generate AI insight and tomorrow's plan based on daily metrics
     * @param {Object} metrics - User's daily metrics
     * @returns {Promise<Object>} - Structured insight data
     */
    async generateDayInsight(metrics) {
        try {
            const {
                recoveryScore = 0,
                hydration = 0,
                hydrationGoal = 8,
                workoutsCompleted = 0,
                sleepScore = 0,
                hrv = 0,
                rhr = 0
            } = metrics;

            // System Instruction (Persona & Rules)
            const systemInstruction = `You are SONNET 4.5, a world-class, predictive AI Fitness Coach for the Antigravity PWA. Your goal is to provide concise, empowering, and highly personalized recommendations.

1. Analyze the provided metrics (Recovery Score, HRV, RHR, Sleep, etc.).
2. Generate a single, short, motivating "insightText" (e.g., "Optimal Recovery Target Reached.").
3. Determine the "nextDayFocus" (a short title, e.g., "Active Recovery"). 
4. Provide "nextDayDetail" (a one-sentence explanation for the focus).
5. The user is highly active, so bias towards optimizing recovery when RHR is high or Recovery Score is low. When all scores are high (like the current mock data), recommend peak performance.
6. Return the response strictly as a JSON object matching the provided schema. Do not add any text outside of the JSON block.`;

            // User Query (Current Context & Data)
            const userQuery = `Analyze the user's daily fitness data and generate a motivational insight and a plan for tomorrow.

Current Metrics:
- Recovery Score: ${recoveryScore}%
- Hydration: ${hydration}/${hydrationGoal} Cups
- Workouts Completed: ${workoutsCompleted}
- Sleep Score: ${sleepScore}
- HRV: ${hrv}ms
- RHR: ${rhr}bpm

The current date is today. Provide the results in the required JSON format.`;

            // Call Gemini with JSON schema
            const response = await GeminiClient.generateStructuredInsight({
                systemInstruction,
                userQuery,
                schema: {
                    type: "object",
                    properties: {
                        insightText: {
                            type: "string",
                            description: "The main, bold insight based on the metrics."
                        },
                        nextDayFocus: {
                            type: "string",
                            description: "The title of tomorrow's recommended activity/focus."
                        },
                        nextDayDetail: {
                            type: "string",
                            description: "A single sentence explaining the recommendation."
                        }
                    },
                    required: ["insightText", "nextDayFocus", "nextDayDetail"]
                }
            });

            return response;
        } catch (error) {

            // Fallback response if AI fails
            return {
                insightText: "Great work today! Keep up the momentum.",
                nextDayFocus: "Active Recovery",
                nextDayDetail: "Focus on light movement and deep rest to optimize tomorrow's performance."
            };
        }
    }
};
