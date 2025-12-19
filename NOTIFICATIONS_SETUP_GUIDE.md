# Notifications API Integration - Setup & Verification Guide

## Prerequisites

- ✅ Spring Boot backend running with NotificationController
- ✅ React app with Redux Toolkit Query configured
- ✅ Node.js and npm installed
- ✅ `.env` file configured

---

## Step-by-Step Setup

### 1. Configure Environment Variables

**File**: `.env`

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Or if using relative paths:

```env
VITE_API_BASE_URL=/api
```

### 2. Verify Backend Endpoints

**Test each endpoint using curl or Postman**:

```bash
# Get all notifications
curl -X GET http://localhost:8080/api/notifications \
  -H "Cookie: session=YOUR_SESSION" \
  -H "Content-Type: application/json"

# Get favorite notifications
curl -X GET http://localhost:8080/api/notifications/favorites \
  -H "Cookie: session=YOUR_SESSION"

# Get archived notifications
curl -X GET http://localhost:8080/api/notifications/archived \
  -H "Cookie: session=YOUR_SESSION"

# Update notification
curl -X PATCH http://localhost:8080/api/notifications/1 \
  -H "Cookie: session=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"read": true}'

# Delete notification
curl -X DELETE http://localhost:8080/api/notifications/1 \
  -H "Cookie: session=YOUR_SESSION"
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Build TypeScript

```bash
npm run build
# or check for errors
npm run type-check
```

### 5. Start Development Server

```bash
npm run dev
```

---

## Verification Checklist

### Phase 1: Type Safety

- [ ] No TypeScript errors in `app/lib/api.ts`
- [ ] No TypeScript errors in `app/lib/types.ts`
- [ ] No TypeScript errors in notification components
- [ ] All imports resolve correctly

**Command**:

```bash
npm run type-check
```

### Phase 2: Component Rendering

- [ ] App loads without crashing
- [ ] NotificationsPopover renders in header
- [ ] Bell icon visible with unread badge
- [ ] No console errors

**Steps**:

1. Start dev server
2. Open http://localhost:5173
3. Check browser console (F12)

### Phase 3: Network Requests

- [ ] Open DevTools Network tab
- [ ] Click on Notifications in header or navigate to /app/notifications
- [ ] Verify `GET /api/notifications` request succeeds
- [ ] Check response has correct structure

**Response format**:

```json
[
  {
    "id": 1,
    "title": "Sample",
    "body": "Body text",
    "createdAt": "2025-12-19T10:30:00Z",
    "read": false,
    "favorite": false,
    "archived": false
  }
]
```

### Phase 4: Redux State

- [ ] Install Redux DevTools extension (if not already)
- [ ] Open Redux DevTools
- [ ] Look for `api` reducer
- [ ] Expand `queries` → `getNotifications`
- [ ] Verify data structure in cache

**Path in Redux DevTools**:

```
api
  └─ queries
     └─ getNotifications
        └─ data: [...]
