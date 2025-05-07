import React from 'react';
import { useChatContext } from './ChatContext';
import { MessageSquare } from 'lucide-react';

const ChatToggle: React.FC = () => {
  const { toggleChat, isOpen } = useChatContext();

  return (
    <button
      onClick={toggleChat}
      className={`fixed bottom-4 right-4 md:right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
      }`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <MessageSquare className="text-white" size={24} />
      <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
    </button>
  );
};

export default ChatToggle;