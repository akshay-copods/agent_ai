import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { useChatContext } from './ChatContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { addMessage, messages } = useChatContext();

  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);


  // useEffect(() => {
  //   // add sample collection and document in firestore db
  //   async function addUser() {
  //     const userRef = collection(db, 'users');
  //     const docRef = await addDoc(userRef, {
  //       name: 'John Doe',
  //       email: 'john.doe@example.com',
  //     });
  //     console.log("User added", userRef.id)
  //   }
  //   addUser()
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    addMessage(input, 'user');
    setInput('');
    try {
      const res = await fetch('http://localhost:5001/generateLangChain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input, chatHistory: messages }),
      });
      const data = await res.json();
      addMessage(data.text, 'model');
      setResponse(data.text);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to generate text');
    }

    setLoading(false);
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