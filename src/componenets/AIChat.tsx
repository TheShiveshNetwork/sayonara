import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

// --- Prop Types ---
type Message = { id: string; from: 'ai' | 'user'; text: string };
export type AIChatProps = {
  messages: Message[];
  isTyping?: boolean;
  onAction: (action: string) => void;
  onSend: (text: string) => void;
};

const AIChat: FC<AIChatProps> = ({ messages, isTyping, onAction, onSend }) => {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="font-inter flex flex-col h-full max-h-[90vh] w-full max-w-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl shadow-purple-900/20">
      {/* Messages Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
                msg.from === 'ai'
                  ? 'bg-gradient-to-br from-purple-700 to-purple-600 text-white rounded-bl-none'
                  : 'bg-gray-800 text-gray-300 rounded-br-none'
              }`}
            >
              <p className="text-sm font-normal leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-800 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s] shadow-[0_0_8px_#9333EA]"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s] shadow-[0_0_8px_#9333EA]"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_8px_#9333EA]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      {/* Input Area */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex justify-center gap-2 mb-4">
          <button onClick={() => onAction('start_wipe')} className="px-4 py-1.5 text-xs font-semibold text-purple-200 bg-purple-900/50 rounded-full hover:bg-purple-800/70 hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all">Start Wipe</button>
          <button onClick={() => onAction('verify')} className="px-4 py-1.5 text-xs font-semibold text-purple-200 bg-purple-900/50 rounded-full hover:bg-purple-800/70 hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all">Verify Blockchain</button>
          <button onClick={() => onAction('logs')} className="px-4 py-1.5 text-xs font-semibold text-purple-200 bg-purple-900/50 rounded-full hover:bg-purple-800/70 hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all">Check Logs</button>
        </div>
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sayonara..."
            className="flex-1 w-full px-4 py-2.5 text-gray-200 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
          />
          <button type="submit" className="p-2.5 text-white bg-purple-600 rounded-lg shadow-md shadow-purple-600/30 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/40 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;

/*
// --- Example Usage ---
const sampleMessages = [
  { id: '1', from: 'ai', text: 'Welcome to Sayonara. Select a drive to begin the secure wipe process.' },
  { id: '2', from: 'user', text: 'Which drive is my OS on?' },
  { id: '3', from: 'ai', text: 'Your primary OS is on "SAMSUNG 980 PRO". I recommend the "Deep Wipe" for system drives.' },
];
<AIChat messages={sampleMessages} isTyping={true} onAction={console.log} onSend={console.log} />
*/