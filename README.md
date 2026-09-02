# Todo App Dashboard

Aplikasi manajemen tugas (Todo App) modern berbasis web full-stack dengan arsitektur terpisah antara Frontend dan Backend. Dibangun untuk membantu pengguna mencatat, mengelola, memantau aktivitas harian, serta melihat analitik penyelesaian tugas secara real-time.

---

## 📖 Deskripsi Proyek (Description)

Todo App Dashboard mengimplementasikan REST API yang cepat dengan Bun dan Elysia.js, antarmuka interaktif dan responsif menggunakan React dan TypeScript dengan Vite, serta integrasi basis data relasional PostgreSQL melalui Prisma ORM.

Aplikasi ini mencakup fitur CRUD lengkap, pelacakan status tugas, manajemen prioritas, indikator keterlambatan (overdue), pencarian judul, filter multi-kategori, sortir fleksibel, dashboard analitik visual, dan tampilan Kanban Board interaktif dengan drag-and-drop.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Backend Runtime** | Bun | Runtime JavaScript/TypeScript berkinerja tinggi |
| **Backend Framework** | Elysia.js | Framework web cepat dan type-safe untuk Bun |
| **Database** | PostgreSQL | Sistem manajemen basis data relasional |
| **ORM** | Prisma | Object-Relational Mapping & Schema Management |
| **Frontend Framework** | React (v18) + TypeScript | Library UI deklaratif dan type-safe |
| **Build Tool** | Vite | Frontend tooling modern & cepat |
| **Styling** | Modern CSS Design System | Glassmorphism, Dark/Light Mode, Animations |
| **Testing** | Bun Test | Framework pengujian bawaan Bun (Unit & Integration) |
| **Icons** | Lucide React | Icon set modern dan ringan |
| **Version Control** | Git & GitHub | Pelacakan versi dan kolaborasi kode |

---

## ✨ Fitur Utama & Fitur Bonus (Features)

### Fitur Utama (Core)
1. **Dashboard Statistik**:
   - Total Todo, Pending, In Progress, Completed, dan Overdue.
   - Progress bar persentase penyelesaian tugas.
   - Daftar 5 aktivitas tugas terbaru (*Recent Todos*).
2. **Manajemen Todo (CRUD)**:
   - **Create**: Tambah Todo baru dengan judul (wajib), deskripsi, prioritas, status, dan due date.
   - **Read**: Tampilkan daftar Todo dengan pagination/grid responsif dan detail lengkap.
   - **Update**: Edit data Todo secara keseluruhan (PUT) atau ganti status secara instan (PATCH).
   - **Delete**: Hapus Todo dengan dialog konfirmasi keamanan (*Confirmation Dialog*).
3. **Pencarian Real-Time**:
   - Cari tugas berdasarkan kata kunci pada judul atau deskripsi.
4. **Filter & Kategori**:
   - Filter berdasarkan status (`All`, `Pending`, `In Progress`, `Completed`).
   - Filter berdasarkan prioritas (`All`, `Low`, `Medium`, `High`).
5. **Validasi Data & Error Handling**:
   - Validasi ketat pada backend dan frontend untuk title, enum status, enum priority, dan validitas ID.

### Fitur Tambahan (Bonus Features)
- 🌓 **Dark Mode & Light Mode**: Tema visual modern yang tersimpan otomatis di *localStorage*.
- 🔔 **Toast Notifications**: Notifikasi interaktif untuk setiap operasi berhasil atau gagal.
- ⚠️ **Overdue Indicator**: Penanda visual merah untuk tugas yang melewati batas waktu deadline dan belum selesai.
- 🗂️ **Kanban Board View**: Papan tugas visual dengan drag-and-drop untuk memindahkan tugas antar status.
- 🔀 **Sorting Lanjutan**: Urutkan berdasarkan tugas terbaru (*Newest*), terlama (*Oldest*), deadline terdekat, atau judul (*A-Z*).
- 🎉 **Confetti Celebration**: Animasi selebrasi saat tugas diselesaikan.

---

## 📁 Struktur Proyek (Project Structure)

