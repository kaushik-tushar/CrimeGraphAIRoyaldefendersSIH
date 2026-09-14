from typing import List, Optional, Any
from pydantic import BaseModel


class KPICard(BaseModel):
    title: str
    count: str
    change: str
    status: str  # "up" | "down"
    color: Optional[str] = None
    bg: Optional[str] = None
    icon: Optional[str] = None


class HighRiskEntity(BaseModel):
    id: str
    name: str
    alias: str
    riskScore: int
    centrality: str
    connections: int
    type: str
    primaryCrime: str


class CriticalAlert(BaseModel):
    id: str
    title: str
    description: str
    timestamp: str
    severity: str
    category: str


class RecentActivity(BaseModel):
    id: str
    action: str
    agent: str
    time: str
    verified: bool = True


class DashboardSummary(BaseModel):
    activeCases: int
    highRiskEntities: int
    detectedNetworks: int
    criticalAlerts: int
    evidenceLogs: int


class DashboardResponse(BaseModel):
    success: bool = True
    summary: DashboardSummary
    kpis: List[KPICard]
    highRiskEntities: List[HighRiskEntity]
    criticalAlerts: List[CriticalAlert]
    recentActivity: List[RecentActivity]
