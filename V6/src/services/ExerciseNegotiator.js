/**
 * Exercise Negotiation Engine
 * Handles exercise swapping with AI-powered alternatives
 */

import { ExerciseDatabase } from '../data/ExerciseDatabase.js';
import { aiMemory } from './AIMemory.js';
import { AIRouter } from './AIRouter.js';

export class ExerciseNegotiator {
    /**
     * Request exercise swap
     * @param {string} exerciseName - Exercise to swap
     * @param {string} reason - Reason for swap
     * @param {object} constraints - User constraints (equipment, injuries, etc.)
     * @returns {Promise<array>} - Alternative exercises
     */
    async requestSwap(exerciseName, reason, constraints = {}) {
        // Record rejection in memory
        const rejectionCount = aiMemory.recordRejection(exerciseName, reason);


        // Build constraints from memory
        const memoryContext = aiMemory.getContext();
        const fullConstraints = {
            ...constraints,
            disliked: memoryContext.user_preferences.disliked_exercises,
            preferred_equipment: memoryContext.user_preferences.equipment_preferences,
            injury_watch: memoryContext.injury_watch
        };

        // Get alternatives from database
        let alternatives = ExerciseDatabase.findAlternatives(exerciseName, fullConstraints);

        // If gym anxiety reason, prefer bodyweight or dumbbell exercises
        if (reason === 'gym_anxiety' || reason === 'dont_know_equipment') {
            alternatives = alternatives.filter(ex =>
                ex.equipment.includes('Bodyweight') ||
                ex.equipment.includes('Dumbbells') ||
                ex.equipment.includes('Dumbbell')
            );

            // If no bodyweight/dumbbell alternatives, fall back to all alternatives
            if (alternatives.length === 0) {
                alternatives = ExerciseDatabase.findAlternatives(exerciseName, fullConstraints);
            }
        }

        // Enhance alternatives with AI descriptions
        const enhancedAlternatives = await this._enhanceWithAI(alternatives, exerciseName, reason);

        return enhancedAlternatives.slice(0, 3); // Return top 3
    }

    /**
     * Enhance alternatives with AI-generated descriptions
     * @private
     */
    async _enhanceWithAI(alternatives, originalExercise, reason) {
        // For now, add simple descriptions (can be enhanced with AI later)
        return alternatives.map(alt => ({
            ...alt,
            description: this._generateDescription(alt, originalExercise),
            sameTargets: true, // Indicates it targets same muscles
            easierToLearn: alt.difficulty === 'beginner'
        }));
    }

    /**
     * Generate simple description for alternative
     * @private
     */
    _generateDescription(exercise, original) {
        const descriptions = {
            'gym_anxiety': `${exercise.name} is easier to learn and requires ${exercise.equipment.join(', ')}.`,
            'dont_like': `${exercise.name} is a great alternative that targets the same muscles.`,
            'equipment_unavailable': `${exercise.name} uses ${exercise.equipment.join(', ')} instead.`,
            'default': `${exercise.name} targets ${exercise.muscles.join(', ')} and is ${exercise.difficulty} level.`
        };

        return descriptions.default;
    }

    /**
     * Handle exercise selection (user picked an alternative)
     */
    selectAlternative(newExercise, originalExercise) {

        // Update equipment preferences
        const exercise = ExerciseDatabase.getAllExercises().find(ex => ex.name === newExercise);
        if (exercise) {
            const memoryContext = aiMemory.getContext();
            exercise.equipment.forEach(eq => {
                if (!memoryContext.user_preferences.equipment_preferences.includes(eq)) {
                    memoryContext.user_preferences.equipment_preferences.push(eq);
                }
            });
            aiMemory._saveMemory();
        }

        return newExercise;
    }

    /**
     * Batch swap multiple exercises (for entire workout regeneration)
     */
    async regenerateWorkout(currentWorkout, user, memory) {

        // Use AIRouter to generate completely new workout
        try {
            const newWorkout = await AIRouter.route('workout_generation', {
                userProfile: user,
                recoveryScore: user.recoveryScore || 50,
                psychologicalState: {
                    motivation: user.todayMotivation || 'neutral',
                    stress: user.todayStress || 3
                },
                memory,
                timeContext: { period: 'morning', suggestedIntensity: 'moderate' }
            });

            return newWorkout;
        } catch (error) {
            return null;
        }
    }
}

// Export singleton
export const exerciseNegotiator = new ExerciseNegotiator();
