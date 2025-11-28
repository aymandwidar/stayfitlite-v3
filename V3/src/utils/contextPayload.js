/**
 * Context Payload Builder
 * Builds comprehensive JSON payload sent to AI for decision-making
 */

import { getTimeContext } from './timeContext.js';

/**
 * Build complete context payload for AI
 * @param {object} user - User profile and data
 * @param {object} memory - AI memory context
 * @returns {object} - Comprehensive context object
 */
export const buildContextPayload = (user, memory = {}) => {
    const timeContext = getTimeContext();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Calculate data freshness
    const dataFreshness = {
        sleepLoggedToday: user.sleepLogs?.some(log => log.date === today) || false,
        motivationLoggedToday: user.motivationLogs?.some(log => log.date === today) || false,
        stressLoggedToday: user.stressLogs?.some(log => log.date === today) || false,
        painLoggedToday: user.painLogs?.some(log => log.date === today) || false,
        hydrationCount: user.hydrationToday || 0,
        mealsLogged: {
            breakfast: user.meals?.breakfast?.date === today,
            lunch: user.meals?.lunch?.date === today,
            dinner: user.meals?.dinner?.date === today
        },
        workoutCompletedToday: user.workouts?.some(w => w.date === today && w.completed) || false,
        dinnerLogged: user.meals?.dinner?.date === today
    };

    return {
        user_id: user.id || 'guest',
        timestamp: new Date().toISOString(),

        current_context: {
            time: timeContext.timestamp,
            time_period: timeContext.period,
            hour: timeContext.hour,
            suggested_intensity: timeContext.suggestedIntensity,
            recovery_score: user.recoveryScore || 0
        },

        user_profile: {
            name: user.name || 'User',
            age: user.age,
            weight: user.weight,
            height: user.height,
            goal: user.goal,
            fitness_level: user.level || 'beginner',
            activity_level: user.activityLevel,
            medical_conditions: user.medicalConditions || 'None'
        },

        psychological_state: {
            motivation: user.todayMotivation || 'neutral',
            stress: user.todayStress || 3,
            fatigue_level: calculateFatigueLevel(user)
        },

        data_freshness: dataFreshness,

        memory_retrieval: {
            last_workout: user.workouts?.[0] || null,
            disliked_exercises: memory.user_preferences?.disliked_exercises || [],
            loved_exercises: memory.user_preferences?.loved_exercises || [],
            injury_watch: memory.injury_watch || [],
            progression_status: memory.progression_status || {},
            psychological_patterns: memory.psychological_patterns || [],
            preferred_training_times: memory.user_preferences?.preferred_training_times || {}
        }
    };
};

/**
 * Calculate user's current fatigue level
 * @private
 */
const calculateFatigueLevel = (user) => {
    const recoveryScore = user.recoveryScore || 50;

    if (recoveryScore < 40) return 'High';
    if (recoveryScore < 70) return 'Moderate';
    return 'Low';
};

/**
 * Build simplified payload for quick AI queries
 */
export const buildQuickPayload = (user) => {
    const timeContext = getTimeContext();

    return {
        time_period: timeContext.period,
        recovery_score: user.recoveryScore || 50,
        motivation: user.todayMotivation || 'neutral',
        stress: user.todayStress || 3
    };
};
