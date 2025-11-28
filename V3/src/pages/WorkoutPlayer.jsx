import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { progressiveOverload } from '../services/ProgressiveOverload';
import { useUser } from '../context/UserContext';

export default function WorkoutPlayer({ workout, onComplete, onExit }) {
    const { user, updateUser } = useUser();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [restTimeLeft, setRestTimeLeft] = useState(0);
    const [setNumber, setSetNumber] = useState(1);
    const [exercisePerformance, setExercisePerformance] = useState({});
    const [showRPESelector, setShowRPESelector] = useState(false);
    const [selectedRPE, setSelectedRPE] = useState(null);

    const exercises = workout.exercises || [];
    const currentExercise = exercises[currentExerciseIndex];
    const isLastExercise = currentExerciseIndex === exercises.length - 1;
    const isLastSet = setNumber === currentExercise?.sets;

    // Rest timer
    useEffect(() => {
        if (isResting && restTimeLeft > 0) {
            const timer = setTimeout(() => {
                setRestTimeLeft(restTimeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isResting && restTimeLeft === 0) {
            setIsResting(false);
        }
    }, [isResting, restTimeLeft]);

    const handleSetComplete = () => {
        if (isLastSet) {
            // Show RPE selector for this exercise
            setShowRPESelector(true);
        } else {
            // Start rest period
            setIsResting(true);
            setRestTimeLeft(currentExercise.rest_seconds || 60);
            setSetNumber(setNumber + 1);
        }
    };

    const handleRPESelect = (rpe) => {
        setSelectedRPE(rpe);

        // Record performance
        const performance = {
            exerciseName: currentExercise.name,
            weight: currentExercise.weight || 0,
            reps: currentExercise.reps,
            sets: currentExercise.sets,
            rpe,
            completed: true,
            date: new Date().toISOString().split('T')[0]
        };

        // Store performance
        setExercisePerformance(prev => ({
            ...prev,
            [currentExercise.name]: performance
        }));

        // Record in progressive overload system
        progressiveOverload.recordPerformance(currentExercise.name, performance);

        // Move to next exercise or finish
        if (isLastExercise) {
            handleWorkoutComplete();
        } else {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setSetNumber(1);
            setShowRPESelector(false);
            setSelectedRPE(null);
        }
    };

    const handleWorkoutComplete = () => {
        // Save workout to user data
        const workoutRecord = {
            ...workout,
            performance: exercisePerformance,
            completedAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };

        const workouts = user.workouts || [];
        workouts.unshift(workoutRecord);

        updateUser({ workouts });

        // Notify parent
        onComplete(workoutRecord);
    };

    const handleSkipExercise = () => {
        if (isLastExercise) {
            handleWorkoutComplete();
        } else {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setSetNumber(1);
            setShowRPESelector(false);
        }
    };

    if (!currentExercise) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white">No exercises in workout</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Dimmed Background for Gym Mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

            <div className="relative z-10 min-h-screen flex flex-col p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={onExit}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
                    >
                        ← Exit
                    </button>
                    <div className="text-white text-sm">
                        Exercise {currentExerciseIndex + 1} of {exercises.length}
                    </div>
                </div>

                {/* Exercise Info */}
                <div className="glass-card-prominent p-6 mb-6">
                    <h2 className="text-3xl font-heading text-white mb-2">
                        {currentExercise.name}
                    </h2>
                    <div className="flex gap-4 text-gray-300">
                        <div>Set {setNumber} of {currentExercise.sets}</div>
                        <div>•</div>
                        <div>{currentExercise.reps} reps</div>
                        {currentExercise.weight && (
                            <>
                                <div>•</div>
                                <div>{currentExercise.weight}kg</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isResting ? (
                            /* Rest Timer */
                            <motion.div
                                key="rest"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center"
                            >
                                <div className="text-gray-400 text-lg mb-4">Rest</div>
                                <motion.div
                                    key={restTimeLeft}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="text-9xl font-bold text-white mb-8"
                                >
                                    {restTimeLeft}
                                </motion.div>
                                <button
                                    onClick={() => {
                                        setIsResting(false);
                                        setRestTimeLeft(0);
                                    }}
                                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
                                >
                                    Skip Rest
                                </button>
                            </motion.div>
                        ) : showRPESelector ? (
                            /* RPE Selector */
                            <motion.div
                                key="rpe"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-md"
                            >
                                <div className="glass-card-prominent p-8">
                                    <h3 className="text-2xl font-heading text-white mb-2">
                                        How hard was that?
                                    </h3>
                                    <p className="text-gray-300 mb-6">Rate of Perceived Exertion (RPE)</p>

                                    <div className="grid grid-cols-5 gap-3 mb-4">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rpe) => (
                                            <motion.button
                                                key={rpe}
                                                onClick={() => handleRPESelect(rpe)}
                                                className={`
                          aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition
                          ${selectedRPE === rpe
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110'
                                                        : rpe <= 3
                                                            ? 'bg-green-500/30 text-green-200 hover:bg-green-500/40'
                                                            : rpe <= 7
                                                                ? 'bg-yellow-500/30 text-yellow-200 hover:bg-yellow-500/40'
                                                                : 'bg-red-500/30 text-red-200 hover:bg-red-500/40'
                                                    }
                        `}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {rpe}
                                            </motion.button>
                                        ))}
                                    </div>

                                    <div className="text-xs text-gray-400 space-y-1">
                                        <div>1-3: Very Easy</div>
                                        <div>4-6: Moderate</div>
                                        <div>7-8: Hard (optimal for growth)</div>
                                        <div>9-10: Very Hard / Failure</div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* Set Tracker */
                            <motion.div
                                key="set"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center"
                            >
                                <div className="text-8xl font-bold text-white mb-8">
                                    {currentExercise.reps}
                                </div>
                                <div className="text-gray-400 text-xl mb-12">reps</div>

                                <motion.button
                                    onClick={handleSetComplete}
                                    className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-white font-bold text-2xl transition shadow-lg"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLastSet ? 'Complete Exercise' : 'Complete Set'}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Actions */}
                {!isResting && !showRPESelector && (
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleSkipExercise}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
                        >
                            Skip Exercise
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