```text
todo-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma            # Skema database Prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   └── todo.controller.ts    # Controller request handler
│   │   ├── routes/
│   │   │   └── todo.route.ts         # Definisi router REST API
│   │   ├── services/
│   │   │   └── todo.service.ts       # Query Prisma & business logic
│   │   ├── utils/
│   │   │   └── todo.utils.ts         # Helper kalkulasi & format response
│   │   ├── validators/
│   │   │   └── todo.validator.ts     # Validasi input request
│   │   ├── lib/
│   │   │   └── prisma.ts             # Prisma client singleton
│   │   └── index.ts                  # Server entry point Elysia.js
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── todo.validator.test.ts # Pengujian unit validator
│   │   │   └── todo.utils.test.ts     # Pengujian unit business logic
│   │   └── integration/
│   │       └── todo.api.test.ts       # Pengujian integrasi API & DB
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Navigasi & switch tema
│   │   │   ├── StatCard.tsx           # Kartu analitik statistik
│   │   │   ├── TodoModal.tsx          # Form dialog Tambah & Edit Todo
│   │   │   ├── DeleteModal.tsx        # Dialog konfirmasi hapus
│   │   │   ├── Toast.tsx              # Komponen Toast notification
│   │   │   ├── StatusBadge.tsx        # Visual badge status
│   │   │   └── PriorityBadge.tsx      # Visual badge prioritas
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx      # Halaman dashboard & ringkasan
│   │   │   ├── TodosPage.tsx          # Halaman daftar tugas & filter
│   │   │   └── KanbanPage.tsx         # Halaman Kanban drag & drop
│   │   ├── services/
│   │   │   └── todoApi.ts             # Client service fetch API
│   │   ├── types/
│   │   │   └── todo.ts                # TypeScript interface & types
│   │   ├── App.tsx                    # Komponen utama aplikasi
│   │   ├── main.tsx                   # React DOM entry point
│   │   └── index.css                  # Modern design system stylesheet
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── .gitignore
```

---

## ⚙️ Persyaratan Sistem & Instalasi (Installation)

