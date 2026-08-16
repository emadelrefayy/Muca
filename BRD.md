# Business Requirements Document (BRD) — Muca

Status note: this document captures **decided business rules**. It does not imply any rule is implemented in code — see `PROJECT_STATUS.md` for what actually exists today.

## 1. Business Goals

Muca is a SaaS platform for medical analysis labs. Each lab (tenant) manages its own operations — staff, customers, services/pricing, templates, branding, results — fully independently, with no day-to-day involvement from the Muca platform team. Muca's role is platform-level: onboarding labs, managing plans/subscriptions, and providing shared infrastructure (auth, database, template library).

## 2. Actors / Roles

### Super Admin
Platform-level administrator. Can:
- Create labs; create the Lab Manager account for a lab.
- Create and manage subscription Plans (features, limits, duration).
- Activate/deactivate subscriptions; approve upgrade/downgrade requests.
- Replace a Lab Manager.
- Decide the fate of a lab's data after subscription expiration.
- Open/close Support Access sessions (audited).
- View platform-level analytics.
- Manage the central Template Library.

Cannot: manage a lab's day-to-day staff, customers, services, prices, or operational results.

### Lab Manager
One per lab; owns decision-making within the lab. Can:
- Manage employees (create Receptionists, create Technicians, enable a Validator).
- Manage services, prices, lab-specific templates, lab settings/branding, printing settings.
- View customers, orders, results, revenue.
- Manage shifts; see currently active staff.

Account is created by Super Admin. First-login flow: temporary password → login → forced password change → lab setup/onboarding.

### Receptionist
Customer-facing role. Can:
- Create/edit/search customers.
- Create orders; add/remove tests **before** any test has started; cancel an order before any test starts.
- Record cash payment.
- Open/close their own shift; see expected cash.
- Print results; re-deliver old results; (future) send results via WhatsApp.

Cannot: edit results, edit services/prices, approve/validate results.

### Lab Technician
Can: see all orders in the lab, execute tests, enter results, freely edit results **before** approval.
Cannot: edit customer data, payments, services, prices; cannot approve results if Validation is enabled.

### Validator (optional role)
Enabled per-lab by the Lab Manager, for labs with a reviewing doctor/specialist. Can: see all results and the pending-validation queue; approve; reject (a reason is required on reject).

## 3. Core Workflows

### 3.1 Customer
Customer profile: name, mobile, age, gender, persistent Patient ID. Searchable by mobile or Patient ID. A customer's history (visits, orders, tests, results) persists indefinitely — a customer can return after any length of time and retrieve an old result. Receptionist and Lab Manager can re-deliver old results.

### 3.2 Orders
One order can contain multiple tests (e.g. CBC, Liver Function, Kidney Function, Glucose in a single order). Each test within an order has its own service, price, status, result, and validation state.
- Before any test in the order starts: Receptionist may add tests, remove tests, or cancel the whole order.
- Once a test has started: these reception-side edits are no longer allowed for that order.

### 3.3 Payments
MVP scope: cash only, paid in full before the test begins. No partial payment, no debt/credit, no installments.

### 3.4 Shifts / Cash Register
- Receptionist opens and closes their own shift; no mandatory pre-scheduled shift table.
- If a shift is left open (forgotten), the Lab Manager can close it.
- The system computes **Expected Cash** for a shift; the Receptionist does not need to enter an "actual cash" figure in the MVP.
- Lab Manager can view revenue per shift and daily revenue, plus shift details.

### 3.5 Results Lifecycle
If Validation is **not** enabled for the lab:
```
Result Entry → Ready for Delivery
```
If Validation **is** enabled:
```
Technician Entry → Pending Validation → Approved → Ready for Delivery
```
Rejection path:
```
Rejected (reason required) → Technician Correction → Pending Validation
```
Once a result is Approved, it is **immutable** — it is never edited afterward. If a genuine correction is needed, a new result/test is created rather than editing the approved one.

## 4. Templates System

