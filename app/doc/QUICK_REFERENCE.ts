/**
 * QUICK REFERENCE - TICKET ENUM CONVERSION
 * 
 * Gunakan file ini sebagai quick reference saat development
 */

// ============================================
// BACKEND ENUM VALUES (yang diterima backend)
// ============================================

export const BACKEND_ENUMS = {
  category: {
    BUG_ERROR: 'BUG_ERROR',
    FEATURE_QUESTION: 'FEATURE_QUESTION',
    FEATURE_REQUEST: 'FEATURE_REQUEST',
    ACCOUNT: 'ACCOUNT',
    PAYMENT: 'PAYMENT',
    OTHER: 'OTHER',
  },
  priority: {
    LOW: 'LOW',
    NORMAL: 'NORMAL',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
  },
  status: {
    OPEN: 'OPEN',
    RESPONDED: 'RESPONDED',
    INVESTIGATING: 'INVESTIGATING',
    PENDING: 'PENDING',
    DONE: 'DONE',
    CLOSED: 'CLOSED',
  },
} as const;

// ============================================
// FRONTEND VALUES (yang ditampilkan di UI)
// ============================================

export const FRONTEND_VALUES = {
  category: {
    'Bug/Error': 'Bug/Error',
    'Feature Question': 'Feature Question',
    'Feature Request': 'Feature Request',
    'Account': 'Account',
    'Payment': 'Payment',
    'Other': 'Other',
  },
  priority: {
    'Low': 'Low',
    'Normal': 'Normal',
    'High': 'High',
    'Critical': 'Critical',
  },
  status: {
    'Open': 'Open',
    'Responded': 'Responded',
    'Investigating': 'Investigating',
    'Pending': 'Pending',
    'Done': 'Done',
    'Closed': 'Closed',
  },
} as const;

// ============================================
// QUICK CONVERSION TABLE
// ============================================

/**
 * CATEGORY
 * Backend        → Frontend
 * BUG_ERROR      → Bug/Error
 * FEATURE_QUESTION → Feature Question
 * FEATURE_REQUEST → Feature Request
 * ACCOUNT        → Account
 * PAYMENT        → Payment
 * OTHER          → Other
 */

/**
 * PRIORITY
 * Backend   → Frontend
 * LOW       → Low
 * NORMAL    → Normal
 * HIGH      → High
 * CRITICAL  → Critical
 */

/**
 * STATUS
 * Backend       → Frontend
 * OPEN          → Open
 * RESPONDED     → Responded
 * INVESTIGATING → Investigating
 * PENDING       → Pending
 * DONE          → Done
 * CLOSED        → Closed
 */

// ============================================
// HOW TO USE IN CODE
// ============================================

/**
 * CASE 1: Display data from backend
 * 
 * // Backend sends: { category: "BUG_ERROR", priority: "HIGH", status: "OPEN" }
 * // API transformResponse automatically converts to:
 * // { category: "Bug/Error", priority: "High", status: "Open" }
 * // Use directly in UI without conversion needed!
 * 
 * <span>{ticket.category}</span>  // Shows: "Bug/Error"
 * <span>{ticket.priority}</span>  // Shows: "High"
 * <span>{ticket.status}</span>    // Shows: "Open"
 */

/**
 * CASE 2: Create ticket with user input
 * 
 * // User selects from dropdown: "Bug/Error"
 * // When sending to API:
 * await createTicketApi({
 *   category: "Bug/Error",  // Frontend format
 *   priority: "High",       // Frontend format
 *   ...
 * }).unwrap();
 * 
 * // API query() automatically converts to:
 * // { category: "BUG_ERROR", priority: "HIGH", ... }
 * // No need to manually convert!
 */

/**
 * CASE 3: Working with data
 * 
 * const tickets = useGetTicketsQuery().data;
 * // tickets are already in Frontend format:
 * // [
 * //   { id: "T-1", category: "Bug/Error", priority: "High", status: "Open" },
 * //   { id: "T-2", category: "Feature Request", priority: "Normal", status: "Closed" }
 * // ]
 * // Just use them as-is, no conversion needed!
 */

// ============================================
// TROUBLESHOOTING
// ============================================

