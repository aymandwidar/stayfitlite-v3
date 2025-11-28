import axios from 'axios';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

export const DeepSeekClient = {
    /**
     * Generate a comprehensive workout plan with deep reasoning
     * @param {object} userProfile - User's profile data
     * @param {number} recoveryScore - Current recovery score (0-100)
     * @param {object} psychologicalState - Motivation and stress levels
     * @param {object} memory - User's AI memory context
     * @param {object} timeContext - Current time period and constraints
     * @returns {Promise<object>} - Workout plan with exercises and reasoning
     */
    async generateWorkoutPlan(userProfile, recoveryScore, psychologicalState, memory, timeContext) {
        try {
            const systemPrompt = this._buildWorkoutSystemPrompt(userProfile, memory, psychologicalState, timeContext);

            const response = await axios.post(
                `${DEEPSEEK_BASE_URL}/chat/completions`,
                {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: `Generate today's workout plan. Recovery score: ${recoveryScore}/100. Motivation: ${psychologicalState.motivation}. Stress: ${psychologicalState.stress}/5.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.error('DeepSeek Workout Generation Error:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Analyze progression patterns in workout history
     * @param {array} exerciseHistory - Historical exercise performance
     * @returns {Promise<object>} - Pattern analysis with recommendations
     */
    async analyzeProgressionPattern(exerciseHistory) {
        try {
            const response = await axios.post(
                `${DEEPSEEK_BASE_URL}/chat/completions`,
                {
                    model: 'deepseek-coder',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an AI fitness analyst. Analyze workout patterns and detect plateaus, overtraining, or optimal progression. Return JSON with analysis and recommendations.'
                        },
                        {
                            role: 'user',
                            content: `Analyze this exercise history: ${JSON.stringify(exerciseHistory)}`
                        }
                    ],
                    temperature: 0.5,
                    max_tokens: 1500,
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.error('DeepSeek Pattern Analysis Error:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Detect psychological patterns (stress/motivation by day of week)
     * @param {array} motivationLogs - Historical motivation data
     * @param {array} stressLogs - Historical stress data
     * @returns {Promise<object>} - Detected patterns with recommendations
     */
    async detectPsychologicalPattern(motivationLogs, stressLogs) {
        try {
            const response = await axios.post(
                `${DEEPSEEK_BASE_URL}/chat/completions`,
                {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'Detect recurring psychological patterns in user data. Return JSON with pattern description, frequency, and recommendations for AI scheduling.'
                        },
                        {
                            role: 'user',
                            content: `Motivation logs: ${JSON.stringify(motivationLogs)}\\n\\nStress logs: ${JSON.stringify(stressLogs)}`
                        }
                    ],
                    temperature: 0.6,
                    max_tokens: 1000,
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.error('DeepSeek Psychological Pattern Detection Error:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Build comprehensive system prompt for workout generation
     * @private
     */
    _buildWorkoutSystemPrompt(userProfile, memory, psychologicalState, timeContext) {
        return `You are Coach Adam, an elite AI fitness orchestrator specializing in personalized training.

USER PROFILE:
- Age: ${userProfile.age}
- Weight: ${userProfile.weight}kg
- Goal: ${userProfile.goal}
- Fitness Level: ${userProfile.level}
- Medical Conditions: ${userProfile.medicalConditions || 'None'}

MEMORY CONTEXT:
- Disliked Exercises: ${memory?.disliked_exercises?.join(', ') || 'None yet'}
- Loved Exercises: ${memory?.loved_exercises?.join(', ') || 'None yet'}
- Injury Watch: ${memory?.injury_watch?.join(', ') || 'None'}
- Equipment Preferences: ${memory?.equipment_preferences?.join(', ') || 'None'}

PSYCHOLOGICAL STATE (CRITICAL):
- Motivation: ${psychologicalState.motivation} (low/neutral/high)
- Stress: ${psychologicalState.stress}/5
${psychologicalState.motivation === 'low' || psychologicalState.stress >= 4 ? '⚠️ PRIORITY: User needs RECOVERY mode today regardless of physical metrics.' : ''}

TIME CONTEXT:
- Period: ${timeContext.period}
- Suggested Intensity: ${timeContext.suggestedIntensity} (this is a suggestion, not a rule)
${timeContext.userPreferredTime ? `- User prefers training at this time (learned preference)` : ''}

RULES:
1. If motivation = "low" OR stress >= 4: Force recovery mode (gentle activities only)
2. NEVER suggest exercises in the disliked list
3. Prioritize loved exercises when possible
4. Respect injury watch constraints
5. Time suggestions are advisory - if user consistently trains at night, learn and adapt
6. Return JSON format:
   {
     "workout_type": "string",
     "reasoning": "string (explain why this workout based on context)",
     "duration_minutes": number,
     "intensity": "low|moderate|high",
     "exercises": [
       {
         "name": "string",
         "sets": number,
         "reps": "string",
         "rest_seconds": number
       }
     ]
   }

Generate a workout that makes the user FEEL HEARD and respected.`;
    }
};
