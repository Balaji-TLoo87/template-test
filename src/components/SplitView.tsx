'use client';

import { useEffect, useState } from 'react';
import EventBus from '@/lib/eventbus/EventBus';
import SettingsPage from '@/app/settings/page';
import FormPage from '@/app/form/page';

interface SplitViewProps {
  isOpen: boolean;
  page: 'settings' | 'form' | 'none';
  onClose: () => void;
}

export default function SplitView({ isOpen, page, onClose }: SplitViewProps) {
  if (!isOpen || page === 'none') return null;

  return (
    <div className="w-1/2 border-l dark:border-gray-700 flex-shrink-0 overflow-auto bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {page === 'settings' ? '⚙️ Settings' : '📝 Form'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          title="Close split view"
        >
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300"
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
      <div className="overflow-auto">
        {page === 'settings' && <SettingsPage />}
        {page === 'form' && <FormPage />}
      </div>
    </div>
  );
}
