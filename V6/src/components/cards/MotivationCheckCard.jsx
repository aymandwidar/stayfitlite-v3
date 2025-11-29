import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MotivationCheckCard({ data, onAction }) {
    const [selected, setSelected] = useState(null);

    const levels = [
        { emoji: '🔥', label: 'High', value: 'high' },
        { emoji: '😐', label: 'Medium', value: 'medium' },
        { emoji: '😴', label: 'Low', value: 'low' }
    ];

    const handleSelect = (value) => {
        setSelected(value);
        setTimeout(() => {
            onAction('log_motivation', { level: value });
        }, 500);
    };

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
            <p className="text-gray-300 mb-8">{data.question}</p>

            <div className="flex justify-center gap-4">
                {levels.map((level) => (
                    <motion.button
                        key={level.value}
                        onClick={() => handleSelect(level.value)}
                        className={`
                            flex flex-col items-center justify-center w-24 h-24 rounded-2xl transition-all
                            ${selected === level.value
                                ? 'bg-cyan-400/20 border border-cyan-400 scale-110'
                                : 'bg-white/5 hover:bg-white/10 border border-transparent'}
                        `}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-4xl mb-2">{level.emoji}</span>
                        <span className={`text-sm font-medium ${selected === level.value ? 'text-cyan-400' : 'text-gray-400'}`}>
                            {level.label}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
