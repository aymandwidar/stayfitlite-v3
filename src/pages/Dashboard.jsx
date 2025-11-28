import React, { useMemo, useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { AIClient } from '../utils/AIClient';
import { GroqClient } from '../utils/AI/GroqClient';
import { Play, Clock, Dumbbell, Calendar, Trophy, Flame, Sparkles } from 'lucide-react';

export default function Dashboard({ onStartWorkout }) {
    const { user, clearUser } = useUser();
    const [dailyWorkout, setDailyWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dailyTip, setDailyTip] = useState("Loading your daily wisdom...");

    useEffect(() => {
        const fetchWorkout = async () => {
            setLoading(true);
            try {
                const workout = await AIClient.generateWorkout(user);
                setDailyWorkout(workout);
            } catch (error) {
                console.error("Failed to generate workout", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkout();
    }, [user]);

    useEffect(() => {
        const fetchTip = async () => {
            const tip = await GroqClient.getDailyTip(user.goal);
            setDailyTip(tip);
        };
        fetchTip();
    }, [user.goal]);

    // Calculate Stats
    const stats = useMemo(() => {
        const history = user.history || [];
        const totalWorkouts = history.length;

        // Calculate Streak (consecutive days)
        let streak = 0;
        const today = new Date().setHours(0, 0, 0, 0);
        const uniqueDays = new Set(history.map(w => new Date(w.date).setHours(0, 0, 0, 0)));

        // Check if worked out today
        if (uniqueDays.has(today)) {
            streak = 1;
        }

        // Check previous days
        for (let i = 1; i < 365; i++) {
            const prevDate = new Date(today - (i * 86400000)).setHours(0, 0, 0, 0);
            if (uniqueDays.has(prevDate)) {
                streak++;
            } else if (i === 1 && !uniqueDays.has(today)) {
                // If didn't work out today, check if worked out yesterday to start streak
                continue;
            } else {
                break;
            }
        }

        return { totalWorkouts, streak };
    }, [user.history]);

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <header className="p-6 flex justify-between items-center glass sticky top-0 z-20 border-b-0">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Hi, {user.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded">Lvl {user.level || 1}</span>
                        <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${((user.xp || 0) / ((user.level || 1) * 100)) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
                    <div className="w-full h-full rounded-full bg-darker flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-8 relative z-10">
                {/* Today's Workout Card */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <Calendar className="w-5 h-5 text-primary" /> Today's Plan
                        </h2>
                        <span className="text-xs font-bold text-slate-300 glass px-3 py-1 rounded-full">
                            {new Date().toLocaleDateString()}
                        </span>
                    </div>

                    <div className="glass-card rounded-3xl p-1 border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 min-h-[300px]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/30 transition-colors duration-500"></div>

                        <div className="bg-darker/40 backdrop-blur-sm rounded-[20px] p-6 h-full flex flex-col justify-center">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
                                        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6 animate-pulse" />
                                    </div>
                                    <p className="text-slate-400 font-medium animate-pulse">AI Coach is designing your plan...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{dailyWorkout?.title}</h3>
                                            <div className="flex gap-4 text-sm text-slate-300 font-medium">
                                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {dailyWorkout?.duration} min</span>
                                                <span className="flex items-center gap-1.5"><Dumbbell className="w-4 h-4 text-secondary" /> {dailyWorkout?.exercises.length} Exercises</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {dailyWorkout?.exercises.slice(0, 3).map((ex, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-200">{ex.details.name}</div>
                                                    <div className="text-xs text-slate-400 font-medium">
                                                        {ex.duration ? `${ex.duration}s` : `${ex.sets} sets x ${ex.reps} reps`}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {dailyWorkout?.exercises.length > 3 && (
                                            <div className="text-center text-xs font-medium text-slate-500 mt-2">
                                                + {dailyWorkout?.exercises.length - 3} more exercises
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => onStartWorkout(dailyWorkout)}
                                        className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] transition-all active:scale-95"
                                    >
                                        <Play className="w-5 h-5 fill-current" /> Start Workout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Stats Preview */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-5 rounded-3xl flex flex-col justify-between h-32 hover:bg-white/5 transition-colors">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Flame className="w-3 h-3 text-secondary" /> Streak</div>
                        <div className="text-4xl font-black text-white">{stats.streak} <span className="text-sm font-medium text-slate-500">days</span></div>
                    </div>
                    <div className="glass-card p-5 rounded-3xl flex flex-col justify-between h-32 hover:bg-white/5 transition-colors">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-500" /> Total</div>
                        <div className="text-4xl font-black text-white">{stats.totalWorkouts}</div>
                    </div>
                </section>

                {/* Daily Meal Tip (Powered by Groq) */}
                <section className="glass-card p-6 rounded-3xl border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-xl">💡</span> Coach's Daily Tip
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {dailyTip}
                    </p>
                </section>

                <div className="text-center pt-4">
                    <button
                        onClick={clearUser}
                        className="text-xs text-slate-600 hover:text-white transition-colors font-medium"
                    >
                        Reset Profile (Debug)
                    </button>
                </div>
            </main>
        </div>
    );
}
