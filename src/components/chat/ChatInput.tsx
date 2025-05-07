import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useChatContext } from './ChatContext';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { addMessage } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage(input.trim(), 'user');
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t border-gray-200 p-3 bg-white"
    >
      <div className="flex items-center space-x-2 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 py-2 px-4 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className={`p-2 rounded-full ${
            input.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
          } transition-colors duration-200`}
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;