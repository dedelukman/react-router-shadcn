/**
 * Mapper untuk mengkonversi antara format frontend dan backend
 * Frontend: 'Bug/Error', 'Feature Question', etc
 * Backend: 'BUG_ERROR', 'FEATURE_QUESTION', etc
 */

// Mapping category dari frontend ke backend
export const categoryFrontendToBackend: Record<string, string> = {
  'Bug/Error': 'BUG_ERROR',
  'Feature Question': 'FEATURE_QUESTION',
  'Feature Request': 'FEATURE_REQUEST',
  Account: 'ACCOUNT',
  Payment: 'PAYMENT',
  Other: 'OTHER',
};

// Mapping category dari backend ke frontend
export const categoryBackendToFrontend: Record<string, string> = {
  BUG_ERROR: 'Bug/Error',
  FEATURE_QUESTION: 'Feature Question',
  FEATURE_REQUEST: 'Feature Request',
  ACCOUNT: 'Account',
  PAYMENT: 'Payment',
  OTHER: 'Other',
};

// Mapping priority dari frontend ke backend (jika diperlukan)
export const priorityFrontendToBackend: Record<string, string> = {
  Low: 'LOW',
  Normal: 'NORMAL',
  High: 'HIGH',
  Critical: 'CRITICAL',
};

// Mapping priority dari backend ke frontend
export const priorityBackendToFrontend: Record<string, string> = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// Mapping status dari backend ke frontend (jika diperlukan)
export const statusBackendToFrontend: Record<string, string> = {
  OPEN: 'Open',
  RESPONDED: 'Responded',
  INVESTIGATING: 'Investigating',
  PENDING: 'Pending',
  DONE: 'Done',
  CLOSED: 'Closed',
};

export const statusFrontendToBackend: Record<string, string> = {
  Open: 'OPEN',
  Responded: 'RESPONDED',
  Investigating: 'INVESTIGATING',
  Pending: 'PENDING',
  Done: 'DONE',
  Closed: 'CLOSED',
};

/**
 * Konversi category dari frontend ke backend sebelum mengirim ke API
 */
export function getCategoryForBackend(frontendCategory: string): string {
  return categoryFrontendToBackend[frontendCategory] || frontendCategory;
}

/**
 * Konversi category dari backend ke frontend untuk ditampilkan
 */
export function getCategoryForFrontend(backendCategory: string): string {
  return categoryBackendToFrontend[backendCategory] || backendCategory;
}

/**
 * Konversi priority dari frontend ke backend sebelum mengirim ke API
 */
export function getPriorityForBackend(frontendPriority: string): string {
  return priorityFrontendToBackend[frontendPriority] || frontendPriority;
}

/**
 * Konversi priority dari backend ke frontend untuk ditampilkan
 */
export function getPriorityForFrontend(backendPriority: string): string {
  return priorityBackendToFrontend[backendPriority] || backendPriority;
}

/**
 * Konversi status dari backend ke frontend untuk ditampilkan
 */
export function getStatusForFrontend(backendStatus: string): string {
  return statusBackendToFrontend[backendStatus] || backendStatus;
}

/**
 * Konversi status dari frontend ke backend sebelum mengirim ke API
 */
export function getStatusForBackend(frontendStatus: string): string {
  return statusFrontendToBackend[frontendStatus] || frontendStatus;
}
