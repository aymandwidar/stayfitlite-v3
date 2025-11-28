/**
 * AI Memory Module
 * Manages long-term memory for preference learning and pattern detection
 */

export class AIMemory {
    constructor() {
        this.memory = this._loadMemory();
    }

    /**
     * Load memory from localStorage
     * @private
     */
    _loadMemory() {
        const saved = localStorage.getItem('stayfitlite_v2_memory');
        if (saved) {
            return JSON.parse(saved);
        }

        return {
            user_preferences: {
                disliked_exercises: [],
                loved_exercises: [],
                equipment_preferences: [],
                preferred_training_times: {},
                rejection_counts: {}
            },
            injury_watch: [],
            psychological_patterns: [],
            workout_memory: [],
            progression_status: {}
        };
    }

    /**
     * Save memory to localStorage
     * @private
     */
    _saveMemory() {
        localStorage.setItem('stayfitlite_v2_memory', JSON.stringify(this.memory));
    }

    /**
     * Record exercise rejection
     */
    recordRejection(exerciseName, reason) {
        const rejections = this.memory.user_preferences.rejection_counts;
        rejections[exerciseName] = (rejections[exerciseName] || 0) + 1;

        // After 3 rejections, add to disliked list
        if (rejections[exerciseName] >= 3) {
            if (!this.memory.user_preferences.disliked_exercises.includes(exerciseName)) {
                this.memory.user_preferences.disliked_exercises.push(exerciseName);
            }
        }

        this._saveMemory();
        return rejections[exerciseName];
    }

    /**
     * Record exercise completion with positive feedback
     */
    recordLoved(exerciseName) {
        if (!this.memory.user_preferences.loved_exercises.includes(exerciseName)) {
            this.memory.user_preferences.loved_exercises.push(exerciseName);
            this._saveMemory();
        }
    }

    /**
     * Record injury or pain
     */
    recordInjury(exerciseName, bodyPart, severity = 'mild') {
        const injury = {
            exercise: exerciseName,
            bodyPart,
            severity,
            timestamp: new Date().toISOString(),
            flagged: true
        };

        this.memory.injury_watch.push(injury);
        this._saveMemory();
    }

    /**
     * Record workout completion for progression tracking
     */
    recordWorkout(workout) {
        this.memory.workout_memory.push({
            ...workout,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 workouts
        if (this.memory.workout_memory.length > 50) {
            this.memory.workout_memory = this.memory.workout_memory.slice(-50);
        }

        this._saveMemory();
    }

    /**
     * Update progression status for an exercise
     */
    updateProgression(exerciseName, status) {
        this.memory.progression_status[exerciseName] = status;
        this._saveMemory();
    }

    /**
     * Detect psychological patterns (e.g., "Low motivation every Monday")
     */
    detectPsychologicalPatterns(motivationLogs, stressLogs) {
        const patterns = [];

        // Analyze by day of week
        const dayStats = {
            0: { lowMotivation: 0, highStress: 0, total: 0 }, // Sunday
            1: { lowMotivation: 0, highStress: 0, total: 0 }, // Monday
            2: { lowMotivation: 0, highStress: 0, total: 0 }, // Tuesday
            3: { lowMotivation: 0, highStress: 0, total: 0 }, // Wednesday
            4: { lowMotivation: 0, highStress: 0, total: 0 }, // Thursday
            5: { lowMotivation: 0, highStress: 0, total: 0 }, // Friday
            6: { lowMotivation: 0, highStress: 0, total: 0 }  // Saturday
        };

        // Analyze motivation
        motivationLogs.forEach(log => {
            const day = new Date(log.timestamp).getDay();
            dayStats[day].total++;
            if (log.level === 'low') {
                dayStats[day].lowMotivation++;
            }
        });

        // Analyze stress
        stressLogs.forEach(log => {
            const day = new Date(log.timestamp).getDay();
            if (log.level >= 4) {
                dayStats[day].highStress++;
            }
        });

        // Detect patterns
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        Object.keys(dayStats).forEach(dayKey => {
            const day = parseInt(dayKey);
            const stats = dayStats[day];

            if (stats.total >= 3) { // Need at least 3 data points
                const lowMotivationRate = stats.lowMotivation / stats.total;
                const highStressRate = stats.highStress / stats.total;

                if (lowMotivationRate >= 0.6) {
                    patterns.push({
                        pattern: `Low motivation on ${dayNames[day]}s`,
                        frequency: stats.lowMotivation,
                        recommendation: `Schedule active recovery or rest on ${dayNames[day]}s`
                    });
                }

                if (highStressRate >= 0.6) {
                    patterns.push({
                        pattern: `High stress on ${dayNames[day]}s`,
                        frequency: stats.highStress,
                        recommendation: `Avoid HIIT on ${dayNames[day]}s, prefer yoga or gentle cardio`
                    });
                }
            }
        });

        this.memory.psychological_patterns = patterns;
        this._saveMemory();

        return patterns;
    }

    /**
     * Learn user's preferred training times
     */
    learnTrainingTime(activityType, timePeriod) {
        const prefs = this.memory.user_preferences.preferred_training_times;
        if (!prefs[activityType]) {
            prefs[activityType] = [];
        }

        if (!prefs[activityType].includes(timePeriod)) {
            prefs[activityType].push(timePeriod);
            this._saveMemory();
        }
    }

    /**
     * Get memory context for AI
     */
    getContext() {
        return this.memory;
    }

    /**
     * Clear all memory (reset)
     */
    clear() {
        this.memory = {
            user_preferences: {
                disliked_exercises: [],
                loved_exercises: [],
                equipment_preferences: [],
                preferred_training_times: {},
                rejection_counts: {}
            },
            injury_watch: [],
            psychological_patterns: [],
            workout_memory: [],
            progression_status: {}
        };
        this._saveMemory();
    }
}

// Export singleton instance
export const aiMemory = new AIMemory();
