export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  isOpen: boolean;
  toggleChat: () => void;
  isTyping: boolean;
}