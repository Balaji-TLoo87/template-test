'use client';

import { useEffect, useState } from 'react';
import EventBus from '@/lib/eventbus/EventBus';
import GeminiAgent from '@/lib/agents/Agent';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ApiKeyInput from './ApiKeyInput';
import Sidebar from './Sidebar';
import SplitView from '../SplitView';
import { getApiKey } from '@/lib/storage/apiKeyStorage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [agent, setAgent] = useState<GeminiAgent | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [splitView, setSplitView] = useState<{ isOpen: boolean; page: 'settings' | 'form' | 'none' }>({
    isOpen: false,
    page: 'none',
  });

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Initialize agent and subscribe to events
  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const geminiAgent = new GeminiAgent();
    setAgent(geminiAgent);

    // Subscribe to USER_MESSAGE_SENT
    const unsubscribeUserMessage = eventBus.subscribe(
      'USER_MESSAGE_SENT',
      (payload: { message: string; messageId: string }) => {
        setMessages((prev) => [
          ...prev,
          {
            id: payload.messageId,
            role: 'user',
            content: payload.message,
          },
        ]);
      }
    );

    // Subscribe to AI_RESPONSE_CHUNK
    const unsubscribeChunk = eventBus.subscribe(
      'AI_RESPONSE_CHUNK',
      (payload: { chunk: string; messageId: string }) => {
        setMessages((prev) => {
          const existing = prev.find((m) => m.id === payload.messageId);
          if (existing) {
            // Append to existing message
            return prev.map((m) =>
              m.id === payload.messageId
                ? { ...m, content: m.content + payload.chunk }
                : m
            );
          } else {
            // Create new message
            return [
              ...prev,
              {
                id: payload.messageId,
                role: 'assistant',
                content: payload.chunk,
                streaming: true,
              },
            ];
          }
        });
      }
    );

    // Subscribe to AI_RESPONSE_COMPLETE
    const unsubscribeComplete = eventBus.subscribe(
      'AI_RESPONSE_COMPLETE',
      (payload: { fullResponse: string; messageId: string }) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === payload.messageId ? { ...m, streaming: false } : m
          )
        );
      }
    );

    // Subscribe to AI_RESPONSE_ERROR
    const unsubscribeError = eventBus.subscribe(
      'AI_RESPONSE_ERROR',
      (payload: { error: string; messageId: string }) => {
        setMessages((prev) => [
          ...prev,
          {
            id: payload.messageId + '-error',
            role: 'assistant',
            content: `Error: ${payload.error}`,
          },
        ]);
      }
    );

    // Subscribe to SIDEBAR_TOGGLE
    const unsubscribeSidebar = eventBus.subscribe(
      'SIDEBAR_TOGGLE',
      (payload: { isOpen: boolean }) => {
        setIsSidebarOpen(payload.isOpen);
      }
    );

    // Subscribe to CLEAR_CHAT
    const unsubscribeClearChat = eventBus.subscribe(
      'CLEAR_CHAT',
      (payload: { confirm: boolean }) => {
        if (payload.confirm) {
          setMessages([]);
        }
      }
    );

    // Subscribe to SPLIT_VIEW_TOGGLE
    const unsubscribeSplitView = eventBus.subscribe(
      'SPLIT_VIEW_TOGGLE',
      (payload: { page: 'settings' | 'form' | 'none'; isOpen: boolean }) => {
        setSplitView({
          isOpen: payload.isOpen,
          page: payload.page,
        });
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeUserMessage();
      unsubscribeChunk();
      unsubscribeComplete();
      unsubscribeError();
      unsubscribeSidebar();
      unsubscribeClearChat();
      unsubscribeSplitView();
    };
  }, []);

  const handleSendMessage = (message: string) => {
    if (!apiKey) {
      alert('Please enter your Groq API key first');
      return;
    }

    const eventBus = EventBus.getInstance();
    const userMessageId = `user-${Date.now()}`;

    // Emit USER_MESSAGE_SENT event
    eventBus.emit({
      type: 'USER_MESSAGE_SENT',
      payload: {
        message,
        messageId: userMessageId,
      },
      timestamp: Date.now(),
    });

    // Emit AI_RESPONSE_REQUESTED event
    const aiMessageId = `ai-${Date.now()}`;
    eventBus.emit({
      type: 'AI_RESPONSE_REQUESTED',
      payload: {
        message,
        messageId: aiMessageId,
        apiKey,
      },
      timestamp: Date.now(),
    });
  };

  const toggleSidebar = () => {
    const eventBus = EventBus.getInstance();
    eventBus.emit({
      type: 'SIDEBAR_TOGGLE',
      payload: {
        isOpen: !isSidebarOpen,
      },
      timestamp: Date.now(),
    });
  };

  // Show API key input if not set
  if (!apiKey) {
    return <ApiKeyInput onApiKeySet={setApiKey} />;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-1 min-w-0">
        <div className="flex flex-col flex-1 min-w-0">
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                aria-label="Toggle sidebar"
              >
                <svg
                  className="w-6 h-6 text-gray-900 dark:text-gray-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Event-Driven</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Powered by Groq & EventBus Pattern</p>
              </div>
            </div>
          </header>
          <MessageList messages={messages} />
          <MessageInput onSend={handleSendMessage} />
        </div>

        <SplitView
          isOpen={splitView.isOpen}
          page={splitView.page}
          onClose={() => setSplitView({ isOpen: false, page: 'none' })}
        />
      </div>
    </div>
  );
}
