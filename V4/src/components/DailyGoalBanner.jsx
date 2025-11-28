import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

/**
 * Premium Glassmorphism DailyGoalBanner Component
 * Following strict glassmorphism design principles
 */
export default function DailyGoalBanner() {
    const { user, updateUser } = useUser();
    const [isCompleted, setIsCompleted] = useState(false);

    const defaultGoal = '30 min workout';
    const currentGoal = user?.dailyGoal || defaultGoal;

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setIsCompleted(user?.dailyGoalCompleted === today);
    }, [user]);

    const handleToggleGoal = () => {
        const today = new Date().toISOString().split('T')[0];
        const newCompleted = !isCompleted;

        setIsCompleted(newCompleted);
        updateUser({
            dailyGoalCompleted: newCompleted ? today : null
        });
    };

    return (
        <div
            className={`p-6 mb-3 rounded-3xl flex items-center justify-between ${isCompleted ? 'border-2' : ''
                }`}
            style={{
                background: isCompleted
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isCompleted
                    ? '2px solid rgba(34, 197, 94, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
            }}
        >
            <div className="flex items-center gap-4">
                <div className={`text-4xl ${isCompleted ? 'animate-bounce' : ''}`}>
                    {isCompleted ? '✅' : '🎯'}
                </div>
                <div>
                    <p className="text-white text-lg font-bold">
                        {isCompleted ? 'Great job!' : 'Today\'s Goal'}
                    </p>
                    <p className="text-gray-100 text-base">{currentGoal}</p>
                </div>
            </div>

            <button
                onClick={handleToggleGoal}
                className="px-6 py-3 rounded-2xl text-base font-semibold transition-all hover:scale-105"
                style={{
                    background: isCompleted
                        ? 'rgba(34, 197, 94, 0.3)'
                        : 'linear-gradient(to right, rgb(59, 130, 246), rgb(147, 51, 234))',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)'
                }}
            >
                {isCompleted ? 'Undo' : 'Mark Done'}
            </button>
        </div>
    );
}
