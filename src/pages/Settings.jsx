import React from 'react';
import { useUser } from '../context/UserContext';
import { User, Volume2, Trash2, LogOut, ChevronRight, Shield } from 'lucide-react';

export default function Settings() {
    const { user, updateUser, clearUser } = useUser();

    const handleReset = () => {
        if (confirm("Are you sure you want to reset your profile? This cannot be undone.")) {
            clearUser();
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen pb-24 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Customize your experience.</p>
            </header>

            <div className="space-y-6">
                {/* Profile Section */}
                <section>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Profile</h2>
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-bold">Name</div>
                                    <div className="text-slate-400 text-sm">{user.name}</div>
                                </div>
                            </div>
                            {/* <ChevronRight className="w-5 h-5 text-slate-600" /> */}
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-bold">Goal</div>
                                    <div className="text-slate-400 text-sm capitalize">{user.goal.replace('_', ' ')}</div>
                                </div>
                            </div>
                            {/* <ChevronRight className="w-5 h-5 text-slate-600" /> */}
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Preferences</h2>
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Volume2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-bold">Voice Coach</div>
                                    <div className="text-slate-400 text-sm">Hear audio cues during workouts</div>
                                </div>
                            </div>
                            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/20">
                                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-primary transition" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section>
                    <h2 className="text-sm font-bold text-red-500/70 uppercase tracking-wider mb-3 px-1">Danger Zone</h2>
                    <button
                        onClick={handleReset}
                        className="w-full glass-card p-4 rounded-2xl flex items-center gap-4 text-red-400 hover:bg-red-500/10 transition-colors border-red-500/20"
                    >
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div className="font-bold">Reset Profile Data</div>
                    </button>
                </section>

                <div className="text-center text-xs text-slate-600 mt-8">
                    StayFit Lite v1.0.0
                </div>
            </div>
        </div>
    );
}
