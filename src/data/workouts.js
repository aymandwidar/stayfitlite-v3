export const exercises = [
    // Legs
    { id: 'squats', name: 'Squats', type: 'strength', muscle: 'legs', difficulty: 'beginner' },
    { id: 'lunges', name: 'Lunges', type: 'strength', muscle: 'legs', difficulty: 'beginner' },
    { id: 'glute_bridges', name: 'Glute Bridges', type: 'strength', muscle: 'legs', difficulty: 'beginner' },
    { id: 'calf_raises', name: 'Calf Raises', type: 'strength', muscle: 'legs', difficulty: 'beginner' },
    { id: 'jump_squats', name: 'Jump Squats', type: 'cardio', muscle: 'legs', difficulty: 'intermediate' },
    { id: 'bulgarian_split_squats', name: 'Bulgarian Split Squats', type: 'strength', muscle: 'legs', difficulty: 'advanced' },

    // Core
    { id: 'plank', name: 'Plank', type: 'strength', muscle: 'core', difficulty: 'beginner' },
    { id: 'crunches', name: 'Crunches', type: 'strength', muscle: 'core', difficulty: 'beginner' },
    { id: 'leg_raises', name: 'Leg Raises', type: 'strength', muscle: 'core', difficulty: 'intermediate' },
    { id: 'bicycle_crunches', name: 'Bicycle Crunches', type: 'strength', muscle: 'core', difficulty: 'intermediate' },
    { id: 'mountain_climbers', name: 'Mountain Climbers', type: 'cardio', muscle: 'core', difficulty: 'intermediate' },
    { id: 'russian_twists', name: 'Russian Twists', type: 'strength', muscle: 'core', difficulty: 'intermediate' },

    // Upper Body
    { id: 'pushups', name: 'Push-ups', type: 'strength', muscle: 'chest', difficulty: 'beginner' },
    { id: 'diamond_pushups', name: 'Diamond Push-ups', type: 'strength', muscle: 'triceps', difficulty: 'advanced' },
    { id: 'dips', name: 'Chair Dips', type: 'strength', muscle: 'triceps', difficulty: 'beginner' },
    { id: 'pike_pushups', name: 'Pike Push-ups', type: 'strength', muscle: 'shoulders', difficulty: 'intermediate' },
    { id: 'superman', name: 'Superman', type: 'strength', muscle: 'back', difficulty: 'beginner' },
    { id: 'burpees', name: 'Burpees', type: 'cardio', muscle: 'full_body', difficulty: 'advanced' },

    // Cardio
    { id: 'jumping_jacks', name: 'Jumping Jacks', type: 'cardio', muscle: 'full_body', difficulty: 'beginner' },
    { id: 'high_knees', name: 'High Knees', type: 'cardio', muscle: 'legs', difficulty: 'beginner' },
    { id: 'butt_kicks', name: 'Butt Kicks', type: 'cardio', muscle: 'legs', difficulty: 'beginner' }
];

export const workoutTemplates = {
    weight_loss: {
        beginner: [
            { id: 'jumping_jacks', duration: 30, rest: 15 },
            { id: 'squats', sets: 3, reps: 10, rest: 30 },
            { id: 'pushups', sets: 3, reps: 8, rest: 30 },
            { id: 'plank', duration: 20, rest: 30 },
            { id: 'high_knees', duration: 30, rest: 30 },
        ],
        intermediate: [
            { id: 'jumping_jacks', duration: 45, rest: 15 },
            { id: 'burpees', sets: 3, reps: 10, rest: 45 },
            { id: 'squats', sets: 3, reps: 15, rest: 30 },
            { id: 'mountain_climbers', duration: 45, rest: 30 },
            { id: 'plank', duration: 45, rest: 30 },
        ],
        advanced: [
            { id: 'burpees', sets: 4, reps: 15, rest: 30 },
            { id: 'mountain_climbers', duration: 60, rest: 15 },
            { id: 'squats', sets: 4, reps: 20, rest: 30 },
            { id: 'pushups', sets: 4, reps: 20, rest: 30 },
            { id: 'high_knees', duration: 60, rest: 30 },
        ]
    },
    muscle_gain: {
        beginner: [
            { id: 'pushups', sets: 3, reps: 8, rest: 60 },
            { id: 'squats', sets: 3, reps: 10, rest: 60 },
            { id: 'lunges', sets: 3, reps: 8, rest: 60 },
            { id: 'plank', duration: 20, rest: 60 },
        ],
        intermediate: [
            { id: 'pushups', sets: 4, reps: 12, rest: 45 },
            { id: 'squats', sets: 4, reps: 15, rest: 45 },
            { id: 'lunges', sets: 3, reps: 12, rest: 45 },
            { id: 'crunches', sets: 3, reps: 20, rest: 45 },
        ],
        advanced: [
            { id: 'pushups', sets: 5, reps: 20, rest: 30 },
            { id: 'squats', sets: 5, reps: 25, rest: 30 },
            { id: 'lunges', sets: 4, reps: 20, rest: 30 },
            { id: 'plank', duration: 90, rest: 45 },
        ]
    },
    // Fallback for other goals
    fitness: {
        beginner: [
            { id: 'jumping_jacks', duration: 30, rest: 15 },
            { id: 'squats', sets: 3, reps: 10, rest: 30 },
            { id: 'pushups', sets: 3, reps: 8, rest: 30 },
        ],
        intermediate: [
            { id: 'jumping_jacks', duration: 60, rest: 15 },
            { id: 'squats', sets: 3, reps: 20, rest: 30 },
            { id: 'pushups', sets: 3, reps: 15, rest: 30 },
            { id: 'plank', duration: 60, rest: 30 },
        ],
        advanced: [
            { id: 'burpees', sets: 3, reps: 15, rest: 30 },
            { id: 'squats', sets: 4, reps: 25, rest: 30 },
            { id: 'pushups', sets: 4, reps: 25, rest: 30 },
            { id: 'plank', duration: 120, rest: 30 },
        ]
    }
};
