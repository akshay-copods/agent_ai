import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Message, ChatContextType } from './types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I assist you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate typing indicator for AI responses
    if (role === 'user') {
      setIsTyping(true);
      // In a real implementation, this would be handled by your AI integration
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const value = {
    messages,
    addMessage,
    isOpen,
    toggleChat,
    isTyping
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};