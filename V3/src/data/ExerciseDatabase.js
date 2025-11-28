/**
 * Comprehensive Exercise Database
 * Categorized by muscle group, equipment, and difficulty
 */

export const ExerciseDatabase = {
    // CHEST
    chest: [
        { name: 'Bench Press', equipment: ['Barbell', 'Bench'], muscles: ['Chest', 'Triceps'], difficulty: 'intermediate', type: 'compound' },
        { name: 'Dumbbell Bench Press', equipment: ['Dumbbells', 'Bench'], muscles: ['Chest', 'Triceps'], difficulty: 'intermediate', type: 'compound' },
        { name: 'Push-ups', equipment: ['Bodyweight'], muscles: ['Chest', 'Triceps', 'Shoulders'], difficulty: 'beginner', type: 'compound' },
        { name: 'Incline Dumbbell Press', equipment: ['Dumbbells', 'Bench'], muscles: ['Upper Chest', 'Triceps'], difficulty: 'intermediate', type: 'compound' },
        { name: 'Cable Fly', equipment: ['Cable Machine'], muscles: ['Chest'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Dips', equipment: ['Dip Bars'], muscles: ['Chest', 'Triceps'], difficulty: 'intermediate', type: 'compound' },
    ],

    // BACK
    back: [
        { name: 'Deadlift', equipment: ['Barbell'], muscles: ['Back', 'Legs', 'Core'], difficulty: 'advanced', type: 'compound' },
        { name: 'Pull-ups', equipment: ['Pull-up Bar'], muscles: ['Back', 'Biceps'], difficulty: 'intermediate', type: 'compound' },
        { name: 'Lat Pulldown', equipment: ['Cable Machine'], muscles: ['Lats', 'Biceps'], difficulty: 'beginner', type: 'compound' },
        { name: 'Dumbbell Row', equipment: ['Dumbbells', 'Bench'], muscles: ['Back', 'Biceps'], difficulty: 'beginner', type: 'compound' },
        { name: 'Seated Cable Row', equipment: ['Cable Machine'], muscles: ['Mid Back', 'Biceps'], difficulty: 'beginner', type: 'compound' },
        { name: 'T-Bar Row', equipment: ['Barbell'], muscles: ['Mid Back'], difficulty: 'intermediate', type: 'compound' },
    ],

    // LEGS
    legs: [
        { name: 'Barbell Squat', equipment: ['Barbell', 'Squat Rack'], muscles: ['Quads', 'Glutes', 'Hamstrings'], difficulty: 'intermediate', type: 'compound' },
        { name: 'Goblet Squat', equipment: ['Dumbbell'], muscles: ['Quads', 'Glutes'], difficulty: 'beginner', type: 'compound' },
        { name: 'Leg Press', equipment: ['Leg Press Machine'], muscles: ['Quads', 'Glutes'], difficulty: 'beginner', type: 'compound' },
        { name: 'Lunges', equipment: ['Dumbbells'], muscles: ['Quads', 'Glutes'], difficulty: 'beginner', type: 'compound' },
        { name: 'Romanian Deadlift', equipment: ['Barbell'], muscles: ['Hamstrings', 'Glutes', 'Lower Back'], difficulty: 'intermediate', type: 'compound' },
        { name: 'Leg Curl', equipment: ['Leg Curl Machine'], muscles: ['Hamstrings'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Leg Extension', equipment: ['Leg Extension Machine'], muscles: ['Quads'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Calf Raises', equipment: ['Dumbbells'], muscles: ['Calves'], difficulty: 'beginner', type: 'isolation' },
    ],

    // SHOULDERS
    shoulders: [
        { name: 'Overhead Press', equipment: ['Barbell'], muscles: ['Shoulders', 'Triceps'], difficulty: 'intermediate', type: 'compound' },
        { name: 'Dumbbell Shoulder Press', equipment: ['Dumbbells'], muscles: ['Shoulders', 'Triceps'], difficulty: 'beginner', type: 'compound' },
        { name: 'Lateral Raises', equipment: ['Dumbbells'], muscles: ['Side Delts'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Front Raises', equipment: ['Dumbbells'], muscles: ['Front Delts'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Face Pulls', equipment: ['Cable Machine'], muscles: ['Rear Delts'], difficulty: 'beginner', type: 'isolation' },
    ],

    // ARMS
    arms: [
        { name: 'Barbell Curl', equipment: ['Barbell'], muscles: ['Biceps'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Dumbbell Curl', equipment: ['Dumbbells'], muscles: ['Biceps'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Hammer Curl', equipment: ['Dumbbells'], muscles: ['Biceps', 'Forearms'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Tricep Dips', equipment: ['Bench'], muscles: ['Triceps'], difficulty: 'intermediate', type: 'compound' },
        { name: 'Tricep Pushdown', equipment: ['Cable Machine'], muscles: ['Triceps'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Skull Crushers', equipment: ['Barbell', 'Bench'], muscles: ['Triceps'], difficulty: 'intermediate', type: 'isolation' },
    ],

    // CORE
    core: [
        { name: 'Plank', equipment: ['Bodyweight'], muscles: ['Core'], difficulty: 'beginner', type: 'isometric' },
        { name: 'Russian Twists', equipment: ['Dumbbell'], muscles: ['Obliques'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Bicycle Crunches', equipment: ['Bodyweight'], muscles: ['Abs', 'Obliques'], difficulty: 'beginner', type: 'isolation' },
        { name: 'Hanging Leg Raises', equipment: ['Pull-up Bar'], muscles: ['Lower Abs'], difficulty: 'intermediate', type: 'isolation' },
        { name: 'Cable Crunches', equipment: ['Cable Machine'], muscles: ['Abs'], difficulty: 'beginner', type: 'isolation' },
    ],

    // CARDIO
    cardio: [
        { name: 'Running', equipment: ['Treadmill'], muscles: ['Legs', 'Cardio'], difficulty: 'beginner', type: 'cardio' },
        { name: 'Cycling', equipment: ['Bike'], muscles: ['Legs', 'Cardio'], difficulty: 'beginner', type: 'cardio' },
        { name: 'Rowing', equipment: ['Rowing Machine'], muscles: ['Full Body', 'Cardio'], difficulty: 'beginner', type: 'cardio' },
        { name: 'Jump Rope', equipment: ['Jump Rope'], muscles: ['Legs', 'Cardio'], difficulty: 'beginner', type: 'cardio' },
        { name: 'Burpees', equipment: ['Bodyweight'], muscles: ['Full Body', 'Cardio'], difficulty: 'intermediate', type: 'cardio' },
    ],

    // RECOVERY
    recovery: [
        { name: 'Walking', equipment: ['None'], muscles: ['Legs'], difficulty: 'beginner', type: 'active_recovery' },
        { name: 'Yoga Flow', equipment: ['Yoga Mat'], muscles: ['Full Body'], difficulty: 'beginner', type: 'flexibility' },
        { name: 'Stretching Routine', equipment: ['Yoga Mat'], muscles: ['Full Body'], difficulty: 'beginner', type: 'flexibility' },
        { name: 'Foam Rolling', equipment: ['Foam Roller'], muscles: ['Full Body'], difficulty: 'beginner', type: 'active_recovery' },
    ],

    /**
     * Find exercises by muscle group
     */
    findByMuscleGroup(muscleGroup) {
        const normalizedGroup = muscleGroup.toLowerCase();
        return this[normalizedGroup] || [];
    },

    /**
     * Find alternatives for an exercise
     */
    findAlternatives(exercise, constraints = {}) {
        // Determine muscle group of original exercise
        const muscleGroup = this._findMuscleGroup(exercise);
        if (!muscleGroup) return [];

        let alternatives = [...this[muscleGroup]];

        // Filter out the original exercise
        alternatives = alternatives.filter(ex => ex.name !== exercise);

        // Apply constraints
        if (constraints.equipment_unavailable) {
            alternatives = alternatives.filter(ex =>
                !ex.equipment.some(eq => constraints.equipment_unavailable.includes(eq))
            );
        }

        if (constraints.disliked) {
            alternatives = alternatives.filter(ex =>
                !constraints.disliked.includes(ex.name)
            );
        }

        if (constraints.difficulty) {
            alternatives = alternatives.filter(ex =>
                ex.difficulty === constraints.difficulty
            );
        }

        if (constraints.preferred_equipment) {
            // Prioritize exercises with preferred equipment
            alternatives.sort((a, b) => {
                const aHasPreferred = a.equipment.some(eq => constraints.preferred_equipment.includes(eq));
                const bHasPreferred = b.equipment.some(eq => constraints.preferred_equipment.includes(eq));
                if (aHasPreferred && !bHasPreferred) return -1;
                if (!aHasPreferred && bHasPreferred) return 1;
                return 0;
            });
        }

        return alternatives.slice(0, 3); // Return top 3 alternatives
    },

    /**
     * Find muscle group for an exercise
     * @private
     */
    _findMuscleGroup(exerciseName) {
        for (const group in this) {
            if (typeof this[group] === 'object' && Array.isArray(this[group])) {
                if (this[group].some(ex => ex.name === exerciseName)) {
                    return group;
                }
            }
        }
        return null;
    },

    /**
     * Get all exercises
     */
    getAllExercises() {
        const all = [];
        for (const group in this) {
            if (typeof this[group] === 'object' && Array.isArray(this[group])) {
                all.push(...this[group]);
            }
        }
        return all;
    }
};
