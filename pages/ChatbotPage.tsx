
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeEmotion, getChatResponse } from '../services/geminiService';
import type { Message, Emotion, PersonalInfoItem, UploadedFile } from '../types';
import { SendIcon } from '../components/Icons';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-sky-400 rounded-full animate-bounce-dot-1"></div>
        <div className="h-2 w-2 bg-sky-400 rounded-full animate-bounce-dot-2"></div>
        <div className="h-2 w-2 bg-sky-400 rounded-full animate-bounce-dot-3"></div>
    </div>
);

const EmotionBadge: React.FC<{ emotion: Emotion }> = ({ emotion }) => (
    <div className="absolute -top-4 -right-2 bg-gray-700 border-2 border-gray-900 rounded-full px-3 py-1 text-xs flex items-center space-x-1 shadow-lg animate-subtle-pulse">
        <span>{emotion.emoji}</span>
        <span className="font-semibold">{emotion.label}</span>
    </div>
);

const ChatbotPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessageText = input;
        setInput('');
        setIsLoading(true);

        const emotion = await analyzeEmotion(userMessageText);
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userMessageText,
            sender: 'user',
            emotion: emotion,
        };
        setMessages(prev => [...prev, userMessage]);

        const chatHistory = messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        // Retrieve personal info
        const storedInfo = localStorage.getItem('personalInfo');
        const personalInfoItems: PersonalInfoItem[] = storedInfo ? JSON.parse(storedInfo) : [];
        const personalInfoRecord = personalInfoItems.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {} as Record<string, string>);

        // Retrieve uploaded files for RAG
        const storedFiles = localStorage.getItem('uploadedFiles');
        const uploadedFiles: UploadedFile[] = storedFiles ? JSON.parse(storedFiles) : [];


        const aiResponseText = await getChatResponse(userMessageText, chatHistory, personalInfoRecord, uploadedFiles);
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: aiResponseText,
            sender: 'ai',
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    }, [input, isLoading, messages]);


    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden animate-fade-in-up-scale">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end animate-slide-in-chat-right' : 'justify-start animate-slide-in-chat-left'}`}>
                        {msg.sender === 'ai' && <img src="https://picsum.photos/seed/ai-avatar/40" alt="AI Avatar" className="w-10 h-10 rounded-full" />}
                        <div className={`relative max-w-lg px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                           {msg.sender === 'user' && msg.emotion && <EmotionBadge emotion={msg.emotion} />}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start gap-3">
                         <img src="https://picsum.photos/seed/ai-avatar/40" alt="AI Avatar" className="w-10 h-10 rounded-full" />
                        <div className="px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700">
                           <TypingIndicator />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative transition-transform duration-300 focus-within:scale-[1.02]">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="w-full pl-4 pr-12 py-3 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-sky-500 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-sky-600 transition-all duration-300 transform hover:scale-110"
                    >
                        <SendIcon className="h-5 w-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;
