import { useUser } from '../context/UserContext';
import { useState } from 'react';

/**
 * Premium Glassmorphism MoodTracker Component
 * Following strict glassmorphism design principles
 */
export default function MoodTracker() {
    const { user, updateUser } = useUser();
    const [mood, setMood] = useState(user?.mood || '😊');
    const [energy, setEnergy] = useState(user?.energy || 5);

    const handleMoodChange = (newMood) => {
        setMood(newMood);
        updateUser({ mood: newMood });
    };

    const handleEnergyChange = (e) => {
        const newEnergy = Number(e.target.value);
        setEnergy(newEnergy);
        updateUser({ energy: newEnergy });
    };

    const moods = [
        { emoji: '😊', label: 'Good' },
        { emoji: '😐', label: 'Okay' },
        { emoji: '😔', label: 'Low' },
        { emoji: '💪', label: 'Fired Up' }
    ];

    return (
        <div
            className="p-6 mb-3 rounded-3xl"
            style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
            }}
        >
            {/* Mood selector */}
            <div className="mb-5">
                <h3 className="text-white text-base font-semibold mb-3">How are you feeling?</h3>
                <div className="grid grid-cols-4 gap-3">
                    {moods.map((m) => (
                        <button
                            key={m.emoji}
                            onClick={() => handleMoodChange(m.emoji)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-105 ${mood === m.emoji ? 'scale-105' : ''
                                }`}
                            style={{
                                background: mood === m.emoji
                                    ? 'rgba(255, 255, 255, 0.25)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: mood === m.emoji
                                    ? '0 4px 16px 0 rgba(0, 0, 0, 0.2)'
                                    : '0 2px 8px 0 rgba(0, 0, 0, 0.1)'
                            }}
                            title={m.label}
                        >
                            <span className="text-3xl">{m.emoji}</span>
                            <span className="text-white text-xs font-medium">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Energy slider */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white text-base font-semibold">Energy Level</h3>
                    <span className="text-white text-2xl font-bold">{energy}/10</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={energy}
                    onChange={handleEnergyChange}
                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                        accentColor: '#8b5cf6'
                    }}
                />
            </div>
        </div>
    );
}