### Prasyarat:
- **Bun** (versi >= 1.0.0) -> [Instalasi Bun](https://bun.sh)
- **PostgreSQL** (versi 14+) berjalan di port `5432`
- **Git**

---

## 🔐 Variabel Lingkungan (Environment Variables)

Buat file `.env` di dalam direktori `backend/`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/todo_app_db"
PORT=3000
```

> File contoh tersedia di `backend/.env.example`.

---

## 🗄️ Setup Database & Migrasi Prisma (Database Setup & Prisma Migration)

1. Pastikan service PostgreSQL aktif, lalu buat database `todo_app_db`:
   ```sql
   CREATE DATABASE todo_app_db;
   ```

2. Buka folder `backend` dan jalankan sinkronisasi / migrasi Prisma:
   ```bash
   cd backend
   bunx prisma db push
   # atau
   bunx prisma migrate dev --name init
   bunx prisma generate
   ```

3. *(Opsional)* Untuk membuka GUI visual database:
   ```bash
   bunx prisma studio
   ```

---

## 🚀 Menjalankan Aplikasi (Running Project)

### 1. Menjalankan Backend:
```bash
cd backend
bun run dev
# Server aktif di: http://localhost:3000
```

### 2. Menjalankan Frontend:
Buka terminal baru:
```bash
cd frontend
bun run dev
# Frontend aktif di: http://localhost:5173
```

---

## 🧪 Menjalankan Pengujian (Running Tests)

Backend dilengkapi dengan rangkaian pengujian otomatis lengkap menggunakan Bun Test:

```bash
cd backend

# Menjalankan seluruh pengujian (Unit + Integration)
bun test

# Menjalankan hanya Unit Testing
bun test tests/unit

# Menjalankan hanya Integration Testing
bun test tests/integration
```

### Rangkuman Hasil Pengujian:
- **34 tests passing** (0 failure).
- **Unit Tests**: Menguji validasi title kosong, title valid, enum priority (LOW, MEDIUM, HIGH, invalid), enum status, validasi ID, dan business logic `isOverdue` serta kalkulasi statistik.
- **Integration Tests**: Menguji end-to-end komunikasi Elysia.js -> Prisma ORM -> PostgreSQL untuk Create, Get All, Get By ID, Update (PUT), Update Status (PATCH), Delete, 404 Not Found, 400 Bad Request, dan Dashboard statistics.

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Proyek ini telah dilengkapi dengan workflow otomatisasi **GitHub Actions CI** pada file [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml):

- **Trigger**: Otomatis berjalan pada setiap `push` dan `pull_request` ke branch `main` atau `master`.
- **Backend Job (`backend-ci`)**:
  - Menjalankan service container **PostgreSQL 16**.
  - Menginstal dependensi runtime Bun.
  - Menjalankan **Linting & Typecheck** (`bun run lint`).
  - Menjalankan migrasi Prisma (`bun run prisma:push`).
  - Menjalankan seluruh pengujian unit & integrasi (`bun test`).
- **Frontend Job (`frontend-ci`)**:
  - Menginstal dependensi frontend.
  - Menjalankan **Linting & Typecheck** (`bun run lint`).
  - Menjalankan **Production Build** (`bun run build`).

---

## 📚 Dokumentasi REST API (API Documentation)

Base URL: `http://localhost:3000/api`

### Tabel Endpoint

| Method | Endpoint | Deskripsi | Status Code Berhasil |
| :--- | :--- | :--- | :--- |
| **GET** | `/todos` | Mengambil seluruh daftar Todo (mendukung query filter) | `200 OK` |
| **GET** | `/todos/:id` | Mengambil detail Todo berdasarkan ID | `200 OK` (atau `404 Not Found`) |
| **POST** | `/todos` | Membuat Todo baru | `201 Created` (atau `400 Bad Request`) |
| **PUT** | `/todos/:id` | Memperbarui seluruh data Todo | `200 OK` (atau `400/404`) |
| **PATCH** | `/todos/:id/status` | Mengubah status Todo (`PENDING`, `IN_PROGRESS`, `COMPLETED`) | `200 OK` (atau `400/404`) |
| **DELETE** | `/todos/:id` | Menghapus Todo berdasarkan ID | `200 OK` (atau `404 Not Found`) |
| **GET** | `/dashboard` | Mengambil ringkasan statistik dan analitik Todo | `200 OK` |

---

### Contoh Request & Response Payload

#### 1. GET `/api/todos`
**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Membuat Todo App",
      "description": "Mengerjakan backend Todo",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2026-09-10T00:00:00.000Z",
      "createdAt": "2026-09-02T06:50:00.000Z",
      "updatedAt": "2026-09-02T07:00:00.000Z"
    }
  ]
}
```

#### 2. POST `/api/todos`
**Request Body:**
```json
{
  "title": "Membuat Unit Testing",
  "description": "Membuat pengujian fungsi validasi Todo",
  "priority": "HIGH",
  "dueDate": "2026-09-10"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Membuat Unit Testing",
    "description": "Membuat pengujian fungsi validasi Todo",
    "status": "PENDING",
    "priority": "HIGH",
    "dueDate": "2026-09-10T00:00:00.000Z",
    "createdAt": "2026-09-02T07:05:00.000Z",
    "updatedAt": "2026-09-02T07:05:00.000Z"
  }
}
```

#### 3. PATCH `/api/todos/:id/status`
**Request Body:**
```json
{
  "status": "COMPLETED"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Membuat Unit Testing",
    "status": "COMPLETED",
    "priority": "HIGH",
    "updatedAt": "2026-09-02T07:10:00.000Z"
  }
}
```

#### 4. GET `/api/dashboard`
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 20,
    "pending": 8,
    "inProgress": 5,
    "completed": 7,
    "overdue": 2,
    "recent": [ ... ]
  }
}
```

#### 5. Format Error Response
**Response (400 / 404 / 500):**
```json
{
  "success": false,
  "message": "Title wajib diisi"
}
```

---

## 🎥 Panduan Demo & Screen Record (Screen Record Demo Guide)

Urutan demonstrasi yang disarankan untuk video demo / review mentor:
1. **Pembukaan**: Penjelasan arsitektur full-stack (Bun + Elysia.js + PostgreSQL + Prisma + React TypeScript).
2. **Struktur Project**: Tinjau folder backend, frontend, tests, dan prisma.
3. **Database**: Buka `prisma/schema.prisma` dan perlihatkan model serta enums.
4. **Backend**: Tinjau `index.ts`, routing, controller, service, validator, dan utilitas.
5. **Testing**: Jalankan `bun test` di terminal untuk memperlihatkan semua unit & integration test lulus.
6. **Frontend Dashboard**: Tunjukkan statistik real-time, progress bar, dan Recent Todos.
7. **Demo Fitur CRUD**:
   - Tambah Todo baru (*Create*).
   - Filter dan cari Todo (*Search & Filter*).
   - Ubah status menjadi *In Progress* lalu *Completed* (*Status Switch & Confetti*).
   - Edit judul & deadline (*Update*).
   - Buka Kanban Board dan lakukan *Drag & Drop*.
   - Hapus Todo dengan konfirmasi dialog (*Delete*).
   - Toggle Dark/Light Mode.
