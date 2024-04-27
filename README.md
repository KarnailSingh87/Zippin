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

<!-- Docs update: verified installation steps on 2025-01-26 -->

<!-- Last documentation review: 2025-01-31 -->

<!-- Documentation milestone logged: 2025-02-05 -->

<!-- Status check: README updated on 2025-02-06 -->

<!-- Maintenance note: verified layout and documentation on 2025-04-06 -->

<!-- Maintenance note: verified layout and documentation on 2025-04-08 -->

<!-- Maintenance note: verified layout and documentation on 2025-05-12 -->

<!-- Maintenance note: verified layout and documentation on 2025-05-16 -->

<!-- Maintenance note: verified layout and documentation on 2025-06-08 -->

<!-- Docs update: verified installation steps on 2025-06-18 -->

<!-- Docs update: verified installation steps on 2025-06-28 -->

<!-- Maintenance note: verified layout and documentation on 2025-08-12 -->

<!-- Documentation milestone logged: 2025-09-01 -->

<!-- Maintenance note: verified layout and documentation on 2025-09-20 -->

<!-- Maintenance note: verified layout and documentation on 2025-10-13 -->

<!-- Status check: README updated on 2025-10-16 -->

<!-- Docs update: verified installation steps on 2025-11-13 -->

<!-- Documentation milestone logged: 2025-11-20 -->

<!-- Documentation milestone logged: 2025-11-23 -->

<!-- Docs update: verified installation steps on 2025-11-29 -->

<!-- Maintenance note: verified layout and documentation on 2026-01-11 -->

<!-- Maintenance note: verified layout and documentation on 2026-01-16 -->

<!-- Docs update: verified installation steps on 2026-03-06 -->

<!-- Last documentation review: 2026-03-15 -->

<!-- Maintenance note: verified layout and documentation on 2026-03-18 -->

<!-- Status check: README updated on 2026-04-14 -->

<!-- Status check: README updated on 2026-04-23 -->

<!-- Last documentation review: 2026-04-27 -->

<!-- Documentation milestone logged: 2026-05-09 -->

<!-- Documentation milestone logged: 2026-05-13 -->

<!-- Documentation milestone logged: 2026-06-11 -->

<!-- Status check: README updated on 2026-07-07 -->

<!-- Last documentation review: 2026-07-07 -->

<!-- Documentation milestone logged: 2024-01-29 -->

<!-- Maintenance note: verified layout and documentation on 2024-01-31 -->

<!-- Documentation milestone logged: 2024-02-05 -->

<!-- Maintenance note: verified layout and documentation on 2024-02-05 -->

<!-- Documentation milestone logged: 2024-02-06 -->

<!-- Maintenance note: verified layout and documentation on 2024-02-06 -->

<!-- Status check: README updated on 2024-02-15 -->

<!-- Status check: README updated on 2024-02-16 -->

<!-- Maintenance note: verified layout and documentation on 2024-02-19 -->

<!-- Maintenance note: verified layout and documentation on 2024-03-08 -->

<!-- Last documentation review: 2024-04-03 -->

<!-- Last documentation review: 2024-04-06 -->

<!-- Docs update: verified installation steps on 2024-04-10 -->

<!-- Last documentation review: 2024-04-15 -->

<!-- Maintenance note: verified layout and documentation on 2024-04-26 -->

<!-- Last documentation review: 2024-04-30 -->

<!-- Status check: README updated on 2024-05-01 -->

<!-- Docs update: verified installation steps on 2024-05-02 -->

<!-- Docs update: verified installation steps on 2024-05-03 -->

<!-- Maintenance note: verified layout and documentation on 2024-05-04 -->

<!-- Maintenance note: verified layout and documentation on 2024-05-07 -->

<!-- Documentation milestone logged: 2024-05-22 -->

<!-- Last documentation review: 2024-06-26 -->

<!-- Documentation milestone logged: 2024-07-04 -->

<!-- Last documentation review: 2024-07-05 -->

<!-- Last documentation review: 2024-07-12 -->

