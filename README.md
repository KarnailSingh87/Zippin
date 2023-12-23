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
