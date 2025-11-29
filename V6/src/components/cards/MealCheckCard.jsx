import { motion } from 'framer-motion';

export default function MealCheckCard({ data, onAction }) {
    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
            <p className="text-gray-300 mb-8">{data.question}</p>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onAction('log_meal', { type: 'healthy' })}
                    className="p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl transition group"
                >
                    <div className="text-2xl mb-1">🥗</div>
                    <div className="text-green-400 font-medium">Healthy</div>
                </button>
                <button
                    onClick={() => onAction('log_meal', { type: 'balanced' })}
                    className="p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition"
                >
                    <div className="text-2xl mb-1">🍱</div>
                    <div className="text-blue-400 font-medium">Balanced</div>
                </button>
                <button
                    onClick={() => onAction('log_meal', { type: 'indulgent' })}
                    className="p-4 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl transition"
                >
                    <div className="text-2xl mb-1">🍔</div>
                    <div className="text-yellow-400 font-medium">Indulgent</div>
                </button>
                <button
                    onClick={() => onAction('skip_meal')}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition"
                >
                    <div className="text-2xl mb-1">⏭️</div>
                    <div className="text-gray-400 font-medium">Skip</div>
                </button>
            </div>
        </div>
    );
}
