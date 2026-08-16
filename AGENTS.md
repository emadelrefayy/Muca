# AGENTS.md — Instructions for the coding agent (aider)

Read this file **first, before writing any code**. It tells you what order to read the other docs in, what to build first, and how to work through the rest of the build without re-asking questions that are already settled. Every decision in Section 3 below is final — there is one correct way to do each of these things in this project, not several. If you find yourself choosing between two valid approaches anywhere else in the codebase, stop and ask rather than picking one silently.

## 0. ⚠️ Critical correction before you start

An earlier build session wired this frontend to Supabase (auth, real CRUD, live data) — **but that work was never merged into this repo and is not recoverable.** Do not assume any Supabase integration exists in the current code. The repo today is at its original state: React/Vite frontend with **mock data only**, plus an **unused FastAPI backend skeleton** (`backend/`, health check + mock dashboard endpoint, no DB/auth). Only the Supabase cloud project itself (schema + RLS on `grcobobbhrqjanarptln`) is real and confirmed live.

Treat "wire the frontend to Supabase" (auth, real CRUD, live dashboard data) as the actual Phase 1/first priority — not something already done. **Delete the `backend/` folder (FastAPI skeleton) as part of Phase 0** — the target architecture has no custom backend server; the project runs as Vercel-hosted frontend + Supabase Cloud only, so `backend/` is dead weight, not a decision to defer.

## 1. Read order (do this before any code change)

1. `PROJECT_STATUS.md` — what's actually implemented today vs. decided-but-not-built vs. planned vs. future. This is the source of truth for current state. Pay special attention to the "Confirmed via live schema inspection" section — it lists real, verified gaps between the business requirements and the live database.
2. `BRD.md` — the business rules. These are decided. Do not re-derive, question, or propose alternatives to them.
3. `ARCHITECTURE.md` — the target technical architecture and what's confirmed vs. not yet built.
4. `TASKS.md` — the phased build plan, phase by phase, with status markers (✅ Done / 🔶 Partial / ⬜ Not started).
5. `README.md` — project overview and dev setup.

## 2. Conflict resolution rule

If anything conflicts (a doc vs. the code, a doc vs. another doc):
1. `BRD.md` decisions win first.
2. `PROJECT_STATUS.md` / current project files win for "what actually exists" questions.
3. The current code itself wins for implementation-detail questions.
4. Only if none of the above answer it, make a new assumption — and clearly label it `TBD` in a comment or in `PROJECT_STATUS.md`, don't silently decide.

Do not re-ask questions that are already settled in `BRD.md` or `PROJECT_STATUS.md`. Do not re-invent business rules that are already decided.

## 3. Locked technical decisions — one meaning, no forks

These remove every either/or left open in earlier drafts of the docs. Follow them exactly; do not substitute an equivalent alternative.

- **Language: JavaScript (JSX), not TypeScript, for the entire MVP build.** Do not start a TypeScript migration, do not write new files in `.tsx`/`.ts`, do not mix the two. TypeScript migration is Future work, after the MVP ships — not something to do "along the way."
- **UI components: shadcn/ui + Radix UI + Tailwind CSS, for every new component.** Do not build a parallel set of custom/hand-rolled components for things shadcn/ui already provides (buttons, dialogs, inputs, tables, etc). If an existing custom component already does the job, leave it — but any *new* UI work uses shadcn/ui.
- **Routing: React Router (`react-router-dom`).** If it's already in the repo, use it as-is. If it isn't installed yet, add `react-router-dom` — do not introduce any other routing library.
- **Data fetching/mutations: TanStack Query wrapping the Supabase JS client, for every page.** Do not call `supabase-js` directly from inside components and do not mix raw `useEffect`+`fetch` patterns with TanStack Query in the same codebase. One pattern, everywhere.
- **Forms: React Hook Form + Zod, for every form.** Every create/edit form (Clients, Services, Staff, Orders, Payments, Results, Settings, etc.) uses this pair for state and validation — not native uncontrolled forms, not ad hoc `useState` form handling.
- **`payments.method`: restrict the DB check constraint to `'cash'` only**, as part of the Phase 2 migration. Do not leave `card`/`bank_transfer` in the constraint "for later" — cash-only is real security enforced at the database, consistent with the project's stated principle that the frontend is not a trust boundary. If card/bank_transfer payment methods are ever needed post-MVP, that's a future migration, decided at that time.
- **`subscription_plans`: keep the current fixed columns** (`max_staff`, `max_clients`, `max_orders`, `price`, `duration_days`) for the MVP. Do not migrate to a dynamic/JSONB limits model now. BRD Section 22's "fully dynamic Plans" is explicitly deferred to Future/post-MVP — treat the fixed-column model as the correct MVP implementation, not a stopgap to second-guess.
- **`backend/` folder: delete it.** No custom backend server exists in this project. Do not repurpose it, do not keep it "just in case."

