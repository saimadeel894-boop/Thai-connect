"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const initialBotMessage: ChatMessage = {
  id: "welcome",
  text: "Hi! I'm your ThaiConnect assistant. How can I help you today?",
  sender: "bot",
  timestamp: new Date(),
};

const suggestedQuestions = [
  "How do I upgrade to premium?",
  "How do I change my profile?",
  "Report a problem",
  "Account & billing",
];

const botResponses: Record<string, string> = {
  "how do i upgrade to premium?": "To upgrade to premium, click the Settings icon in the top right, then select 'Upgrade to Premium'. You can choose between monthly ($29.99) or yearly ($19.99/month) plans!",
  "how do i change my profile?": "To edit your profile, click on the profile icon (person symbol) next to the settings. This will open your profile where you can edit all your information, photos, and interests.",
  "report a problem": "I'm sorry you're experiencing issues! You can report problems by going to Settings > Privacy & Safety > Report User. For technical issues, please email support@thaiconnect.com",
  "account & billing": "For account and billing questions, go to Settings > Account Settings. You can manage your email, phone, password, and payment methods there. For specific billing questions, email billing@thaiconnect.com",
  "default": "I'm here to help! You can ask me about premium upgrades, profile editing, reporting issues, or account management. What would you like to know?",
};

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

export default function ChatBot({ isOpen, onClose, onMinimize, isMinimized }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    return botResponses[lowerMessage] || botResponses["default"];
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: getBotResponse(messageText),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onMinimize}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl transition hover:scale-110"
        >
          <span className="text-2xl">💬</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-96 flex-col rounded-2xl border border-gray-800 bg-black shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-white">ThaiConnect Support</h3>
            <p className="text-xs text-gray-400">Ask me anything</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-900 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-red-500 text-white"
                  : "bg-gray-900 text-white border border-gray-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
              <div className="flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (only show initially) */}
      {messages.length === 1 && (
        <div className="border-t border-gray-800 p-4">
          <p className="mb-2 text-xs text-gray-400">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSend(question)}
                className="rounded-full bg-gray-900 px-3 py-1.5 text-xs text-white transition hover:bg-gray-800"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 rounded-lg bg-gray-900 border border-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 transition focus:border-red-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
