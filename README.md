# Muca

Muca is a multi-tenant SaaS platform for medical analysis labs. Each lab is a fully isolated tenant with its own staff, clients, services, pricing, templates, branding, and results. Labs run their day-to-day operations independently, with no operational involvement from the Muca platform team.

This README reflects the **actual current state of the codebase** as of this document's writing. It intentionally does not describe planned/future work as if it already existed — see `PROJECT_STATUS.md` for the Implemented / Decided / Planned / Future breakdown, and `TASKS.md` for the phased build plan.

## Product Overview

See `BRD.md` for full business requirements. In short:

- Multi-tenant lab management SaaS (tenant = `lab_id`).
- Roles: Super Admin, Lab Manager, Receptionist, Lab Technician, Validator (optional).
- Core flow: Receptionist creates a customer + order (one or more tests) → cash payment → Technician enters results → optional Validator approval → results delivered/printed.
- Central template library (master templates, versioned) that labs copy and customize.
- Bilingual app UI (Arabic/English, RTL/LTR, dark/light); medical reports are English-only regardless of app language.

## Current Architecture (Implemented)

- **Frontend:** React + Vite, bilingual (AR/EN) with RTL/LTR support and dark/light mode — **this part is real and in the repo.**
- **Backend-as-a-service:** Supabase Cloud project is live (Auth, PostgreSQL, RLS, Storage) — confirmed via direct schema inspection. This part is real.
- **No custom backend server.** There is **no FastAPI service in the target build** — an earlier FastAPI skeleton (health check + mock dashboard endpoint) exists in the repo as leftover from an earlier snapshot and is scheduled for deletion (Phase 0 of `TASKS.md`); the frontend is meant to talk to Supabase directly.
- **Database:** Live Supabase project (`grcobobbhrqjanarptln`), tables: `labs`, `staff`, `clients`, `services`, `orders`, `results`, `payments`, `subscription_plans`, `subscriptions`, `super_admins` — all tenant-scoped via `lab_id`. This is real and confirmed.
- **RLS:** Enabled on all tables with policies written (tenant isolation enforced at the database level). Real and confirmed.
- **Auth:** Supabase Auth is configured on the project side, but the frontend does not yet call it — sign-in/sign-up UI is not wired.
- **Frontend integration:** Not done. Clients/Services/Staff/Orders/Payments/Results pages exist as placeholders/mock-data pages only.

See `ARCHITECTURE.md` for the full target architecture, including MVP pieces not yet built (Supabase Edge Functions, webhook capability, template versioning tables, audit log) and explicitly excluded integrations.

## Development Setup

```bash
cd frontend
npm install
npm run dev
```

Open the Vite dev URL shown in the terminal.

### Environment Variables

The frontend requires Supabase connection details (exact `.env` variable names TBD — confirm against the current `frontend` env file/config in the repo):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### First login / bootstrap

There is no seed data yet, and the frontend does not yet call Supabase Auth. Once the auth wiring is (re)built:
1. Sign up a user via the app's sign-up flow (creates a Supabase Auth user).
2. Manually insert a `staff` row linking that `auth_user_id` to a `lab_id` with role `lab_manager` (via SQL, until a proper onboarding/invite flow exists).

## Security Principles

- The frontend is **not** a trust boundary. All tenant isolation (`Lab A cannot read/write Lab B's data`) is enforced via PostgreSQL RLS, not by hiding UI elements.
- Supabase Auth owns password storage; the application never stores passwords in its own tables.
- A Supabase Vault (or equivalent) is reserved for future integration secrets/credentials — not for password storage.

## Current MVP Scope

Only the Supabase cloud project (schema, RLS) is real infrastructure today. The frontend is still at mock-data-only stage with a placeholder page set (Clients/Services/Staff/Orders/Payments/Results) and an unused FastAPI skeleton. All Supabase wiring (auth, real CRUD, live dashboard data) needs to be built — this was attempted once but that code was never merged into this repo and its whereabouts are unconfirmed. Business-rule enforcement described in `BRD.md` (order/test lifecycle, shift-based cash accounting, template versioning, validation workflow, subscription/plan management, Super Admin dashboard, audit logging) is **decided but not yet implemented** — see `PROJECT_STATUS.md`.

## MVP Technical Requirements

- **Supabase Edge Functions:** REQUIRED in the MVP.
- **Webhook capability:** REQUIRED in the MVP and implemented through Supabase Edge Functions.
- **Playwright E2E:** REQUIRED in the MVP for critical end-to-end workflows.
- **Unit tests (Vitest/React Testing Library):** OUT OF MVP.
- **Direct laboratory-device integrations:** OUT OF MVP.

## Post-MVP

- **GitHub Actions CI/CD:** POST-MVP; not implemented during the MVP build.
- **WhatsApp integration via n8n:** OUT OF MVP.


## Deployment

```
GitHub → Vercel → React/Vite frontend → Supabase Cloud (Auth, PostgreSQL, RLS, Storage)
```

GitHub Actions CI/CD is POST-MVP and is not implemented during the MVP build.
