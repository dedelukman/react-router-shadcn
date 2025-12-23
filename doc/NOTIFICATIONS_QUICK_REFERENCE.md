# Notifications API - Quick Reference

## Import Hooks

```typescript
import {
  useGetNotificationsQuery,
  useGetInboxNotificationsQuery,
  useGetFavoriteNotificationsQuery,
  useGetArchivedNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} from '~/lib/api';

import type {
  Notification,
  NotificationResponse,
  NotificationUpdateRequest,
} from '~/lib/types';
```

## Query Hooks

### Get All Notifications

```typescript
const {
  data: notifications = [],
  isLoading,
  error,
} = useGetNotificationsQuery();
```

### Get Inbox Only

```typescript
const { data: inboxNotifications = [] } = useGetInboxNotificationsQuery();
```

### Get Favorites Only

```typescript
const { data: favorites = [] } = useGetFavoriteNotificationsQuery();
```

### Get Archived Only

```typescript
const { data: archived = [] } = useGetArchivedNotificationsQuery();
```

## Mutation Hooks

### Update Notification

```typescript
const [updateNotification, { isLoading: isUpdating }] =
  useUpdateNotificationMutation();

// Mark as read
await updateNotification({
  id: 123,
  body: { read: true },
}).unwrap();

// Mark as favorite
await updateNotification({
  id: 123,
  body: { favorite: true },
}).unwrap();

// Archive notification
await updateNotification({
  id: 123,
  body: { archived: true },
}).unwrap();

// Multiple updates
await updateNotification({
  id: 123,
  body: { read: true, favorite: true, archived: false },
}).unwrap();
```

### Delete Notification

```typescript
const [deleteNotification, { isLoading: isDeleting }] =
  useDeleteNotificationMutation();

await deleteNotification(123).unwrap();
```

## Common Patterns

### Conditional Query

```typescript
const { data: notifications } = useGetNotificationsQuery(undefined, {
  skip: !userId, // Skip if no userId
});
```

### Handle Errors

```typescript
try {
  await updateNotification({
    id: notificationId,
    body: { read: true },
  }).unwrap();
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 404) {
    // Notification not found
  }
}
```

### Batch Operations

```typescript
const [updateNotification] = useUpdateNotificationMutation();

// Mark multiple as read
await Promise.all(
  selectedIds.map((id) =>
    updateNotification({
      id,
      body: { read: true },
    }).unwrap()
  )
);
```

### Refetch Manually

```typescript
const { refetch } = useGetNotificationsQuery();
await refetch();
```

## API Endpoints

```
GET    /api/notifications              → Inbox (all non-archived)
GET    /api/notifications/favorites    → Favorites
GET    /api/notifications/archived     → Archived
PATCH  /api/notifications/{id}         → Update notification
DELETE /api/notifications/{id}         → Delete notification
```

## Type Definitions

### NotificationResponse (from API)

```typescript
interface NotificationResponse {
  id: number;
  title: string;
  body?: string;
  createdAt: string;
  read?: boolean;
  favorite?: boolean;
  archived?: boolean;
}
```

### NotificationUpdateRequest (to API)

```typescript
interface NotificationUpdateRequest {
  read?: boolean;
  favorite?: boolean;
  archived?: boolean;
}
```

### Notification (internal)

```typescript
interface Notification {
  id: string | number;
  title: string;
  body?: string;
  date: string; // Formatted
  favorite?: boolean;
  archived?: boolean;
  read?: boolean;
}
```

## Error Codes

| Code | Message                                                    | Action            |
| ---- | ---------------------------------------------------------- | ----------------- |
| 401  | "Sesi Anda telah berakhir. Silakan login kembali."         | Redirect to login |
| 404  | "Endpoint tidak ditemukan. Silakan hubungi administrator." | Contact support   |
| 500+ | "Terjadi kesalahan pada server. Silakan coba lagi nanti."  | Retry later       |

## Component Examples

### Notifications Popover (Header)

Located: `app/components/toggle/notifications-popover.tsx`

- Shows 5 latest unread notifications
- Quick mark as read
- Link to full notifications page

### Notifications Panel (Full Page)

Located: `app/components/panel/notifications/notifications.tsx`

- All notification management
- Tab filtering
- Search functionality
- Bulk operations

## Performance Tips

1. **Pagination** (if implemented later):

   ```typescript
   const page = 1;
   useGetNotificationsQuery(page);
   ```

2. **Polling** (if needed):

   ```typescript
   useGetNotificationsQuery(undefined, {
     pollingInterval: 30000, // 30 seconds
   });
   ```

3. **Refetch on Focus**:
   ```typescript
   useGetNotificationsQuery(undefined, {
     refetchOnFocus: true,
   });
   ```

## Debugging

### Redux DevTools

In Redux DevTools, look under `api` > `queries` > `getNotifications`

### Console Logging

```typescript
const { data, status } = useGetNotificationsQuery();
console.log('Status:', status); // 'uninitialized' | 'pending' | 'fulfilled' | 'rejected'
console.log('Data:', data);
```

---

**Quick Links**:

- [Full Integration Guide](./NOTIFICATIONS_INTEGRATION.md)
- [API Reference](./app/lib/api.ts)
- [Type Definitions](./app/lib/types.ts)
