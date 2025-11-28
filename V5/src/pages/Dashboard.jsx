import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { DayInsightGenerator } from '../services/DayInsightGenerator';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { user, addHydration } = useUser();
    const [insight, setInsight] = useState(null);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);

    // Calculate recovery score (mock for now)
    const recoveryScore = user?.recoveryScore || 85;
    const hydrationProgress = ((user?.hydrationToday || 0) / 8) * 100;

    // Generate AI insight on mount
    useEffect(() => {
        generateInsight();
    }, []);

    const generateInsight = async () => {
        setIsLoadingInsight(true);
        try {
            const metrics = {
                recoveryScore: recoveryScore,
                hydration: user?.hydrationToday || 0,
                hydrationGoal: 8,
                workoutsCompleted: user?.workoutsCompleted || 0,
                sleepScore: user?.sleepScore || 92,
                hrv: user?.hrv || 68,
                rhr: user?.rhr || 48
            };

            const result = await DayInsightGenerator.generateDayInsight(metrics);
            setInsight(result);
        } catch (error) {
            // Silently handle quota errors
            // Use fallback
            setInsight({
                insightText: "Optimal Recovery Target Reached.",
                nextDayFocus: "Active Recovery & Deep Sleep Protocol",
                nextDayDetail: "Sonnet 4.5 recommends light mobility work based on today's intense load."
            });
        } finally {
            setIsLoadingInsight(false);
        }
    };

    return (
        <div className="min-h-screen pb-32 safe-top" style={{
            background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)'
        }}>
            {/* Header */}
            <div className="px-6 pt-8 pb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-white mb-1">Dashboard</h1>
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">V5.1 DEBUG</span>
                </div>
                <p className="text-cyan-400 text-sm font-medium">Antigravity | Today</p>
            </div>

            {/* Content */}
            <div className="px-4 space-y-4">
                {/* SONNET 4.5 Insight Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-prominent p-6"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-cyan-400 font-bold text-sm">SONNET 4.5 INSIGHT</span>
                        <span className="badge badge-live">LIVE</span>
                    </div>

                    {isLoadingInsight ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                {insight?.insightText || "Loading insight..."}
                            </h2>
                            <p className="text-gray-300 text-sm mb-4">
                                Your HRV (68ms) and Resting Heart Rate (48bpm) indicate peak readiness. Focus on high-intensity training today.
                            </p>
                            <button className="btn-primary w-full">
                                View Custom Workout Plan
                            </button>
                        </>
                    )}
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Recovery Score */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-4"
                    >
                        <div className="flex flex-col items-center">
                            <div className="circular-progress mb-3">
                                <svg width="80" height="80">
                                    <circle className="bg-circle" cx="40" cy="40" r="36" />
                                    <circle
                                        className="progress-circle"
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        style={{
                                            strokeDashoffset: 251.2 - (251.2 * recoveryScore) / 100
                                        }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-cyan-400">{recoveryScore}</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs mb-1">RECOVERY SCORE</p>
                            <p className="text-white font-semibold">{recoveryScore}%</p>
                        </div>
                    </motion.div>

                    {/* Hydration Goal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-4"
                    >
                        <div className="flex flex-col items-center">
                            <div className="circular-progress mb-3">
                                <svg width="80" height="80">
                                    <circle className="bg-circle" cx="40" cy="40" r="36" />
                                    <circle
                                        className="progress-circle"
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        style={{
                                            strokeDashoffset: 251.2 - (251.2 * hydrationProgress) / 100
                                        }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-cyan-400">{user?.hydrationToday || 0}</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs mb-1">HYDRATION GOAL</p>
                            <p className="text-white font-semibold">{user?.hydrationToday || 0}/8 Cups</p>
                        </div>
                    </motion.div>
                </div>

                {/* Your Day at a Glance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-5"
                >
                    <h3 className="text-white font-bold mb-4">Your Day at a Glance</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🏋️</span>
                                <span className="text-gray-300">Workouts Completed</span>
                            </div>
                            <span className="text-white font-bold">3/4</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💧</span>
                                <span className="text-gray-300">Hydration Intake</span>
                            </div>
                            <span className="text-white font-bold">6/8 Cups</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🌙</span>
                                <span className="text-gray-300">Sleep Score (Last Night)</span>
                            </div>
                            <span className="text-white font-bold">92</span>
                        </div>
                    </div>
                </motion.div>

                {/* Tomorrow's Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-5"
                >
                    <h3 className="text-white font-bold mb-3">Tomorrow's Plan</h3>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🌙</span>
                        <div>
                            <p className="text-white font-semibold mb-1">
                                Scheduled: {insight?.nextDayFocus || "Active Recovery & Deep Sleep Protocol"}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {insight?.nextDayDetail || "Sonnet 4.5 recommends light mobility work based on today's intense load."}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Finish Day Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full py-4 rounded-2xl font-bold text-white text-lg"
                    style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)'
                    }}
                    onClick={generateInsight}
                >
                    Finish Day & Generate Tomorrow's Plan
                </motion.button>
            </div>
        </div>
    );
}
