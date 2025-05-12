import React from 'react';
import ChatToggle from './ChatToggle';
import ChatWindow from './ChatWindow';
import { ChatProvider } from './ChatContext';

// Add animation classes to tailwind
const injectTailwindAnimations = `
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out forwards;
}

.delay-0 {
  animation-delay: 0ms;
}

.delay-150 {
  animation-delay: 150ms;
}

.delay-300 {
  animation-delay: 300ms;
}
`;

const ChatBot = () => {
  return (
    <ChatProvider>
      <style>{injectTailwindAnimations}</style>
      <ChatToggle />
      <ChatWindow />
    </ChatProvider>
  );
};

export default ChatBot;