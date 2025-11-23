import type { Priority } from "./types";


export function formatDate(iso?: string) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString();
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