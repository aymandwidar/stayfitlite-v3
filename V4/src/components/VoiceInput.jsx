import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceInput({ onInput, placeholder = "Type or speak..." }) {
    const [isListening, setIsListening] = useState(false);
    const [mode, setMode] = useState('voice'); // 'voice' or 'text'
    const [text, setText] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');

                if (event.results[0].isFinal) {
                    onInput(transcript);
                    setIsListening(false);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [onInput]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleTextSubmit = (e) => {
        if (e.key === 'Enter' && text.trim()) {
            onInput(text);
            setText('');
        }
    };

    return (
        <div className="w-full">
            <div className="relative h-16 bg-white/10 rounded-full border border-white/10 flex items-center px-4 backdrop-blur-md overflow-hidden">

                <AnimatePresence mode="wait">
                    {mode === 'text' ? (
                        <motion.div
                            key="text-mode"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex-1 flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyPress={handleTextSubmit}
                                placeholder={placeholder}
                                className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                                autoFocus
                            />
                            <button
                                onClick={() => onInput(text)}
                                className="p-2 text-white/70 hover:text-white"
                            >
                                ➤
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="voice-mode"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex-1 flex items-center justify-between"
                        >
                            {/* Keyboard Toggle */}
                            <button
                                onClick={() => setMode('text')}
                                className="p-2 text-white/70 hover:text-white transition"
                            >
                                ⌨️
                            </button>

                            {/* Waveform Visualization */}
                            <div className="flex-1 flex justify-center items-center gap-1 h-8 mx-4">
                                {isListening ? (
                                    // Active Waveform Animation
                                    <>
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
                                                animate={{
                                                    height: [10, Math.random() * 24 + 10, 10],
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    // Static Waveform
                                    <div className="w-full h-0.5 bg-white/20 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-8 flex items-center justify-center">
                                            <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 12C20 12 20 4 40 12C60 20 60 4 80 12C100 20 100 12 120 12" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" />
                                                <defs>
                                                    <linearGradient id="paint0_linear" x1="0" y1="12" x2="120" y2="12" gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="#60A5FA" stopOpacity="0" />
                                                        <stop offset="0.5" stopColor="#A78BFA" />
                                                        <stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mic Button */}
                            <button
                                onClick={toggleListening}
                                className={`p-2 rounded-full transition ${isListening ? 'text-red-400 scale-110' : 'text-white/70 hover:text-white'}`}
                            >
                                {isListening ? '⏹️' : '🎤'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