```

### Phase 5: User Interactions

#### Test Mark as Read (Single)

- [ ] Open NotificationsPopover (bell icon)
- [ ] Hover over a notification
- [ ] Click mail icon
- [ ] Verify request: `PATCH /api/notifications/1` with `{"read": true}`
- [ ] UI updates immediately (optimistic)
- [ ] Toast shows success message
- [ ] Notification appears faded/marked as read

#### Test Mark All as Read

- [ ] In NotificationsPopover, click "Mark all"
- [ ] Verify multiple PATCH requests sent
- [ ] All notifications marked as read
- [ ] Toast shows success

#### Test Mark as Favorite

- [ ] Go to full Notifications page
- [ ] Click star icon on a notification
- [ ] Verify request: `PATCH /api/notifications/1` with `{"favorite": true}`
- [ ] Star becomes yellow/filled
- [ ] Notification appears in Favorites tab

#### Test Archive

- [ ] Click archive icon on notification
- [ ] Verify request: `PATCH /api/notifications/1` with `{"archived": true}`
- [ ] Notification disappears from All tab
- [ ] Notification appears in Archived tab

#### Test Delete

- [ ] Click trash icon on notification
- [ ] Confirm deletion in dialog
- [ ] Verify request: `DELETE /api/notifications/1`
- [ ] Notification removed from list
- [ ] Toast shows success

#### Test Bulk Operations

- [ ] Go to Notifications page
- [ ] Select multiple notifications via checkboxes
- [ ] Click "Mark all read" button
- [ ] Verify all selected notifications marked as read
- [ ] Click "Delete selected"
- [ ] Confirm in dialog
- [ ] All selected notifications deleted

#### Test Search

- [ ] Go to Notifications page
- [ ] Type in search box
- [ ] List filters in real-time
- [ ] Only matching notifications shown

#### Test Tab Filtering

- [ ] Go to Notifications page
- [ ] Click "Favorites" tab
- [ ] Only favorite notifications shown
- [ ] Click "Archived" tab
- [ ] Only archived notifications shown
- [ ] Click "All" tab
- [ ] All non-archived notifications shown

### Phase 6: Error Handling

#### Simulate 401 Error

- [ ] Logout or clear session
- [ ] Try to perform any action
- [ ] Should see: "Sesi Anda telah berakhir. Silakan login kembali."

#### Simulate 404 Error

- [ ] Try to update non-existent notification (change ID in request)
- [ ] Should see: "Endpoint tidak ditemukan..."

#### Simulate Network Error

- [ ] Disable internet or backend
- [ ] Try to fetch notifications
- [ ] Should show error toast
- [ ] UI gracefully handles error

### Phase 7: Loading States

- [ ] When first loading notifications
- [ ] "Loading..." message should appear
- [ ] Once data loads, list displays
- [ ] During mutation, buttons should be disabled (if implemented)

### Phase 8: Cross-Tab Synchronization (Advanced)

- [ ] Open app in two browser tabs
- [ ] Make changes in Tab 1
- [ ] Changes should reflect in Tab 2 (via Redux cache)
- [ ] Note: Requires tab to be focused or polling enabled

---

## Common Issues & Solutions

### Issue: 401 Unauthorized

**Symptoms**:

- Toast: "Sesi Anda telah berakhir..."
- Network shows 401 responses

**Solutions**:

1. Verify session cookie is set
2. Check `credentials: 'include'` in baseQuery
3. Ensure authentication is valid on backend

**Code to check**:

```typescript
// app/lib/api.ts
baseQuery: fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include', // ← Ensure this is set
});
```

### Issue: 404 Not Found

**Symptoms**:

- Toast: "Endpoint tidak ditemukan..."
- Network shows 404 responses

**Solutions**:

1. Verify endpoint paths match backend
2. Check `VITE_API_BASE_URL` environment variable
3. Ensure backend is running

**Endpoints to verify**:

- `GET /api/notifications`
- `PATCH /api/notifications/{id}`
- `DELETE /api/notifications/{id}`

### Issue: CORS Errors

**Symptoms**:

- Console shows CORS errors
- No network request appears

**Solutions** (Backend):

1. Enable CORS on Spring Boot backend
2. Allow credentials in CORS config

**Backend Config Example**:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Issue: No Data Loading

**Symptoms**:

- "Loading..." persists indefinitely
- Or empty list shows

**Solutions**:

1. Check backend is running
2. Verify endpoint returns valid JSON
3. Check browser console for errors
4. Check Redux DevTools for error state

**Debug steps**:

```typescript
// Add console logs in component
const { data, isLoading, error } = useGetNotificationsQuery();
console.log('Loading:', isLoading);
console.log('Error:', error);
console.log('Data:', data);
```

### Issue: Changes Not Persisting

**Symptoms**:

- UI updates but changes don't save
- Refresh resets to old state

**Solutions**:

1. Verify mutation requests are sent (check Network tab)
2. Check mutation responses are successful (200/204)
3. Verify backend is saving changes
4. Check Redux cache invalidation

### Issue: Slow Performance

**Symptoms**:

- Updates take long time
- List renders slowly with many notifications

**Solutions**:

1. Implement pagination (if many notifications)
2. Check for unnecessary re-renders (React DevTools Profiler)
3. Enable caching (already done)
4. Consider virtual scrolling for large lists

---

## Testing with Mock Data

### Option 1: Mock Service Worker (MSW)

```typescript
// handlers.ts
import { http, HttpResponse } from 'msw';

