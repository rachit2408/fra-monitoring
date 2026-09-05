from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.claims import router as claims_router
from app.routes.stats import router as stats_router
from app.routes.anomalies import router as anomalies_router

app = FastAPI(
    title="FRA Monitoring System API",
    description=(
        "Backend API for the AI-powered "
        "Forest Rights Act Monitoring System"
    ),
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Routers
# --------------------------------------------------

app.include_router(claims_router)
app.include_router(stats_router)
app.include_router(anomalies_router)

# --------------------------------------------------
# Basic routes
# --------------------------------------------------

@app.get("/")
def root():

    return {
        "message": "FRA Monitoring System API is running successfully!",
        "dataset": "5000 synthetic FRA claims",
        "status": "operational"
    }


@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }