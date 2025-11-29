import { motion, AnimatePresence } from 'framer-motion';
import MoodTracker from './MoodTracker';
import DailyGoalBanner from './DailyGoalBanner';

export default function DailyLogModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md glass-card-prominent rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-heading text-white">Daily Log</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 overflow-y-auto space-y-6">
                            <section>
                                <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">Mood & Energy</h3>
                                <MoodTracker />
                            </section>

                            <section>
                                <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">Daily Goal</h3>
                                <DailyGoalBanner />
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold transition shadow-lg"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
