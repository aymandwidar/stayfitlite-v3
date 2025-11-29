import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

export default function Onboarding() {
    const { updateUser } = useUser();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        goal: '',
        level: '',
        activityLevel: '',
        medicalConditions: '',
        unitSystem: 'metric' // 'metric' or 'imperial'
    });

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleComplete = () => {
        // Save user data
        updateUser({
            ...formData,
            age: parseInt(formData.age),
            weight: parseFloat(formData.weight),
            height: parseFloat(formData.height),
            unitSystem: formData.unitSystem,
            onboarded: true,
            joinedAt: new Date().toISOString(),
            recoveryScore: 50
        });
    };

    const steps = [
        {
            title: "Welcome to StayFit Lite",
            subtitle: "Your AI-First Fitness Journey Starts Here",
            content: (
                <div className="text-center">
                    <p className="text-gray-300 mb-6">Let's get to know you so our AI can create the perfect training plan.</p>
                    <input
                        type="text"
                        placeholder="What's your name?"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field text-lg py-4"
                    />
                </div>
            )
        },
        {
            title: "Tell us about yourself",
            subtitle: "These help us calculate your recovery and energy needs",
            content: (
                <div className="space-y-4">
                    {/* Unit Toggle */}
                    <div className="flex bg-black/20 p-1 rounded-xl mb-4">
                        <button
                            onClick={() => setFormData({ ...formData, unitSystem: 'metric' })}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${formData.unitSystem === 'metric' ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            Metric (kg/cm)
                        </button>
                        <button
                            onClick={() => setFormData({ ...formData, unitSystem: 'imperial' })}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${formData.unitSystem === 'imperial' ? 'bg-cyan-400 text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            Imperial (lbs/in)
                        </button>
                    </div>

                    <input
                        type="number"
                        placeholder="Age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="input-field"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder={formData.unitSystem === 'metric' ? "Weight (kg)" : "Weight (lbs)"}
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="number"
                            placeholder={formData.unitSystem === 'metric' ? "Height (cm)" : "Height (in)"}
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            className="input-field"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "What's your goal?",
            subtitle: "We'll tailor your workouts to match this",
            content: (
                <div className="grid grid-cols-3 gap-4">
                    {['muscle_gain', 'fat_loss', 'general_fitness'].map((goal) => (
                        <button
                            key={goal}
                            onClick={() => setFormData({ ...formData, goal })}
                            className={`p-6 rounded-2xl text-center transition glass-card ${formData.goal === goal
                                ? 'border-cyan-400 bg-cyan-400/10 scale-105'
                                : 'hover:bg-white/5'
                                }`}
                        >
                            <div className="text-4xl mb-2">
                                {goal === 'muscle_gain' && '💪'}
                                {goal === 'fat_loss' && '🔥'}
                                {goal === 'general_fitness' && '⚡'}
                            </div>
                            <div className={`font-semibold capitalize ${formData.goal === goal ? 'text-cyan-400' : 'text-white'}`}>
                                {goal.replace('_', ' ')}
                            </div>
                        </button>
                    ))}
                </div>
            )
        },
        {
            title: "What's your experience level?",
            subtitle: "This helps us set the right intensity",
            content: (
                <div className="space-y-3">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setFormData({ ...formData, level })}
                            className={`w-full p-6 rounded-2xl text-left transition glass-card ${formData.level === level
                                ? 'border-cyan-400 bg-cyan-400/10 scale-105'
                                : 'hover:bg-white/5'
                                }`}
                        >
                            <div className={`font-semibold text-lg capitalize mb-1 ${formData.level === level ? 'text-cyan-400' : 'text-white'}`}>{level}</div>
                            <div className="text-gray-400 text-sm">
                                {level === 'beginner' && 'New to working out or getting back after a break'}
                                {level === 'intermediate' && '6+ months of consistent training'}
                                {level === 'advanced' && '2+ years of structured training'}
                            </div>
                        </button>
                    ))}
                </div>
            )
        },
        {
            title: "Activity level",
            subtitle: "Outside of structured workouts",
            content: (
                <div className="space-y-3">
                    {['sedentary', 'lightly_active', 'active', 'very_active'].map((activity) => (
                        <button
                            key={activity}
                            onClick={() => setFormData({ ...formData, activityLevel: activity })}
                            className={`w-full p-6 rounded-2xl text-left transition glass-card ${formData.activityLevel === activity
                                ? 'border-cyan-400 bg-cyan-400/10 scale-105'
                                : 'hover:bg-white/5'
                                }`}
                        >
                            <div className={`font-semibold capitalize mb-1 ${formData.activityLevel === activity ? 'text-cyan-400' : 'text-white'}`}>{activity.replace('_', ' ')}</div>
                        </button>
                    ))}
                </div>
            )
        },
        {
            title: "Any injuries or conditions?",
            subtitle: "AI will avoid exercises that could aggravate these",
            content: (
                <textarea
                    placeholder="e.g., Lower back pain, knee issues, etc. (optional)"
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                    className="input-field h-32 resize-none"
                />
            )
        }
    ];

    const currentStep = steps[step];
    const isLastStep = step === steps.length - 1;
    const canProceed = formData.name && (step === 0 ||
        (step === 1 && formData.age && formData.weight && formData.height) ||
        (step === 2 && formData.goal) ||
        (step === 3 && formData.level) ||
        (step === 4 && formData.activityLevel) ||
        step === 5);

    return (
        <div className="min-h-screen relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)'
        }}>
            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    className="glass-card-prominent p-8 w-full max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Progress */}
                    <div className="flex justify-center gap-2 mb-8">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all ${idx === step ? 'w-12 bg-cyan-400' : 'w-2 bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-2">{currentStep.title}</h2>
                            <p className="text-gray-400 mb-8">{currentStep.subtitle}</p>
                            {currentStep.content}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex gap-4 mt-8">
                        {step > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={isLastStep ? handleComplete : handleNext}
                            disabled={!canProceed}
                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLastStep ? 'Complete Setup' : 'Continue'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
