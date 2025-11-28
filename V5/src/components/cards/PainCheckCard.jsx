import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PainCheckCard({ data, onAction }) {
    const [hasPain, setHasPain] = useState(null);
    const [painLocation, setPainLocation] = useState('');
    const [painLevel, setPainLevel] = useState(3);

    const handlePainSelection = (status) => {
        setHasPain(status);
        if (!status) {
            setTimeout(() => {
                onAction('log_pain', { hasPain: false });
            }, 500);
        }
    };

    const handleSubmitPain = () => {
        onAction('log_pain', {
            hasPain: true,
            location: painLocation,
            level: painLevel
        });
    };

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
            <p className="text-gray-300 mb-8">{data.question}</p>

            {hasPain === null ? (
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => handlePainSelection(false)}
                        className="flex-1 py-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-2xl transition group"
                    >
                        <div className="text-3xl mb-2">💪</div>
                        <div className="text-green-400 font-bold">Feeling Good</div>
                    </button>
                    <button
                        onClick={() => handlePainSelection(true)}
                        className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl transition group"
                    >
                        <div className="text-3xl mb-2">🤕</div>
                        <div className="text-red-400 font-bold">I Have Pain</div>
                    </button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Where does it hurt?</label>
                        <input
                            type="text"
                            value={painLocation}
                            onChange={(e) => setPainLocation(e.target.value)}
                            placeholder="e.g., Lower back, right knee"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Pain Level (1-10): <span className="text-white font-bold">{painLevel}</span></label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={painLevel}
                            onChange={(e) => setPainLevel(parseInt(e.target.value))}
                            className="w-full accent-cyan-400"
                        />
                    </div>

                    <button
                        onClick={handleSubmitPain}
                        disabled={!painLocation}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        Log Pain & Adjust Workout
                    </button>
                </motion.div>
            )}
        </div>
    );
}
