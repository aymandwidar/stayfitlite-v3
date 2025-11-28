/**
 * AI Orchestrator - Central Decision Engine
 * Determines what card to show based on time, data freshness, and user context
 */

import { getTimeContext, getRecommendedCardType, getActivitySuggestion } from '../utils/timeContext.js';
import { buildContextPayload } from '../utils/contextPayload.js';
import { AIRouter } from './AIRouter.js';
import { PainConstraints } from '../utils/painConstraints.js';

export const AIOrchestrator = {
    /**
     * Get the next card that user should see
     * This is the main decision engine
     */
    async getNextCard(user, memory = {}) {
        const timeContext = getTimeContext();
        const payload = buildContextPayload(user, memory);
        const today = new Date().toISOString().split('T')[0];

        // Determine recommended card based on time and data freshness
        const recommendedCardType = getRecommendedCardType(
            timeContext,
            payload.data_freshness
        );

        // Build card data based on type
        const cardData = await this._buildCardData(
            recommendedCardType,
            user,
            memory,
            payload
        );

        return {
            cardType: recommendedCardType,
            data: cardData,
            timeContext,
            reasoning: cardData.reasoning
        };
    },

    /**
     * Build card-specific data
     * @private
     */
    async _buildCardData(cardType, user, memory, payload) {
        switch (cardType) {
            case 'sleep_check':
                return {
                    title: `Good ${this._getGreeting(payload.current_context.time_period)}, ${user.name}!`,
                    question: 'How did you sleep last night?',
                    type: '5-point-likert',
                    options: ['Very Poor', 'Poor', 'Neutral', 'Well', 'Very Well'],
                    reasoning: 'Sleep quality determines today\'s workout intensity'
                };

            case 'motivation_check':
                return {
                    title: 'Quick check-in',
                    question: 'What\'s your energy level for today\'s plan?',
                    type: '3-point-emoji',
                    options: [
                        { emoji: '💪', label: 'Ready to crush it!', value: 'high' },
                        { emoji: '🙂', label: 'Can manage', value: 'neutral' },
                        { emoji: '🛋️', label: 'Need a break', value: 'low' }
                    ],
                    reasoning: 'Mental readiness is as important as physical readiness'
                };

            case 'stress_check':
                return {
                    title: 'How are you feeling?',
                    question: 'What\'s your current stress level?',
                    type: '5-point-emoji',
                    options: [
                        { emoji: '😌', label: 'Very Low (Zen)', value: 1 },
                        { emoji: '😊', label: 'Low (Calm)', value: 2 },
                        { emoji: '😐', label: 'Neutral', value: 3 },
                        { emoji: '😰', label: 'High (Tense)', value: 4 },
                        { emoji: '😫', label: 'Very High (Overwhelmed)', value: 5 }
                    ],
                    reasoning: 'High stress requires recovery mode'
                };

            case 'pain_check':
                return {
                    title: 'Safety Check',
                    question: 'Any pain or issues today that might affect your training?',
                    type: 'pain_selector',
                    reasoning: 'Safety is our top priority - AI will avoid exercises that could aggravate pain'
                };

            case 'hydration_prompt':
                return {
                    title: 'Stay hydrated!',
                    question: 'How many glasses of water have you had today?',
                    type: 'stepper',
                    currentValue: payload.data_freshness.hydrationCount,
                    goal: 8,
                    reasoning: 'Hydration affects performance and recovery'
                };

            case 'workout_plan':
                // Generate workout using AI
                const workout = await this._generateWorkout(user, memory, payload);

                // Apply pain constraints if user has reported pain today
                const today = new Date().toISOString().split('T')[0];
                const todayPain = user.painLogs?.find(log => log.date === today);

                if (todayPain && todayPain.hasPain) {
                    const modifiedWorkout = PainConstraints.filterWorkout(workout, todayPain.areas);
                    const painMessage = PainConstraints.getModificationMessage(todayPain.areas);

                    return {
                        title: 'Your workout for today',
                        workout: modifiedWorkout,
                        canRegenerate: true,
                        painModification: painMessage,
                        reasoning: `${workout.reasoning} (Modified for safety due to reported pain)`
                    };
                }

                return {
                    title: 'Your workout for today',
                    workout,
                    canRegenerate: true,
                    reasoning: workout.reasoning
                };

            case 'meal_check':
                const mealType = this._getMealType(payload.current_context.hour);
                return {
                    title: `Meal check`,
                    question: `Did you eat ${mealType}?`,
                    type: 'binary',
                    mealType,
                    reasoning: 'Nutrition tracking affects recovery score'
                };

            case 'day_summary':
                return {
                    title: 'Your day at a glance',
                    type: 'summary',
                    stats: this._calculateDayStats(user),
                    tomorrowPreview: await this._generateTomorrowPreview(user, memory, payload),
                    reasoning: 'Reflect and prepare for tomorrow'
                };

            default:
                return {
                    title: 'Welcome back!',
                    message: 'Ready to continue your fitness journey?',
                    reasoning: 'Default fallback card'
                };
        }
    },

    /**
     * Generate workout using AIRouter
     * @private
     */
    async _generateWorkout(user, memory, payload) {
        try {
            // Check if time-based suggestion should be made
            const suggestion = getActivitySuggestion('HIIT', memory.user_preferences);

            const workout = await AIRouter.route('workout_generation', {
                userProfile: payload.user_profile,
                recoveryScore: payload.current_context.recovery_score,
                psychologicalState: payload.psychological_state,
                memory: payload.memory_retrieval,
                timeContext: payload.current_context
            });

            // Add time-based warning if needed
            if (suggestion.shouldWarn && workout.intensity === 'high') {
                workout.timeWarning = {
                    message: suggestion.warningMessage,
                    alternative: suggestion.alternative
                };
            }

            return workout;
        } catch (error) {
            console.error('Workout generation error:', error);
            // Fallback workout
            return {
                workout_type: 'Light Activity',
                reasoning: 'AI service temporarily unavailable - here\'s a simple workout',
                duration_minutes: 20,
                intensity: 'low',
                exercises: [
                    { name: 'Walking', sets: 1, reps: '20 minutes', rest_seconds: 0 }
                ]
            };
        }
    },

    /**
     * Generate tomorrow's preview
     * @private
     */
    async _generateTomorrowPreview(user, memory, payload) {
        // Predict tomorrow's workout based on recovery patterns
        return {
            suggestedActivity: 'Rest day' // Simplified for now
        };
    },

    /**
     * Calculate today's stats
     * @private
     */
    _calculateDayStats(user) {
        const today = new Date().toISOString().split('T')[0];
        return {
            workoutsCompleted: user.workouts?.filter(w => w.date === today && w.completed).length || 0,
            mealsLogged: Object.values(user.meals || {}).filter(m => m.date === today).length,
            hydrationGlasses: user.hydrationToday || 0,
            hydrationGoal: 8,
            recoveryScore: user.recoveryScore || 0
        };
    },

    /**
     * Get greeting based on time
     * @private
     */
    _getGreeting(period) {
        const greetings = {
            morning: 'Morning',
            afternoon: 'Afternoon',
            evening: 'Evening',
            night: 'Evening'
        };
        return greetings[period] || 'Day';
    },

    /**
     * Determine current meal type
     * @private
     */
    _getMealType(hour) {
        if (hour < 11) return 'breakfast';
        if (hour < 15) return 'lunch';
        return 'dinner';
    },

    /**
     * Trigger proactive AI message based on context
     */
    getProactiveMessage(user, memory, trigger) {
        const messages = {
            poor_sleep: `I see you logged "Poor" sleep. I've adjusted today's workout to light stretching. Rest is progress too! 💙`,
            low_hydration: `You've only had ${user.hydrationToday || 0} glasses of water. Want a reminder to drink more?`,
            high_stress: `You seem stressed today. How about we do some calming yoga instead of high intensity?`,
            low_motivation: `Not feeling it today? That's totally okay. Want a rest day or something super light?`,
            workout_skipped: `I noticed you haven't worked out in 3 days. Everything okay? I can adjust your plan if needed.`,
            chronic_pain: `You've reported pain in the same area for 3+ days. Consider consulting a professional for proper assessment.`
        };

        return {
            message: messages[trigger] || 'How can I help you today?',
            trigger,
            suggestedAction: this._getSuggestedAction(trigger)
        };
    },

    /**
     * Get suggested action for proactive message
     * @private
     */
    _getSuggestedAction(trigger) {
        const actions = {
            poor_sleep: 'view_light_workout',
            low_hydration: 'set_hydration_reminder',
            high_stress: 'switch_to_yoga',
            low_motivation: 'take_rest_day',
            workout_skipped: 'adjust_plan',
            chronic_pain: 'consult_professional'
        };
        return actions[trigger];
    }
};
