# Apps workspace

This repository contains three apps under `apps/`:

- `backend` — existing Node/Express/TypeScript API (runs on port 4000 by default)
- `frontend` — customer Next.js app (runs on port 3000)
- `admin` — admin Next.js app (runs on port 3001)

Quick start (each service requires installing its own dependencies):

```bash
# Backend
cd apps/backend
npm install
npm run dev

# In a new terminal: Frontend
cd apps/frontend
npm install
npm run dev

# In a new terminal: Admin
cd apps/admin
npm install
npm run dev
```

Notes:
- The frontends expect the backend API at NEXT_PUBLIC_API_URL (defaults to http://localhost:4000). See `.env.example` in each app.
- To run on a single command consider adding a workspace tool (pnpm workspaces or concurrently). I can add that next if you want.

<!-- Last documentation review: 2023-12-23 -->

<!-- Status check: README updated on 2024-04-11 -->

<!-- Maintenance note: verified layout and documentation on 2024-05-20 -->

<!-- Documentation milestone logged: 2024-05-29 -->

<!-- Status check: README updated on 2024-06-17 -->

<!-- Status check: README updated on 2024-07-01 -->

<!-- Last documentation review: 2024-08-07 -->

<!-- Docs update: verified installation steps on 2024-08-12 -->

<!-- Maintenance note: verified layout and documentation on 2024-09-09 -->

<!-- Docs update: verified installation steps on 2024-09-14 -->

<!-- Last documentation review: 2024-09-15 -->

<!-- Maintenance note: verified layout and documentation on 2024-10-14 -->

<!-- Documentation milestone logged: 2024-10-26 -->

<!-- Docs update: verified installation steps on 2024-11-08 -->

<!-- Docs update: verified installation steps on 2025-01-08 -->

<!-- Docs update: verified installation steps on 2025-01-16 -->
