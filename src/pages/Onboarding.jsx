import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const steps = [
    {
        id: 'name',
        title: "What's your name?",
        subtitle: "Let's get to know you.",
        type: 'text',
        placeholder: 'Enter your name'
    },
    {
        id: 'goal',
        title: "What's your main goal?",
        subtitle: "We'll tailor workouts to this.",
        type: 'select',
        options: [
            { value: 'weight_loss', label: 'Lose Weight', icon: '🔥' },
            { value: 'muscle_gain', label: 'Build Muscle', icon: '💪' },
            { value: 'fitness', label: 'Get Fit', icon: '🏃' },
            { value: 'flexibility', label: 'Flexibility', icon: '🧘' }
        ]
    },
    {
        id: 'level',
        title: "What's your fitness level?",
        subtitle: "Be honest, we won't judge!",
        type: 'select',
        options: [
            { value: 'beginner', label: 'Beginner', desc: 'New to fitness' },
            { value: 'intermediate', label: 'Intermediate', desc: 'Work out occasionally' },
            { value: 'advanced', label: 'Advanced', desc: 'Fitness enthusiast' }
        ]
    }
];

export default function Onboarding() {
    const { updateUser } = useUser();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        goal: '',
        level: ''
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Complete onboarding
            updateUser({ ...formData, onboarded: true, joinedAt: new Date().toISOString() });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const canProceed = () => {
        const step = steps[currentStep];
        return formData[step.id] && formData[step.id].length > 0;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
            <div className="w-full max-w-md">
                {/* Progress Bar */}
                <div className="mb-8 flex gap-2">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-primary shadow-[0_0_10px_rgba(0,242,234,0.5)]' : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{steps[currentStep].title}</h2>
                        <p className="text-slate-300 mb-8 text-lg">{steps[currentStep].subtitle}</p>

                        {steps[currentStep].type === 'text' && (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={steps[currentStep].placeholder}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-black/40 transition-all text-lg backdrop-blur-sm"
                                autoFocus
                            />
                        )}

                        {steps[currentStep].type === 'select' && (
                            <div className="space-y-3">
                                {steps[currentStep].options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFormData({ ...formData, [steps[currentStep].id]: option.value })}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300 group ${formData[steps[currentStep].id] === option.value
                                                ? 'bg-primary/20 border-primary/50 text-white shadow-[0_0_15px_rgba(0,242,234,0.1)]'
                                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:scale-[1.02]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {option.icon && <span className="text-2xl filter drop-shadow-md">{option.icon}</span>}
                                            <div className="text-left">
                                                <div className={`font-bold text-lg ${formData[steps[currentStep].id] === option.value ? 'text-primary' : 'text-white'}`}>
                                                    {option.label}
                                                </div>
                                                {option.desc && <div className="text-xs text-slate-400 font-medium">{option.desc}</div>}
                                            </div>
                                        </div>
                                        {formData[steps[currentStep].id] === option.value && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                <Check className="w-6 h-6 text-primary drop-shadow-[0_0_5px_rgba(0,242,234,0.8)]" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleBack}
                        className={`flex items-center text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={`flex items-center px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${canProceed()
                                ? 'bg-primary text-darker hover:shadow-[0_0_30px_rgba(0,242,234,0.4)] hover:scale-105 active:scale-95'
                                : 'bg-white/10 text-slate-500 cursor-not-allowed backdrop-blur-sm'
                            }`}
                    >
                        {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                        <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
