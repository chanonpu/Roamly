import React, { useState } from 'react';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface AiTravelAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  destinationContext?: string;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiTravelAssistant: React.FC<AiTravelAssistantProps> = ({
  isOpen,
  onClose,
  destinationContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello! I'm your Roamly AI Travel Concierge. Ask me anything about destination tips, cultural etiquette, transit passes, or hidden local food spots for ${destinationContext || 'your upcoming trip'}!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    setMessages(prev => [...prev, {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setLoading(true);

    try {
      const { reply } = await api.aiChat(userText, destinationContext);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: reply || "I'm having trouble retrieving details right now, but feel free to ask again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I couldn't reach the concierge backend just now — but as a quick tip: carry a local transit card, download offline maps, and check out local food markets!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-chat-drawer" className="fixed bottom-4 left-4 right-4 sm:left-auto z-50 sm:w-96 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[calc(100dvh-2rem)] animate-fade-in">

      <div className="bg-gradient-to-r from-sky-700 to-sky-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-serif-heading">Roamly AI Concierge</h3>
            <span className="text-[10px] text-sky-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Connected to Roamly API
            </span>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50 dark:bg-stone-950 text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-sky-700 text-white flex items-center justify-center text-[10px] shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`p-3 rounded-2xl max-w-[80%] ${
              m.sender === 'user'
                ? 'bg-sky-700 text-white rounded-tr-none shadow-md'
                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-tl-none border border-stone-200 dark:border-stone-700 shadow-xs'
            }`}>
              <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
              <span className="text-[9px] opacity-70 block text-right mt-1">{m.timestamp}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-stone-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-700 dark:text-sky-400" />
            <span>AI Concierge thinking...</span>
          </div>
        )}
      </div>

      <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          maxLength={1000}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask tipping, transit, weather..."
          className="flex-1 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-sky-600/40"
        />

        <button
          onClick={handleSendMessage}
          disabled={loading || !inputQuery.trim()}
          className="p-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white shadow-md disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
