import { motion } from 'framer-motion';

export default function DaySummaryCard({ data, onAction }) {
    const { stats, tomorrowPreview } = data;

    const handleFinishDay = () => {
        onAction('day_completed', { stats });
    };

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto">
            {/* Title */}
            <h2 className="text-3xl font-heading text-white mb-6">{data.title}</h2>

            {/* Today's Stats */}
            <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/10 rounded-xl flex items-center justify-between">
                    <span className="text-gray-200">Workouts Completed</span>
                    <span className="text-white font-bold text-2xl">{stats.workoutsCompleted}</span>
                </div>

                <div className="p-4 bg-white/10 rounded-xl flex items-center justify-between">
                    <span className="text-gray-200">Meals Logged</span>
                    <span className="text-white font-bold text-2xl">{stats.mealsLogged}</span>
                </div>

                <div className="p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-200">Hydration</span>
                        <span className="text-white font-bold text-2xl">{stats.hydrationGlasses}/{stats.hydrationGoal}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                            style={{ width: `${(stats.hydrationGlasses / stats.hydrationGoal) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="p-4 bg-white/10 rounded-xl flex items-center justify-between">
                    <span className="text-gray-200">Recovery Score</span>
                    <span className={`font-bold text-2xl ${stats.recoveryScore >= 70 ? 'text-green-400' :
                            stats.recoveryScore >= 40 ? 'text-yellow-400' :
                                'text-red-400'
                        }`}>
                        {stats.recoveryScore}
                    </span>
                </div>
            </div>

            {/* Tomorrow Preview */}
            {tomorrowPreview && (
                <div className="p-4 bg-purple-500/20 border border-purple-500/50 rounded-xl mb-6">
                    <p className="text-purple-100 font-semibold mb-1">Tomorrow's Plan</p>
                    <p className="text-purple-200 text-sm">{tomorrowPreview.suggestedActivity}</p>
                </div>
            )}

            {/* Finish Day Button */}
            <motion.button
                onClick={handleFinishDay}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-2xl text-white font-bold text-lg transition shadow-lg"
                whileTap={{ scale: 0.98 }}
            >
                Finish Day
            </motion.button>
        </div>
    );
}
