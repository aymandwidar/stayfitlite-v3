/**
 * Recovery Score Calculation
 * Combines sleep, hydration, nutrition, psychological state, pain status, and biometrics
 */

export const calculateRecoveryScore = (user, biometrics = null) => {
    let score = 50; // Base score
    const today = new Date().toISOString().split('T')[0];

    // Sleep Quality (30 points max)
    const todaySleep = user.sleepLogs?.find(log => log.date === today);
    if (todaySleep) {
        const sleepPoints = {
            'Very Poor': 0,
            'Poor': 10,
            'Neutral': 18,
            'Well': 25,
            'Very Well': 30
        };
        score += sleepPoints[todaySleep.quality] || 15;
    }

    // Hydration (15 points max)
    const hydration = user.hydrationToday || 0;
    const hydrationScore = Math.min(15, (hydration / 8) * 15);
    score += hydrationScore;

    // Nutrition (10 points max)
    const meals = user.meals || {};
    const mealsEaten = Object.values(meals).filter(m => m.date === today && m.eaten).length;
    score += (mealsEaten / 3) * 10;

    // Psychological State (25 points max) - CRITICAL OVERRIDE
    const todayMotivation = user.motivationLogs?.find(log => log.date === today);
    const todayStress = user.stressLogs?.find(log => log.date === today);

    // If either motivation is low OR stress is high, force recovery mode
    if (todayMotivation?.level === 'low' || (todayStress?.level >= 4)) {
        // PSYCHOSOCIAL OVERRIDE: Cap score at 40 (forces recovery mode)
        return Math.min(score, 40);
    }

    // Normal psychological scoring
    if (todayMotivation) {
        const motivationPoints = {
            'high': 15,
            'neutral': 8,
            'low': 0
        };
        score += motivationPoints[todayMotivation.level] || 8;
    }

    if (todayStress) {
        const stressPoints = {
            1: 10,
            2: 8,
            3: 5,
            4: 2,
            5: 0
        };
        score += stressPoints[todayStress.level] || 5;
    }

    // PAIN STATUS (FR-AI9) - HIGHEST PRIORITY NEGATIVE CONSTRAINT
    const todayPain = user.painLogs?.find(log => log.date === today);
    if (todayPain && todayPain.hasPain) {
        todayPain.areas.forEach(area => {
            if (area.severity === 'Severe') {
                score -= 20; // Severe pain: -20 points
            } else if (area.severity === 'Moderate') {
                score -= 12; // Moderate pain: -12 points
            } else {
                score -= 5; // Mild pain: -5 points
            }
        });
    }

    // BIOMETRIC ANALYSIS (FR-AI10) - Passive optimization
    if (biometrics && biometrics.systemicStress) {
        // If RHR elevated or HRV lowered significantly
        score -= 15; // Systemic stress: -15 points
    }

    // Rest Days Bonus (10 points)
    const lastWorkout = user.workouts?.[0];
    if (lastWorkout) {
        const daysSinceWorkout = Math.floor(
            (new Date() - new Date(lastWorkout.date)) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceWorkout >= 1) {
            score += Math.min(10, daysSinceWorkout * 3);
        }
    }

    return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Get recovery category
 */
export const getRecoveryCategory = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'moderate';
    return 'poor';
};

/**
 * Get recovery recommendation
 */
export const getRecoveryRecommendation = (score, psychologicalState) => {
    // Psychosocial override
    if (psychologicalState?.motivation === 'low' || psychologicalState?.stress >= 4) {
        return {
            category: 'recovery',
            message: 'Your mental state needs rest today',
            suggestedIntensity: 'low',
            activities: ['Gentle Yoga', 'Walking', 'Stretching', 'Active Recovery']
        };
    }

    if (score >= 80) {
        return {
            category: 'excellent',
            message: 'You\'re fully recovered and ready for intense training',
            suggestedIntensity: 'high',
            activities: ['HIIT', 'Heavy Strength Training', 'Power Workouts']
        };
    }

    if (score >= 60) {
        return {
            category: 'good',
            message: 'Good recovery - moderate to high intensity is suitable',
            suggestedIntensity: 'moderate-high',
            activities: ['Strength Training', 'Moderate Cardio', 'Skill Work']
        };
    }

    if (score >= 40) {
        return {
            category: 'moderate',
            message: 'Moderate recovery - stick to lighter workouts',
            suggestedIntensity: 'moderate',
            activities: ['Light Cardio', 'Bodyweight Exercises', 'Technique Work']
        };
    }

    return {
        category: 'poor',
        message: 'Low recovery - prioritize rest and recovery',
        suggestedIntensity: 'low',
        activities: ['Rest Day', 'Gentle Stretching', 'Walking', 'Mobility Work']
    };
};
