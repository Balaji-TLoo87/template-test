'use client';

import { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Send all messages to AI for processing
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
