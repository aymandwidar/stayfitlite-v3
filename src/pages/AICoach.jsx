import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { GroqClient } from '../utils/AI/GroqClient';
import { GeminiClient } from '../utils/AI/GeminiClient';
import { Send, Bot, User, Sparkles, Image as ImageIcon, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AICoach() {
    const { user } = useUser();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hey ${user.name}! I'm Coach Saty. I can build you a custom plan, estimate calories, or show you how to do an exercise. What's on your mind?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Dual-AI Logic
            const lowerInput = input.toLowerCase();
            let responseText = "";

            if (lowerInput.includes('show') || lowerInput.includes('image') || lowerInput.includes('video') || lowerInput.includes('how to')) {
                // Use Gemini for visual generation
                const geminiResponse = await GeminiClient.generateImageDescription(input);

                if (geminiResponse.type === 'image') {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: geminiResponse.content,
                        image: geminiResponse.imageUrl
                    }]);
                    setIsLoading(false);
                    return; // Exit early as we already set the message
                } else {
                    responseText = geminiResponse.content;
                }
            } else {
                // Use Groq (Llama 3.2) for chat/planning
                const history = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
                history.push(userMsg);
                responseText = await GroqClient.chat(history);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I tripped over a dumbbell. Try again?" }]);
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

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="p-4 glass border-b border-white/10 flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,234,0.3)]">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-white">Coach Saty <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">AI Expert</span></h1>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-slate-400">Online (Llama 3.2 + Gemini)</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user'
                                ? 'bg-primary text-darker font-medium rounded-tr-none'
                                : 'glass border-white/10 text-slate-200 rounded-tl-none'
                            }`}>
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {msg.content}
                            </div>
                            {msg.image && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 shadow-lg relative group">
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-white font-bold">AI Generated Visualization</span>
                                    </div>
                                    <img
                                        src={msg.image}
                                        alt="AI Generated Exercise"
                                        className="w-full h-auto object-cover min-h-[200px]"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="glass border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                            <Loader className="w-4 h-4 text-primary animate-spin" />
                            <span className="text-xs text-slate-400">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 glass border-t border-white/10 z-20">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask for a plan, calorie estimate, or exercise tip..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-2 bg-primary rounded-full text-darker hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
