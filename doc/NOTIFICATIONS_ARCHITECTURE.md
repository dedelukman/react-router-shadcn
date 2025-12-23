# Notifications Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          NotificationsPopover (Header)              │   │
│  │                                                      │   │
│  │  • Shows 5 latest notifications                     │   │
│  │  • Quick mark as read                               │   │
│  │  • Unread badge                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     Notifications Panel (Full Page)                 │   │
│  │                                                      │   │
│  │  • All notification management                      │   │
│  │  • Tab filtering (All/Favorites/Archived)           │   │
│  │  • Search & bulk operations                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Redux Toolkit Query Store                 │   │
│  │                                                      │   │
│  │  Queries:                                            │   │
│  │  • getNotifications                                 │   │
│  │  • getInboxNotifications                            │   │
│  │  • getFavoriteNotifications                         │   │
│  │  • getArchivedNotifications                         │   │
│  │                                                      │   │
│  │  Mutations:                                         │   │
│  │  • updateNotification                               │   │
│  │  • deleteNotification                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓↑                               │
├─────────────────────────────────────────────────────────────┤
│                   HTTP/REST Layer                           │
│            (with Credentials & Error Handling)              │
├─────────────────────────────────────────────────────────────┤
│                  Spring Boot Backend                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       NotificationController                        │   │
│  │                                                      │   │
│  │  GET    /api/notifications                          │   │
│  │  GET    /api/notifications/favorites                │   │
│  │  GET    /api/notifications/archived                 │   │
│  │  PATCH  /api/notifications/{id}                     │   │
│  │  DELETE /api/notifications/{id}                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓↑                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Database                                      │   │
│  │       (Notifications Table)                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### 1. Fetch Notifications Flow

```
User opens app
    ↓
NotificationsPopover mounts
    ↓
useGetNotificationsQuery() triggered
    ↓
Redux RTK Query checks cache
    ├─ If cached & fresh → use cache
    └─ If not cached → fetch from API
        ↓
    GET /api/notifications (with credentials)
        ↓
    Spring Backend processes request
        ↓
    Returns List<NotificationResponse>
        ↓
    Redux caches response
        ↓
    Components re-render with new data
        ↓
    UI displays notifications
```

### 2. Update Notification Flow (Mark as Read)

```
User clicks "Mark Read" button
    ↓
onClick handler calls: updateNotification({ id, body: { read: true } })
    ↓
Redux RTK Query:
  ├─ Optimistic update to cache (immediate UI change)
  ├─ Send PATCH /api/notifications/1
  └─ Wait for response
    ↓
Backend processes PATCH request
    ↓
Updates database
    ↓
Returns updated NotificationResponse
    ↓
Redux receives response
    ├─ If success → keep optimistic update
    └─ If error → revert cache (undo)
        ↓
    UI reflects final state
        ↓
    Toast notification shown
        (Success "Marked read" or Error message)
```

### 3. Bulk Delete Flow

```
User selects 3 notifications
    ↓
User clicks "Delete Selected"
    ↓
Confirmation dialog shown
    ↓
User confirms
    ↓
performDelete() called
    ↓
For each selected ID:
  ├─ Optimistic remove from cache
  ├─ Send DELETE /api/notifications/{id}
  └─ Wait for response
    ↓
Promise.all() waits for all deletions
    ↓
Backend processes each DELETE
    ↓
Redux cache updated
    ├─ Success → keep removals
    └─ Error → revert changes
        ↓
    UI reflects final state
        ↓
    Single toast shows final status
        "3 notifications deleted"
```

### 4. Error Handling Flow

```
User action triggered
    ↓
Mutation sends request to backend
    ↓
Backend returns error response
    ├─ 401 Unauthorized
    ├─ 404 Not Found
    ├─ 500+ Server Error
    └─ Other error
        ↓
onQueryStarted error handler catches
    ↓
Error caught in try-catch
    ↓
    ├─ If optimistic update was made
    │    └─ Revert cache (patchResult.undo())
    │
    └─ Check error status
        ├─ 401 → Toast: "Sesi Anda telah berakhir..."
        ├─ 404 → Toast: "Endpoint tidak ditemukan..."
        ├─ 500+ → Toast: "Terjadi kesalahan pada server..."
        └─ Other → Toast: "Gagal mengambil data..."
            ↓
        UI reverted to previous state
```

---

## State Management Pattern

### Redux Store Structure

```
api/
├── queries/
│   ├── getNotifications
│   │   └── data: [NotificationResponse[], ...]
│   ├── getInboxNotifications
│   ├── getFavoriteNotifications
│   └── getArchivedNotifications
│
└── mutations/
    ├── updateNotification
    │   └── status: 'pending' | 'fulfilled' | 'rejected'
    └── deleteNotification
        └── status: 'pending' | 'fulfilled' | 'rejected'
```

---

## Component Hierarchy & Data Flow

