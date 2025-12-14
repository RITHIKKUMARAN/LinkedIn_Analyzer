import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { gsap } from 'gsap';
import { api } from '../services/api';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

export const AiAnalyst = ({ pageId }: { pageId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I analyze data voids. Is there existing data you'd like me to interpret, or missing data you want me to hypothesize about?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Toggle Chat
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    // Animation on open
    useEffect(() => {
        if (isOpen && chatRef.current) {
            gsap.fromTo(chatRef.current,
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await api.chatWithAnalyst(pageId, userMsg.text);
            const aiMsg: Message = { id: Date.now() + 1, text: response.response, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm having trouble connecting to the matrix. Please try again.", sender: 'ai' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-auto">

            {/* Chat Window */}
            {isOpen && (
                <div
                    ref={chatRef}
                    className="mb-4 w-[350px] h-[500px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">AI Analyst</h3>
                                <p className="text-xs text-blue-300">Powered by Gemini</p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`
                                    max-w-[80%] p-3 rounded-2xl text-sm
                                    ${msg.sender === 'user'
                                        ? 'bg-blue-600/80 text-white rounded-br-none'
                                        : 'bg-white/10 text-gray-200 rounded-bl-none backdrop-blur-md'}
                                `}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75" />
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about this company..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-blue-300 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={toggleChat}
                className={`
                    w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 
                    flex items-center justify-center shadow-lg shadow-blue-900/40
                    hover:scale-110 active:scale-95 transition-transform duration-300
                    group relative overflow-visible
                `}
            >
                {/* Multiple Ripple Effects */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span className="absolute inline-flex h-[120%] w-[120%] rounded-full bg-purple-400 opacity-50 animate-ping" style={{ animationDelay: '0.5s' }}></span>
                <span className="absolute inline-flex h-[140%] w-[140%] rounded-full bg-pink-400 opacity-30 animate-ping" style={{ animationDelay: '1s' }}></span>

                {isOpen ? (
                    <X className="text-white w-6 h-6 relative z-10" />
                ) : (
                    <Bot className="text-white w-6 h-6 relative z-10 group-hover:animate-pulse" />
                )}
            </button>
        </div>
    );
};
