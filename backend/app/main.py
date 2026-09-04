from fastapi import FastAPI

app = FastAPI(
    title="FRA Monitoring System API",
    description="Backend API for the AI-powered Forest Rights Act Monitoring System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "FRA Monitoring System API is running successfully!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }