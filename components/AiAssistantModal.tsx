import React, { useState, useEffect, useRef } from 'react';
import { AiAssistantContent, PricingContent, Language } from '../types';

interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
  isPricing?: boolean;
}

// FIX: Removed comment as 'import.meta.env' with type casting is a valid workaround.
const apiKey = (import.meta as any).env.VITE_DEEP_SEEK_API_KEY;
const CHAT_HISTORY_KEY = 'tourcare_ai_chat_history';

const AiAssistantModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  aiAssistantContent: AiAssistantContent;
  pricingContent: PricingContent;
  lang: Language;
}> = ({ isOpen, onClose, aiAssistantContent, pricingContent, lang }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const systemInstruction = `You are a helpful and friendly assistant for TourCare.ai, an AI Operating System for tour operators. Your goal is to answer questions about features, pricing, and help users understand the service. If asked to book a consultation, guide them to use the "Book a Consultation" button on the website. Be concise and helpful.`;

  useEffect(() => {
    if (isOpen) {
      if (!apiKey) {
        console.error("VITE_DEEP_SEEK_API_KEY is not set. The AI Assistant cannot function.");
        setMessages([{
          role: 'system',
          text: "Sorry, the AI Assistant is not configured correctly. An API key is missing."
        }]);
        return;
      }
      
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
          try {
            const parsedHistory = JSON.parse(savedHistory);
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
              setMessages(parsedHistory);
            } else {
              setMessages([{ role: 'system', text: aiAssistantContent.initialMessage }]);
            }
          } catch (e) {
            setMessages([{ role: 'system', text: aiAssistantContent.initialMessage }]);
          }
      } else {
        setMessages([{ role: 'system', text: aiAssistantContent.initialMessage }]);
      }
    }
  }, [isOpen, aiAssistantContent.initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Save history to localStorage
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages, isOpen]);

  const handleClearChat = () => {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setMessages([{ role: 'system', text: aiAssistantContent.initialMessage }]);
  };


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Command handling (local)
    if (input.toLowerCase().includes('pricing')) {
        setMessages(prev => [...prev, { role: 'model', text: pricingContent.title, isPricing: true }]);
        setIsLoading(false);
        return;
    }
    
    if (input.toLowerCase().includes('book') || input.toLowerCase().includes('consultation')) {
        setMessages(prev => [...prev, { role: 'model', text: "Great! You can book a free consultation by clicking the 'Book a Consultation' button in the header or on the homepage. I can't book it for you directly from here." }]);
        setIsLoading(false);
        return;
    }

    // DeepSeek API response
    try {
        const apiMessages = [
            { role: 'system', content: systemInstruction },
            ...newMessages
                .filter(m => m.role !== 'system' && !m.isPricing)
                .map(m => ({
                    role: m.role === 'model' ? 'assistant' : m.role,
                    content: m.text,
                }))
        ];

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: apiMessages,
                stream: true,
            }),
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.substring(6);
                    if (data.trim() === '[DONE]') {
                        setIsLoading(false);
                        return;
                    }
                    try {
                        const chunk = JSON.parse(data);
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                           setMessages(prev => {
                                const newMessages = [...prev];
                                const lastMessage = newMessages[newMessages.length - 1];
                                if (lastMessage && lastMessage.role === 'model') {
                                    lastMessage.text += content;
                                }
                                return newMessages;
                            });
                        }
                    } catch (e) {
                        console.error('Error parsing stream chunk:', data, e);
                    }
                }
            }
        }

    } catch (error) {
        console.error("DeepSeek API error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4 sm:justify-end" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-md h-[70vh] rounded-lg shadow-2xl flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center">
            <div>
                <h2 id="ai-modal-title" className="font-bold text-lg">{aiAssistantContent.title}</h2>
                <p className="text-sm text-gray-500">{aiAssistantContent.description}</p>
            </div>
            <div className="flex items-center gap-2">
                <button 
                  onClick={handleClearChat} 
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label={aiAssistantContent.clearChat} 
                  title={aiAssistantContent.clearChat}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
                <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-brand-accent text-white rounded-lg p-3 max-w-xs break-words">{msg.text}</div>
                ) : (
                  msg.isPricing ? (
                    <div className="bg-gray-100 rounded-lg p-4 max-w-xs w-full">
                        <h3 className="font-bold text-gray-900 mb-4">{pricingContent.title}</h3>
                        <div className="space-y-4">
                            {pricingContent.plans.map(plan => (
                                <div key={plan.name} className="border-l-4 border-brand-accent/50 pl-3">
                                    <p className="font-bold">{plan.name} - {plan.price}</p>
                                    <ul className="text-sm text-gray-600 list-disc list-inside">
                                        {plan.features.slice(0, 2).map((feat, i) => <li key={i}>{feat}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs break-words">{msg.text}</div>
                  )
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'model' && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                        <span className="animate-pulse">...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={aiAssistantContent.inputPlaceholder}
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
              disabled={isLoading || !apiKey}
            />
            <button type="submit" className="bg-brand-accent text-white font-bold px-5 py-2 rounded-md hover:bg-brand-accent-hover transition disabled:bg-gray-400" disabled={isLoading || !input.trim() || !apiKey}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default AiAssistantModal;