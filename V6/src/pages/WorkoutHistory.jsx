import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WorkoutHistory() {
    const { user } = useUser();
    const [dateRange, setDateRange] = useState('30');
    const [selectedExercise, setSelectedExercise] = useState('all');

    // Mock data - replace with actual workout history
    const workoutData = [
        { date: '11/01', volume: 2500 },
        { date: '11/05', volume: 2800 },
        { date: '11/08', volume: 3000 },
        { date: '11/12', volume: 3200 },
        { date: '11/15', volume: 3400 },
        { date: '11/19', volume: 3600 },
        { date: '11/22', volume: 3800 },
        { date: '11/26', volume: 4000 },
    ];

    const dateRanges = [
        { value: '7', label: '7 Days' },
        { value: '30', label: '30 Days' },
        { value: '90', label: '90 Days' },
        { value: 'all', label: 'All Time' }
    ];

    return (
        <div className="min-h-screen pb-32 safe-top" style={{
            background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)'
        }}>
            {/* Header */}
            <div className="px-6 pt-8 pb-4">
                <h1 className="text-4xl font-bold text-white mb-1">Workout History</h1>
                <p className="text-cyan-400 text-sm font-medium">Track your progress over time</p>
            </div>

            {/* Date Range Filter */}
            <div className="px-4 mb-4">
                <div className="flex gap-2">
                    {dateRanges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setDateRange(range.value)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${dateRange === range.value
                                    ? 'bg-cyan-500 text-white'
                                    : 'glass-card text-gray-300'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="px-4 mb-4 grid grid-cols-3 gap-3">
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">24</p>
                    <p className="text-xs text-gray-400">Workouts</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">18h</p>
                    <p className="text-xs text-gray-400">Total Time</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">+15%</p>
                    <p className="text-xs text-gray-400">Volume</p>
                </div>
            </div>

            {/* Volume Chart */}
            <div className="px-4 mb-4">
                <div className="glass-card p-4">
                    <h3 className="text-white font-bold mb-4">Training Volume</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={workoutData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(6, 182, 212, 0.3)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="volume"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                dot={{ fill: '#06b6d4', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Insight */}
            <div className="px-4 mb-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-prominent p-4"
                >
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                            <p className="text-white font-semibold mb-1">Great Progress!</p>
                            <p className="text-sm text-gray-300">
                                You've increased your total volume by 60% this month. Keep up the momentum!
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Workouts */}
            <div className="px-4">
                <h3 className="text-white font-bold mb-3">Recent Workouts</h3>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-white font-semibold">Push Day</p>
                                    <p className="text-xs text-gray-400">Nov {28 - i}, 2024</p>
                                </div>
                                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                                    45 min
                                </span>
                            </div>
                            <p className="text-sm text-gray-300">8 exercises • 4,200 kg volume</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
