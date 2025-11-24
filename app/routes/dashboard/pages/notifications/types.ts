export type NotificationTab = 'all' | 'favorites' | 'archived';
export type ConfirmMode = 'single' | 'bulk';

export interface Notification {
  id: string;
  title: string;
  body?: string;
  date: string;
  favorite?: boolean;
  archived?: boolean;
  read?: boolean;
}

export interface NotificationCounts {
  all: number;
  fav: number;
  archived: number;
  unread: number;
}

export const SAMPLE_NOTIFICATIONS: Notification[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `n-${i}`,
  title: `Notification ${i + 1}`,
  body: `This is the detail for notification ${i + 1}.`,
  date: new Date(Date.now() - i * 1000 * 60 * 60).toLocaleString(),
  favorite: i % 5 === 0,
  archived: i % 7 === 0,
  read: i % 3 === 0,
}));