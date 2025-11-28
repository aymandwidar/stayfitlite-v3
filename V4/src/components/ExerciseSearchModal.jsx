import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { ExerciseDatabase } from '../data/ExerciseDatabase';

/**
 * ExerciseSearchModal - searchable modal for browsing exercises
 */
export default function ExerciseSearchModal({ isOpen, onClose }) {
    const { updateUser } = useUser();
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    // Get all exercises and filter by search query
    const allExercises = ExerciseDatabase.getAllExercises();
    const filteredExercises = allExercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscles?.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAddExercise = (exercise) => {
        // Placeholder: would integrate with workout builder/routine editor
        console.log('Adding exercise to routine:', exercise.name);
        // TODO: Implement custom routine functionality
        alert(`${exercise.name} added to custom routine!`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className="glass-card-prominent max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-heading text-white">Exercise Library</h2>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Search input */}
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                        autoFocus
                    />
                </div>

                {/* Exercise list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredExercises.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No exercises found</p>
                    ) : (
                        filteredExercises.map((exercise, idx) => (
                            <div key={idx} className="glass-card p-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">{exercise.name}</h3>
                                    <p className="text-gray-300 text-sm">
                                        {exercise.muscles?.join(', ') || 'Full body'}
                                    </p>
                                    {exercise.equipment && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            Equipment: {exercise.equipment}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAddExercise(exercise)}
                                    className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white text-sm font-semibold transition"
                                >
                                    Add
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
