'use client';

import { useState, useEffect } from 'react';
import { clearApiKey } from '@/lib/storage/apiKeyStorage';
import EventBus from '@/lib/eventbus/EventBus';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [sidebarSize, setSidebarSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Subscribe to sidebar resize events
  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribe = eventBus.subscribe(
      'SIDEBAR_RESIZE',
      (payload: { size: 'small' | 'medium' | 'large' }) => {
        setSidebarSize(payload.size);
      }
    );

    return unsubscribe;
  }, []);

  const handleClearApiKey = () => {
    if (confirm('Are you sure you want to clear your API key? You will need to enter it again.')) {
      clearApiKey();
      window.location.reload();
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear all chat messages?')) {
      const eventBus = EventBus.getInstance();
      eventBus.emit({
        type: 'CLEAR_CHAT',
        payload: { confirm: true },
        timestamp: Date.now(),
      });
    }
  };

  if (!isOpen) return null;

  const isActive = (path: string) => pathname === path;

  // Map size to Tailwind width classes
  const sizeClasses = {
    small: 'w-64',   // 16rem
    medium: 'w-80',  // 20rem
    large: 'w-96',   // 24rem
  };

  return (
    <div className={`${sizeClasses[sidebarSize]} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg flex-shrink-0 h-full overflow-hidden transition-all duration-300`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5 text-gray-900 dark:text-gray-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Navigation */}
              <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Navigation
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/"
                    className={`block px-3 py-2 text-sm rounded-lg transition ${
                      isActive('/')
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    💬 Chat
                  </Link>
                  <Link
                    href="/form"
                    className={`block px-3 py-2 text-sm rounded-lg transition ${
                      isActive('/form')
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    📝 Form
                  </Link>
                  <Link
                    href="/settings"
                    className={`block px-3 py-2 text-sm rounded-lg transition ${
                      isActive('/settings')
                        ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    ⚙️ Settings
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Actions
                </h3>
                <button
                  onClick={handleClearChat}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition"
                >
                  🗑️ Clear Chat
                </button>
                <button
                  onClick={handleClearApiKey}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition"
                >
                  🔑 Change API Key
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition"
                >
                  🔄 Refresh Chat
                </button>
              </div>

              {/* Resources */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Resources
                </h3>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition underline"
                >
                  🔗 Get Groq API Key
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition underline"
                >
                  📖 View on GitHub
                </a>
              </div>

              {/* About EventBus */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                  About This App
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                  This application demonstrates event-driven architecture using the EventBus pattern.
                  All components communicate through events, ensuring loose coupling and scalability.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Built with Next.js & EventBus Pattern
            </p>
          </div>
        </div>
    </div>
  );
}