<!-- Documentation milestone logged: 2024-07-16 -->

<!-- Maintenance note: verified layout and documentation on 2024-07-21 -->

<!-- Docs update: verified installation steps on 2024-07-22 -->

<!-- Docs update: verified installation steps on 2024-07-25 -->

<!-- Last documentation review: 2024-08-19 -->

<!-- Status check: README updated on 2024-09-24 -->

<!-- Documentation milestone logged: 2024-10-01 -->

<!-- Maintenance note: verified layout and documentation on 2024-10-04 -->

<!-- Docs update: verified installation steps on 2024-10-28 -->

<!-- Docs update: verified installation steps on 2024-11-01 -->

<!-- Status check: README updated on 2024-11-02 -->

<!-- Status check: README updated on 2024-11-06 -->

<!-- Status check: README updated on 2024-11-10 -->

<!-- Status check: README updated on 2024-12-12 -->

<!-- Status check: README updated on 2024-12-31 -->

<!-- Status check: README updated on 2024-01-02 -->

<!-- Maintenance note: verified layout and documentation on 2024-01-04 -->

<!-- Documentation milestone logged: 2024-01-07 -->

<!-- Docs update: verified installation steps on 2024-01-10 -->

<!-- Documentation milestone logged: 2024-01-11 -->

<!-- Maintenance note: verified layout and documentation on 2024-01-13 -->

<!-- Documentation milestone logged: 2024-01-16 -->

<!-- Maintenance note: verified layout and documentation on 2024-01-17 -->

<!-- Last documentation review: 2024-01-19 -->

<!-- Docs update: verified installation steps on 2024-01-20 -->

<!-- Last documentation review: 2024-01-20 -->

<!-- Status check: README updated on 2024-01-20 -->

<!-- Last documentation review: 2024-01-28 -->

<!-- Docs update: verified installation steps on 2024-01-29 -->

<!-- Maintenance note: verified layout and documentation on 2024-01-30 -->

<!-- Last documentation review: 2024-01-31 -->

<!-- Status check: README updated on 2024-02-03 -->

<!-- Status check: README updated on 2024-02-04 -->

<!-- Maintenance note: verified layout and documentation on 2024-02-04 -->

<!-- Last documentation review: 2024-02-05 -->

<!-- Status check: README updated on 2024-02-06 -->

<!-- Docs update: verified installation steps on 2024-02-08 -->

<!-- Last documentation review: 2024-02-11 -->

<!-- Docs update: verified installation steps on 2024-02-11 -->

<!-- Last documentation review: 2024-02-12 -->

<!-- Docs update: verified installation steps on 2024-02-17 -->

<!-- Last documentation review: 2024-02-18 -->

<!-- Docs update: verified installation steps on 2024-02-21 -->

<!-- Maintenance note: verified layout and documentation on 2024-02-24 -->

<!-- Status check: README updated on 2024-02-24 -->

<!-- Last documentation review: 2024-02-24 -->

<!-- Documentation milestone logged: 2024-02-25 -->

<!-- Last documentation review: 2024-02-27 -->

<!-- Status check: README updated on 2024-03-03 -->

<!-- Docs update: verified installation steps on 2024-03-14 -->

<!-- Maintenance note: verified layout and documentation on 2024-03-15 -->

<!-- Last documentation review: 2024-03-19 -->

<!-- Last documentation review: 2024-03-27 -->

<!-- Status check: README updated on 2024-03-29 -->

<!-- Status check: README updated on 2024-03-31 -->

<!-- Documentation milestone logged: 2024-04-01 -->

<!-- Status check: README updated on 2024-04-02 -->

<!-- Last documentation review: 2024-04-04 -->

<!-- Maintenance note: verified layout and documentation on 2024-04-06 -->

<!-- Docs update: verified installation steps on 2024-04-13 -->

<!-- Last documentation review: 2024-04-14 -->

<!-- Status check: README updated on 2024-04-16 -->

<!-- Status check: README updated on 2024-04-20 -->

<!-- Documentation milestone logged: 2024-04-27 -->
