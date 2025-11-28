import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';

/**
 * Simple progress chart showing workout duration for the last 7 days.
 * It reads the user's history from the UserContext and renders a bar for each day.
 */
export default function ProgressChart() {
    const { user } = useUser();
    const [lastWeek, setLastWeek] = useState([]);

    useEffect(() => {
        if (!user?.history) return;
        // Get last 7 entries (or fewer) sorted by date descending
        const sorted = [...user.history]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 7);
        setLastWeek(sorted);
    }, [user]);

    // Find max duration to normalize bar heights
    const maxDuration = Math.max(...lastWeek.map((h) => h.stats?.duration || 0), 1);

    return (
        <div className="p-4 glass-card-prominent mb-4">
            <h2 className="text-lg font-heading text-white mb-2">Weekly Progress</h2>
            <div className="flex items-end space-x-2">
                {lastWeek.map((entry, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t"
                            style={{
                                height: `${((entry.stats?.duration || 0) / maxDuration) * 100}%`,
                                width: '20px',
                            }}
                        />
                        <span className="text-xs text-white mt-1">
                            {new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
