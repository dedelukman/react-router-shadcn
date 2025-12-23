import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Priority } from '../store/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- GET HELP ---
export function formatDate(iso?: string): string {
  if (!iso) return '-';

  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso; // Invalid date

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch {
    return iso;
  }
}

export function priorityVariant(p: Priority) {
  switch (p) {
    case 'Low':
      return 'secondary';
    case 'Normal':
      return 'default';
    case 'High':
      return 'destructive';
    case 'Critical':
      return 'destructive';
    default:
      return 'default';
  }
}
