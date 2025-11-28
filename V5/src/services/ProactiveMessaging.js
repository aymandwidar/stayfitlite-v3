/**
 * Proactive AI Messaging System
 * Triggers contextual messages based on user state
 */

export const ProactiveMessaging = {
    /**
     * Check if any proactive messages should be triggered
     * @param {object} user - User data
     * @param {object} memory - AI memory
     * @returns {object|null} - Proactive message if triggered
     */
    checkTriggers(user, memory) {
        const today = new Date().toISOString().split('T')[0];

        // Poor sleep trigger
        const todaySleep = user.sleepLogs?.find(log => log.date === today);
        if (todaySleep && (todaySleep.quality === 'Very Poor' || todaySleep.quality === 'Poor')) {
            return {
                trigger: 'poor_sleep',
                message: `I see you logged "${todaySleep.quality}" sleep. I've adjusted today's workout to focus on active recovery. Rest is progress too! 💙`,
                suggestedAction: 'view_recovery_workout',
                priority: 'high'
            };
        }

        // Low motivation trigger
        const todayMotivation = user.motivationLogs?.find(log => log.date === today);
        if (todayMotivation && todayMotivation.level === 'low') {
            return {
                trigger: 'low_motivation',
                message: `Not feeling it today? That's totally okay. Want to take a rest day or do something super light? I'm here to support whatever you need. 🛋️`,
                suggestedAction: 'suggest_rest_or_light',
                priority: 'high'
            };
        }

        // High stress trigger
        const todayStress = user.stressLogs?.find(log => log.date === today);
        if (todayStress && todayStress.level >= 4) {
            return {
                trigger: 'high_stress',
                message: `You seem stressed today. How about some calming yoga or a gentle walk instead of high intensity? Movement can help reduce stress. 🧘`,
                suggestedAction: 'switch_to_yoga',
                priority: 'high'
            };
        }

        // Low hydration trigger (afternoon check)
        const hour = new Date().getHours();
        if (hour >= 14 && hour < 18 && (user.hydrationToday || 0) < 4) {
            return {
                trigger: 'low_hydration',
                message: `You've only had ${user.hydrationToday || 0} glasses of water today. Want a reminder to drink more? Hydration affects your performance! 💧`,
                suggestedAction: 'set_hydration_reminder',
                priority: 'medium'
            };
        }

        // Workout skipped pattern (3 days inactive)
        const lastWorkout = user.workouts?.[0];
        if (lastWorkout) {
            const daysSince = Math.floor((new Date() - new Date(lastWorkout.date)) / (1000 * 60 * 60 * 24));
            if (daysSince >= 3) {
                return {
                    trigger: 'workout_skipped',
                    message: `I noticed you haven't worked out in ${daysSince} days. Everything okay? I can adjust your plan or we can chat about what's holding you back. 💪`,
                    suggestedAction: 'adjust_plan',
                    priority: 'medium'
                };
            }
        }

        // Plateau detected via memory
        const plateauExercises = Object.entries(memory.progression_status || {})
            .filter(([_, status]) => status.includes('Struggling') || status.includes('plateau'))
            .map(([exercise, _]) => exercise);

        if (plateauExercises.length > 0) {
            return {
                trigger: 'plateau_detected',
                message: `I've noticed you're plateauing on ${plateauExercises[0]}. Want to try a different training approach or swap to a variation? 📊`,
                suggestedAction: 'suggest_variation',
                priority: 'low',
                data: { exercises: plateauExercises }
            };
        }

        // Consistent progress celebration
        if (user.workouts?.length >= 10) {
            const recentWorkouts = user.workouts.slice(0, 5);
            const allCompleted = recentWorkouts.every(w => w.completedAt);
            if (allCompleted) {
                return {
                    trigger: 'progress_celebration',
                    message: `You've completed 5 workouts in a row! That's amazing consistency. Keep it up! 🎉`,
                    suggestedAction: 'view_progress',
                    priority: 'low'
                };
            }
        }

        return null; // No triggers
    },

    /**
     * Get recommended response for a proactive trigger
     */
    getRecommendedResponse(trigger) {
        const responses = {
            poor_sleep: 'Switch to active recovery',
            low_motivation: 'Take today off',
            high_stress: 'Do gentle yoga',
            low_hydration: 'Set reminder',
            workout_skipped: 'Tell me what's up',
      plateau_detected: 'Try variation',
            progress_celebration: 'Thanks! 💪'
        };
        return responses[trigger] || 'Got it';
    }
};