## 4. Required migrations before feature work (do these first, in this order)

The live Supabase schema (project `grcobobbhrqjanarptln`) has confirmed structural gaps against `BRD.md`. Do **not** start building role/order/results features on top of the current schema as-is — apply these migrations first:

1. **`order_tests` table.** `orders.service_id` is currently a single FK — one order maps to exactly one service/test. Create an `order_tests` table (order_id, service_id, price, status, result linkage) so one order can hold multiple tests, per BRD Section 7. Migrate existing `orders`/`results` references to go through it. Confirm with the user before dropping/renaming any existing column that other code depends on.
2. **Extend `staff.role` check constraint.** Currently only `'receptionist'` and `'lab_manager'` are valid. Add `'technician'` and `'validator'` per BRD Section 2.
3. **Add validation-workflow columns to `results`.** Currently `status` is only `pending/ready/sent`. Add states/columns needed for BRD Section 3.5: `pending_validation`, `approved`, `rejected` statuses, a `rejected_reason` column, and a `validated_by` FK to `staff`. Also add a DB-level guard (trigger or RLS `UPDATE` policy) that blocks edits to a result once `approved` — this must not be app-level discipline only, per BRD Section 3.5 (immutability).
4. **Add `age`, `gender`, and a persistent Patient ID column to `clients`.** BRD Section 6 requires search by mobile or Patient ID; the ID must persist across visits.
5. **Restrict `payments.method` to `'cash'` only** — see Section 3 above.
6. **Leave `subscription_plans` as-is** (fixed columns) — see Section 3 above. No migration needed here.

After these migrations, update `PROJECT_STATUS.md` to move the relevant items from "Planned"/"Confirmed gap" into "Implemented," and update the schema section of `ARCHITECTURE.md` accordingly. Do not mark anything "Implemented" until it is actually built and working.

## 5. Execution style

- Work through `TASKS.md` **one phase at a time**, in order. Do not jump ahead to a later phase before the current one is functionally complete.
- **Commit after each phase**, with a commit message naming the phase (e.g. `Phase 2: order_tests table + staff role migration + results validation columns`). Small, reviewable commits — not one giant commit for the whole build.
- After finishing a phase, update the ✅/🔶/⬜ markers for that phase in `TASKS.md`, and update `PROJECT_STATUS.md`'s Implemented/Planned lists to match reality. Keep these two files honest and current — they are what the next session (human or agent) will read to pick up where you left off.
- Do not touch Medical Report language behavior — reports stay English-only regardless of the app's language toggle (BRD Section 5/14).
- All tenant isolation must be enforced via PostgreSQL RLS, not by hiding UI elements in the frontend. If you add a new table, it needs an RLS policy in the same phase/commit, not "later."
- Follow Section 3's locked decisions exactly — they exist so you never have to choose between two valid approaches. If you hit a genuine ambiguity that neither Section 3 nor the other docs resolve, stop and ask rather than guessing.

## 6. Deployment

Target: GitHub → Vercel (frontend) → Supabase Cloud (Auth/DB/RLS/Storage), per `ARCHITECTURE.md`. No custom backend server. Confirm Vercel environment variables (Supabase URL/anon key) are set before the first deploy; do not commit secrets to the repo.
