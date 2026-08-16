# Project Status — Muca

This file is the source of truth for what's real vs. what's agreed-but-not-built. **A decided business rule is never marked Implemented just because it was decided.** Anything below not explicitly confirmed against the live repo/DB should be re-verified — this snapshot is based on the project's tracked build history, not a fresh code read.

## Implemented

- Supabase project live (ref `grcobobbhrqjanarptln`) with 10 tables: `labs`, `staff`, `clients`, `services`, `orders`, `results`, `payments`, `subscription_plans`, `subscriptions`, `super_admins` — all scoped by `lab_id`.
- Row Level Security **enabled with policies written** on all current tables (ahead of the original plan).
- React + Vite frontend shell, bilingual AR/EN with RTL/LTR layout and dark/light theme toggle.
- Design/visual direction (logo, header, sidebar, stat cards, revenue chart) established on the Dashboard page and usable as the reference for other pages.
- **⚠️ Not implemented, despite an earlier report to the contrary:** frontend Supabase integration (auth sign-in/sign-up, real CRUD on Clients/Services/Staff/Orders/Payments/Results, live dashboard data). This was built once in a prior session but never merged into this repo, and its current whereabouts are unconfirmed — treat it as not existing. The repo today has mock-data-only pages and an unused FastAPI backend skeleton (health check + mock dashboard endpoint, no DB/auth).

## Decided (business rules agreed, not yet implemented)

Everything in `BRD.md`, including but not limited to:
- Full role/permission matrix (Super Admin, Lab Manager, Receptionist, Technician, Validator).
- Order/test lifecycle rules (add/remove/cancel only before a test starts).
- Cash-only payment, full payment before test start; no partial/debt/installments.
- Shift-based cash accounting with system-computed Expected Cash.
- Results lifecycle incl. optional Validation, reject-with-reason, and post-approval immutability.
- Central Template Library, master/versioned templates, per-lab copies, custom lab templates.
- English-only medical reports, independent of app language toggle.
- Onboarding wizard with skip/resume and dashboard "incomplete setup" nudges.
- Support Access model (Super Admin, unlimited duration until revoked, audited).
- Fully dynamic Plans (features/limits/duration set by Super Admin, not a fixed schema).
- Upgrade/downgrade request-then-approve workflow.
- Expiration → grace period → inactive → controlled data-fate decision.
- Audit log scoped to sensitive operations only (not routine views).
- WhatsApp delivery via n8n is OUT OF MVP scope.

## Planned (next up per TASKS.md, not yet built)

- **Frontend Supabase integration itself** — auth sign-in/sign-up, real CRUD wired to Supabase for Clients/Services/Staff/Orders/Payments/Results, live dashboard data. This is the top-priority item; the repo currently has mock-data pages only.
- `order_tests`, `shifts`, `templates`/`template_versions`/`lab_templates`, `audit_logs` tables.
- Role-granular RLS policy verification against the full BRD permission matrix.
- Storage policies.
- Lab Manager first-login forced password change + onboarding wizard.
- Employee account creation flows from within the app (currently manual SQL bootstrap only, once auth exists).
- Shift open/close and Expected Cash calculation.
- Validator role, Pending Validation queue, reject/correction loop, approval immutability enforcement.
- Template library (master + versioning + lab copies + custom templates).
- English-only medical report generation and print configuration.
- Super Admin dashboard, lab/plan/subscription management, Support Access.
- Playwright E2E test suite — REQUIRED MVP; none exists yet.
- TypeScript migration — REQUIRED MVP; current code is JS/JSX and must be migrated before feature work.
- Vitest/React Testing Library unit/component tests — OUT OF MVP.
- **Delete the unused `backend/` (FastAPI skeleton) folder** — the project ships as Vercel frontend + Supabase Cloud only, with no custom backend server. Decided, not deferred.

## MVP Scope Decisions

- Supabase Edge Functions — REQUIRED MVP.
- Webhook capability through Supabase Edge Functions — REQUIRED MVP.
- Playwright E2E testing — REQUIRED MVP.
- Vitest/React Testing Library unit/component tests — OUT OF MVP.
- Direct laboratory-device integrations — OUT OF MVP.
- WhatsApp integration via n8n — OUT OF MVP.

## Post-MVP

- GitHub Actions CI/CD — POST-MVP; implement after MVP completion.

## Confirmed via live schema inspection (`grcobobbhrqjanarptln`, public schema)

- **One test per order today.** `orders.service_id` is a single FK — the BRD's multi-test-per-order model requires a new `order_tests` table plus a migration. This is the single biggest gap between BRD and current schema.
- **`staff.role` constraint only allows `receptionist` / `lab_manager`** — Technician and Validator don't exist as valid roles in the DB yet.
- **`clients` table has no `age`, `gender`, or persistent Patient ID columns** — only `name`, `phone`, `email`, `address`, `notes`. BRD Section 6 requires all three plus search-by-Patient-ID.
- **`results` has no validation workflow columns** — status is `pending/ready/sent` only; no `pending_validation`/`approved`/`rejected`, no `rejected_reason`, no `validated_by`. Approval immutability is not yet enforced anywhere (no trigger/policy).
- **`payments.method` allows `card`/`bank_transfer`** in addition to `cash` at the schema level — **locked decision: restrict to `cash` only** in the Phase 2 migration (see `AGENTS.md`), not an open question.
- **`subscription_plans` uses fixed limit columns** (`max_staff`, `max_clients`, `max_orders`) rather than a dynamic/JSONB limits model — **locked decision: keep as-is for the MVP**; BRD Section 22's fully-dynamic model is explicitly Future/post-MVP, not a gap to close now.
- **Confirmed absent:** `order_tests`, `shifts`, `templates`, `template_versions`, `lab_templates`, `audit_logs` tables.
- RLS is enabled on every existing table, but since `staff.role` can't yet express Technician/Validator, RLS policies can't be role-granular beyond receptionist/lab_manager until the schema is extended.

## Open Items / TBD (still unverified — not schema-level, need a code read)

- Exact `.env` variable names for Supabase connection in the frontend.
- Current routing library/approach and how deep TanStack Query / React Hook Form / Zod adoption actually goes vs. the target architecture.
- Whether the `backend/` folder deletion (Phase 0) has actually been carried out yet in this repo.

---
**Governance rule:** the model/agent producing or extending code from these documents does not re-invent decided business rules. On conflict, resolution order is: (1) `BRD.md`, (2) this file / current project files for what's actually implemented, (3) the current code, (4) new assumptions — clearly labeled TBD. Already-settled questions are not re-asked.
