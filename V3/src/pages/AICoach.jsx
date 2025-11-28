import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { AIRouter } from '../services/AIRouter';
import { exerciseNegotiator } from '../services/ExerciseNegotiator';
import ExerciseSearchModal from '../components/ExerciseSearchModal';

export default function AICoach() {
    const { user, getMemoryContext } = useUser();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hey ${user?.name || 'there'}! 👋 I'm Coach Adam, your AI fitness partner. Ask me anything about your training, nutrition, or if you need help swapping exercises!`,
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const handleVoiceInput = () => {
        if (recognitionRef.current) {
            if (isListening) {
                recognitionRef.current.stop();
            } else {
                recognitionRef.current.start();
                setIsListening(true);
            }
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Build context
            const memory = getMemoryContext();
            const context = `User Profile: ${JSON.stringify(user)}\nMemory: ${JSON.stringify(memory)}\nCurrent Time: ${new Date().toLocaleTimeString()}\nRecovery Score: ${user.recoveryScore || 0}\n`;

            // Clean messages - remove timestamp property for API compatibility
            const cleanMessages = messages.slice(-5).map(({ role, content }) => ({ role, content }));
            const cleanUserMessage = { role: userMessage.role, content: userMessage.content };

            // Get AI response
            const response = await AIRouter.route('chat', {
                messages: [
                    {
                        role: 'system',
                        content: `You are Coach Adam, an empathetic and knowledgeable AI fitness coach. You have access to the user's complete profile and memory.\n\nContext:\n${context}\n\nGuidelines:\n- Be conversational and supportive\n- Reference user's preferences and history when relevant\n- If user asks to swap an exercise, use the exercise negotiator\n- If user mentions stress or low motivation, suggest gentle recovery\n- Keep responses concise (2-3 sentences max)\n- Use emojis sparingly but meaningfully`
                    },
                    ...cleanMessages,
                    cleanUserMessage
                ]
            });

            const assistantMessage = {
                role: 'assistant',
                content: response.choices?.[0]?.message?.content || response.message || 'I apologize, I had trouble processing that. Can you try again?',
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Quick action suggestions (V3 - 5 buttons including Search exercises)
    const quickActions = [
        { emoji: '💪', text: 'Generate workout', prompt: 'Generate a workout for me today' },
        { emoji: '🔄', text: 'Swap exercise', prompt: 'I want to swap an exercise in my workout' },
        { emoji: '🔍', text: 'Search exercises', action: 'search' },
        { emoji: '📊', text: 'Check progress', prompt: 'How am I progressing?' },
        { emoji: '🍽️', text: 'Meal advice', prompt: 'What should I eat today?' }
    ];

    const handleQuickAction = (action) => {
        if (action.action === 'search') {
            setShowExerciseModal(true);
        } else {
            setInput(action.prompt);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600"
                style={{ animation: 'gradientShift 25s ease infinite', backgroundSize: '200% 200%' }} />

            <div className="relative z-10 min-h-screen flex flex-col pb-20">
                {/* Header */}
                <div className="p-4 glass-card-prominent pt-14">
                    <h1 className="text-2xl font-heading text-white">Coach Adam</h1>
                    <p className="text-gray-300 text-sm">Your AI Fitness Partner</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-4 rounded-2xl ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                        : 'glass-card text-white'}`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className="text-xs opacity-60 mt-1">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="glass-card p-4 rounded-2xl">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-gray-300 mb-2">Quick actions:</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuickAction(action)}
                                    className="flex-shrink-0 px-4 py-2 glass-card rounded-full text-sm text-white hover:bg-white/20 transition"
                                >
                                    <span className="mr-2">{action.emoji}</span>
                                    {action.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 glass-card-prominent">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white/40"
                                rows={1}
                                style={{ minHeight: '48px', maxHeight: '120px' }}
                            />
                            {recognitionRef.current && (
                                <button
                                    onClick={handleVoiceInput}
                                    className={`absolute right-3 bottom-3 p-2 rounded-full transition ${isListening
                                        ? 'bg-red-500 animate-pulse'
                                        : 'bg-white/10 hover:bg-white/20'}`}
                                >
                                    {isListening ? '⏹️' : '🎤'}
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Exercise Search Modal (V3 feature) */}
            <ExerciseSearchModal isOpen={showExerciseModal} onClose={() => setShowExerciseModal(false)} />
        </div>
    );
}
