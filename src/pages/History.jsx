import React from 'react';
import { useUser } from '../context/UserContext';
import { Calendar, Clock, Dumbbell, Trophy } from 'lucide-react';

export default function History() {
    const { user } = useUser();
    const history = user.history || [];

    // Sort history by date descending
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="min-h-screen pb-24 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">History</h1>
                <p className="text-slate-400">Your journey so far.</p>
            </header>

            {sortedHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No workouts yet</h3>
                    <p className="text-slate-400 max-w-xs">Complete your first workout to see it tracked here!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedHistory.map((workout, index) => (
                        <div key={index} className="glass-card p-5 rounded-2xl border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-white text-lg">{workout.title}</h3>
                                    <div className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        <span className="mx-1">•</span>
                                        {new Date(workout.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">
                                    Completed
                                </div>
                            </div>

                            <div className="flex gap-4 text-sm text-slate-300">
                                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                                    <Clock className="w-4 h-4 text-primary" /> {workout.duration} min
                                </span>
                                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                                    <Dumbbell className="w-4 h-4 text-secondary" /> {workout.exercises.length} Exercises
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
