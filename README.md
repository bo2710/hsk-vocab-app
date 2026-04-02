# HSK Vocab App

Ứng dụng quản lý từ vựng HSK cá nhân, hỗ trợ offline và PWA (Progressive Web App). Hệ thống được thiết kế theo kiến trúc Offline-first với IndexedDB làm bộ đệm và Supabase làm kho lưu trữ trung tâm.

## 🚀 Công nghệ sử dụng
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL) tích hợp Row Level Security (RLS)
- **Offline Storage:** IndexedDB (thư viện `idb`)
- **PWA:** `vite-plugin-pwa`

## ⚙️ Cài đặt và Chạy dự án

1. **Cài đặt thư viện:**
   ```bash
   npm install