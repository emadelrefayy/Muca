# Muca

Muca is a clean, bilingual (Arabic/English), RTL/LTR, dark/light-mode laboratory SaaS frontend starter with a FastAPI backend starter.

## Current implementation

- Muca SVG logo integrated from the supplied asset.
- Responsive dashboard UI matching the approved visual direction.
- Arabic RTL / English LTR toggle.
- Dark / Light mode toggle.
- Responsive sidebar and mobile bottom navigation.
- Dashboard KPI cards, recent orders, revenue overview.
- Reusable UI primitives for buttons, cards, badges, inputs and tables.
- FastAPI health endpoint and dashboard summary endpoint.
- Mock data only; no production authentication/database yet.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Run backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API:
- `GET /health`
- `GET /api/dashboard/summary`

## Next production phases

1. Supabase authentication + tenant model.
2. PostgreSQL schema and migrations.
3. Clients / services / orders / results / payments / staff CRUD.
4. Role-based access control.
5. n8n integrations.
6. Audit logs, backups, monitoring and production deployment.