```
App Root
├── Header
│   └── NotificationsPopover
│       ├── useGetNotificationsQuery()
│       │   └── Top 5 unread notifications
│       │
│       ├── useUpdateNotificationMutation()
│       │   └── Mark as read action
│       │
│       └── Link to /app/notifications
│
└── Routes
    └── /app/notifications
        └── NotificationsPanel
            ├── useGetNotificationsQuery()
            │   └── All notifications
            │
            ├── NotificationsHeader
            │   └── Search & title
            │
            ├── NotificationsTabs
            │   ├── All
            │   ├── Favorites
            │   └── Archived
            │
            ├── NotificationsToolbar
            │   ├── Select all checkbox
            │   ├── Bulk mark read
            │   └── Bulk delete
            │
            ├── NotificationsList
            │   └── NotificationItem (repeated)
            │       ├── Checkbox (for selection)
            │       ├── Title & Body
            │       └── Action Buttons:
            │           ├── Mark read (useUpdateNotificationMutation)
            │           ├── Favorite (useUpdateNotificationMutation)
            │           ├── Archive (useUpdateNotificationMutation)
            │           └── Delete (useDeleteNotificationMutation)
            │
            └── DeleteConfirmationSheet
                └── Confirmation dialog
```

---

## Type Transformations

### API Response → Internal Format

```typescript
// From Backend
const apiResponse: NotificationResponse = {
  id: 123,
  title: 'Payment Received',
  body: 'Your payment of $100 has been processed',
  createdAt: '2025-12-19T10:30:00.000Z',
  read: false,
  favorite: false,
  archived: false,
};

// Transform in component
const items: Notification[] = apiNotifications.map((n) => ({
  id: n.id, // Keep as number
  title: n.title, // Keep as is
  body: n.body, // Keep as is
  date: new Date(n.createdAt).toLocaleString(), // Format: "12/19/2025, 10:30:00 AM"
  favorite: n.favorite || false, // Ensure boolean
  archived: n.archived || false, // Ensure boolean
  read: n.read || false, // Ensure boolean
}));

// For display
const notification: Notification = {
  id: 123,
  title: 'Payment Received',
  body: 'Your payment of $100 has been processed',
  date: '12/19/2025, 10:30:00 AM',
  read: false,
  favorite: false,
  archived: false,
};
```

---

## Mutation Request/Response Cycle

### Update Notification

```
REQUEST:
PATCH /api/notifications/123
{
  "read": true,
  "favorite": false,
  "archived": false
}

RESPONSE:
{
  "id": 123,
  "title": "Payment Received",
  "body": "Your payment of $100 has been processed",
  "createdAt": "2025-12-19T10:30:00.000Z",
  "read": true,
  "favorite": false,
  "archived": false
}
```

### Delete Notification

```
REQUEST:
DELETE /api/notifications/123

RESPONSE:
HTTP 204 No Content
(Empty body)
```

---

## Caching & Invalidation Strategy

```
Tag: 'Notification'
│
├─ Query: getNotifications
│  └─ Cache Key: ['getNotifications']
│
├─ Query: getInboxNotifications
│  └─ Cache Key: ['getInboxNotifications']
│
├─ Query: getFavoriteNotifications
│  └─ Cache Key: ['getFavoriteNotifications']
│
├─ Query: getArchivedNotifications
│  └─ Cache Key: ['getArchivedNotifications']
│
├─ Mutation: updateNotification
│  ├─ Provides: [{ type: 'Notification', id }]
│  ├─ Invalidates: [{ type: 'Notification', id }, 'Notification']
│  └─ Side effect: Refetches queries with matching tags
│
└─ Mutation: deleteNotification
   ├─ Provides: [{ type: 'Notification', id: 'LIST' }]
   ├─ Invalidates: [{ type: 'Notification', id: 'LIST' }]
   └─ Side effect: Refetches all notification queries
```

---

## Loading States & UI Feedback

```
Initial Load
├─ isLoading = true
├─ UI shows: "Loading..."
└─ Data = []

After Success
├─ isLoading = false
├─ UI shows: Notification list
└─ Data = [Notification, ...]

During Mutation
├─ isLoading = false (query still loaded)
├─ Mutation isLoading = true
├─ UI shows: Updated notification (optimistic)
└─ Button disabled

After Mutation Success
├─ isLoading = false
├─ Mutation isLoading = false
├─ UI shows: Updated state (now from server)
└─ Toast: Success message

After Mutation Error
├─ isLoading = false
├─ Mutation isLoading = false
├─ UI shows: Reverted state (optimistic undo)
└─ Toast: Error message
```

---

## API Endpoint Overview

```
INBOX (All non-archived)
├─ GET /api/notifications
└─ Used by: NotificationsPopover, Notifications Panel

FAVORITES
├─ GET /api/notifications/favorites
└─ Separate query for favorites tab

ARCHIVED
├─ GET /api/notifications/archived
└─ Separate query for archived tab

ACTIONS
├─ PATCH /api/notifications/{id}
│  └─ Update: read, favorite, archived
│
└─ DELETE /api/notifications/{id}
   └─ Remove notification
```

---

## Error Boundary Recommendations

```typescript
// Suggested error handling structure
try {
  await updateNotification({...}).unwrap()
} catch (error) {
  if (error?.status === 401) {
    // Unauthorized - redirect to login
    navigate('/login')
  } else if (error?.status === 404) {
    // Not found
    console.warn('Notification not found')
  } else if (error?.status >= 500) {
    // Server error
    console.error('Server error:', error)
  } else {
    // Generic error
    console.error('Request failed:', error)
  }
}
```

---

**Last Updated**: December 19, 2025
