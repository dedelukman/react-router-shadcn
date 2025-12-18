# Integrasi Ticket API - Dokumentasi

## Ringkasan Perubahan

Sistem telah diperbarui untuk menyelaraskan format data antara frontend dan backend sesuai dengan enum backend Anda.

### File yang Dibuat/Diubah:

#### 1. **NEW: `app/lib/ticket-mapper.ts`**

Mapper untuk konversi format enum antara frontend dan backend:

- **Frontend format**: 'Bug/Error', 'Feature Question', 'Normal', 'Open' (user-friendly dengan spasi)
- **Backend format**: 'BUG_ERROR', 'FEATURE_QUESTION', 'NORMAL', 'OPEN' (SCREAMING_SNAKE_CASE)

#### 2. **UPDATED: `app/lib/api.ts`**

- Impor semua fungsi mapper dari `ticket-mapper.ts`
- Update endpoint `getTickets`: Menambahkan `transformResponse` untuk konversi otomatis
- Update endpoint `getTicketById`: Menambahkan `transformResponse`
- Update endpoint `createTicket`:
  - Query: Konversi data ke format backend sebelum dikirim
  - Response: Konversi response kembali ke format frontend
- Update endpoint `updateTicket`: Konversi dua arah
- Update `tagTypes` untuk menambahkan 'Ticket'

#### 3. **UPDATED: `app/components/panel/gethelp/gethelp.tsx`**

- Menggunakan `useGetTicketsQuery()` hook untuk fetch data dari API
- Menggunakan `useCreateTicketMutation()` hook untuk submit ticket
- Menambahkan error handling dengan API response
- Menambahkan loading state untuk better UX

#### 4. **UPDATED: `app/components/panel/gethelp/create-ticket-form.tsx`**

- Menambahkan `isSubmitting` prop untuk track submission state
- Disable form inputs selama submission
- Update button text menjadi "Submitting..." saat loading

#### 5. **UPDATED: `app/components/panel/gethelp/ticket-table.tsx`**

- Menambahkan `isLoading` prop
- Menambahkan skeleton loading saat fetch data
- Menambahkan empty state ketika tidak ada tickets

#### 6. **UPDATED: `app/i18n/locales/en.json`**

Ditambahkan translation keys:

- `submitting`: "Submitting..."
- `noTickets`: "No tickets yet. Create one to get started."
- `error.failedToCreate`: "Failed to create ticket. Please try again."

#### 7. **UPDATED: `app/i18n/locales/id.json`**

Ditambahkan translation keys (Bahasa Indonesia):

- `submitting`: "Sedang diajukan..."
- `noTickets`: "Belum ada tiket. Buat satu untuk memulai."
- `error.failedToCreate`: "Gagal membuat tiket. Silakan coba lagi."

---

## Data Flow Diagram

### Saat User Membuat Ticket:

```
User Input:
{
  subject: "Cannot login",
  category: "Bug/Error",          ← Frontend format
  priority: "High",               ← Frontend format
  description: "..."
}
    ↓
createTicketApi() dipanggil
    ↓
Mapper (getCategoryForBackend, getPriorityForBackend):
{
  subject: "Cannot login",
  category: "BUG_ERROR",          ← Backend format
  priority: "HIGH",               ← Backend format
  description: "..."
}
    ↓
Dikirim ke API: POST /tickets
    ↓
Backend Response:
{
  id: "T-123",
  category: "BUG_ERROR",
  priority: "HIGH",
  status: "OPEN",
  ...
}
    ↓
transformResponse (getCategoryForFrontend, etc):
{
  id: "T-123",
  category: "Bug/Error",          ← Kembali ke format frontend
  priority: "High",               ← Kembali ke format frontend
  status: "Open",                 ← Kembali ke format frontend
  ...
}
    ↓
Ditampilkan di UI: "Bug/Error", "High", "Open"
```

---

## Mapping Reference

### Category Mapping:

| Frontend         | Backend          |
| ---------------- | ---------------- |
| Bug/Error        | BUG_ERROR        |
| Feature Question | FEATURE_QUESTION |
| Feature Request  | FEATURE_REQUEST  |
| Account          | ACCOUNT          |
| Payment          | PAYMENT          |
| Other            | OTHER            |

### Priority Mapping:

| Frontend | Backend  |
| -------- | -------- |
| Low      | LOW      |
| Normal   | NORMAL   |
| High     | HIGH     |
| Critical | CRITICAL |

### Status Mapping:

| Frontend      | Backend       |
| ------------- | ------------- |
| Open          | OPEN          |
| Responded     | RESPONDED     |
| Investigating | INVESTIGATING |
| Pending       | PENDING       |
| Done          | DONE          |
| Closed        | CLOSED        |

---

## Testing Checklist

- [ ] Submit ticket dengan kategori "Bug/Error"
- [ ] Verifikasi backend menerima "BUG_ERROR"
- [ ] Verifikasi UI menampilkan "Bug/Error"
- [ ] Submit ticket dengan priority "High"
- [ ] Verifikasi backend menerima "HIGH"
- [ ] Verifikasi UI menampilkan "High"
- [ ] Test fetch list tickets
- [ ] Verifikasi semua categories terdisplay dengan benar
- [ ] Test loading states (skeleton, disabled buttons)
- [ ] Test error handling (network error, validation error)
- [ ] Test empty state (no tickets)

---

## API Endpoints Mapping

```typescript
// GET all tickets
GET /tickets
Response: Ticket[] (dengan format frontend)

// GET specific ticket
GET /tickets/:id
Response: Ticket (dengan format frontend)

// CREATE ticket
POST /tickets
Body: Ticket data (frontend format akan dikonversi ke backend)
Response: Ticket (dikonversi kembali ke frontend)

// UPDATE ticket
PUT /tickets/:id
Body: Partial<Ticket> (frontend format akan dikonversi)
Response: Ticket (dikonversi kembali ke frontend)

// DELETE ticket
DELETE /tickets/:id
Response: void
```

---

## Notes

1. **Semua konversi otomatis** - Tidak perlu manual mapping di component
2. **Frontend selalu user-friendly** - Dengan spasi dan huruf besar wajar
3. **Backend selalu SCREAMING_SNAKE_CASE** - Sesuai enum Java/backend
4. **Type-safe** - Typescript akan validate semua props
5. **Backward compatible** - Tidak ada breaking changes pada component API

---

## Contoh Penggunaan di Component

```tsx
// Fetch tickets
const { data: tickets = [], isLoading } = useGetTicketsQuery();

// Create ticket
const [createTicketApi, { isLoading: isSubmitting }] =
  useCreateTicketMutation();

// Submit (format frontend, akan otomatis dikonversi)
await createTicketApi({
  subject: 'Bug di checkout',
  category: 'Bug/Error', // Frontend format
  priority: 'High', // Frontend format
  description: '...',
}).unwrap();

// Response sudah dikonversi kembali ke frontend format
// tickets[0].category akan berisi "Bug/Error"
// tickets[0].priority akan berisi "High"
```

---

**Last Updated**: December 17, 2025
**Version**: 1.0
