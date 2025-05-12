import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((content, role) => {
    const newMessage = {
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