const mockNotifications = [
  {
    id: 1,
    title: 'Test Notification',
    body: 'This is a test',
    createdAt: new Date().toISOString(),
    read: false,
    favorite: false,
    archived: false,
  },
];

export const handlers = [
  http.get('/api/notifications', () => {
    return HttpResponse.json(mockNotifications);
  }),

  http.patch('/api/notifications/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      ...mockNotifications[0],
      id: Number(id),
    });
  }),

  http.delete('/api/notifications/:id', () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];
```

### Option 2: Backend Mock Endpoint

```java
@SpringBootTest
public class NotificationControllerTest {

  @MockBean
  private NotificationService service;

  @Test
  public void testGetNotifications() {
    // Setup mock
    List<NotificationResponse> mockData = List.of(
      new NotificationResponse(1L, "Test", "Body", ...)
    );
    when(service.inbox()).thenReturn(mockData);

    // Test
    // ...
  }
}
```

---

## Performance Optimization Tips

### 1. Enable Query Caching

Already configured in Redux Toolkit Query

### 2. Implement Pagination

```typescript
// Future enhancement
const page = 1;
const { data: notifications } = useGetNotificationsQuery(page);
```

### 3. Lazy Load Notification Bodies

```typescript
// Only load full body when notification is expanded
const [expanded, setExpanded] = useState<number | null>(null);
{
  expanded === n.id && n.body;
}
```

### 4. Virtual Scrolling

```typescript
// For very long lists
import { FixedSizeList } from 'react-window';
```

### 5. WebSocket Real-Time Updates

```typescript
// Future enhancement for real-time notifications
import { useEffect } from 'react';

useEffect(() => {
  const socket = new WebSocket('ws://...');
  socket.onmessage = (event) => {
    // Update notifications
  };
}, []);
```

---

## Deployment Checklist

- [ ] Environment variables set in production
- [ ] Backend API base URL correct
- [ ] CORS configured on backend
- [ ] Session/auth properly configured
- [ ] Error logging set up
- [ ] Performance monitoring enabled
- [ ] Tests passing
- [ ] No console errors in production
- [ ] Accessibility tested (WCAG)

---

## Documentation Files

1. **NOTIFICATIONS_INTEGRATION.md** - Detailed integration guide
2. **NOTIFICATIONS_API_INTEGRATION_SUMMARY.md** - Executive summary
3. **NOTIFICATIONS_QUICK_REFERENCE.md** - Developer quick reference
4. **NOTIFICATIONS_ARCHITECTURE.md** - System architecture & data flow
5. **NOTIFICATIONS_IMPLEMENTATION_CHECKLIST.md** - Implementation checklist
6. **This file** - Setup & verification guide

---

## Getting Help

### Check These First

1. Redux DevTools for state
2. Browser Network tab for requests
3. Console for error messages
4. Backend logs for server-side errors

### Common Debugging Commands

```typescript
// In browser console
// Check Redux state
store.getState().api.queries;

// Check specific query
store.getState().api.queries.getNotifications;

// Refetch manually
store.dispatch(api.util.resetApiState());
```

---

## Next Steps

1. ✅ Follow setup steps above
2. ✅ Run verification checklist
3. ✅ Fix any issues found
4. ✅ Test all user interactions
5. ✅ Test error scenarios
6. ✅ Performance test
7. ✅ Deploy to production

---

**Last Updated**: December 19, 2025  
**Status**: Ready for Integration Testing  
**Estimated Setup Time**: 15-30 minutes
