import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function AlternativesModal({ isOpen, onClose, originalExercise, alternatives, onSelect }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleSelect = (alternative, index) => {
        setSelectedIndex(index);
        setTimeout(() => {
            onSelect(alternative);
            onClose();
            setSelectedIndex(null);
        }, 400);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card-prominent p-6 max-w-lg w-full relative z-10"
                >
                    {/* Header */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-heading text-white mb-2">
                            Swap "{originalExercise}"
                        </h3>
                        <p className="text-gray-300">Choose an alternative that targets the same muscles</p>
                    </div>

                    {/* Alternatives */}
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                        {alternatives && alternatives.length > 0 ? (
                            alternatives.map((alt, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleSelect(alt, index)}
                                    className={`
                    w-full p-4 rounded-xl text-left transition-all
                    ${selectedIndex === index
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-105'
                                            : 'bg-white/10 hover:bg-white/20'}
                  `}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-white font-semibold text-lg mb-1">
                                                {alt.name}
                                            </h4>
                                            <p className="text-gray-300 text-sm mb-2">
                                                {alt.description || `Targets ${alt.muscles?.join(', ')}`}
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                {alt.equipment?.map((eq, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-200"
                                                    >
                                                        {eq}
                                                    </span>
                                                ))}
                                                <span className={`px-2 py-1 rounded-full text-xs ${alt.difficulty === 'beginner' ? 'bg-green-500/30 text-green-200' :
                                                        alt.difficulty === 'intermediate' ? 'bg-yellow-500/30 text-yellow-200' :
                                                            'bg-red-500/30 text-red-200'
                                                    }`}>
                                                    {alt.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {selectedIndex === index && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center flex-shrink-0"
                                            >
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.button>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">No alternatives found</p>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
                    >
                        Cancel
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
