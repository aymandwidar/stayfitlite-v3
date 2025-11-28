import { useState } from 'react';
import { motion } from 'framer-motion';
import AlternativesModal from '../AlternativesModal';
import { exerciseNegotiator } from '../../services/ExerciseNegotiator';

export default function WorkoutPlanCard({ data, onAction }) {
    const [regenerating, setRegenerating] = useState(false);
    const [regenerateCount, setRegenerateCount] = useState(0);
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(null);
    const [alternatives, setAlternatives] = useState([]);
    const [swappedExercises, setSwappedExercises] = useState({});

    const handleRegenerate = async () => {
        if (regenerateCount >= 3) {
            onAction('open_chat', { prompt: "I've tried a few plans. Tell me exactly what you're looking for today!" });
            return;
        }

        setRegenerating(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRegenerateCount(prev => prev + 1);

        onAction('regenerate_workout', { count: regenerateCount + 1 });
        setRegenerating(false);
    };

    const handleStartWorkout = () => {
        // Apply swaps to workout before starting
        const finalWorkout = {
            ...data.workout,
            exercises: data.workout.exercises?.map(ex =>
                swappedExercises[ex.name]
                    ? { ...ex, name: swappedExercises[ex.name] }
                    : ex
            )
        };

        onAction('start_workout', { workout: finalWorkout });
    };

    const handleSwapExercise = async (exerciseName) => {
        setCurrentExercise(exerciseName);

        // Get alternatives from negotiator
        const alts = await exerciseNegotiator.requestSwap(
            exerciseName,
            'dont_like',
            {}
        );

        setAlternatives(alts);
        setSwapModalOpen(true);
    };

    const handleSelectAlternative = (alternative) => {
        // Update swapped exercises map
        setSwappedExercises(prev => ({
            ...prev,
            [currentExercise]: alternative.name
        }));

        // Record in negotiator
        exerciseNegotiator.selectAlternative(alternative.name, currentExercise);
    };

    const hasTimeWarning = data.workout?.timeWarning;

    return (
        <>
            <div className="glass-card-prominent p-8 max-w-md mx-auto">
                {/* Title */}
                <h2 className="text-2xl font-heading text-white mb-2">{data.title}</h2>

                {/* Time Warning */}
                {hasTimeWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl"
                    >
                        <p className="text-yellow-100 text-sm">{data.workout.timeWarning.message}</p>
                    </motion.div>
                )}

                {/* Workout Info */}
                {data.workout && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl text-white font-semibold">{data.workout.workout_type}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${data.workout.intensity === 'high' ? 'bg-red-500/30 text-red-200' :
                                    data.workout.intensity === 'moderate' ? 'bg-yellow-500/30 text-yellow-200' :
                                        'bg-green-500/30 text-green-200'
                                }`}>
                                {data.workout.intensity}
                            </span>
                        </div>

                        <p className="text-gray-200 text-sm mb-4 italic">{data.workout.reasoning}</p>

                        <div className="flex gap-4 text-sm text-gray-300 mb-4">
                            <div>⏱️ {data.workout.duration_minutes} min</div>
                            <div>💪 {data.workout.exercises?.length || 0} exercises</div>
                        </div>

                        {/* Exercise List with Swap Buttons */}
                        {data.workout.exercises && data.workout.exercises.length > 0 && (
                            <div className="space-y-2 mb-4">
                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Exercises</p>
                                {data.workout.exercises.map((exercise, idx) => {
                                    const displayName = swappedExercises[exercise.name] || exercise.name;
                                    const wasSwapped = swappedExercises[exercise.name];

                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="text-white font-medium">
                                                    {wasSwapped && <span className="text-blue-400 text-xs mr-2">↻</span>}
                                                    {displayName}
                                                </div>
                                                <div className="text-gray-400 text-xs">
                                                    {exercise.sets} sets × {exercise.reps} reps
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSwapExercise(exercise.name)}
                                                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white transition"
                                            >
                                                🔄 Swap
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                    <motion.button
                        onClick={handleStartWorkout}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-white font-bold text-lg transition shadow-lg"
                        whileTap={{ scale: 0.98 }}
                    >
                        Start Workout
                    </motion.button>

                    {data.canRegenerate && (
                        <motion.button
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-2xl text-white font-semibold transition flex items-center justify-center gap-2"
                            whileTap={{ scale: 0.98 }}
                        >
                            {regenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    🔄 {regenerateCount >= 3 ? 'Tell me what you want' : 'Regenerate Workout'}
                                </>
                            )}
                        </motion.button>
                    )}
                </div>

                {regenerateCount > 0 && regenerateCount < 3 && (
                    <p className="text-center text-xs text-gray-400 mt-3">
                        {regenerateCount}/3 regenerations
                    </p>
                )}
            </div>

            {/* Alternatives Modal */}
            <AlternativesModal
                isOpen={swapModalOpen}
                onClose={() => setSwapModalOpen(false)}
                originalExercise={currentExercise}
                alternatives={alternatives}
                onSelect={handleSelectAlternative}
            />
        </>
    );
}
