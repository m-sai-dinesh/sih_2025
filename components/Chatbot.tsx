
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { useTranslation } from '../hooks/useTranslation';

// --- Interfaces & Icons ---

interface Message {
    role: 'user' | 'model';
    text: string;
}

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


// --- Markdown Renderer ---

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderHtml = () => {
        // Replace **text** with <strong>text</strong>
        let processedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle unordered lists starting with * or -
        processedContent = processedContent.replace(/^\s*([*-])\s+(.*)/gm, '<ul><li class="ml-4">$2</li></ul>');
        processedContent = processedContent.replace(/<\/ul>\n<ul>/g, ''); // Merge consecutive lists

        return processedContent.replace(/\n/g, '<br />');
    };

    return <div className="space-y-2" dangerouslySetInnerHTML={{ __html: renderHtml() }} />;
};


// --- Main Chatbot Component ---

const Chatbot: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chatRef.current) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                         systemInstruction: `You are 'Suraksha Sahayak', a specialized AI assistant for the EduDisaster platform, focusing on disaster preparedness within the Indian context. Your primary role is to provide clear, concise, and actionable information about disaster safety.
Your scope is strictly limited to:
1. Preparedness measures for common Indian disasters (e.g., earthquakes, floods, cyclones, tsunamis, heatwaves).
2. Safety procedures during an emergency.
3. Contents of an emergency 'go-bag'.
4. First-aid basics in a disaster scenario.

Use simple language suitable for students and adults. Use markdown for formatting (e.g., * for list items, ** for bold text).

Crucially, if a user asks a question outside this scope (e.g., about celebrities, politics, general knowledge, etc.), you must politely refuse. A good refusal would be: 'My purpose is to help with disaster safety. I can't answer questions on other topics. How can I assist you with preparedness today?'`,
                    }
                });
                setMessages([{ role: 'model', text: t('chatbot.initialMessage') }]);
            } catch (e) {
                console.error("Failed to initialize chatbot:", e);
                setError("Could not connect to the AI service.");
            }
        }
    }, [t]);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage, { role: 'model', text: '' }]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            if (!chatRef.current) {
                throw new Error("Chat session not initialized.");
            }
            const stream = await chatRef.current.sendMessageStream({ message: currentInput });
            
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.text += chunkText;
                    }
                    return newMessages;
                });
            }

        } catch (e) {
            console.error("Error sending message:", e);
            const errorMessage = t('chatbot.error');
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'model' && lastMessage.text === '') {
                    lastMessage.text = errorMessage;
                } else {
                    newMessages.push({ role: 'model', text: errorMessage });
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 right-4 md:right-8 w-full max-w-sm h-[70vh] max-h-[600px] bg-dark-800/80 backdrop-blur-md border border-dark-700 rounded-xl shadow-2xl flex flex-col z-50 transform transition-all duration-300 ease-in-out origin-bottom-right animate-fade-in-up">
                    <header className="bg-dark-900 text-light p-4 flex justify-between items-center flex-shrink-0 rounded-t-xl border-b border-dark-700">
                        <h2 className="font-bold text-lg font-mono">{t('chatbot.header')}</h2>
                        <button onClick={() => setIsOpen(false)} className="text-dark-200 hover:bg-dark-700 p-1 rounded-full" aria-label="Close chat">
                            <CloseIcon />
                        </button>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`px-4 py-2 rounded-xl max-w-xs ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-dark-700 text-dark-200'}`}>
                                    {msg.role === 'model' ? <MarkdownRenderer content={msg.text} /> : msg.text}
                                </div>
                            </div>
                        ))}
                         {isLoading && messages[messages.length - 1]?.text === '' && (
                            <div className="flex justify-start mb-3">
                                <div className="px-4 py-2 rounded-xl bg-dark-700 text-dark-200">
                                    <div className="flex items-center space-x-1">
                                       <span className="w-2 h-2 bg-dark-400 rounded-full animate-pulse"></span>
                                       <span className="w-2 h-2 bg-dark-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                       <span className="w-2 h-2 bg-dark-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-dark-700 bg-dark-800 flex-shrink-0 rounded-b-xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="w-full p-3 pr-12 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-dark-900 text-light placeholder-dark-400 font-mono hover:border-primary transition-colors"
                                disabled={isLoading}
                                aria-label="Chat input"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary disabled:text-dark-500 transition-all duration-200 ease-in-out transform hover:scale-125 hover:text-secondary" disabled={isLoading || !userInput.trim()} aria-label="Send message">
                                <SendIcon />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-4 md:bottom-8 md:right-8 bg-primary text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110 hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-primary/50 hover:shadow-[0_0_20px_theme(colors.primary)]"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </>
    );
};

export default Chatbot;
