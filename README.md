# User Management API

A production-ready REST API with authentication, authorization, and user management built with Node.js, TypeScript, Express, PostgreSQL, and Prisma.

## Features

### Authentication
- ✅ User registration with email verification
- ✅ Login with JWT (access & refresh tokens)
- ✅ Email verification
- ✅ Password reset flow
- ✅ Secure password hashing (bcrypt)

### Authorization (RBAC)
- ✅ Role-based access control (Admin/User)
- ✅ Protected routes with JWT middleware

### User Management (Admin Only)
- ✅ List all users (with pagination, filtering, search)
- ✅ Get user by ID
- ✅ Update user details
- ✅ Delete user
- ✅ Change user role
- ✅ Activate/deactivate user

### User Profile
- ✅ Get own profile
- ✅ Update own profile
- ✅ Change password

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Email**: Nodemailer
- **Security**: Helmet, bcryptjs, rate-limiting

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Custom middlewares
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
├── validators/      # Request validation schemas
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/user_management_db?schema=public"
JWT_ACCESS_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

4. Start PostgreSQL (with Docker):
```bash
docker-compose up -d
```

5. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

6. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/verify-email` | Verify email | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |
| GET | `/api/auth/profile` | Get own profile | Yes |

### User (Authenticated)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/api/user/profile` | Update own profile | Yes |
| PATCH | `/api/user/profile/password` | Change password | Yes |

### Admin (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/users/:id` | Get user by ID | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| PATCH | `/api/admin/users/:id/role` | Change user role | Admin |
| PATCH | `/api/admin/users/:id/status` | Toggle user status | Admin |

## API Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

### Get Users (Admin)
```bash
curl -X GET "http://localhost:3000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_ACCESS_SECRET` | JWT access token secret | `your-secret` |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | `your-secret` |
| `SMTP_HOST` | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | Email SMTP port | `587` |
| `SMTP_USER` | Email username | `user@gmail.com` |
| `SMTP_PASSWORD` | Email password | `app-password` |

## Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build TypeScript
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio

# Testing
npm test                 # Run tests
```

## Database Schema

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
}

enum Role {
  ADMIN
  USER
}
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Rate limiting
- Helmet security headers
- CORS protection
- Input validation with Zod
- SQL injection protection (Prisma ORM)

## Deployment

### Railway / Render / Vercel

1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables
4. Deploy!

### Docker (Optional)

```bash
# Build image
docker build -t user-management-api .

# Run container
docker run -p 3000:3000 --env-file .env user-management-api
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT

## Next Steps

- [ ] Add refresh token rotation
- [ ] Add unit & integration tests
- [ ] Add API documentation (Swagger)
- [ ] Add logging (Winston/Pino)
- [ ] Add Redis for caching
- [ ] Add file upload feature
- [ ] Add social auth (Google, GitHub)
- [ ] Add 2FA authentication