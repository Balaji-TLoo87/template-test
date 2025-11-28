export interface FormSubmission {
  id: string;
  formData: {
    name: string;
    email: string;
    message: string;
  };
  formType: string;
  timestamp: string;
}

const STORAGE_KEY = 'form_submissions';

/**
 * Get all form submissions from localStorage
 */
export function getSubmissions(): FormSubmission[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const submissions = JSON.parse(stored);
    return Array.isArray(submissions) ? submissions : [];
  } catch (error) {
    console.error('Error reading form submissions from localStorage:', error);
    return [];
  }
}

/**
 * Save a new form submission to localStorage
 */
export function saveSubmission(submission: FormSubmission): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existing = getSubmissions();
    const updated = [...existing, submission];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving form submission to localStorage:', error);

    // Check if quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some submissions.');
    }
  }
}

/**
 * Delete a specific submission by ID
 */
export function deleteSubmission(id: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existing = getSubmissions();
    const updated = existing.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting form submission from localStorage:', error);
  }
}

/**
 * Clear all form submissions
 */
export function clearSubmissions(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form submissions from localStorage:', error);
  }
}
