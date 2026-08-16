# Tasks — Phased Build Plan

Status legend used inline: ✅ Done · 🔶 Partial · ⬜ Not started. These reflect the assessment in `PROJECT_STATUS.md`; re-verify against the live repo/DB before trusting a ✅ blindly.

## Phase 0 — Foundation
- ⬜ **Delete the `backend/` folder (unused FastAPI skeleton)** — the project runs as a Vercel-hosted frontend talking directly to Supabase Cloud, with no custom backend server. Not a decision to defer.
- ✅ React + Vite confirmed. **Locked: stays JavaScript/JSX for the MVP — no TypeScript migration mid-build** (see `AGENTS.md` Section 3).
- ✅ Tailwind CSS.
- 🔶 shadcn/ui — adopt for every new component going forward (locked decision); leave working custom components as-is, don't force a rewrite of things that already work.
- ✅ Supabase project created and connected.
- 🔶 Environment variables — confirm `.env` setup matches README.
- ⬜ Routing — **locked: React Router (`react-router-dom`)**; add it if not already present.
- ✅ Global theme (dark/light).
- ✅ Arabic/English toggle.
- ✅ RTL/LTR support.

## Phase 1 — Auth
- ⬜ Supabase Auth wiring in the frontend — **not implemented in this repo.** An earlier session built this but it was never merged and is not recoverable; treat it as starting fresh.
- ⬜ Super Admin account/flow.
- ⬜ Lab Manager account — no UI yet; will need manual SQL bootstrap the first time even after auth wiring exists.
- ⬜ Employee accounts (Receptionist/Technician/Validator) creation flow from within the app.
- ⬜ Forced first-login password change.
- ⬜ Session handling / role-aware routing.

## Phase 2 — Database
- ✅ Core tables live: `labs`, `staff`, `clients`, `services`, `orders`, `results`, `payments`, `subscription_plans`, `subscriptions`, `super_admins`.
- ⬜ **Confirmed gap:** `orders.service_id` is a single FK — one order = one test today. Need `order_tests` line-item table + migration to support the BRD's multi-test-per-order model. This blocks BRD Section 7 correctly.
- ⬜ **Confirmed gap:** `staff.role` check constraint only allows `receptionist`/`lab_manager` — extend to include `technician`/`validator` before those roles can be created.
- ⬜ **Confirmed gap:** `results` table has no validation-state columns (`pending_validation`/`approved`/`rejected`, `rejected_reason`, `validated_by`) — needs migration to support BRD Section 3.5.
- ⬜ `shifts` — confirmed not present.
- ⬜ `templates`, `template_versions`, `lab_templates` — confirmed not present.
- ⬜ `audit_logs` — confirmed not present.
- ⬜ `subscription_plans` uses fixed limit columns, not a dynamic/JSONB limits model — decide whether to extend or accept as MVP scope (BRD Section 22 calls for fully dynamic plans).

## Phase 3 — RLS
- ✅ RLS enabled with policies on all current tables (ahead of original schedule).
- 🔶 Role-level policy granularity — verify against the full BRD permission matrix (Receptionist vs Technician vs Validator distinctions).
- ⬜ Storage policies.
- ⬜ Explicit cross-tenant isolation test suite.

## Phase 4 — Lab Management
- ⬜ Lab Manager dashboard — placeholder pages only (mock data); needs full Supabase wiring plus the remaining BRD page list (Services, Validator, Shifts, Employees, Online users, Receptionists, Technicians, Settings, Branding, Templates, Printing).
- ⬜ Employees CRUD wired to Supabase.
- ⬜ Services CRUD wired to Supabase.
- ⬜ Prices as a distinct managed concept (vs. flat service price) — verify against BRD once built.
- ⬜ Branding upload/management.
- ⬜ Lab settings page.

## Phase 5 — Customers & Orders
- ⬜ Customer profile CRUD wired to Supabase — needs `name`, `phone`, plus new `age`, `gender`, and persistent Patient ID columns (not in schema yet, see Phase 2) and search-by-mobile/Patient-ID.
- ⬜ Orders CRUD wired to Supabase — requires the `order_tests` migration (Phase 2) first to support multi-test orders per BRD Section 7.
- ⬜ Order/test status lifecycle enforcement.

## Phase 6 — Payments & Shifts
- ⬜ Payments CRUD wired to Supabase — `payments.method` check constraint restricted to `'cash'` only (locked decision, part of the Phase 2 migration — not app-layer enforcement).
- ⬜ Shift open/close by Receptionist.
- ⬜ Shift force-close by Lab Manager.
- ⬜ Expected Cash calculation.
- ⬜ Revenue-per-shift / daily revenue reporting.

## Phase 7 — Templates
- ⬜ Master template library (storage + metadata).
- ⬜ Versioning.
- ⬜ Lab copies on adoption.
- ⬜ Custom (lab-private) templates.
- ⬜ Template-driven branding/print configuration.

## Phase 8 — Results
- ⬜ Results CRUD wired to Supabase (Technician-facing entry) — schema has `result_text`, `result_file_path`, status `pending/ready/sent`; no structured per-parameter result fields yet (template-driven results, BRD Section 10, need `templates`/`template_versions` first).
- ⬜ Pending Validation queue / Validator role and dashboard — blocked on both the `staff.role` constraint and missing validation-state columns on `results`.
- ⬜ Reject with required reason → correction loop — needs a `rejected_reason` column.
- ⬜ Approval → immutability enforcement — needs an `approved`/immutable state and a DB-level guard (e.g. trigger or RLS `UPDATE` policy) once approved, not just app-level discipline.

## Phase 9 — Reports
- ⬜ English-only medical report generation (independent of app language toggle).
- ⬜ Branding/header/footer/logo on reports.
- ⬜ Printer/paper-size/layout configuration.

## Phase 10 — Super Admin
- ⬜ Super Admin dashboard (platform analytics).
- ⬜ Lab management (create lab, create Lab Manager, replace Lab Manager).
- ⬜ Plans management (dynamic features/limits/duration).
- ⬜ Subscription request/approval workflow.
- ⬜ Support Access (open/close, audited).
- ⬜ Expiration → grace period → inactive → data-fate decision flow.

## Phase 11 — QA / Security
- ⬜ RLS/tenant-isolation test suite.
- ⬜ Role-permission tests.
- ⬜ Auth tests.
- ⬜ Template isolation tests.
- ⬜ Result-immutability tests.
- ⬜ Audit log tests.
- ⬜ E2E workflow tests (Playwright).
- ⬜ Accessibility and responsive UI checks.

## Phase 12 — Future
- ⬜ WhatsApp integration via n8n.
- ⬜ Supabase Edge Functions, added only as concrete server-side needs arise.
- ⬜ Advanced lab-device integrations.

---
**Implementation rule (unchanged from the Master Brief):** do not re-litigate decided business rules. If something conflicts, resolve in this order: (1) `BRD.md` decisions, (2) current project files/`PROJECT_STATUS.md` for what actually exists, (3) the current code itself, (4) new assumptions — clearly labeled TBD.
