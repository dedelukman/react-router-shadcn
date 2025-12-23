/**
 * CONTOH API RESPONSE & TRANSFORMATION
 *
 * File ini menunjukkan bagaimana data ditransformasi antara frontend dan backend
 */

// ============================================
// CONTOH 1: BACKEND RESPONSE (Raw)
// ============================================
const backendResponse = {
  id: 'T-1701788400000',
  subject: 'Unable to access account settings',
  category: 'BUG_ERROR', // ← Backend format (SCREAMING_SNAKE_CASE)
  priority: 'HIGH', // ← Backend format
  description:
    'Whenever I try to access my account settings, I receive an error message saying "Access Denied".',
  status: 'INVESTIGATING', // ← Backend format
  attachment: 'screenshot.png',
  createdAt: '2025-12-17T10:00:00Z',
  updatedAt: '2025-12-17T10:00:00Z',
};

// ============================================
// TRANSFORMATION PROCESS
// ============================================
// transformResponse di API layer akan mengkonversi:
// backendResponse.category: 'BUG_ERROR' → 'Bug/Error'
// backendResponse.priority: 'HIGH' → 'High'
// backendResponse.status: 'INVESTIGATING' → 'Investigating'

// ============================================
// CONTOH 2: FRONTEND DISPLAY (Transformed)
// ============================================
const frontendDisplay = {
  id: 'T-1701788400000',
  subject: 'Unable to access account settings',
  category: 'Bug/Error', // ← Frontend format (user-friendly)
  priority: 'High', // ← Frontend format
  description:
    'Whenever I try to access my account settings, I receive an error message saying "Access Denied".',
  status: 'Investigating', // ← Frontend format
  attachment: 'screenshot.png',
  createdAt: '2025-12-17T10:00:00Z',
  updatedAt: '2025-12-17T10:00:00Z',
};

// ============================================
// CONTOH 3: CREATE TICKET - FRONTEND INPUT
// ============================================
const userInput = {
  subject: 'Cannot checkout with card payment',
  category: 'Bug/Error', // ← User memilih dari dropdown (format frontend)
  priority: 'High', // ← User memilih dari dropdown (format frontend)
  description:
    'Reproduction steps: 1. Go to checkout 2. Enter card details 3. Click pay',
  attachment: 'error-screenshot.jpg',
};

// ============================================
// TRANSFORMATION SEBELUM KIRIM KE BACKEND
// ============================================
// API query() akan mengkonversi:
// userInput.category: 'Bug/Error' → 'BUG_ERROR'
// userInput.priority: 'High' → 'HIGH'

// ============================================
// CONTOH 4: YANG DIKIRIM KE BACKEND
// ============================================
const requestToBackend = {
  subject: 'Cannot checkout with card payment',
  category: 'BUG_ERROR', // ← Format backend
  priority: 'HIGH', // ← Format backend
  description:
    'Reproduction steps: 1. Go to checkout 2. Enter card details 3. Click pay',
  attachment: 'error-screenshot.jpg',
};

// ============================================
// CONTOH 5: BACKEND RESPONSE (SETELAH CREATE)
// ============================================
const backendCreateResponse = {
  id: 'T-1702000000000',
  ...requestToBackend,
  status: 'OPEN', // ← Backend set status ke OPEN
  createdAt: '2025-12-17T10:00:00Z',
  updatedAt: '2025-12-17T10:00:00Z',
};

// ============================================
// TRANSFORMATION RESPONSE
// ============================================
// transformResponse di createTicket akan mengkonversi:
// - category: 'BUG_ERROR' → 'Bug/Error'
// - priority: 'HIGH' → 'High'
// - status: 'OPEN' → 'Open'

// ============================================
// CONTOH 6: FINAL RESULT DI FRONTEND
// ============================================
const finalFrontendData = {
  id: 'T-1702000000000',
  subject: 'Cannot checkout with card payment',
  category: 'Bug/Error', // ← Format frontend untuk display
  priority: 'High', // ← Format frontend untuk display
  description:
    'Reproduction steps: 1. Go to checkout 2. Enter card details 3. Click pay',
  status: 'Open', // ← Format frontend untuk display
  attachment: 'error-screenshot.jpg',
  createdAt: '2025-12-17T10:00:00Z',
  updatedAt: '2025-12-17T10:00:00Z',
};

// ============================================
// MAPPING REFERENCE LENGKAP
// ============================================

export const CATEGORY_MAP = {
  'Bug/Error': 'BUG_ERROR',
  'Feature Question': 'FEATURE_QUESTION',
  'Feature Request': 'FEATURE_REQUEST',
  Account: 'ACCOUNT',
  Payment: 'PAYMENT',
  Other: 'OTHER',
} as const;

export const PRIORITY_MAP = {
  Low: 'LOW',
  Normal: 'NORMAL',
  High: 'HIGH',
  Critical: 'CRITICAL',
} as const;

export const STATUS_MAP = {
  Open: 'OPEN',
  Responded: 'RESPONDED',
  Investigating: 'INVESTIGATING',
  Pending: 'PENDING',
  Done: 'DONE',
  Closed: 'CLOSED',
} as const;

// ============================================
// TESTING EXAMPLES
// ============================================

/**
 * Test Case 1: Submit Ticket dengan Category "Bug/Error"
 *
 * Step 1: User input
 * category = "Bug/Error"
 *
 * Step 2: API transformation (sebelum dikirim)
 * getCategoryForBackend("Bug/Error") → "BUG_ERROR"
 *
 * Step 3: Backend menerima
 * POST /tickets
 * { category: "BUG_ERROR", ... }
 *
 * Step 4: Backend response
 * { id: "T-123", category: "BUG_ERROR", ... }
 *
 * Step 5: API transformation (response)
 * getCategoryForFrontend("BUG_ERROR") → "Bug/Error"
 *
 * Step 6: Frontend display
 * tickets[0].category === "Bug/Error" ✓
 */

/**
 * Test Case 2: Display Ticket List
 *
 * Backend API response:
 * [
 *   { id: "T-1", category: "BUG_ERROR", priority: "HIGH", status: "OPEN" },
 *   { id: "T-2", category: "FEATURE_REQUEST", priority: "NORMAL", status: "CLOSED" },
 * ]
 *
 * Setelah transformResponse:
 * [
 *   { id: "T-1", category: "Bug/Error", priority: "High", status: "Open" },
 *   { id: "T-2", category: "Feature Request", priority: "Normal", status: "Closed" },
 * ]
 *
 * Displayed in table:
 * | ID  | Category         | Priority | Status |
 * | T-1 | Bug/Error        | High     | Open   |
 * | T-2 | Feature Request  | Normal   | Closed |
 */

export const API_RESPONSE_EXAMPLES = {
  category: CATEGORY_MAP,
  priority: PRIORITY_MAP,
  status: STATUS_MAP,
};
