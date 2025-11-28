import { exercises, workoutTemplates } from '../data/workouts';

export function generateDailyWorkout(user) {
    const { goal, level } = user;

    // Normalize goal to match keys (fitness/flexibility fallback to fitness)
    let targetGoal = goal;
    if (!workoutTemplates[targetGoal]) {
        targetGoal = 'fitness';
    }

    const goalTemplates = workoutTemplates[targetGoal];
    const routine = goalTemplates[level] || goalTemplates['beginner'];

    const hydratedExercises = routine.map(item => {
        const exerciseDetails = exercises.find(ex => ex.id === item.id);
        return {
            ...item,
            details: exerciseDetails || { name: 'Unknown Exercise', type: 'strength' }
        };
    });

    return {
        id: `daily-${new Date().toISOString().split('T')[0]}`,
        title: "Daily " + (targetGoal === 'muscle_gain' ? "Strength" : "Cardio") + " Blast",
        duration: calculateDuration(routine),
        exercises: hydratedExercises
    };
}

function calculateDuration(routine) {
    // Rough estimate: (sets * reps * 3s) + (sets * rest) + (duration)
    let totalSeconds = 0;
    routine.forEach(item => {
        if (item.duration) {
            totalSeconds += item.duration + (item.rest || 0);
        } else {
            totalSeconds += (item.sets * item.reps * 4) + (item.sets * (item.rest || 30));
        }
    });
    return Math.ceil(totalSeconds / 60);
}
