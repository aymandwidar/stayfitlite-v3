import { motion } from 'framer-motion';

export default function HydrationCard({ data, onAction }) {
    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">💧</div>
            <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
            <p className="text-gray-300 mb-8">{data.message}</p>

            <div className="flex gap-3 justify-center">
                <button
                    onClick={() => onAction('log_hydration', { amount: 1 })}
                    className="btn-primary px-8"
                >
                    Log 1 Cup
                </button>
                <button
                    onClick={() => onAction('dismiss')}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition"
                >
                    Skip
                </button>
            </div>
        </div>
    );
}
