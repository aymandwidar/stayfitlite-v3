import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

export default function PainCheckCard({ data, onAction }) {
    const { user, updateUser } = useUser();
    const [hasPain, setHasPain] = useState(null);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [severities, setSeverities] = useState({});

    const bodyAreas = [
        { name: 'Neck', icon: '🦴' },
        { name: 'Shoulders', icon: '💪' },
        { name: 'Upper Back', icon: '🫁' },
        { name: 'Lower Back', icon: '🔻' },
        { name: 'Chest', icon: '❤️' },
        { name: 'Hips', icon: '🦴' },
        { name: 'Knees', icon: '🦵' },
        { name: 'Ankles', icon: '👟' },
        { name: 'Wrists', icon: '✋' },
        { name: 'Elbows', icon: '💪' }
    ];

    const severityLevels = ['Mild', 'Moderate', 'Severe'];

    const handlePainResponse = (response) => {
        setHasPain(response);
        if (!response) {
            // No pain - continue to next card
            const today = new Date().toISOString().split('T')[0];
            const painLogs = user.painLogs || [];
            painLogs.push({ hasPain: false, date: today, timestamp: new Date().toISOString() });
            updateUser({ painLogs });

            setTimeout(() => {
                onAction('pain_logged', { hasPain: false });
            }, 400);
        }
    };

    const toggleArea = (area) => {
        if (selectedAreas.includes(area)) {
            setSelectedAreas(selectedAreas.filter(a => a !== area));
            const newSeverities = { ...severities };
            delete newSeverities[area];
            setSeverities(newSeverities);
        } else {
            setSelectedAreas([...selectedAreas, area]);
            setSeverities({ ...severities, [area]: 'Mild' });
        }
    };

    const setSeverity = (area, severity) => {
        setSeverities({ ...severities, [area]: severity });
    };

    const handleSubmit = () => {
        // Save pain data
        const today = new Date().toISOString().split('T')[0];
        const painLogs = user.painLogs || [];

        const painData = {
            hasPain: true,
            areas: selectedAreas.map(area => ({
                location: area,
                severity: severities[area]
            })),
            date: today,
            timestamp: new Date().toISOString()
        };

        painLogs.push(painData);
        updateUser({ painLogs, todayPain: painData });

        setTimeout(() => {
            onAction('pain_logged', painData);
        }, 400);
    };

    return (
        <div className="glass-card-prominent p-8 max-w-md mx-auto">
            {/* Title */}
            <h2 className="text-2xl font-heading text-white mb-2">Safety Check</h2>
            <p className="text-lg text-gray-200 mb-8">{data.question || 'Any pain or issues today that might affect your training?'}</p>

            {hasPain === null ? (
                /* Initial Yes/No */
                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        onClick={() => handlePainResponse(false)}
                        className="py-8 bg-white/10 hover:bg-white/20 rounded-2xl flex flex-col items-center gap-3 transition group"
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-5xl group-hover:scale-110 transition-transform">✅</span>
                        <span className="text-white font-semibold text-lg">No Issues</span>
                    </motion.button>

                    <motion.button
                        onClick={() => handlePainResponse(true)}
                        className="py-8 bg-white/10 hover:bg-white/20 rounded-2xl flex flex-col items-center gap-3 transition group"
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-5xl group-hover:scale-110 transition-transform">🩹</span>
                        <span className="text-white font-semibold text-lg">Some Pain</span>
                    </motion.button>
                </div>
            ) : (
                /* Body Area Selector */
                <>
                    <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-3">Select affected area(s):</p>
                        <div className="grid grid-cols-2 gap-2">
                            {bodyAreas.map((area) => (
                                <button
                                    key={area.name}
                                    onClick={() => toggleArea(area.name)}
                                    className={`p-3 rounded-xl text-left transition ${selectedAreas.includes(area.name)
                                            ? 'bg-red-500/30 border-2 border-red-400'
                                            : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{area.icon}</span>
                                        <span className="text-white text-sm">{area.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Severity for selected areas */}
                    {selectedAreas.length > 0 && (
                        <div className="mb-6 space-y-3">
                            <p className="text-sm text-gray-400">Rate severity:</p>
                            {selectedAreas.map((area) => (
                                <div key={area} className="p-3 bg-white/5 rounded-xl">
                                    <p className="text-white text-sm mb-2">{area}</p>
                                    <div className="flex gap-2">
                                        {severityLevels.map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setSeverity(area, level)}
                                                className={`flex-1 py-2 rounded-lg text-xs transition ${severities[area] === level
                                                        ? level === 'Mild' ? 'bg-yellow-500/40 text-yellow-100' :
                                                            level === 'Moderate' ? 'bg-orange-500/40 text-orange-100' :
                                                                'bg-red-500/40 text-red-100'
                                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submit / Back */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setHasPain(null)}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedAreas.length === 0}
                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition"
                        >
                            Continue
                        </button>
                    </div>
                </>
            )}

            {/* Info */}
            <p className="mt-6 text-center text-xs text-gray-400 italic">
                Safety is our top priority. AI will adjust your workout to avoid affected areas.
            </p>
        </div>
    );
}
