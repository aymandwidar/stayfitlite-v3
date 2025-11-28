import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

export default function Settings() {
    const { user, updateUser, clearUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        age: user?.age || '',
        weight: user?.weight || '',
        height: user?.height || '',
        goal: user?.goal || '',
        level: user?.level || '',
        activityLevel: user?.activityLevel || '',
        medicalConditions: user?.medicalConditions || '',
        unitSystem: user?.unitSystem || 'metric'
    });

    const handleSave = () => {
        updateUser({
            ...formData,
            age: parseInt(formData.age),
            weight: parseFloat(formData.weight),
            height: parseFloat(formData.height)
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            age: user?.age || '',
            weight: user?.weight || '',
            height: user?.height || '',
            goal: user?.goal || '',
            level: user?.level || '',
            activityLevel: user?.activityLevel || '',
            medicalConditions: user?.medicalConditions || '',
            unitSystem: user?.unitSystem || 'metric'
        });
        setIsEditing(false);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            clearUser();
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800"
                style={{ animation: 'gradientShift 25s ease infinite', backgroundSize: '200% 200%' }} />

            <div className="relative z-10 min-h-screen p-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-heading text-white mb-2">Settings</h1>
                        <p className="text-gray-300">Manage your profile and preferences</p>
                    </div>

                    {/* Profile Section */}
                    <div className="glass-card-prominent p-6 mb-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Profile</h2>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Unit Toggle (Edit Mode Only) */}
                            {isEditing && (
                                <div className="flex bg-white/10 p-1 rounded-xl mb-4">
                                    <button
                                        onClick={() => setFormData({ ...formData, unitSystem: 'metric' })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${formData.unitSystem === 'metric' ? 'bg-white text-purple-900' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Metric (kg/cm)
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, unitSystem: 'imperial' })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${formData.unitSystem === 'imperial' ? 'bg-white text-purple-900' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Imperial (lbs/in)
                                    </button>
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                                    />
                                ) : (
                                    <div className="text-white">{user?.name}</div>
                                )}
                            </div>

                            {/* Age, Weight, Height */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Age</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                                        />
                                    ) : (
                                        <div className="text-white">{user?.age}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">
                                        Weight ({formData.unitSystem === 'metric' ? 'kg' : 'lbs'})
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                                        />
                                    ) : (
                                        <div className="text-white">{user?.weight}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">
                                        Height ({formData.unitSystem === 'metric' ? 'cm' : 'in'})
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={formData.height}
                                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                                        />
                                    ) : (
                                        <div className="text-white">{user?.height}</div>
                                    )}
                                </div>
                            </div>

                            {/* Goal */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Goal</label>
                                {isEditing ? (
                                    <select
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                                    >
                                        <option value="muscle_gain">Muscle Gain</option>
                                        <option value="fat_loss">Fat Loss</option>
                                        <option value="general_fitness">General Fitness</option>
                                    </select>
                                ) : (
                                    <div className="text-white capitalize">{user?.goal?.replace('_', ' ')}</div>
                                )}
                            </div>

                            {/* Level */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Experience Level</label>
                                {isEditing ? (
                                    <select
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                ) : (
                                    <div className="text-white capitalize">{user?.level}</div>
                                )}
                            </div>

                            {/* Activity Level */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Activity Level</label>
                                {isEditing ? (
                                    <select
                                        value={formData.activityLevel}
                                        onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
                                    >
                                        <option value="sedentary">Sedentary</option>
                                        <option value="lightly_active">Lightly Active</option>
                                        <option value="active">Active</option>
                                        <option value="very_active">Very Active</option>
                                    </select>
                                ) : (
                                    <div className="text-white capitalize">{user?.activityLevel?.replace('_', ' ')}</div>
                                )}
                            </div>

                            {/* Medical Conditions */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Medical Conditions</label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.medicalConditions}
                                        onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white resize-none h-24 focus:outline-none focus:border-white/40"
                                        placeholder="None"
                                    />
                                ) : (
                                    <div className="text-white">{user?.medicalConditions || 'None'}</div>
                                )}
                            </div>
                        </div>

                        {/* Edit Actions */}
                        {isEditing && (
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-semibold transition"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* AI Memory Stats */}
                    <div className="glass-card-prominent p-6 mb-4">
                        <h2 className="text-xl font-semibold text-white mb-4">AI Memory</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-300">
                                <span>Recovery Score:</span>
                                <span className="text-white font-semibold">{user?.recoveryScore || 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Workouts Completed:</span>
                                <span className="text-white font-semibold">{user?.workouts?.length || 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Joined:</span>
                                <span className="text-white font-semibold">
                                    {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* API Configuration */}
                    <div className="glass-card-prominent p-6 mb-4">
                        <h2 className="text-xl font-semibold text-white mb-4">API Configuration</h2>
                        <p className="text-gray-300 text-sm mb-4">Enter your own API keys to use AI features. Keys are saved locally on your device.</p>

                        <div className="space-y-4">
                            {/* Groq API Key */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Groq API Key</label>
                                <input
                                    type="password"
                                    placeholder="gsk_..."
                                    value={localStorage.getItem('VITE_GROQ_API_KEY') || ''}
                                    onChange={(e) => {
                                        localStorage.setItem('VITE_GROQ_API_KEY', e.target.value);
                                        // Force re-render to show update
                                        setFormData({ ...formData });
                                    }}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 placeholder-gray-500"
                                />
                            </div>

                            {/* Gemini API Key */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Gemini API Key</label>
                                <input
                                    type="password"
                                    placeholder="AIza..."
                                    value={localStorage.getItem('VITE_GEMINI_API_KEY') || ''}
                                    onChange={(e) => {
                                        localStorage.setItem('VITE_GEMINI_API_KEY', e.target.value);
                                        setFormData({ ...formData });
                                    }}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 placeholder-gray-500"
                                />
                            </div>

                            {/* DeepSeek API Key */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">DeepSeek API Key</label>
                                <input
                                    type="password"
                                    placeholder="sk-..."
                                    value={localStorage.getItem('VITE_DEEPSEEK_API_KEY') || ''}
                                    onChange={(e) => {
                                        localStorage.setItem('VITE_DEEPSEEK_API_KEY', e.target.value);
                                        setFormData({ ...formData });
                                    }}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 placeholder-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="glass-card-prominent p-6 border-2 border-red-500/30">
                        <h2 className="text-xl font-semibold text-red-300 mb-2">Danger Zone</h2>
                        <p className="text-gray-300 text-sm mb-4">This will delete all your data and AI memory</p>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-200 transition"
                        >
                            Reset All Data
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
