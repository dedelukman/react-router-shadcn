# 🔧 TROUBLESHOOTING GUIDE - TICKET DATA NOT SHOWING

## ❌ Problem: Data tidak tampil di table

### ✅ Step 1: Check Backend Connection

**Check di Browser DevTools Console:**

```javascript
// Paste ini di console untuk test API:
fetch('/tickets')
  .then((r) => r.json())
  .then((d) => console.log('Response:', d))
  .catch((e) => console.error('Error:', e));
```

**Expected Output:**

```json
[
  { "id": "T-1", "subject": "...", "category": "BUG_ERROR", ... },
  { "id": "T-2", "subject": "...", "category": "FEATURE_QUESTION", ... }
]
```

---

### ❌ Problem: 404 Not Found

**Penyebab:** Endpoint path salah

**Solution:**

1. Update `.env.local`:

```env
# Coba salah satu:
VITE_API_BASE_URL=http://localhost:3000/
VITE_API_BASE_URL=http://localhost:3000/api/
VITE_API_BASE_URL=http://localhost:8080/api/
VITE_API_BASE_URL=/api/
```

2. Sesuaikan dengan backend URL Anda

3. Restart dev server: `npm run dev`

---

### ❌ Problem: CORS Error

**Console Error:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

Backend harus allow CORS. Contoh Node/Express:

```javascript
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: 'include',
  })
);
```

---

### ✅ Step 2: Check Response Format

**Backend harus return:**

#### Option A: Array (Simple)

```json
[
  { "id": "T-1", "category": "BUG_ERROR", "priority": "HIGH", ... },
  { "id": "T-2", "category": "FEATURE_QUESTION", "priority": "NORMAL", ... }
]
```

#### Option B: Wrapped (Complex)

```json
{
  "data": [
    { "id": "T-1", "category": "BUG_ERROR", ... },
    { "id": "T-2", "category": "FEATURE_QUESTION", ... }
  ]
}
```

**Current code sudah handle Option A & B**. Jika format berbeda, modifikasi di `transformResponse`.

---

### ✅ Step 3: Check API Configuration

**File: `.env.local`**

```env
# Harus sesuai dengan backend URL
VITE_API_BASE_URL=http://localhost:3000/api/
```

**Check:**

```bash
# 1. File exists?
ls -la .env.local

# 2. Content correct?
cat .env.local
```

---

### ✅ Step 4: Check Console Logs

**Open DevTools → Console**

Lihat debug logs:

```
[DEBUG] Fetching tickets from endpoint
[DEBUG] Raw API Response: [...]
[DEBUG] Response type: array
[DEBUG] Transformed Response: [...]
```

**Jika ada error:**

```
[ERROR] Failed to fetch tickets: ...
[ERROR] Endpoint /tickets not found. Check your backend URL.
```

---

### ✅ Step 5: Manual Test

**Test di Browser Console:**

```javascript
// Test 1: Check base URL
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// Test 2: Direct fetch
fetch('http://localhost:3000/api/tickets')
  .then((r) => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then((data) => console.log('Data:', data))
  .catch((e) => console.error('Error:', e));

// Test 3: Check Redux store
// Open Redux DevTools Chrome extension
// Look for api.queries["getTickets"]
```

---

## 🔧 COMMON ISSUES & SOLUTIONS

### Issue 1: Empty Array Response

**Problem:** API returns `[]` instead of tickets

**Solution:**

1. Check database - are there any tickets?
2. If no tickets, system shows "No tickets yet" message
3. Create test ticket via backend directly

### Issue 2: Response Format Mismatch

**Problem:** Backend returns different structure

**Solution:** Update `transformResponse` in `api.ts`

Example - if backend returns `{ tickets: [...] }`:

```typescript
transformResponse: (response: any) => {
  const ticketArray = response.tickets || [];
  return ticketArray.map((ticket) => ({
    ...ticket,
    category: getCategoryForFrontend(ticket.category),
    // ...
  }));
};
```

### Issue 3: Enum Values Not Converting

**Problem:** UI shows `BUG_ERROR` instead of `Bug/Error`

**Solution:** Check mapper functions in `ticket-mapper.ts`

```javascript
// In console:
const { getCategoryForFrontend } = await import('/src/lib/ticket-mapper.ts');
getCategoryForFrontend('BUG_ERROR'); // Should output: 'Bug/Error'
```

### Issue 4: Type Mismatch

**Problem:** TypeScript error on category

**Check:** Use frontend format, not backend format

```typescript
// ✅ Correct
category: 'Bug/Error';

// ❌ Wrong
category: 'BUG_ERROR';
```

---

## 📋 VERIFICATION CHECKLIST

- [ ] `.env.local` file exists
- [ ] `VITE_API_BASE_URL` points to correct backend
- [ ] Backend API `/tickets` endpoint responds with data
- [ ] Response includes: `id`, `subject`, `category`, `priority`, `status`, `description`, `createdAt`, `updatedAt`
- [ ] Backend uses enum format: `BUG_ERROR`, `HIGH`, `OPEN`
- [ ] DevTools Console shows `[DEBUG]` logs (not errors)
- [ ] No CORS errors
- [ ] Dev server restarted after `.env.local` changes

---

## 🚀 NEXT: Test CREATE Operation

Once GET is working:

1. Click "Create Ticket"
2. Fill form
3. Click "Submit"
4. Check:
   - Loading state shows
   - Success message displays
   - New ticket appears in table
   - Check Network tab - request has correct format

---

## 📞 DEBUGGING STEPS

**If still not working, check in this order:**

1. **Backend Running?**

   ```bash
   # Test backend
   curl http://localhost:3000/api/tickets
   ```

2. **Endpoint Correct?**

   ```bash
   # Check what endpoint backend exposes
   # Common: /api/tickets or /tickets
   ```

3. **Response Format?**

   ```javascript
   // In console
   fetch('http://localhost:3000/api/tickets')
     .then((r) => r.json())
     .then((d) => console.log(JSON.stringify(d, null, 2)));
   ```

4. **Enum Format?**

   ```javascript
   // Check if backend returns BUG_ERROR or Bug/Error
   // Should be BUG_ERROR (uppercase with underscore)
   ```

5. **DevTools Console**
   ```
   Look for:
   - Network tab: Is request sent? Status 200?
   - Console: Any errors logged?
   - Redux DevTools: Is cache updated?
   ```

---

## ✨ SUCCESS INDICATORS

When working correctly, you should see:

✅ Console shows: `[DEBUG] Transformed Response: [...]`
✅ Table displays tickets with correct data
✅ Category shows as "Bug/Error", not "BUG_ERROR"
✅ Priority shows as "High", not "HIGH"
✅ No errors in console
✅ Loading skeleton appears briefly

---

**Last Updated:** December 17, 2025
**Status:** Debugging Guide Ready
