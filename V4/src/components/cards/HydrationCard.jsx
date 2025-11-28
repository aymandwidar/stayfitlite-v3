import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

export default function HydrationCard({ data, onAction }) {
    const { addHydration, user } = useUser();
    const [count, setCount] = useState(data.currentValue || 0);

    const handleChange = (delta) => {
        const newCount = Math.max(0, Math.min(12, count + delta));
        setCount(newCount);

        if (delta > 0) {
            addHydration(delta);
        }
    };

    const handleContinue = () => {
        onAction('hydration_updated', { count });
    };

    const progress = (count / (data.goal || 8)) * 100;

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto">
            {/* Title */}
            <h2 className="text-2xl font-heading text-white mb-2">{data.title}</h2>
            <p className="text-lg text-gray-200 mb-8">{data.question}</p>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-white font-semibold text-3xl">{count}</span>
                    <span className="text-gray-300"
                    >/ {data.goal} glasses</span>
                </div>

                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>

                {count >= data.goal && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mt-3 text-green-300 font-semibold"
                    >
                        🎉 Goal reached! Great job!
                    </motion.p>
                )}
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
                <motion.button
                    onClick={() => handleChange(-1)}
                    disabled={count === 0}
                    className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:hover:bg-white/20 flex items-center justify-center text-white text-2xl font-bold transition"
                    whileTap={{ scale: 0.9 }}
                >
                    −
                </motion.button>

                <div className="w-24 text-center">
                    <motion.div
                        key={count}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl"
                    >
                        💧
                    </motion.div>
                </div>

                <motion.button
                    onClick={() => handleChange(1)}
                    className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-2xl font-bold transition"
                    whileTap={{ scale: 0.9 }}
                >
                    +
                </motion.button>
            </div>

            {/* Continue Button */}
            <motion.button
                onClick={handleContinue}
                className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl text-white font-semibold text-lg transition"
                whileTap={{ scale: 0.98 }}
            >
                Continue
            </motion.button>
        </div>
    );
}
