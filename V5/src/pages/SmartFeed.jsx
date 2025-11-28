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
            setError('Failed to load content. Please refresh.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNextCard();
    }, []);

    const handleCardAction = async (action, value) => {

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
                const stats = {
                    duration: value.duration || 30,
                    calories: value.calories || 200,
                    exercises: value.exercises?.length || 0
                };
                completeDay(stats);
                await loadNextCard();
            } else if (action === 'dismiss' || action === 'next') {
                await loadNextCard();
            } else {
                await loadNextCard();
            }
        } catch (err) {
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
        <div className="min-h-screen flex flex-col text-white relative pb-24 safe-top" style={{
            background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)'
        }}>
            {/* Header */}
            <div className="px-6 pt-8 pb-4">
                <h1 className="text-3xl font-bold text-white mb-1">Smart Feed</h1>
                <p className="text-cyan-400 text-sm">AI-powered personalized experience</p>
            </div>

            {/* Top Status Bar */}
            <div className="flex justify-between items-center px-4 pb-4 gap-2">
                <div className="glass-card px-3 py-2 rounded-full flex-1">
                    <span className="text-xs text-gray-300">Recovery: <span className={`font-semibold ${user.recoveryScore >= 70 ? 'text-cyan-400' : user.recoveryScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{user.recoveryScore || 0}</span></span>
                </div>
                <button
                    onClick={() => addHydration(1)}
                    className="glass-card px-3 py-2 rounded-full hover:border-cyan-400 transition active:scale-95 cursor-pointer flex-1"
                >
                    <span className="text-xs text-gray-300">💧 <span className="font-semibold text-cyan-400">{user.hydrationToday || 0}/8</span></span>
                </button>
                <button
                    onClick={() => logMeal('snack', true)}
                    className="glass-card px-3 py-2 rounded-full hover:border-cyan-400 transition active:scale-95 cursor-pointer flex-1"
                >
                    <span className="text-xs text-gray-300">🍽️ <span className="font-semibold text-cyan-400">{Object.keys(user.meals || {}).length}</span></span>
                </button>
            </div>

            {/* Card Area - Center */}
            <div className="flex-1 flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">AI is thinking...</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card-prominent p-8 text-center max-w-md"
                        >
                            <p className="text-red-400 mb-4">{error}</p>
                            <button
                                onClick={loadNextCard}
                                className="btn-primary"
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
            </div>

            {/* Bottom Actions */}
            <div className="p-4 text-center space-y-3">
                <button
                    onClick={() => setShowLogModal(true)}
                    className="btn-secondary w-full max-w-md mx-auto flex items-center justify-center gap-2"
                >
                    <span>➕</span> Log Daily Stats
                </button>
            </div>

            {/* Daily Log Modal */}
            <DailyLogModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} />
        </div>
    );
}
