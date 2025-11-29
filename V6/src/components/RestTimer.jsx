import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RestTimer({ duration = 90, onComplete, onSkip }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    onComplete?.();
                    // Play notification sound
                    if ('vibrate' in navigator) {
                        navigator.vibrate([200, 100, 200]);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft, onComplete]);

    const progress = (timeLeft / duration) * 100;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const addTime = (amount) => {
        setTimeLeft(prev => prev + amount);
        setIsRunning(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-prominent p-6 text-center"
        >
            <p className="text-sm text-gray-300 mb-4">Rest Timer</p>

            {/* Circular Progress */}
            <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#06b6d4"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2 justify-center">
                <button
                    onClick={onSkip}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-xl text-white font-medium transition"
                >
                    Skip Rest
                </button>
                <button
                    onClick={() => addTime(30)}
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-xl text-white font-medium transition"
                >
                    +30s
                </button>
            </div>
        </motion.div>
    );
}
