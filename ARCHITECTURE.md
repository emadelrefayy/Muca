# Architecture — Muca

This describes the **target** architecture. Items not yet built are marked accordingly; cross-check against `PROJECT_STATUS.md` before assuming something exists.

## Stack

**Locked for this MVP (see `AGENTS.md` Section 3 for the full non-negotiable list):** React, **JavaScript/JSX (not TypeScript — deferred to post-MVP)**, Vite, Tailwind CSS, shadcn/ui, Radix UI, Lucide React, React Hook Form, Zod, TanStack Query, i18next / react-i18next, Recharts, date-fns.

**Testing (planned, not yet in place):** Vitest, React Testing Library, Playwright (E2E, later).

**Backend / Cloud:** No traditional backend server. Supabase Cloud provides Auth, PostgreSQL, Row Level Security, and Storage — **the Supabase project itself is live and confirmed**, but the frontend does not yet call it (see note below). Supabase Edge Functions are added later, only when server-side logic is genuinely required (webhooks, WhatsApp integration, secrets, background jobs, or anything that must not run in the browser).

**⚠️ Current gap:** the frontend in this repo is still mock-data-only. A prior attempt to wire it to Supabase (auth, CRUD, live data) was never merged into this repo and its whereabouts are unconfirmed — treat it as not existing. The repo also still contains a `backend/` folder (unused FastAPI skeleton) which is scheduled for deletion in Phase 0 — the project ships as Vercel-hosted frontend + Supabase Cloud only, with no custom backend server.

**Deployment:**
```
GitHub → Vercel → React/TypeScript frontend → Supabase Cloud
                                                 ├── Auth
                                                 ├── PostgreSQL
                                                 ├── RLS
                                                 └── Storage
```

## Frontend Architecture

- Vite-based React SPA, JavaScript/JSX (this is the locked choice for the MVP, not a gap to close — see `AGENTS.md`).
- Component structure (current): `Header`, `Sidebar`, `Dashboard`, `StatCard`, `StatusBadge`, `RevenueChart`, `Logo`, `PlaceholderPage`, plus placeholder CRUD pages for Clients, Services, Staff, Orders, Payments, Results (mock data only — not yet wired to Supabase).
- i18n via a translations module (current) / i18next (target) — bilingual AR/EN with RTL/LTR layout switching, and dark/light theme toggle, present on every page.
- Data fetching: **TanStack Query wrapping the Supabase JS client, for every page** — one pattern throughout, not mixed with raw `useEffect`+`fetch`.
- Forms: **React Hook Form + Zod, for every form** — no ad hoc `useState` form handling.
- Routing: **React Router (`react-router-dom`)** — the only routing library used in this project.
- UI components: **shadcn/ui + Radix UI + Tailwind**, for every new component built from here forward.

## Data Architecture

Live Supabase project (ref `grcobobbhrqjanarptln`). Current tables, all tenant-scoped via `lab_id`:

`labs`, `staff`, `clients`, `services`, `orders`, `results`, `payments`, `subscription_plans`, `subscriptions`, `super_admins`.

**Confirmed via direct schema inspection (live `public` schema):**

- `orders` has a single `service_id` foreign key — **today one order maps to exactly one service/test**, not the BRD's multi-test-per-order model. There is no `order_tests` line-item table. Adding it (and migrating `orders`/`results` to reference it) is required before the BRD's Section 7 (Orders) rules can hold.
- `staff.role` has a DB check constraint allowing only `'receptionist'` and `'lab_manager'` — Technician and Validator are not yet valid roles at the schema level.
- `results.status` is `pending | ready | sent` — there is no `pending_validation` / `approved` / `rejected` state, no `rejected_reason` column, and no `validated_by` link. The Validation lifecycle in BRD Section 3.5 is not represented in the schema.
- `payments.method` allows `cash | card | bank_transfer` at the DB level — **locked decision: restrict this to `cash` only** as part of the Phase 2 migration (see `AGENTS.md` Section 3). Not an open question.
- `subscription_plans` uses fixed columns (`max_staff`, `max_clients`, `max_orders`, `price`, `duration_days`) — **locked decision: keep these for the MVP**, do not migrate to JSONB (see `AGENTS.md` Section 3). BRD Section 22's fully-dynamic model is explicitly Future/post-MVP.
- **Not present at all:** `order_tests`, `shifts`, `templates`, `template_versions`, `lab_templates`, `audit_logs`.

## Auth Architecture

Supabase Auth (email/password). A `staff` row links `auth_user_id` → `lab_id` + role. No self-serve signup-to-lab-manager pipeline exists yet beyond manual SQL bootstrap of the first staff row per lab (see README). Forced first-login password change flow for Lab Manager (per BRD) is not yet implemented.

## Authorization / Multi-Tenancy

- RLS is **enabled with full policies written** on all current tables — ahead of the original plan, which had deferred RLS to a later phase.
- Tenant isolation (`lab_id`) is the enforcement boundary; the frontend must never be relied on for isolation.
- Role-based policy differentiation (Lab Manager vs Receptionist vs Technician vs Validator vs Super Admin) — the BRD's full permission matrix (Section 2 of BRD.md) currently **exceeds what the schema can express**, since `staff.role` only accepts `receptionist`/`lab_manager`. Extending the role constraint (and RLS policies keyed off it) is a prerequisite for Technician/Validator-specific access rules, independent of whether the RLS policy *logic* itself is already fine-grained.

## Storage

Supabase Storage for lab logos/branding assets and (later) template/report assets. Storage policies should mirror table RLS for tenant isolation — verify current policy coverage.

## Template Versioning (target design)

```
Muca Master Template (versioned, e.g. CBC v1/v2/v3)
        ↓  (lab adopts)
Lab-specific Copy (editable by the lab)
        ↓
Lab Database
```
New master versions never auto-propagate; labs opt in via an "Upgrade available" prompt. Historical results pin to the template version used at result-creation time. **Not yet implemented** — no `templates`/`template_versions`/`lab_templates` tables exist yet.

## State Management

Component-local state for UI-only concerns; **TanStack Query for all server state** (see Frontend Architecture above — this is locked, not a future aspiration).

## i18n / RTL-LTR

Arabic/English toggle with RTL/LTR layout switching is implemented in the current frontend for the app UI. Medical reports remain English-only and unaffected by this toggle (per BRD) — verify report generation, if any exists yet, respects this.

## Testing

Not yet set up. Target: Vitest + React Testing Library for unit/component tests, Playwright for E2E once core flows stabilize.

## Deployment

GitHub → Vercel (frontend) → Supabase Cloud (backend-as-a-service). CI/CD pipeline configuration TBD.

## Future: Edge Functions

Reserved for logic that must not run client-side: WhatsApp/n8n webhook handling, background jobs, secret-dependent integrations. None exist yet — the MVP is deliberately frontend-first + Supabase backend-as-a-service, with real security enforced via Auth + RLS + Storage policies, not by hiding buttons in the UI.

## Future: TypeScript Migration

Deferred until after the MVP ships. Do not begin it mid-build — see `AGENTS.md` Section 3.
