import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { AIOrchestrator } from '../services/AIOrchestrator';
import Card from '../components/Card';
import WorkoutPlayer from './WorkoutPlayer';
import DailyLogModal from '../components/DailyLogModal';

export default function SmartFeed() {
    const { user, currentCard, processAIDecision, getMemoryContext, completeDay, addHydration, logMeal, logSleep, logMotivation, logStress } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [showLogModal, setShowLogModal] = useState(false);

    const loadNextCard = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const memory = getMemoryContext();

            // Add timeout to prevent hanging (8 seconds)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('AI Request Timed Out')), 8000)
            );

            const cardDecision = await Promise.race([
                AIOrchestrator.getNextCard(user, memory),
                timeoutPromise
            ]);

            processAIDecision(cardDecision);
            setIsLoading(false);
        } catch (err) {
            console.error('Error loading card:', err);
            setError('Failed to load content. Please refresh.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNextCard();
    }, []);

    const handleCardAction = async (action, value) => {
        console.log('Card action:', action, value);

        try {
            if (action === 'log_sleep') {
                logSleep(value);
                await loadNextCard();
            } else if (action === 'log_motivation') {
                logMotivation(value);
                await loadNextCard();
            } else if (action === 'log_stress') {
                logStress(value);
                await loadNextCard();
            } else if (action === 'start_workout') {
                setActiveWorkout(value);
            } else if (action === 'complete_workout') {
                // Logic to complete workout
                const stats = {
                    duration: value.duration || 30,
                    calories: value.calories || 200,
                    exercises: value.exercises?.length || 0
                };
                completeDay(stats); // This might be too aggressive, but for now it works
                await loadNextCard();
            } else if (action === 'dismiss' || action === 'next') {
                await loadNextCard();
            } else {
                // Default fallback
                await loadNextCard();
            }
        } catch (err) {
            console.error('Error handling action:', err);
            setError('Failed to process action. Please try again.');
        }
    };

    if (activeWorkout) {
        return (
            <WorkoutPlayer
                workout={activeWorkout}
                onComplete={(stats) => {
                    setActiveWorkout(null);
                    handleCardAction('complete_workout', stats);
                }}
                onClose={() => setActiveWorkout(null)}
            />
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 text-white relative pb-24 mb-20 pt-14">
            {/* Top Status Bar */}
            <div className="flex justify-between items-center p-4 z-10">
                <div className="glass-card px-4 py-2 rounded-full">
                    <span className="text-xs text-gray-200">Recovery: <span className={`font-semibold ${user.recoveryScore >= 70 ? 'text-green-400' : user.recoveryScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{user.recoveryScore || 0}</span></span>
                </div>
                <button
                    onClick={() => addHydration(1)}
                    className="glass-card px-4 py-2 rounded-full hover:bg-white/20 transition active:scale-95 cursor-pointer"
                >
                    <span className="text-xs text-gray-200">💧 Hydration: <span className="font-semibold text-blue-400">{user.hydrationToday || 0}/8</span></span>
                </button>
                <button
                    onClick={() => logMeal('snack', true)}
                    className="glass-card px-4 py-2 rounded-full hover:bg-white/20 transition active:scale-95 cursor-pointer"
                >
                    <span className="text-xs text-gray-200">🍽️ Meals: <span className="font-semibold text-green-400">{Object.keys(user.meals || {}).length}</span></span>
                </button>
            </div>

            {/* Card Area - Center */}
            < div className="flex-1 flex items-center justify-center p-4" >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white/80">AI is thinking...</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-8 text-center"
                        >
                            <p className="text-red-300 mb-4">{error}</p>
                            <button
                                onClick={loadNextCard}
                                className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
                            >
                                Retry
                            </button>
                        </motion.div>
                    ) : currentCard ? (
                        <motion.div
                            key={currentCard.cardType}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="w-full max-w-md"
                        >
                            <Card
                                cardType={currentCard.cardType}
                                data={currentCard.data}
                                timeContext={currentCard.timeContext}
                                onAction={handleCardAction}
                            />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div >

            {/* Navigation hint & Log Button - Bottom */}
            < div className="p-4 text-center space-y-4" >
                <button
                    onClick={() => setShowLogModal(true)}
                    className="px-6 py-3 glass-card-prominent rounded-full text-white font-semibold hover:bg-white/20 transition flex items-center gap-2 mx-auto"
                >
                    <span>➕</span> Log Daily Stats
                </button>
                <p className="text-white/60 text-sm">AI-powered personalized experience</p>
            </div >

            {/* Daily Log Modal */}
            < DailyLogModal isOpen={showLogModal} onClose={() => setShowLogModal(false)
            } />
        </div >
    );
}
