'use client';

import { useState } from 'react';
import { saveApiKey } from '@/lib/storage/apiKeyStorage';

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
}

export default function ApiKeyInput({ onApiKeySet }: ApiKeyInputProps) {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      saveApiKey(key);
      onApiKeySet(key);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Enter OpenRouter API Key</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Get your API key from{' '}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 dark:text-gray-100 underline"
          >
            OpenRouter
          </a>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Using OpenAI GPT-4o model via OpenRouter.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            type="submit"
            className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition"
          >
            Save API Key
          </button>
        </form>
      </div>
    </div>
  );
}