- **Central Template Library:** Muca maintains standard medical test templates (English only), each defining test name, parameters, units, reference ranges, and result field definitions.
- **Master Template:** the original stays in Muca's storage/database and is never altered by a lab's edits.
- **Lab Copy:** when a lab adopts a template, a lab-specific copy is created in the lab's own data. The lab can customize its copy (header, footer, logo, branding, test/parameter display names, pricing, printing settings, and other allowed configuration). Other labs never see this copy.
- **Versioning:** master templates are versioned (v1, v2, v3, ...). A new master version does **not** auto-update existing lab copies — labs see a "New Template Version Available" notice and the Lab Manager decides whether to upgrade. Historical results retain the template version that was active when they were produced; a later template update must never change a historical result.
- **Custom Templates:** a Lab Manager can create a template that is private to that lab, never published/visible to other labs, stored within tenant data — conceptually the same as a customized master-template copy, just without a master origin.

## 5. Medical Reports

English only, unaffected by the app's language toggle. Contains: lab branding, logo, header, footer, customer info, order info, tests, results, units, and reference ranges (per the template used). Lab Manager configures printing settings (printer, paper size, layout).

## 6. Application Language & Theming

The application itself (not medical reports) supports Arabic + English and Light + Dark mode, with a toggle visible on every page. RTL and LTR must both be supported. This applies across the Platform, Super Admin, and all lab dashboards.

## 7. Onboarding

A wizard for non-technical users; can be completed, skipped, or resumed later. The dashboard surfaces incomplete setup (e.g. "Services not configured," "Logo missing," "Printing setup incomplete").

## 8. Dashboards (by role)

- **Lab Manager:** Home shows Customers, Orders, Results, Revenue. Sidebar: Services, Validator, Shifts, Employees, Online users, Receptionists, Technicians, Settings, Branding, Templates, Printing.
- **Reception:** Home shows Customers, Orders, Payments, Current Shift, and a quick "Create New Order" action. Sidebar: Expected Cash, Current Orders, Shift Details, Payment History, Old Results, and other less-frequent operations. UX rule: daily actions stay visible on Home; specialized actions live in the sidebar.
- **Technician:** Home shows Tests/Orders to execute, Pending Results, Validation status.
- **Validator:** Home shows Pending Validation. Sidebar: previous results/history.
- **Super Admin:** Platform-level view — number of labs, lab status, plans, subscription status, user counts, usage, platform revenue, activity, alerts. Super Admin does not manage a lab's internal day-to-day operations as a normal part of administration.

## 9. Support Access

Super Admin can open Support Access into a lab's data on demand. It has no fixed duration — it stays active until manually revoked by Super Admin. Every Support Access session is recorded in the Audit Log. While active, Super Admin can view the lab's data and results (per current policy).

## 10. Plans & Subscriptions

Plans are fully dynamic — Super Admin defines features, limits (employee counts, storage, usage, and any future limit types), and subscription duration. The plan model is not locked to a fixed set of limit types.

*MVP implementation note (see `PROJECT_STATUS.md`/`AGENTS.md`): the current schema implements this with a fixed set of limit columns rather than a schema-less model. That's the accepted MVP scope, not a deviation to fix now — full dynamic limits are Future/post-MVP work.*

Upgrade/downgrade flow:
```
Lab Manager requests Upgrade/Downgrade → Super Admin reviews/calculates → Approves → Plan updated
```
Lab Manager can only request; Super Admin executes.

### Expiration
```
Expired → Grace Period → Inactive
```
Grace period length is set by Super Admin. After grace period, Super Admin decides the data's fate: keep, wait for renewal, or delete per a controlled policy. There is no uncontrolled automatic deletion.

## 11. Audit Log

Focused on sensitive operations only: login/security events, permission changes, deletions, Support Access sessions, and sensitive result changes/actions. Routine data views are not logged.

## 12. Future Integration (out of MVP scope)

WhatsApp result delivery, planned as:
```
Reception Dashboard → Send Result → Hook/Integration → n8n → WhatsApp → Customer
```
Final implementation details TBD.

## 13. Non-Functional / Security Requirements

- The frontend is never treated as a trust boundary; all tenant isolation and authorization is enforced via PostgreSQL Row Level Security.
- Supabase Auth is the sole owner of password storage; the application never stores passwords itself.
- A secrets vault is used later for integration credentials only, not for passwords.

## 14. Out of Scope for MVP

- Online/gateway payments, partial payment, debt, installments.
- WhatsApp/n8n integration (design only, not built).
- Full self-healing/maintenance automation.
