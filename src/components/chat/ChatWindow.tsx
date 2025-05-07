import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChatContext } from './ChatContext';
import { X, MinusIcon } from 'lucide-react';

const ChatWindow: React.FC = () => {
  const { messages, isOpen, toggleChat, isTyping } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 md:right-8 w-[90vw] sm:w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col z-50 max-h-[70vh] transition-all duration-300 animate-slideUp">
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <div className="text-xs font-semibold">AI</div>
          </div>
          <div>
            <h3 className="font-medium">AI Assistant</h3>
            <div className="text-xs opacity-80 flex items-center">
              {isTyping ? (
                <span className="flex items-center">
                  <span className="mr-1">Typing</span>
                  <span className="flex space-x-1">
                    <span className="animate-bounce delay-0 h-1 w-1 bg-white rounded-full inline-block"></span>
                    <span className="animate-bounce delay-150 h-1 w-1 bg-white rounded-full inline-block"></span>
                    <span className="animate-bounce delay-300 h-1 w-1 bg-white rounded-full inline-block"></span>
                  </span>
                </span>
              ) : (
                <span>Online</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={toggleChat}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Minimize chat"
          >
            <MinusIcon size={16} />
          </button>
          <button 
            onClick={toggleChat}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex space-x-1 items-center justify-center h-5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput />
    </div>
  );
};

export default ChatWindow;