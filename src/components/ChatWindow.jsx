import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your Sayonara security assistant. I can help you understand drive erasure options and security protocols.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), type: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await invoke('chat_query', { q: userMessage.content });
      const assistantMessage = { id: Date.now() + 1, type: 'assistant', content: response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat query failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col h-96">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Security Assistant
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about drive erasure..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus-ring bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 focus-ring"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;