import React from 'react';
import { useUser } from '../context/UserContext';

/**
 * Persistent status bar showing key user metrics.
 * Used on both SmartFeed and AICoach pages so the info is always visible.
 */
export default function StatusBar() {
    const { user } = useUser();
    return (
        <div className="p-4 flex gap-3 justify-center bg-black/30 backdrop-blur-md rounded-b-lg">
            <div className="glass-card px-4 py-2 rounded-full">
                <span className="text-xs text-gray-200">
                    Recovery: <span className="font-semibold text-white">{user?.recoveryScore || 0}</span>
                </span>
            </div>
            <div className="glass-card px-4 py-2 rounded-full">
                <span className="text-xs text-gray-200">
                    Hydration: <span className="font-semibold text-white">{user?.hydrationToday || 0}/8</span>
                </span>
            </div>
            {/* Add more pills as needed, e.g., Mood, Stress */}
        </div>
    );
}
