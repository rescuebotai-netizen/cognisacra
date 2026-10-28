import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sendMessageToBot } from '../services/geminiService';
import { ChatMessage } from '../types';
import ChatBubbleBottomCenterTextIcon from './icons/ChatBubbleBottomCenterTextIcon';
import XMarkIcon from './icons/XMarkIcon';
import SparklesIcon from './icons/SparklesIcon';
import LinkIcon from './icons/LinkIcon';
import MapPinIcon from './icons/MapPinIcon';
import { GroundingChunk } from '@google/genai';
import ThumbsUpIcon from './icons/ThumbsUpIcon';
import ThumbsDownIcon from './icons/ThumbsDownIcon';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn("Could not get user location for Maps Grounding:", error.message);
                }
            );
        }
    }, [isOpen]);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFeedback = (messageId: string, feedback: 'good' | 'bad') => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === messageId ? { ...msg, feedback: feedback } : msg
            )
        );
        console.log(`Feedback for message ${messageId}: ${feedback}`);
    };

    const handleSend = useCallback(async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setGroundingChunks([]);
        const aiMessageId = `ai-${Date.now()}`;
        setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

        try {
            const stream = await sendMessageToBot(input, location);
            let aiResponseText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                aiResponseText += chunkText;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    newMessages[newMessages.length - 1] = { ...lastMessage, text: aiResponseText };
                    return newMessages;
                });
                if (chunk.candidates && chunk.candidates[0].groundingMetadata?.groundingChunks) {
                    setGroundingChunks(chunk.candidates[0].groundingMetadata.groundingChunks);
                }
            }
        } catch (error) {
            console.error('Error sending message to bot:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                newMessages[newMessages.length - 1] = { ...lastMessage, text: 'Sorry, I encountered an error.' };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, location]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-crimson text-white p-4 rounded-full shadow-lg hover:bg-red-800 transition-transform hover:scale-110 z-50"
                aria-label="Open AI assistant"
            >
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />
            </button>
        );
    }
    
    return (
        <div className="fixed bottom-6 right-6 w-[90vw] max-w-sm h-[70vh] max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in">
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <SparklesIcon className="w-6 h-6 text-crimson" />
                    <h2 className="ml-2 font-bold text-lg">AI Assistant</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        <div className={`max-w-xs p-3 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-crimson text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
                            }`}>
                            <p className="whitespace-pre-wrap text-sm">{msg.text || '...'}</p>
                             {msg.sender === 'ai' && msg.text && !(isLoading && index === messages.length - 1) && (
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 flex items-center gap-3">
                                    {msg.feedback ? (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">Thank you for your feedback!</p>
                                    ) : (
                                        <>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Helpful?</p>
                                            <button 
                                                onClick={() => handleFeedback(msg.id, 'good')} 
                                                className="p-1 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50" 
                                                aria-label="Good response"
                                            >
                                                <ThumbsUpIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleFeedback(msg.id, 'bad')} 
                                                className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" 
                                                aria-label="Bad response"
                                            >
                                                <ThumbsDownIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {groundingChunks.length > 0 && (
                     <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Sources:</p>
                        {groundingChunks.map((chunk, i) => (
                            <div key={i}>
                                {chunk.web && (
                                    <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                        <LinkIcon className="w-3 h-3"/>
                                        <span className="truncate">{chunk.web.title}</span>
                                    </a>
                                )}
                                {chunk.maps && (
                                    <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                        <MapPinIcon className="w-3 h-3"/>
                                        <span className="truncate">{chunk.maps.title}</span>
                                    </a>
                                )}
                            </div>
                        ))}
                     </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                        placeholder="Ask anything..."
                        className="w-full pl-3 pr-20 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-crimson"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-crimson text-white rounded-full text-sm font-semibold hover:bg-red-800 disabled:bg-red-400"
                    >
                        {isLoading ? '...' : 'Send'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Chatbot;
