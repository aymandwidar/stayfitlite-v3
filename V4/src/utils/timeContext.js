/**
 * Time Context Detection Utility
 * Detects current time period and provides intelligent suggestions
 * (not hard rules - AI learns user preferences)
 */

export const getTimeContext = () => {
    const now = new Date();
    const hour = now.getHours();

    let period, suggestedIntensity, suggestedActivities;

    // Morning: 6am - 12pm
    if (hour >= 6 && hour < 12) {
        period = 'morning';
        suggestedIntensity = 'high';
        suggestedActivities = ['Readiness Check', 'Hydration', 'High-Intensity Workout'];
    }
    // Afternoon: 12pm - 6pm
    else if (hour >= 12 && hour < 18) {
        period = 'afternoon';
        suggestedIntensity = 'high';
        suggestedActivities = ['Peak Performance Training', 'Strength Work', 'Cardio'];
    }
    // Evening: 6pm - 10pm
    else if (hour >= 18 && hour < 22) {
        period = 'evening';
        suggestedIntensity = 'moderate';
        suggestedActivities = ['Moderate Training', 'Skill Work', 'Wind Down'];
    }
    // Night: 10pm - 6am
    else {
        period = 'night';
        suggestedIntensity = 'low';
        suggestedActivities = ['Recovery', 'Sleep Prep', 'Gentle Movement'];
    }

    return {
        period,
        hour,
        isDay: hour >= 6 && hour < 22,
        suggestedIntensity, // SUGGESTION, not a hard rule
        suggestedActivities,
        timestamp: now.toISOString()
    };
};

/**
 * Check if it's an appropriate time for a specific activity type
 * Returns a suggestion object with reasoning
 */
export const getActivitySuggestion = (activityType, userPreferences = {}) => {
    const timeContext = getTimeContext();

    // If user has established preferences for this time, respect them
    if (userPreferences.preferredTimes?.[activityType]?.includes(timeContext.period)) {
        return {
            appropriate: true,
            reasoning: `You typically train ${activityType} at this time`,
            shouldWarn: false
        };
    }

    // Provide gentle suggestions for first-time users or new patterns
    if (activityType === 'HIIT' && timeContext.period === 'night') {
        return {
            appropriate: true, // Still allowed!
            reasoning: 'High-intensity workouts late at night may affect sleep quality',
            shouldWarn: true,
            alternative: 'yoga or stretching',
            warningMessage: 'It\'s pretty late. This workout might affect sleep - want something gentler?'
        };
    }

    return {
        appropriate: true,
        reasoning: 'Good timing for this activity',
        shouldWarn: false
    };
};

/**
 * Determine what card to show based on time and data freshness
 */
export const getRecommendedCardType = (timeContext, dataFreshness) => {
    const { period } = timeContext;

    // Morning flow: Sleep → Motivation → Stress → Pain → Hydration → Workout
    if (period === 'morning') {
        if (!dataFreshness.sleepLoggedToday) return 'sleep_check';
        if (!dataFreshness.motivationLoggedToday) return 'motivation_check';
        if (!dataFreshness.stressLoggedToday) return 'stress_check';
        if (!dataFreshness.painLoggedToday) return 'pain_check';
        if (dataFreshness.hydrationCount < 2) return 'hydration_prompt';
        return 'workout_plan';
    }

    // Afternoon: Mainly workout or hydration reminders
    if (period === 'afternoon') {
        if (dataFreshness.hydrationCount < 4) return 'hydration_prompt';
        if (!dataFreshness.workoutCompletedToday) return 'workout_plan';
        return 'progress_summary';
    }

    // Evening: Meal checks
    if (period === 'evening') {
        if (!dataFreshness.dinnerLogged) return 'meal_check';
        return 'day_summary';
    }

    // Night: End of day summary
    if (period === 'night') {
        return 'day_summary';
    }

    return 'workout_plan'; // Default fallback
};
