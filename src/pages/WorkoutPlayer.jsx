import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipForward, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceCoach } from '../utils/VoiceCoach';

export default function WorkoutPlayer({ workout, onComplete, onExit }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const currentExercise = workout.exercises[currentIndex];
    const timerRef = useRef(null);

    // Announce exercise or rest
    useEffect(() => {
        if (!soundEnabled) return;

        if (isFinished) {
            VoiceCoach.speak("Workout complete! Great job.");
        } else if (isResting) {
            VoiceCoach.speak(`Rest for ${timeLeft} seconds.`);
        } else {
            const ex = workout.exercises[currentIndex];
            VoiceCoach.speak(`Next up, ${ex.details.name}. ${ex.duration ? `${ex.duration} seconds` : `${ex.sets} sets of ${ex.reps} reps`}. Go!`);
        }
    }, [currentIndex, isResting, isFinished, soundEnabled]);

    // Initialize timer for duration exercises
    useEffect(() => {
        if (currentExercise.duration && !isResting) {
            setTimeLeft(currentExercise.duration);
            setIsActive(true);
        } else if (!currentExercise.duration && !isResting) {
            setIsActive(false); // Manual completion for reps
        }
    }, [currentIndex, isResting, currentExercise]);

    // Timer Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 4 && prev > 1 && soundEnabled) {
                        VoiceCoach.speak((prev - 1).toString());
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            handleTimerComplete();
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, soundEnabled]);

    const handleTimerComplete = () => {
        setIsActive(false);
        if (isResting) {
            // Rest finished, start next exercise
            setIsResting(false);
            setCurrentIndex((prev) => prev + 1);
        } else {
            // Exercise finished, start rest (if not last)
            if (currentIndex < workout.exercises.length - 1) {
                setIsResting(true);
                setTimeLeft(currentExercise.rest || 30);
                setIsActive(true);
            } else {
                finishWorkout();
            }
        }
    };

    const handleManualComplete = () => {
        if (isResting) {
            handleTimerComplete(); // Skip rest
        } else {
            // Finished reps
            if (currentIndex < workout.exercises.length - 1) {
                setIsResting(true);
                setTimeLeft(currentExercise.rest || 30);
                setIsActive(true);
            } else {
                finishWorkout();
            }
        }
    };

    const finishWorkout = () => {
        setIsFinished(true);
        // Play sound?
    };

    const togglePause = () => {
        setIsActive(!isActive);
    };

    if (isFinished) {
        return (
            <div className="min-h-screen bg-darker flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle className="w-12 h-12 text-darker" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Workout Complete!</h2>
                <p className="text-slate-400 mb-8">You crushed it. Great job!</p>
                <button
                    onClick={onComplete}
                    className="px-8 py-3 bg-primary text-darker font-bold rounded-full hover:bg-primary/90"
                >
                    Finish & Save
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative z-20">
            {/* Header */}
            <div className="p-6 flex justify-between items-center">
                <button onClick={onExit} className="p-3 glass rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <div className="text-sm font-bold text-slate-400 glass px-4 py-2 rounded-full">
                    {currentIndex + 1} / {workout.exercises.length}
                </div>
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 glass rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isResting ? 'rest' : currentIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="text-center w-full max-w-md"
                    >
                        {isResting ? (
                            <div className="glass-card p-10 rounded-[40px] border-primary/20 shadow-[0_0_50px_rgba(0,242,234,0.1)]">
                                <div className="text-primary font-bold text-2xl mb-6 uppercase tracking-widest">Rest</div>
                                <div className="text-9xl font-black mb-8 font-mono text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    {timeLeft}
                                </div>
                                <div className="text-slate-400 font-medium">Up Next: <span className="text-white">{workout.exercises[currentIndex + 1]?.details.name}</span></div>
                            </div>
                        ) : (
                            <div className="glass-card p-10 rounded-[40px] border-white/10">
                                <div className="text-slate-400 text-sm font-bold mb-4 uppercase tracking-widest bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5">
                                    {currentExercise.details.type}
                                </div>
                                <h2 className="text-4xl font-black mb-10 text-white leading-tight">{currentExercise.details.name}</h2>

                                {currentExercise.duration ? (
                                    <div className="text-9xl font-black mb-8 font-mono text-primary drop-shadow-[0_0_30px_rgba(0,242,234,0.4)]">
                                        {timeLeft}
                                    </div>
                                ) : (
                                    <div className="flex justify-center gap-8 mb-4">
                                        <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5 min-w-[120px]">
                                            <div className="text-6xl font-black text-white mb-2">{currentExercise.sets}</div>
                                            <div className="text-slate-500 uppercase text-xs font-bold tracking-widest">Sets</div>
                                        </div>
                                        <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5 min-w-[120px]">
                                            <div className="text-6xl font-black text-white mb-2">{currentExercise.reps}</div>
                                            <div className="text-slate-500 uppercase text-xs font-bold tracking-widest">Reps</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="p-8 pb-12">
                <div className="flex justify-center gap-6 items-center">
                    {(currentExercise.duration || isResting) && (
                        <button
                            onClick={togglePause}
                            className="w-20 h-20 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 border border-white/20"
                        >
                            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </button>
                    )}

                    <button
                        onClick={handleManualComplete}
                        className="h-20 px-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl flex items-center gap-3 hover:shadow-[0_0_40px_rgba(0,242,234,0.3)] transition-all active:scale-95"
                    >
                        {isResting ? 'Skip Rest' : 'Done'} <SkipForward className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
