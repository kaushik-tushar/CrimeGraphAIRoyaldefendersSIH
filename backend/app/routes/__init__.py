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

__all__ = [
    "auth_router",
    "cases_router",
    "dashboard_router",
    "evidence_router",
    "entities_router",
    "network_router",
    "audit_router",
    "vehicles_router",
    "phones_router",
    "locations_router",
    "assistant_router",
]
