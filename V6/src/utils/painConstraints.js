/**
 * Pain Constraint System (FR-AI9)
 * Removes unsafe exercises based on pain location and severity
 */

export const PainConstraints = {
    /**
     * Get exercises to avoid based on pain areas
     * @param {array} painAreas - Array of {location, severity}
     * @returns {array} - Exercise names to avoid
     */
    getExercisesToAvoid(painAreas) {
        const avoid = new Set();

        if (!painAreas || painAreas.length === 0) return [];

        painAreas.forEach(({ location, severity }) => {
            const exercises = this._getAffectedExercises(location, severity);
            exercises.forEach(ex => avoid.add(ex));
        });

        return Array.from(avoid);
    },

    /**
     * Get exercises affected by specific pain location
     * @private
     */
    _getAffectedExercises(location, severity) {
        const isSevereOrModerate = severity === 'Severe' || severity === 'Moderate';

        const painMap = {
            'Neck': isSevereOrModerate ?
                ['Overhead Press', 'Deadlift', 'Barbell Squat', 'Shoulder Press', 'Pull-ups'] :
                ['Overhead Press', 'Shoulder Press'],

            'Shoulders': isSevereOrModerate ?
                ['Overhead Press', 'Shoulder Press', 'Bench Press', 'Dumbbell Press', 'Lateral Raises', 'Front Raises', 'Push-ups', 'Dips'] :
                ['Overhead Press', 'Shoulder Press', 'Lateral Raises'],

            'Upper Back': isSevereOrModerate ?
                ['Deadlift', 'Barbell Row', 'Pull-ups', 'Lat Pulldown', 'T-Bar Row'] :
                ['Deadlift', 'Barbell Row'],

            'Lower Back': isSevereOrModerate ?
                ['Deadlift', 'Barbell Squat', 'Romanian Deadlift', 'Bent Over Row', 'Overhead Press', 'Good Mornings'] :
                ['Deadlift', 'Barbell Squat', 'Romanian Deadlift'],

            'Chest': isSevereOrModerate ?
                ['Bench Press', 'Dumbbell Press', 'Push-ups', 'Dips', 'Cable Fly', 'Incline Press'] :
                ['Bench Press', 'Dumbbell Press', 'Dips'],

            'Hips': isSevereOrModerate ?
                ['Squat', 'Deadlift', 'Lunges', 'Leg Press', 'Romanian Deadlift', 'Hip Thrusts'] :
                ['Squat', 'Deadlift', 'Lunges'],

            'Knees': isSevereOrModerate ?
                ['Squat', 'Lunges', 'Leg Press', 'Leg Extension', 'Jump Rope', 'Burpees', 'Running'] :
                ['Squat', 'Lunges', 'Jump Rope'],

            'Ankles': isSevereOrModerate ?
                ['Running', 'Jump Rope', 'Burpees', 'Box Jumps', 'Lunges', 'Calf Raises'] :
                ['Running', 'Jump Rope', 'Burpees'],

            'Wrists': isSevereOrModerate ?
                ['Bench Press', 'Push-ups', 'Overhead Press', 'Barbell Curl', 'Plank', 'Burpees'] :
                ['Bench Press', 'Push-ups', 'Plank'],

            'Elbows': isSevereOrModerate ?
                ['Bench Press', 'Tricep Extension', 'Overhead Press', 'Dips', 'Skull Crushers', 'Pull-ups'] :
                ['Tricep Extension', 'Skull Crushers', 'Overhead Press']
        };

        return painMap[location] || [];
    },

    /**
     * Filter workout plan to remove unsafe exercises
     * @param {object} workout - Workout plan
     * @param {array} painAreas - Pain areas
     * @returns {object} - Modified workout
     */
    filterWorkout(workout, painAreas) {
        if (!painAreas || painAreas.length === 0) return workout;

        const avoid = this.getExercisesToAvoid(painAreas);

        if (avoid.length === 0) return workout;

        // Filter out unsafe exercises
        const filteredExercises = workout.exercises?.filter(ex =>
            !avoid.some(avoidEx => ex.name.includes(avoidEx) || avoidEx.includes(ex.name))
        );

        // If too many exercises removed, mark workout as needs regeneration
        if (filteredExercises && filteredExercises.length < workout.exercises.length * 0.5) {
            return {
                ...workout,
                exercises: filteredExercises,
                warning: `${workout.exercises.length - filteredExercises.length} exercises removed due to pain. Consider full regeneration.`,
                needsRegeneration: true
            };
        }

        return {
            ...workout,
            exercises: filteredExercises || [],
            modified: true
        };
    },

    /**
     * Get workout modification message for user
     */
    getModificationMessage(painAreas) {
        if (!painAreas || painAreas.length === 0) return null;

        const severePain = painAreas.filter(p => p.severity === 'Severe');
        const moderatePain = painAreas.filter(p => p.severity === 'Moderate');

        if (severePain.length > 0) {
            return {
                type: 'warning',
                message: `I've removed all exercises that could stress your ${severePain.map(p => p.location).join(', ')}. Safety is our top priority. 🩹`
            };
        }

        if (moderatePain.length > 0) {
            return {
                type: 'info',
                message: `Modified workout to avoid stressing your ${moderatePain.map(p => p.location).join(', ')}. Let me know if anything still hurts.`
            };
        }

        return {
            type: 'info',
            message: `Adjusted exercise selection to be gentle on your ${painAreas.map(p => p.location).join(', ')}.`
        };
    }
};
