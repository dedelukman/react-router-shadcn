# Notifications API Integration Guide

## Overview

This document describes the integration between the frontend notification components and the Spring Boot backend notification API.

## Backend API Endpoints

The backend provides the following endpoints in `com.abahstudio.app.domain.notification.NotificationController`:

### 1. GET /api/notifications

- **Purpose**: Fetch all notifications (inbox)
- **Returns**: `List<NotificationResponse>`
- **Frontend Hook**: `useGetNotificationsQuery()`

### 2. GET /api/notifications/favorites

- **Purpose**: Fetch favorited notifications
- **Returns**: `List<NotificationResponse>`
- **Frontend Hook**: `useGetFavoriteNotificationsQuery()`

### 3. GET /api/notifications/archived

- **Purpose**: Fetch archived notifications
- **Returns**: `List<NotificationResponse>`
- **Frontend Hook**: `useGetArchivedNotificationsQuery()`

### 4. PATCH /api/notifications/{id}

- **Purpose**: Update notification (mark as read, favorite, archive)
- **Request Body**: `NotificationUpdateRequest`
- **Returns**: `NotificationResponse`
- **Frontend Hook**: `useUpdateNotificationMutation()`

```typescript
// Example request body
{
  read?: boolean;
  favorite?: boolean;
  archived?: boolean;
}
```

### 5. DELETE /api/notifications/{id}

- **Purpose**: Delete a notification
- **Returns**: HTTP 204 No Content
- **Frontend Hook**: `useDeleteNotificationMutation()`

## Frontend Types

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

### Notification (internal)

```typescript
interface Notification {
  id: string | number;
  title: string;
  body?: string;
  date: string; // formatted date
  favorite?: boolean;
  archived?: boolean;
  read?: boolean;
}
```

### NotificationUpdateRequest

```typescript
interface NotificationUpdateRequest {
  read?: boolean;
  favorite?: boolean;
  archived?: boolean;
}
```

## Component Integration

### 1. NotificationsPopover Component

**Location**: `app/components/toggle/notifications-popover.tsx`

- Displays top 5 unread non-archived notifications
- Allows marking individual notifications as read
- Provides "Mark all read" functionality
- Shows unread badge
- Fetches from: `useGetNotificationsQuery()`
- Mutations: `useUpdateNotificationMutation()`

### 2. Notifications Panel Component

**Location**: `app/components/panel/notifications/notifications.tsx`

- Main notifications management page
- Features:
  - Filter by tabs: All, Favorites, Archived
  - Search functionality
  - Bulk operations (select, mark as read, delete)
  - Individual notification actions (favorite, archive, delete)
- Fetches from: `useGetNotificationsQuery()`
- Mutations:
  - `useUpdateNotificationMutation()` - for favorite/archive/read
  - `useDeleteNotificationMutation()` - for deletion

## API Integration in Redux Store

**Location**: `app/lib/api.ts`

### Endpoints Added to Redux Toolkit Query:

```typescript
// Query endpoints
getNotifications: builder.query<NotificationResponse[], void>();
getInboxNotifications: builder.query<NotificationResponse[], void>();
getFavoriteNotifications: builder.query<NotificationResponse[], void>();
getArchivedNotifications: builder.query<NotificationResponse[], void>();

// Mutation endpoints
updateNotification: builder.mutation<
  NotificationResponse,
  { id: number; body: NotificationUpdateRequest }
>();
deleteNotification: builder.mutation<void, number>();
```

### Features:

- **Optimistic Updates**: Changes are applied immediately to the UI before server confirmation
- **Automatic Invalidation**: Related queries are automatically invalidated after mutations
- **Error Handling**: Toast notifications for errors (401, 404, 500+)
- **Caching**: Notifications are cached with tag `'Notification'`

## Data Flow

### Fetching Notifications

```
useGetNotificationsQuery()
  ↓
GET /api/notifications
  ↓
Transform createdAt → date format
  ↓
Display in UI
```

### Updating Notification

```
User Action (favorite/archive/read)
  ↓
optimistic update to cache
  ↓
PATCH /api/notifications/{id}
  ↓
Success: toast + invalidate cache
  ↓
Error: undo optimistic update + toast error
```

### Deleting Notification

```
User Confirms Delete
  ↓
optimistic remove from cache
  ↓
DELETE /api/notifications/{id}
  ↓
Success: toast + invalidate cache
  ↓
Error: undo optimistic remove + toast error
```

## Error Handling

The API integration includes comprehensive error handling:

| Status | Action                                                     |
| ------ | ---------------------------------------------------------- |
| 401    | "Sesi Anda telah berakhir. Silakan login kembali."         |
| 404    | "Endpoint tidak ditemukan. Silakan hubungi administrator." |
| 500+   | "Terjadi kesalahan pada server. Silakan coba lagi nanti."  |

## Usage Examples

### Using in Components

```typescript
import {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} from '~/lib/api';

export function MyComponent() {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleMarkRead = async (id: number) => {
    try {
      await updateNotification({
        id,
        body: { read: true },
      }).unwrap();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id).unwrap();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  return (
    // Component JSX
  );
}
```

## Configuration

### API Base URL

The API base URL is configured from environment variable:

```
VITE_API_BASE_URL
```

Default: `/` (current domain)

### Credentials

All requests include credentials (cookies) for authentication:

```typescript
credentials: 'include';
```

## Cache Invalidation

Notifications are tagged with `'Notification'` in the Redux cache. Manual invalidation can be triggered:

```typescript
import { api } from '~/lib/api';

dispatch(api.util.invalidateTags(['Notification']));
```

## Testing the Integration

1. **Test Get Notifications**:
   - Navigate to Notifications page
   - Verify data loads from API endpoint

2. **Test Update**:
   - Mark notification as favorite
   - Verify PATCH request sent with correct payload
   - Verify UI updates immediately (optimistic)

3. **Test Delete**:
   - Delete a notification
   - Verify DELETE request sent
   - Verify notification removed from UI

4. **Test Error Handling**:
   - Disconnect from backend
   - Attempt operations
   - Verify appropriate error toasts appear

## Migration from Local Storage

The previous implementation used `localStorage` for notifications. This has been fully replaced with API-driven state. The key changes:

**Before**:

- Notifications stored in localStorage
- Changes synced across tabs via `storage` events
- Sample data used as fallback

**After**:

- Notifications fetched from backend API
- Changes persisted on server
- Real-time updates through optimistic mutations
- Loading state shown while fetching

## Future Enhancements

Possible future improvements:

1. WebSocket support for real-time notifications
2. Batch operations API endpoint
3. Notification grouping/categories
4. Notification templates/presets
5. Read receipts
6. Notification scheduling

---

**Last Updated**: December 19, 2025
**Integration Status**: ✅ Complete
