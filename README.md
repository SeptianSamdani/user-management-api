# 🚀 User Management API

API backend untuk manajemen user dengan fitur autentikasi, otorisasi, dan CRUD user lengkap. Dibangun dengan Node.js, TypeScript, Express, PostgreSQL, dan Prisma.

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Prerequisite](#-prerequisite)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Endpoints](#-api-endpoints)
- [Testing dengan Postman](#-testing-dengan-postman)
- [Database Schema](#-database-schema)
- [Troubleshooting](#-troubleshooting)

## ✨ Fitur

### Authentication (Autentikasi)
- ✅ Register user baru dengan validasi
- ✅ Login dengan JWT (Access & Refresh Token)
- ✅ Verifikasi email
- ✅ Reset password via email
- ✅ Password hashing dengan bcrypt

### Authorization (Otorisasi)
- ✅ Role-based access control (RBAC)
- ✅ 2 Role: Admin dan User
- ✅ Protected routes dengan JWT middleware

### User Management (Khusus Admin)
- ✅ Lihat semua user (dengan pagination & filter)
- ✅ Lihat detail user by ID
- ✅ Update data user
- ✅ Hapus user
- ✅ Ubah role user (Admin/User)
- ✅ Aktifkan/nonaktifkan user

### User Profile (Untuk Semua User)
- ✅ Lihat profile sendiri
- ✅ Update profile sendiri
- ✅ Ganti password

## 🛠 Tech Stack

- **Runtime:** Node.js v18+
- **Language:** TypeScript
- **Framework:** Express.js v5
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Email:** Nodemailer + Mailtrap (development)
- **Security:** Helmet, bcryptjs, rate-limiting

## 📦 Prerequisite

Pastikan sudah terinstall:

- **Node.js** (v18 atau lebih baru) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 atau lebih baru) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Postman** (opsional, untuk testing) - [Download](https://www.postman.com/)

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/SeptianSamdani/user-management-api.git
cd user-management-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database PostgreSQL

**Buat database baru:**
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE user_management_db;

# Keluar dari psql
\q
```

**Atau pakai GUI seperti pgAdmin atau DBeaver**

### 4. Setup Environment Variables

Copy file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi kamu:
```env
# Server
NODE_ENV=development
PORT=3000

# Database - Sesuaikan username & password PostgreSQL kamu
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/user_management_db?schema=public"

# JWT - Ganti dengan string random yang kuat
JWT_ACCESS_SECRET=ganti-dengan-string-random-yang-panjang
JWT_REFRESH_SECRET=ganti-dengan-string-random-yang-berbeda
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email - Mailtrap (untuk development)
# Daftar di https://mailtrap.io lalu copy credentials
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@usermanagement.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Generate Prisma Client & Migrate Database
```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migration (buat tabel di database)
npx prisma migrate dev --name init
```

## ⚙️ Konfigurasi

### Setup Mailtrap (Email Testing)

1. **Daftar** di [Mailtrap.io](https://mailtrap.io) (gratis)
2. **Login** dan buka dashboard
3. Pilih **Email Testing** → **Inboxes**
4. Copy **SMTP credentials** (username & password)
5. Paste ke file `.env`:
```env
   SMTP_USER=your-mailtrap-username
   SMTP_PASSWORD=your-mailtrap-password
```

**Kenapa Mailtrap?**
- Email tidak benar-benar terkirim
- Semua email tertangkap di inbox Mailtrap
- Bisa test tampilan email
- Gratis dan mudah

### Generate JWT Secret (Opsional tapi Recommended)
```bash
# Generate random string untuk JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy hasilnya dan paste ke `.env` sebagai `JWT_ACCESS_SECRET` dan `JWT_REFRESH_SECRET`

## 🎮 Menjalankan Aplikasi

### Development Mode (dengan auto-reload)
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

### Production Mode
```bash
# Build TypeScript ke JavaScript
npm run build

# Jalankan production server
npm start
```

### Buka Prisma Studio (Database GUI)
```bash
npx prisma studio
```

Browser akan terbuka di **http://localhost:5555**

## 📡 API Endpoints

Base URL: `http://localhost:3000/api`

### 🔐 Authentication

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/auth/register` | Daftar user baru | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/verify-email` | Verifikasi email | ❌ |
| POST | `/auth/forgot-password` | Request reset password | ❌ |
| POST | `/auth/reset-password` | Reset password | ❌ |
| GET | `/auth/profile` | Lihat profile sendiri | ✅ |

### 👤 User (Authenticated)

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| PUT | `/user/profile` | Update profile sendiri | ✅ User |
| PATCH | `/user/profile/password` | Ganti password | ✅ User |

### 👑 Admin (Admin Only)

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/admin/users` | Lihat semua user | ✅ Admin |
| GET | `/admin/users/:id` | Lihat user by ID | ✅ Admin |
| PUT | `/admin/users/:id` | Update user | ✅ Admin |
| DELETE | `/admin/users/:id` | Hapus user | ✅ Admin |
| PATCH | `/admin/users/:id/role` | Ubah role user | ✅ Admin |
| PATCH | `/admin/users/:id/status` | Aktifkan/nonaktifkan user | ✅ Admin |

### 🏥 Health Check

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/health` | Cek status server |

## 🧪 Testing dengan Postman

### Import Collection

1. Buka Postman
2. Click **Import**
3. Pilih file `postman_collection.json` dari root project
4. Collection akan muncul dengan nama **"User Management API"**

### Setup Variables

1. Click collection name
2. Tab **Variables**
3. Set values:
   - `baseUrl` = `http://localhost:3000`
   - `accessToken` = (kosongkan dulu)

### Flow Testing

#### 1. Register User

**Endpoint:** `POST /api/auth/register`
```json
{
  "email": "admin@test.com",
  "password": "Admin123",
  "name": "Admin User"
}
```

#### 2. Verify Email

- Buka **Mailtrap inbox**
- Copy verification token dari email
- **Endpoint:** `POST /api/auth/verify-email`
```json
{
  "token": "token-dari-email"
}
```

#### 3. Set User sebagai Admin
```bash
# Buka Prisma Studio
npx prisma studio

# Edit user:
# - role: ADMIN
# - isVerified: true
```

#### 4. Login

**Endpoint:** `POST /api/auth/login`
```json
{
  "email": "admin@test.com",
  "password": "Admin123"
}
```

**Copy `accessToken` dari response!**

#### 5. Set Token di Postman

1. Click collection name
2. Tab **Variables**
3. Paste token ke `accessToken`
4. Save

#### 6. Test Protected Endpoints

Sekarang bisa test semua endpoint yang butuh authentication:

- Get Profile
- Update Profile
- Get All Users (Admin)
- Update User (Admin)
- dll.

## 🗄 Database Schema
```prisma
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  password          String
  name              String
  role              Role      @default(USER)
  isVerified        Boolean   @default(false)
  isActive          Boolean   @default(true)
  verificationToken String?   @unique
  resetToken        String?   @unique
  resetTokenExpiry  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@map("users")
}

enum Role {
  ADMIN
  USER
}
```

## 🔒 Security Features

- ✅ Password hashing dengan bcrypt (10 rounds)
- ✅ JWT authentication dengan expiry
- ✅ Rate limiting (100 requests per 15 menit)
- ✅ Helmet untuk security headers
- ✅ CORS protection
- ✅ Input validation dengan Zod
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection

## 🐛 Troubleshooting

### Error: Can't connect to database

**Solusi:**
```bash
# Pastikan PostgreSQL running
# Windows: Check di Services
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Cek DATABASE_URL di .env sudah benar
```

### Error: Module not found

**Solusi:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Generate Prisma Client
npx prisma generate
```

### Error: Port 3000 already in use

**Solusi:**
```env
# Ubah PORT di .env
PORT=3001
```

### Error: Email tidak terkirim

**Solusi:**
```bash
# Pastikan credentials Mailtrap sudah benar di .env
# Login ke Mailtrap.io dan copy ulang credentials
```

### Error: Invalid token

**Solusi:**
- Token expired (login ulang)
- Token salah format (pastikan pakai "Bearer TOKEN")
- Token tidak di-set di Postman variables

### Error: Prisma migration failed

**Solusi:**
```bash
# Reset database (HATI-HATI: data akan hilang!)
npx prisma migrate reset

# Atau drop database dan buat ulang
psql -U postgres
DROP DATABASE user_management_db;
CREATE DATABASE user_management_db;
\q

# Jalankan migration ulang
npx prisma migrate dev --name init
```

## 📚 Scripts
```bash
# Development
npm run dev              # Jalankan dev server dengan auto-reload

# Production
npm run build            # Compile TypeScript ke JavaScript
npm start                # Jalankan production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Buat migration baru
npm run prisma:studio    # Buka database GUI
```

## 📂 Struktur Project
```
user-management-api/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── config/                 # Konfigurasi app
│   │   ├── database.ts         # Prisma client
│   │   └── index.ts            # Environment config
│   ├── controllers/            # Business logic
│   │   ├── admin.controller.ts
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/            # Custom middlewares
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── authorize.middleware.ts  # Role check
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── routes/                 # API routes
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   ├── services/               # External services
│   │   └── email.service.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── errors.ts           # Custom error classes
│   │   ├── jwt.ts              # JWT helpers
│   │   ├── password.ts         # Password hashing
│   │   └── token.ts            # Token generator
│   ├── validators/             # Input validation
│   │   └── auth.validator.ts
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── .env                        # Environment variables (jangan di-commit!)
├── .env.example                # Template environment
├── .gitignore
├── package.json
├── postman_collection.json     # Postman collection
├── README.md
└── tsconfig.json               # TypeScript config
```

## 🎓 Konsep yang Dipelajari

Project ini mencakup konsep-konsep penting:

1. **REST API Design** - Endpoint yang terstruktur
2. **Authentication & Authorization** - JWT, role-based access
3. **Database Design** - Relasi, indexing, migrations
4. **TypeScript** - Type safety, interfaces
5. **Security** - Password hashing, rate limiting, validation
6. **Error Handling** - Custom errors, error middleware
7. **Email Service** - SMTP, HTML templates
8. **Environment Config** - Environment variables
9. **API Testing** - Postman collection

## 🚀 Next Steps & Improvements

Fitur yang bisa ditambahkan:

- [ ] Refresh token rotation
- [ ] Unit & integration tests (Jest)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Logging system (Winston/Pino)
- [ ] Redis caching
- [ ] File upload (avatar)
- [ ] Social authentication (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Audit log
- [ ] Soft delete users

## 📄 License

MIT License - Silakan digunakan untuk belajar!

## 👨‍💻 Author

**Septian Samdani**
- GitHub: [@SeptianSamdani](https://github.com/SeptianSamdani)

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/) - Modern database toolkit
- [Express.js](https://expressjs.com/) - Web framework
- [Mailtrap](https://mailtrap.io/) - Email testing
- [PostgreSQL](https://www.postgresql.org/) - Database

---

⭐ Jangan lupa kasih star kalau project ini membantu kamu belajar!