import { motion } from 'framer-motion';

export default function DaySummaryCard({ data, onAction }) {
    const { stats, insight } = data;

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Day Complete! 🎉</h2>
            <p className="text-gray-300 mb-6">Here's your daily summary</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-2xl font-bold text-white">{stats.calories || 0}</div>
                    <div className="text-xs text-gray-400">Calories Burned</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-2xl mb-1">⏱️</div>
                    <div className="text-2xl font-bold text-white">{stats.duration || 0}m</div>
                    <div className="text-xs text-gray-400">Active Minutes</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-2xl mb-1">💧</div>
                    <div className="text-2xl font-bold text-white">{stats.hydration || 0}</div>
                    <div className="text-xs text-gray-400">Cups Water</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-2xl mb-1">😴</div>
                    <div className="text-2xl font-bold text-white">{stats.sleep || '-'}</div>
                    <div className="text-xs text-gray-400">Sleep Quality</div>
                </div>
            </div>

            {/* AI Insight */}
            {insight && (
                <div className="mb-6 p-4 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-400/20 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">AI Insight</span>
                    </div>
                    <p className="text-white font-medium mb-1">{insight.insightText}</p>
                    <p className="text-gray-400 text-sm">{insight.nextDayDetail}</p>
                </div>
            )}

            <button
                onClick={() => onAction('finish_day')}
                className="btn-primary w-full"
            >
                Finish Day
            </button>
        </div>
    );
}
