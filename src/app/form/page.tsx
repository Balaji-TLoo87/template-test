'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventBus from '@/lib/eventbus/EventBus';
import type { AppEvent } from '@/lib/eventbus/types';
import {
  getSubmissions,
  saveSubmission,
  deleteSubmission,
  clearSubmissions,
  type FormSubmission
} from '@/lib/storage/formStorage';

export default function FormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [autoSubmit, setAutoSubmit] = useState(false);

  // Load submissions from localStorage on mount
  useEffect(() => {
    const savedSubmissions = getSubmissions();
    setSubmissions(savedSubmissions);
  }, []);

  useEffect(() => {
    // Subscribe to form submit events
    const eventBus = EventBus.getInstance();
    const unsubscribeSubmit = eventBus.subscribe(
      'FORM_SUBMIT',
      (payload: { formData: Record<string, any>; formType: string }) => {
        console.log('Form submitted via EventBus:', payload);

        // Create submission with unique ID
        const submission: FormSubmission = {
          id: crypto.randomUUID(),
          formData: payload.formData as { name: string; email: string; message: string },
          formType: payload.formType,
          timestamp: new Date().toLocaleString(),
        };

        // Save to localStorage
        saveSubmission(submission);

        // Update UI state
        setSubmissions((prev) => [...prev, submission]);

        // Auto-open split view to show the form
        eventBus.emit<AppEvent>({
          type: 'SPLIT_VIEW_TOGGLE',
          payload: {
            page: 'form',
            isOpen: true,
          },
          timestamp: Date.now(),
        });
      }
    );

    // Subscribe to form fill events (AI fills form)
    const unsubscribeFill = eventBus.subscribe(
      'FORM_FILL',
      (payload: { name?: string; email?: string; message?: string }) => {
        console.log('Form filled via AI:', payload);
        setFormData((prev) => ({
          name: payload.name !== undefined ? payload.name : prev.name,
          email: payload.email !== undefined ? payload.email : prev.email,
          message: payload.message !== undefined ? payload.message : prev.message,
        }));
      }
    );

    return () => {
      unsubscribeSubmit();
      unsubscribeFill();
    };
  }, []);

  // Auto-submit when all fields are filled
  useEffect(() => {
    if (autoSubmit && formData.name && formData.email && formData.message) {
      const timer = setTimeout(() => {
        handleSubmit(new Event('submit') as any);
      }, 1000); // Auto-submit after 1 second of inactivity

      return () => clearTimeout(timer);
    }
  }, [formData, autoSubmit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    // Emit form submit event
    const eventBus = EventBus.getInstance();
    eventBus.emit<AppEvent>({
      type: 'FORM_SUBMIT',
      payload: {
        formData: { ...formData },
        formType: 'contact',
      },
      timestamp: Date.now(),
    });

    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this submission?')) {
      deleteSubmission(id);
      setSubmissions((prev) => prev.filter(s => s.id !== id));
    }
  };

  const handleClearAll = () => {
    if (confirm(`Clear all ${submissions.length} submissions? This cannot be undone.`)) {
      clearSubmissions();
      setSubmissions([]);
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

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Contact Form</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Submit Form</h2>

            {/* Auto-submit toggle */}
            <div className="mb-6 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <input
                type="checkbox"
                id="autoSubmit"
                checked={autoSubmit}
                onChange={(e) => setAutoSubmit(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="autoSubmit" className="text-sm text-gray-700 dark:text-gray-300">
                Enable auto-submit (submits automatically when all fields are filled)
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your message"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Submit Form
              </button>
            </form>
          </div>

          {/* Submissions Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Submissions ({submissions.length})
              </h2>
              {submissions.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {submissions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No submissions yet. Fill out the form to see it here!
                </p>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {submission.timestamp}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
                          {submission.formType}
                        </span>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                          title="Delete submission"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-900 dark:text-white">
                        <strong>Name:</strong> {submission.formData.name}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        <strong>Email:</strong> {submission.formData.email}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        <strong>Message:</strong> {submission.formData.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
