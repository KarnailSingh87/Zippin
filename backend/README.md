# Zippin Backend (scaffold)

This is a minimal TypeScript Express backend scaffold for a Zippin-like app.

Features included:
- TypeScript + Express
- MongoDB (Mongoose) connection
- User auth (register/login) with JWT
- Product model
- Cloudinary signed upload endpoint

Quick start:

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
cd apps/backend
npm install
```

3. Run dev server:

```bash
npm run dev
```

API endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/uploads/sign  -> returns Cloudinary signature for client uploads

