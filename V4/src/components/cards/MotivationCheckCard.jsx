import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

export default function MotivationCheckCard({ data, onAction }) {
    const { logMotivation } = useUser();
    const [selected, setSelected] = useState(null);

    const handleSelect = async (option) => {
        setSelected(option.value);

        // Log to user context
        logMotivation(option.value);

        // Trigger next card
        setTimeout(() => {
            onAction('motivation_logged', { level: option.value });
        }, 600);
    };

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto">
            {/* Title */}
            <h2 className="text-2xl font-heading text-white mb-2">{data.title}</h2>
            <p className="text-lg text-gray-200 mb-8">{data.question}</p>

            {/* 3-Point Emoji Selector */}
            <div className="space-y-4">
                {data.options.map((option, index) => (
                    <motion.button
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={`
              w-full p-6 rounded-2xl flex items-center gap-4 transition-all
              ${selected === option.value
                                ? 'bg-white/30 scale-105'
                                : 'bg-white/10 hover:bg-white/20'}
            `}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-5xl">{option.emoji}</span>
                        <div className="flex-1 text-left">
                            <div className="text-white font-semibold text-lg">{option.label}</div>
                        </div>
                        {selected === option.value && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Info */}
            <p className="mt-6 text-center text-sm text-gray-300 italic">
                Your mental state affects today's plan as much as your physical recovery
            </p>
        </div>
    );
}
