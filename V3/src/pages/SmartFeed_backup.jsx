import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { AIOrchestrator } from '../services/AIOrchestrator';
import Card from '../components/Card';
import WorkoutPlayer from './WorkoutPlayer';
import AuraBackground from '../components/AuraBackground';

export default function SmartFeed() {
    const { user, currentCard, processAIDecision, getMemoryContext, completeDay } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeWorkout, setActiveWorkout] = useState(null);

    // Load initial card from AI Orchestrator
    useEffect(() => {
        if (!activeWorkout) {
            loadNextCard();
        }
    }, [activeWorkout]);

    const loadNextCard = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const memory = getMemoryContext();
            const cardDecision = await AIOrchestrator.getNextCard(user, memory);

            processAIDecision(cardDecision);
            setIsLoading(false);
        } catch (err) {
            console.error('Error loading card:', err);
            setError('Failed to load content. Please refresh.');
            setIsLoading(false);
        }
    };

    // Handle card action completion
    const handleCardAction = async (action, data) => {
        console.log('Card action:', action, data);

        if (action === 'start_workout') {
            setActiveWorkout(data.workout);
            return;
        }

        if (action === 'day_completed') {
            completeDay(data.stats);
        }

        await loadNextCard();
    };

    const handleWorkoutComplete = (workoutRecord) => {
        console.log('Workout completed:', workoutRecord);
        setActiveWorkout(null);
    };

    const handleWorkoutExit = () => {
        setActiveWorkout(null);
    };

    // Show workout player if active
    if (activeWorkout) {
        return (
            <WorkoutPlayer
                workout={activeWorkout}
                onComplete={handleWorkoutComplete}
                onExit={handleWorkoutExit}
            />
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-heading text-white mb-4">Welcome to StayFit Lite V2</h2>
                    <p className="text-gray-300">Please complete onboarding to continue</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Aura Background */}
            <AuraBackground />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Status Pills - Top */}
                <div className="p-4 flex gap-3 justify-center">
                    <div className="glass-card px-4 py-2 rounded-full">
                        <span className="text-xs text-gray-200">Recovery: <span className="font-semibold text-white">{user.recoveryScore || 0}</span></span>
                    </div>
                    <div className="glass-card px-4 py-2 rounded-full">
                        <span className="text-xs text-gray-200">Hydration: <span className="font-semibold text-white">{user.hydrationToday || 0}/8</span></span>
                    </div>
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
                </div>

                {/* Navigation hint - Bottom */}
                <div className="p-4 text-center">
                    <p className="text-white/60 text-sm">AI-powered personalized experience</p>
                </div>
            </div>
        </div>
    );
}
