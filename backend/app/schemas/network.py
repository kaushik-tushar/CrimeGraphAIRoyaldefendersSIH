from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict


class NodeData(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    label: str
    type: str
    role: Optional[str] = None
    threat: Optional[int] = None
    riskScore: Optional[int] = None
    status: Optional[str] = None
    location: Optional[str] = None


class CytoscapeNode(BaseModel):
    data: NodeData


class EdgeData(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: Optional[str] = None
    source: str
    target: str
    label: str
    connectionType: Optional[str] = None
    weight: Optional[int] = None


class CytoscapeEdge(BaseModel):
    data: EdgeData


class NetworkGraphResponse(BaseModel):
    nodes: List[CytoscapeNode]
    edges: List[CytoscapeEdge]
    caseId: Optional[str] = None
    source: Optional[str] = Field("neo4j", description="'neo4j' or 'mock_fallback'")
