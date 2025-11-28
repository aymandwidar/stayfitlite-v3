import { useUser } from '../context/UserContext';
import { useState } from 'react';

/**
 * Simple Mood & Energy Tracker.
 * Allows the user to select a mood emoji and an energy level (1‑10).
 * Updates the user context so the AI can reference it.
 */
export default function MoodTracker() {
    const { user, updateUser } = useUser();
    const [mood, setMood] = useState(user?.mood || '😊');
    const [energy, setEnergy] = useState(user?.energy || 5);

    const handleMoodChange = (e) => {
        const newMood = e.target.value;
        setMood(newMood);
        updateUser({ mood: newMood });
    };

    const handleEnergyChange = (e) => {
        const newEnergy = Number(e.target.value);
        setEnergy(newEnergy);
        updateUser({ energy: newEnergy });
    };

    return (
        <div className="p-4 glass-card-prominent mb-4 flex items-center gap-4">
            <label className="text-white">Mood:</label>
            <select value={mood} onChange={handleMoodChange} className="bg-white/10 text-white rounded px-2 py-1">
                <option value="😊">😊 Happy</option>
                <option value="😐">😐 Neutral</option>
                <option value="😔">😔 Sad</option>
                <option value="😡">😡 Angry</option>
            </select>
            <label className="text-white">Energy:</label>
            <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={handleEnergyChange}
                className="bg-white/20"
            />
            <span className="text-white">{energy}</span>
        </div>
    );
}
