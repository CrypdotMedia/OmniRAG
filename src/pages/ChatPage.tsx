import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      // TODO: Implement AI response logic
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="flex-1 overflow-auto bg-white rounded-lg shadow p-4 mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded-r-lg">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;