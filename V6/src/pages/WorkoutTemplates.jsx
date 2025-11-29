import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

export default function WorkoutTemplates() {
    const { user, saveWorkoutTemplate, deleteWorkoutTemplate } = useUser();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const templates = user?.workoutTemplates || [];

    const categories = [
        { id: 'all', name: 'All Templates', emoji: '📚' },
        { id: 'favorites', name: 'Favorites', emoji: '⭐' },
        { id: 'upper', name: 'Upper Body', emoji: '💪' },
        { id: 'lower', name: 'Lower Body', emoji: '🦵' },
        { id: 'full', name: 'Full Body', emoji: '🏋️' },
        { id: 'quick', name: 'Quick 30min', emoji: '⚡' }
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    const handleStartWorkout = (template) => {
        // Navigate to workout player with template
        window.location.href = `/workout-player?template=${template.id}`;
    };

    const handleDelete = (templateId) => {
        if (confirm('Delete this template?')) {
            deleteWorkoutTemplate(templateId);
        }
    };

    return (
        <div className="min-h-screen pb-32 safe-top" style={{
            background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)'
        }}>
            {/* Header */}
            <div className="px-6 pt-8 pb-4">
                <h1 className="text-4xl font-bold text-white mb-1">Workout Templates</h1>
                <p className="text-cyan-400 text-sm font-medium">Save and reuse your favorite routines</p>
            </div>

            {/* Category Filter */}
            <div className="px-4 mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat.id
                                    ? 'bg-cyan-500 text-white'
                                    : 'glass-card text-gray-300 hover:border-cyan-400'
                                }`}
                        >
                            <span className="mr-2">{cat.emoji}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="px-4 space-y-3">
                {filteredTemplates.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                        <p className="text-2xl mb-2">📝</p>
                        <p className="text-gray-300 mb-1">No templates yet</p>
                        <p className="text-sm text-gray-400">Save a workout to create your first template</p>
                    </div>
                ) : (
                    filteredTemplates.map((template, idx) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-4"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {template.exercises.length} exercises • {template.estimatedTime || '45'} min
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg transition"
                                >
                                    🗑️
                                </button>
                            </div>

                            {/* Exercise List Preview */}
                            <div className="mb-3 space-y-1">
                                {template.exercises.slice(0, 3).map((ex, i) => (
                                    <div key={i} className="text-sm text-gray-300">
                                        • {ex.name} - {ex.sets}x{ex.reps}
                                    </div>
                                ))}
                                {template.exercises.length > 3 && (
                                    <div className="text-sm text-gray-400">
                                        +{template.exercises.length - 3} more exercises
                                    </div>
                                )}
                            </div>

                            {/* Start Button */}
                            <button
                                onClick={() => handleStartWorkout(template)}
                                className="w-full btn-primary"
                            >
                                Start Workout
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