/**
 * Problem: Backend returns error "not one of the values accepted for Enum class"
 * Solution: Check if you're manually converting values. Don't! Let API do it.
 * 
 * ❌ WRONG:
 * await createTicketApi({
 *   category: "BUG_ERROR",  // Frontend should send "Bug/Error"
 * })
 * 
 * ✅ CORRECT:
 * await createTicketApi({
 *   category: "Bug/Error",  // API will convert to "BUG_ERROR"
 * })
 */

/**
 * Problem: UI displays "BUG_ERROR" instead of "Bug/Error"
 * Solution: Data must come from RTK Query hooks, which have transformResponse.
 *           If displaying from plain fetch, use getCategoryForFrontend() manually.
 * 
 * ❌ WRONG:
 * const data = await fetch('/tickets').then(r => r.json());
 * <span>{data.category}</span>  // Shows "BUG_ERROR"
 * 
 * ✅ CORRECT:
 * const { data } = useGetTicketsQuery();
 * <span>{data.category}</span>  // Shows "Bug/Error"
 */

/**
 * Problem: TypeScript says category type error
 * Solution: Use correct Frontend format in TypeScript
 * 
 * ❌ WRONG:
 * const category: string = "BUG_ERROR";
 * 
 * ✅ CORRECT:
 * const category: Category = "Bug/Error";
 * import type { Category } from '~/lib/types';
 */

// ============================================
// USEFUL IMPORTS
// ============================================

/**
 * For displaying data:
 * import { useGetTicketsQuery } from '~/lib/api';
 * 
 * For creating/updating data:
 * import { useCreateTicketMutation, useUpdateTicketMutation } from '~/lib/api';
 * 
 * For type checking:
 * import type { Ticket, Category, Priority, TicketStatus } from '~/lib/types';
 * 
 * For manual conversion (if needed):
 * import { getCategoryForFrontend, getCategoryForBackend } from '~/lib/ticket-mapper';
 */

// ============================================
// COMMON PATTERNS
// ============================================

/**
 * Pattern 1: Display list of tickets
 */
const DisplayTicketList = () => {
  const { data: tickets = [], isLoading } = useGetTicketsQuery();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {tickets.map(ticket => (
        <div key={ticket.id}>
          <h3>{ticket.subject}</h3>
          <p>Category: {ticket.category}</p>  {/* "Bug/Error" format */}
          <p>Priority: {ticket.priority}</p>  {/* "High" format */}
          <p>Status: {ticket.status}</p>      {/* "Open" format */}
        </div>
      ))}
    </div>
  );
};

/**
 * Pattern 2: Create ticket
 */
const CreateTicketForm = () => {
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [category, setCategory] = useState<Category>('Bug/Error');
  const [priority, setPriority] = useState<Priority>('Normal');
  
  const handleSubmit = async () => {
    try {
      await createTicket({
        subject: 'Some subject',
        category,        // "Bug/Error" format (converted automatically)
        priority,        // "Normal" format (converted automatically)
        description: 'Details...'
      }).unwrap();
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
    </form>
  );
};

/**
 * Pattern 3: Conditional styling based on priority
 */
const PriorityBadge = ({ priority }: { priority: Priority }) => {
  // priority is in Frontend format: "Low", "Normal", "High", "Critical"
  const getColor = (p: Priority) => {
    switch(p) {
      case 'Low': return 'bg-blue-500';
      case 'Normal': return 'bg-green-500';
      case 'High': return 'bg-orange-500';
      case 'Critical': return 'bg-red-500';
    }
  };
  
  return <span className={getColor(priority)}>{priority}</span>;
};

// ============================================
// TESTING HELPERS
// ============================================

export const testData = {
  // Valid Backend Response
  backendResponse: {
    id: 'T-1',
    subject: 'Test ticket',
    category: 'BUG_ERROR',
    priority: 'HIGH',
    description: 'Test description',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Valid Frontend Input
  frontendInput: {
    subject: 'Test ticket',
    category: 'Bug/Error' as const,
    priority: 'High' as const,
    description: 'Test description',
  },

  // All Categories
  allCategories: [
    'Bug/Error',
    'Feature Question',
    'Feature Request',
    'Account',
    'Payment',
    'Other',
  ] as const,

  // All Priorities
  allPriorities: [
    'Low',
    'Normal',
    'High',
    'Critical',
  ] as const,

  // All Statuses
  allStatuses: [
    'Open',
    'Responded',
    'Investigating',
    'Pending',
    'Done',
    'Closed',
  ] as const,
};

export default {
  BACKEND_ENUMS,
  FRONTEND_VALUES,
  testData,
};
