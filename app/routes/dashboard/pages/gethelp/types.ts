export type Priority = 'Low' | 'Normal' | 'High' | 'Critical';
export type Category =
  | 'Bug/Error'
  | 'Feature Question'
  | 'Feature Request'
  | 'Account'
  | 'Payment'
  | 'Other';

export type TicketStatus =
  | 'Open'
  | 'Responded'
  | 'Investigating'
  | 'Pending'
  | 'Done'
  | 'Closed';

export type Ticket = {
  id: string;
  subject: string;
  category: Category | string;
  priority: Priority;
  description: string;
  attachment?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
};

export const defaultCategories: Category[] = [
  'Bug/Error',
  'Feature Question',
  'Feature Request',
  'Account',
  'Payment',
  'Other',
];

export const defaultPriorities: Priority[] = ['Low', 'Normal', 'High', 'Critical'];