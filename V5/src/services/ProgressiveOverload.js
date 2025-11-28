/**
 * Progressive Overload System
 * Automatically increases weight/reps based on RPE and performance
 */

import { aiMemory } from './AIMemory.js';

export class ProgressiveOverload {
    /**
     * Calculate next workout progression for an exercise
     * @param {object} exerciseHistory - Array of previous performances
     * @param {object} lastPerformance - Most recent performance
     * @returns {object} - Recommended weight/reps for next session
     */
    calculateProgression(exerciseHistory, lastPerformance) {
        const { exerciseName, weight, reps, sets, rpe, completed } = lastPerformance;

        // Check for plateau
        const plateauDetected = this._detectPlateau(exerciseHistory, exerciseName);

        if (plateauDetected) {
            return this._handlePlateau(lastPerformance);
        }

        // Normal progression based on RPE
        if (!completed || rpe >= 9) {
            // Failed or too hard - reduce weight
            return {
                weight: Math.round(weight * 0.95 * 10) / 10,
                reps,
                sets,
                reasoning: rpe >= 9 ? 'RPE too high - reducing weight' : 'Failed last attempt - reducing weight'
            };
        }

        if (rpe <= 6) {
            // Too easy - increase weight
            return {
                weight: Math.round(weight * 1.05 * 10) / 10,
                reps,
                sets,
                reasoning: 'Last session was easy - increasing weight'
            };
        }

        if (rpe >= 7 && rpe <= 8) {
            // Perfect intensity - maintain
            return {
                weight,
                reps,
                sets,
                reasoning: 'Perfect intensity - maintaining weight'
            };
        }

        // Default: maintain
        return { weight, reps, sets, reasoning: 'Maintaining current load' };
    }

    /**
     * Detect if user has plateaud on an exercise
     * @private
     */
    _detectPlateau(exerciseHistory, exerciseName) {
        // Get last 3 attempts for this exercise
        const recentAttempts = exerciseHistory
            .filter(h => h.exerciseName === exerciseName)
            .slice(-3);

        if (recentAttempts.length < 3) return false;

        // Check if all 3 attempts failed or had RPE >= 9
        const failedCount = recentAttempts.filter(a => !a.completed || a.rpe >= 9).length;

        return failedCount >= 2; // 2 out of 3 failures = plateau
    }

    /**
     * Handle plateau by switching training style
     * @private
     */
    _handlePlateau(lastPerformance) {
        const { weight, reps, sets, trainingStyle = 'strength' } = lastPerformance;

        if (trainingStyle === 'strength') {
            // Switch to hypertrophy: Lower weight, higher reps
            return {
                weight: Math.round(weight * 0.75 * 10) / 10,
                reps: Math.min(15, reps + 4),
                sets,
                trainingStyle: 'hypertrophy',
                reasoning: 'Plateau detected - switching to hypertrophy (higher volume, lower weight)'
            };
        } else {
            // Switch back to strength: Higher weight, lower reps
            return {
                weight: Math.round(weight * 1.1 * 10) / 10,
                reps: Math.max(5, reps - 4),
                sets,
                trainingStyle: 'strength',
                reasoning: 'Switching back to strength training (lower reps, higher weight)'
            };
        }
    }

    /**
     * Record workout performance
     */
    recordPerformance(exerciseName, performance) {
        const record = {
            exerciseName,
            ...performance,
            timestamp: new Date().toISOString()
        };

        // Store in AI memory
        aiMemory.recordWorkout(record);

        // Update progression status
        const status = this._getProgressionStatus(performance);
        aiMemory.updateProgression(exerciseName, status);

        return record;
    }

    /**
     * Get progression status for an exercise
     * @private
     */
    _getProgressionStatus(performance) {
        if (!performance.completed) {
            return 'Struggling - consider reducing weight';
        }

        if (performance.rpe <= 6) {
            return 'Progressing well - ready for increase';
        }

        if (performance.rpe >= 7 && performance.rpe <= 8) {
            return 'Optimal intensity - maintain';
        }

        if (performance.rpe >= 9) {
            return 'Too difficult - reduce weight';
        }

        return 'Normal progression';
    }

    /**
     * Get recommended progression for next workout
     */
    getRecommendation(exerciseName, userHistory) {
        const exerciseHistory = userHistory.filter(h => h.exerciseName === exerciseName);

        if (exerciseHistory.length === 0) {
            return {
                weight: 20, // Default starting weight
                reps: 8,
                sets: 3,
                reasoning: 'First time - starting with moderate weight'
            };
        }

        const lastPerformance = exerciseHistory[exerciseHistory.length - 1];
        return this.calculateProgression(exerciseHistory, lastPerformance);
    }
}

// Export singleton
export const progressiveOverload = new ProgressiveOverload();
