"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "bot";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}

const STORAGE_KEY = "chatbot_sessions";

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- load chat session
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const sessions: ChatSession[] = JSON.parse(saved);
      const latest = sessions.sort(
        (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      )[0];
      if (latest) {
        setMessages(
          latest.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
        );
        setConversationId(latest.id);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    }
  }, []);

  const saveSession = (updated: Message[]) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let sessions: ChatSession[] = saved ? JSON.parse(saved) : [];
      const idx = sessions.findIndex((s) => s.id === conversationId);

      const session: ChatSession = {
        id: conversationId,
        messages: updated,
        createdAt: idx === -1 ? new Date() : sessions[idx].createdAt,
        lastUpdated: new Date(),
      };

      if (idx === -1) sessions.push(session);
      else sessions[idx] = session;

      sessions = sessions
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 10);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (err) {
      console.error("Error saving session:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInputValue("");
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, conversationId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to get response");

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        content: data.response,
        role: "bot",
        timestamp: new Date(),
      };
      const final = [...updated, botMessage];
      setMessages(final);
      setConversationId(data.conversationId);
      saveSession(final);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId("");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Animations */}
      <style jsx global>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 
              0 0 20px rgba(59, 130, 246, 0.3),
              0 0 40px rgba(59, 130, 246, 0.2),
              0 0 60px rgba(59, 130, 246, 0.1);
          }
          50% {
            box-shadow: 
              0 0 30px rgba(59, 130, 246, 0.4),
              0 0 60px rgba(59, 130, 246, 0.3),
              0 0 90px rgba(59, 130, 246, 0.2);
          }
        }
        
        .glow-effect {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        .sparkle-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: linear-gradient(45deg, #ffd700, #fff);
          border-radius: 50%;
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .sparkle:nth-child(1) {
          top: 10%;
          left: 20%;
          animation-delay: 0s;
        }

        .sparkle:nth-child(2) {
          top: 30%;
          right: 15%;
          animation-delay: 0.3s;
        }

        .sparkle:nth-child(3) {
          bottom: 25%;
          left: 15%;
          animation-delay: 0.6s;
        }

        .sparkle:nth-child(4) {
          bottom: 10%;
          right: 25%;
          animation-delay: 0.9s;
        }

        .sparkle:nth-child(5) {
          top: 50%;
          left: 10%;
          animation-delay: 1.2s;
        }

        .sparkle:nth-child(6) {
          top: 20%;
          right: 30%;
          animation-delay: 0.15s;
        }
      `}</style>

      {/* Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen ? (
          <div className="relative group">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="h-12 w-12 rounded-full shadow-md transition-all duration-300 bg-gray-900 hover:bg-gray-800 hover:shadow-lg hover:scale-105"
              size="icon"
            >
              <Bot className="h-5 w-5 text-white" />
            </Button>
            
            {/* Sparkle Effect on Hover */}
            <div className="sparkle-container opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="h-12 w-12 rounded-full shadow-md"
            size="icon"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 h-96 md:w-96 md:h-[500px]">
          <Card className={`flex flex-col h-full transition-all duration-300 ${isOpen ? 'glow-effect' : ''}`}>
            <CardHeader className="flex h-14 flex-row items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <CardTitle className="text-base">Assistant</CardTitle>
              </div>
              <Button
                variant="outline"
                onClick={clearChat}
                className="text-xs px-2 py-1 h-8"
              >
                <X className="h-3 w-3 mr-1" />
                clear chat
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                    <div className="relative mb-4">
                      <Bot className="h-10 w-10 relative z-10 opacity-70" />
                    </div>
                    <p className="text-sm">Hello! Start a conversation below.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-2 ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {m.role === "bot" && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-20"></div>
                            <Bot className="h-4 w-4 relative z-10" />
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] rounded-lg p-2 text-sm transition-all duration-200 hover:scale-[1.02] ${
                            m.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.content}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {m.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {m.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
                          <Bot className="h-4 w-4 relative z-10" />
                        </div>
                        <div className="bg-muted p-2 rounded-lg rounded-bl-none text-sm flex items-center gap-2 text-muted-foreground">
                          <div className="relative">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm opacity-30 animate-pulse"></div>
                          </div>
                          Thinking...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {error && (
                <div className="p-2 border-t text-sm text-destructive bg-destructive/10 border-destructive/20">
                  {error}
                </div>
              )}

              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}