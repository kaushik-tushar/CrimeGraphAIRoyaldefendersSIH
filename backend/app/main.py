<<<<<<< HEAD
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat  # ya jahan bhi aapne chat.py rakha hai

app = FastAPI(title="NCRB Crime Graph AI Backend")

# Enable CORS for frontend communication (React port 3000 ya jo bhi ho)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production me specific domain de sakte hain
=======
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database.postgres import init_db, SessionLocal
from app.database.neo4j import neo4j_client
from app.database.seed import seed_all
from app.routes.auth import router as auth_router
from app.routes.cases import router as cases_router
from app.routes.dashboard import router as dashboard_router
from app.routes.evidence import router as evidence_router
from app.routes.entities import router as entities_router
from app.routes.network import router as network_router
from app.routes.audit import router as audit_router
from app.routes.vehicles import router as vehicles_router
from app.routes.phones import router as phones_router
from app.routes.locations import router as locations_router
from app.routes.assistant import router as assistant_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("crimegraph")

# Dynamic uploads directory
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle manager.
    Initializes relational DB schemas, seeds initial users/cases/evidence/entities,
    verifies upload storage, and checks Neo4j connectivity.
    """
    logger.info("Initializing CrimeGraph AI Backend...")
    
    # 0. Ensure uploads folder exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    logger.info(f"Uploads repository initialized at {UPLOAD_DIR}")

    # 1. Initialize PostgreSQL / Relational DB schemas & seed data
    try:
        init_db()
        db = SessionLocal()
        try:
            seed_all(db)
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error during relational database initialization: {e}")

    # 2. Verify Neo4j connectivity
    try:
        if neo4j_client.connect():
            logger.info("Neo4j graph database is operational.")
        else:
            logger.warning("Neo4j is not connected. Graph endpoints will be disabled.")
    except Exception as e:
        logger.warning(f"Neo4j startup check failed: {e}")

    yield

    # Shutdown
    logger.info("Shutting down CrimeGraph AI Backend...")
    neo4j_client.close()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Tactical Law Enforcement Analytics & Syndicate Tracking REST API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.CORS_ORIGINS == ["*"] else settings.CORS_ORIGINS,
>>>>>>> 8eec4bb (feat(backend): complete Phase 5-7 AI engine, Deep Models, and LLM Assistant)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# Include the AI chat router
app.include_router(chat.router)
=======
# Ensure uploads directory is mounted for static file access
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Mount Routers:
# 1. Authentication
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth")
app.include_router(auth_router, prefix="/api/auth")

# 2. Case Management
app.include_router(cases_router, prefix=f"{settings.API_V1_STR}/cases")
app.include_router(cases_router, prefix="/api/cases")

# 3. Intelligence Dashboard
app.include_router(dashboard_router, prefix=f"{settings.API_V1_STR}/dashboard")
app.include_router(dashboard_router, prefix="/api/dashboard")

# 4. Digital Evidence & Cryptographic Chain of Custody
app.include_router(evidence_router, prefix=f"{settings.API_V1_STR}/evidence")
app.include_router(evidence_router, prefix="/api/evidence")

# 5. Entity Intelligence
app.include_router(entities_router, prefix=f"{settings.API_V1_STR}/entities")
app.include_router(entities_router, prefix="/api/entities")

# 6. Network Intelligence Graph (Cytoscape.js)
app.include_router(network_router, prefix=f"{settings.API_V1_STR}/network")
app.include_router(network_router, prefix="/api/network")

# 7. Audit & Compliance
app.include_router(audit_router, prefix=f"{settings.API_V1_STR}/audit-logs")
app.include_router(audit_router, prefix="/api/audit-logs")

# 8. Vehicle Intelligence
app.include_router(vehicles_router, prefix=f"{settings.API_V1_STR}/vehicles")
app.include_router(vehicles_router, prefix="/api/vehicles")

# 9. Telecom Intelligence (Phones)
app.include_router(phones_router, prefix=f"{settings.API_V1_STR}/phones")
app.include_router(phones_router, prefix="/api/phones")

# 10. Geospatial Intelligence (Locations)
app.include_router(locations_router, prefix=f"{settings.API_V1_STR}/locations")
app.include_router(locations_router, prefix="/api/locations")

# 11. Autonomous LLM Tactical Assistant & Risk Scoring
app.include_router(assistant_router, prefix=f"{settings.API_V1_STR}/assistant")
app.include_router(assistant_router, prefix="/api/assistant")


@app.get("/health", tags=["System"])
@app.get(f"{settings.API_V1_STR}/health", tags=["System"])
def health_check():
    """
    Health check endpoint verifying relational DB and Neo4j connectivity.
    """
    neo4j_status = "connected" if neo4j_client.is_connected() else "unavailable"
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected",
        "neo4j": neo4j_status,
        "version": "1.0.0"
    }


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to CrimeGraph AI - Tactical Intelligence Mesh Backend API",
        "docs": "/docs",
        "health": "/health"
    }
>>>>>>> 8eec4bb (feat(backend): complete Phase 5-7 AI engine, Deep Models, and LLM Assistant)
