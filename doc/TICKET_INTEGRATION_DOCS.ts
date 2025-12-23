/**
 * DOKUMENTASI INTEGRASI TICKET API
 *
 * Perubahan yang telah dilakukan untuk menyelaraskan data frontend dan backend:
 *
 * 1. MAPPER (ticket-mapper.ts) - Konversi Format Data
 *    - categoryFrontendToBackend: Konversi 'Bug/Error' -> 'BUG_ERROR', 'Feature Question' -> 'FEATURE_QUESTION', dll
 *    - categoryBackendToFrontend: Konversi kebalikan dari backend ke format tampilan frontend
 *    - priorityFrontendToBackend: Konversi 'Low' -> 'LOW', 'Normal' -> 'NORMAL', dll
 *    - statusFrontendToBackend/Frontend: Konversi status antara dua format
 *
 * 2. API INTEGRATION (api.ts)
 *    - Menambahkan transformResponse di setiap endpoint untuk otomatis mapping data
 *    - getTickets: Fetch semua tiket + transformasi ke format frontend
 *    - getTicketById: Fetch tiket spesifik + transformasi
 *    - createTicket: Kirim data dengan transformasi ke format backend, terima dengan transformasi kembali
 *    - updateTicket: Update tiket dengan transformasi dua arah
 *    - deleteTicket: Hapus tiket
 *
 * 3. KOMPONEN FRONTEND
 *    - gethelp.tsx: Component utama, menggunakan API hooks
 *    - create-ticket-form.tsx: Form dengan support loading state
 *    - ticket-table.tsx: Tabel dengan skeleton loading dan empty state
 *    - ticket-details.tsx: Detail view (sudah menggunakan getTranslatedValue)
 *
 * 4. TRANSLATIONS (i18n)
 *    - Ditambahkan: 'submitting', 'failedToCreate', 'noTickets' keys
 *    - Tersedia dalam bahasa Inggris dan Indonesia
 *
 * FLOW DATA:
 *
 * CREATE TICKET:
 * User Input (Frontend format)
 *   ↓
 * createTicketApi() dipanggil
 *   ↓
 * API mapper: 'Bug/Error' → 'BUG_ERROR'
 *   ↓
 * Dikirim ke backend: { category: 'BUG_ERROR', priority: 'HIGH', ... }
 *   ↓
 * Backend response diterima
 *   ↓
 * transformResponse: 'BUG_ERROR' → 'Bug/Error'
 *   ↓
 * Ditampilkan di UI: 'Bug/Error'
 *
 * DISPLAY TICKET:
 * Backend response: { category: 'FEATURE_QUESTION', priority: 'NORMAL', ... }
 *   ↓
 * transformResponse: Konversi ke frontend format
 *   ↓
 * Ditampilkan sebagai: 'Feature Question', 'Normal'
 *
 * CATATAN PENTING:
 * - Semua konversi enum (category, priority, status) dilakukan di API layer
 * - Frontend selalu bekerja dengan format yang user-friendly (dengan spasi, huruf besar)
 * - Backend selalu menerima dan mengirim format UPPERCASE dengan underscore (SCREAMING_SNAKE_CASE)
 * - Tidak perlu mengubah logic di components, semuanya otomatis di API layer
 */

export const TICKET_INTEGRATION_DOCS = {
  version: '1.0',
  lastUpdated: '2025-12-17',
  description: 'Ticket API Integration with Frontend-Backend Format Mapping',
};
