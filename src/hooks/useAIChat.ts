import { useState, useCallback } from 'react';

// Exported types
export interface ChatMessage {
  id: string;
  from: 'ai' | 'user';
  text: string;
  time: Date;
}

export interface UseAIChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  sendUserMessage: (text: string) => void;
  addAIMessage: (text: string) => void;
  requestRecommendation: (driveId: string) => Promise<string>;
  clearChat: () => void;
}

// Canned AI responses for simulation
const AI_RESPONSES = [
  "I understand you need help with secure data wiping. What specific drive would you like to wipe?",
  "For maximum security, I recommend using DoD 5220.22-M method with multiple passes.",
  "Before we proceed, please ensure you have backed up any important data you wish to keep.",
  "The wipe process will be irreversible. Are you ready to continue?",
  "I can help you choose the best wipe method based on your security requirements.",
  "Blockchain verification will provide cryptographic proof of successful data destruction."
];

// Hook implementation
export const useAIChat = (): UseAIChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addMessage = useCallback((from: 'ai' | 'user', text: string) => {
    const message: ChatMessage = {
      id: generateMessageId(),
      from,
      text,
      time: new Date(),
    };
    setMessages(prev => [...prev, message]);
    return message;
  }, [generateMessageId]);

  const sendUserMessage = useCallback((text: string) => {
    const userMessage = addMessage('user', text);
    
    // Simulate AI response after user message
    setTimeout(() => {
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      addAIMessage(randomResponse);
    }, 1500);

    return userMessage;
  }, [addMessage]);

  const addAIMessage = useCallback((text: string) => {
    setIsTyping(true);
    
    // Simulate AI typing delay (1.5 seconds as requested)
    setTimeout(() => {
      addMessage('ai', text);
      setIsTyping(false);
    }, 1500);

    // TODO: Replace simulation with real AI API call:
    // Option 1: Direct API call to AI service
    // const response = await fetch('/api/ai/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: text, context: messages })
    // });
    
    // Option 2: Tauri command to Rust backend
    // const aiResponse = await invoke('get_ai_response', { 
    //   message: text, 
    //   conversation: messages 
    // });
    
    // Option 3: Direct LLM integration (OpenAI, Anthropic, etc.)
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: text }]
    // });
  }, [addMessage]);

  const requestRecommendation = useCallback(async (driveId: string): Promise<string> => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // TODO: Replace this simulation with real AI recommendation API:
    // const recommendation = await invoke('get_wipe_recommendation', { 
    //   driveId,
    //   driveInfo: await invoke('analyze_drive', { driveId })
    // });
    
    // Simulated recommendation logic based on drive characteristics
    const recommendations = [
      'DoD 5220.22-M (3-pass) - Recommended for standard security',
      'NIST 800-88 Purge - Government standard for classified data',
      'Random Data Overwrite (7-pass) - High security for sensitive data',
      'Cryptographic Erasure - Fastest for encrypted drives',
      'Gutmann Method (35-pass) - Maximum security (legacy drives)',
      'Single Pass Zero Fill - Basic security, fastest completion'
    ];
    
    // Generate consistent recommendation based on drive ID
    const driveHash = driveId.split('').reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);
    
    const selectedMethod = recommendations[Math.abs(driveHash) % recommendations.length];
    
    setIsTyping(false);
    
    // Automatically add AI message with recommendation
    setTimeout(() => {
      addMessage('ai', `Based on analysis of ${driveId}, I recommend: ${selectedMethod}`);
    }, 500);
    
    return selectedMethod;
  }, [addMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  return {
    messages,
    isTyping,
    sendUserMessage,
    addAIMessage,
    requestRecommendation,
    clearChat,
  };
};

/*
Example usage:

const ChatInterface = () => {
  const { 
    messages, 
    isTyping, 
    sendUserMessage, 
    addAIMessage,
    requestRecommendation,
    clearChat 
  } = useAIChat();

  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendUserMessage(inputText);
      setInputText('');
    }
  };

  const handleGetRecommendation = async () => {
    const driveId = '/dev/sda1'; // Example drive
    try {
      const recommendation = await requestRecommendation(driveId);
      console.log('AI Recommendation:', recommendation);
    } catch (error) {
      console.error('Failed to get recommendation:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>AI Assistant</h3>
        <button onClick={clearChat} className="clear-btn">Clear Chat</button>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.from}`}>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.time.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message ai typing">
            <div className="message-content">
              <div className="typing-indicator">AI is typing...</div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about secure data wiping..."
          rows={2}
        />
        <div className="input-actions">
          <button 
            onClick={handleSendMessage} 
            disabled={!inputText.trim() || isTyping}
          >
            Send
          </button>
          <button 
            onClick={handleGetRecommendation}
            disabled={isTyping}
          >
            Get Recommendation
          </button>
        </div>
      </div>
    </div>
  );
};
*/