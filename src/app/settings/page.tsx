'use client';

import { useTheme } from '@/lib/theme/ThemeProvider';
import { clearApiKey } from '@/lib/storage/apiKeyStorage';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleClearApiKey = () => {
    if (confirm('Clear your API key? You will need to enter it again.')) {
      clearApiKey();
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Chat
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Appearance</h2>

          <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose between light and dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-10 w-20 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                  theme === 'dark' ? 'translate-x-11' : 'translate-x-1'
                }`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>
          </div>

          <div className="py-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current theme: <span className="font-semibold">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </p>
          </div>
        </div>

        {/* API Configuration Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">API Configuration</h2>

          <div className="py-3">
            <button
              onClick={handleClearApiKey}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Clear API Key
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Remove your stored Groq API key. You'll need to enter it again.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">About</h2>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong className="text-gray-900 dark:text-white">Version:</strong> 1.0.0
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Framework:</strong> Next.js 15 with App Router
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">AI Model:</strong> Llama 3.3 70B via Groq
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Architecture:</strong> Event-Driven with EventBus Pattern
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
