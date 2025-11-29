import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import VoiceInput from '../VoiceInput';

export default function SleepCheckCard({ data, onAction }) {
    const { logSleep } = useUser();
    const [selected, setSelected] = useState(null);

    const icons = ['☁️', '🌙', '😐', '🌙', '⭐'];
    const labels = ['Very Poor', 'Poor', 'Neutral', 'Well', 'Very Well'];

    const handleSelect = async (index) => {
        setSelected(index);

        // Log to user context
        const quality = labels[index];
        logSleep(quality);

        // Trigger next card with slight delay for feedback
        setTimeout(() => {
            onAction('sleep_logged', { quality, value: index + 1 });
        }, 600);
    };

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto">
            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-2">{data.title}</h2>
            <p className="text-lg text-gray-300 mb-8">{data.question}</p>

            {/* Sleep Quality Selector */}
            <div className="space-y-6">
                {/* Icons Row */}
                <div className="flex justify-between items-center gap-2">
                    {icons.map((icon, index) => (
                        <motion.button
                            key={index}
                            onClick={() => handleSelect(index)}
                            className={`
                flex flex-col items-center justify-center
                w-16 h-16 rounded-2xl transition-all
                ${selected === index
                                    ? 'bg-cyan-400/20 border border-cyan-400 scale-110'
                                    : 'bg-white/5 hover:bg-white/10 hover:scale-105 border border-transparent'}
              `}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-3xl">{icon}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Labels Row */}
                <div className="flex justify-between gap-2">
                    {labels.map((label, index) => (
                        <div
                            key={index}
                            className={`
                text-center text-xs flex-1
                ${selected === index ? 'text-cyan-400 font-bold' : 'text-gray-400'}
              `}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* Visual Slider Track */}
                <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                    {selected !== null && (
                        <motion.div
                            className="absolute left-0 top-0 h-full bg-cyan-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((selected + 1) / 5) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </div>
            </div>

            {/* Voice/Text Input */}
            <div className="mt-8">
                <VoiceInput onInput={(text) => {
                    if (text.toLowerCase().includes('good') || text.toLowerCase().includes('well')) handleSelect(3);
                    else if (text.toLowerCase().includes('bad') || text.toLowerCase().includes('poor')) handleSelect(1);
                }} />
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex gap-3 flex-wrap justify-center">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-400 hover:text-white transition border border-white/5">
                    [Tell me more]
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-400 hover:text-white transition border border-white/5">
                    [Skip question]
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-400 hover:text-white transition border border-white/5">
                    [Set a reminder]
                </button>
            </div>
        </div>
    );
}
