from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Muca API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "muca-api"}

@app.get("/api/dashboard/summary")
def dashboard_summary():
    return {
        "clients": 1248,
        "orders": 84,
        "pending_results": 36,
        "revenue": 45200,
        "currency": "EGP",
    }
