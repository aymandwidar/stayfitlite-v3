import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

export default function StressCheckCard({ data, onAction }) {
    const { logStress } = useUser();
    const [selected, setSelected] = useState(null);

    const handleSelect = async (option) => {
        setSelected(option.value);

        // Log to user context
        logStress(option.value);

        // Trigger next card
        setTimeout(() => {
            onAction('stress_logged', { level: option.value });
        }, 600);
    };

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto">
            {/* Title */}
            <h2 className="text-2xl font-heading text-white mb-2">{data.title}</h2>
            <p className="text-lg text-gray-200 mb-8">{data.question}</p>

            {/* 5-Point Stress Scale */}
            <div className="flex justify-between items-center gap-3 mb-6">
                {data.options.map((option) => (
                    <motion.button
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={`
              flex flex-col items-center gap-2 p-3 rounded-xl transition-all
              ${selected === option.value
                                ? 'bg-white/30 scale-110'
                                : 'bg-white/0 hover:bg-white/10'}
            `}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span className="text-4xl">{option.emoji}</span>
                        <span className={`
              text-xs text-center leading-tight
              ${selected === option.value ? 'text-white font-semibold' : 'text-gray-300'}
            `}>
                            {option.label.split('(')[0].trim()}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Selected Feedback */}
            {selected !== null && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/10 rounded-xl"
                >
                    <p className="text-white text-center">
                        {selected >= 4
                            ? '⚠️ High stress detected - I\'ll suggest gentler activities today'
                            : selected <= 2
                                ? '✨ Great! You\'re in a good headspace for training'
                                : 'Got it - I\'ll keep this in mind for today\'s plan'}
                    </p>
                </motion.div>
            )}

            {/* Info */}
            <p className="mt-6 text-center text-sm text-gray-300 italic">
                High stress means we avoid intense workouts and focus on stress relief
            </p>
        </div>
    );
}
