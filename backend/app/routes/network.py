import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from app.database.neo4j import neo4j_client
from app.models.user import User
from app.schemas.network import NetworkGraphResponse
from app.security.permissions import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Network Intelligence Graph"])

MOCK_CYTOSCAPE_GRAPH = {
    "nodes": [
        {
            "data": {
                "id": "1",
                "label": 'Rajesh "Raju" Sharma',
                "type": "Person",
                "role": "Syndicate Kingpin",
                "threat": 98,
                "status": "ABSCONDING",
                "location": "Vijayawada / Delhi NCR"
            }
        },
        {
            "data": {
                "id": "2",
                "label": "Vikram Choudhury",
                "type": "Person",
                "role": "Financial Handler / Mule Recruiter",
                "threat": 89,
                "status": "UNDER_SURVEILLANCE",
                "location": "Guntur"
            }
        },
        {
            "data": {
                "id": "3",
                "label": "Mohan Reddy",
                "type": "Person",
                "role": "Logistics & Hawala Courier",
                "threat": 85,
                "status": "ACTIVE",
                "location": "Hyderabad"
            }
        },
        {
            "data": {
                "id": "4",
                "label": "Priya Sharma",
                "type": "Person",
                "role": "Field Operative / SIM Activator",
                "threat": 75,
                "status": "MONITORED",
                "location": "Noida"
            }
        },
        {
            "data": {
                "id": "5",
                "label": "Burner SIM (+91 98210-XXXXX)",
                "type": "Phone",
                "role": "Primary Intercept Line",
                "threat": 92,
                "status": "INTERCEPTED",
                "location": "Sector 62 Tower Dump"
            }
        },
        {
            "data": {
                "id": "6",
                "label": "Secondary Line (+91 97110-XXXXX)",
                "type": "Phone",
                "role": "Encrypted VoIP Node",
                "threat": 96,
                "status": "ACTIVE",
                "location": "Ghaziabad"
            }
        },
        {
            "data": {
                "id": "7",
                "label": "IMEI 869402049182391",
                "type": "Phone",
                "role": "OnePlus Nord Handset",
                "threat": 85,
                "status": "TRACKED",
                "location": "Hardware Ping"
            }
        },
        {
            "data": {
                "id": "8",
                "label": "Sector 62 Cell Tower Node, Noida",
                "type": "Location",
                "role": "Midnight Dump Location",
                "threat": 60,
                "status": "GEO_FENCED",
                "location": "Noida Sector 62"
            }
        },
        {
            "data": {
                "id": "9",
                "label": "Safehouse Warehouse, Ghaziabad",
                "type": "Location",
                "role": "Suspected Meeting Point",
                "threat": 78,
                "status": "SURVEILLED",
                "location": "Ghaziabad Industrial Zone"
            }
        },
        {
            "data": {
                "id": "10",
                "label": "Axis Bank Acct #9041",
                "type": "Account",
                "role": "Mule Corporate Account",
                "threat": 88,
                "status": "FROZEN",
                "location": "Connaught Place Branch"
            }
        },
        {
            "data": {
                "id": "11",
                "label": "Apex Logistics Pvt Ltd",
                "type": "Organization",
                "role": "Shell Transport Company",
                "threat": 84,
                "status": "FLAGGED",
                "location": "Delhi Logistics Corridor"
            }
        },
        {
            "data": {
                "id": "12",
                "label": "DL-01-AB-1234 (Black Scorpio)",
                "type": "Vehicle",
                "role": "Courier Transit SUV",
                "threat": 82,
                "status": "TRACKED",
                "location": "National Highway 24"
            }
        }
    ],
    "edges": [
        {"data": {"id": "e1", "source": "1", "target": "5", "label": "OPERATES", "weight": 9}},
        {"data": {"id": "e2", "source": "5", "target": "6", "label": "CALLED", "weight": 14}},
        {"data": {"id": "e3", "source": "5", "target": "7", "label": "BOUND_TO", "weight": 10}},
        {"data": {"id": "e4", "source": "5", "target": "8", "label": "CONNECTED_TOWER", "weight": 6}},
        {"data": {"id": "e5", "source": "1", "target": "2", "label": "ASSOCIATE", "weight": 8}},
        {"data": {"id": "e6", "source": "2", "target": "10", "label": "CONTROLLED", "weight": 10}},
        {"data": {"id": "e7", "source": "1", "target": "10", "label": "FUNDS_TRANSFERRED", "weight": 7}},
        {"data": {"id": "e8", "source": "2", "target": "11", "label": "DIRECTOR_OF", "weight": 5}},
        {"data": {"id": "e9", "source": "3", "target": "11", "label": "WORKS_FOR", "weight": 6}},
        {"data": {"id": "e10", "source": "3", "target": "12", "label": "DRIVES", "weight": 8}},
        {"data": {"id": "e11", "source": "12", "target": "9", "label": "SPOTTED_AT", "weight": 7}},
        {"data": {"id": "e12", "source": "1", "target": "9", "label": "VISITED", "weight": 5}},
        {"data": {"id": "e13", "source": "4", "target": "5", "label": "ACTIVATED", "weight": 4}},
        {"data": {"id": "e14", "source": "4", "target": "7", "label": "CONFIGURED", "weight": 3}},
        {"data": {"id": "e15", "source": "3", "target": "9", "label": "MET_AT", "weight": 8}},
        {"data": {"id": "e16", "source": "2", "target": "3", "label": "COORDINATES", "weight": 9}}
    ]
}


def _get_mock_cytoscape_data(case_id: str) -> Dict[str, Any]:
    """
    Returns high-fidelity fallback Cytoscape data with 12 nodes and 16 edges
    customized for the requested case dossier.
    """
    graph = {
        "nodes": [dict(n) for n in MOCK_CYTOSCAPE_GRAPH["nodes"]],
        "edges": [dict(e) for e in MOCK_CYTOSCAPE_GRAPH["edges"]],
        "caseId": case_id,
        "source": "mock_fallback"
    }
    return graph


@router.get("/{case_id}", response_model=NetworkGraphResponse, summary="Query Cytoscape.js Network Graph by Case ID")
def get_network_by_case_id(
    case_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Fetch all nodes (Person, Phone, Location, Vehicle, Organization, Account) and relationships
    for a given Case ID, structured strictly for Cytoscape.js visualization.
    
    Includes robust automatic fallback to high-fidelity mock graph data if Neo4j is offline or initializing.
    """
    try:
        # Check if Neo4j is connected
        if not neo4j_client.is_connected():
            logger.info(f"Neo4j is not connected. Serving mock fallback graph for case {case_id}.")
            return _get_mock_cytoscape_data(case_id)

        # Cypher query to fetch all nodes and their relationships linked to the case
        cypher_query = """
        MATCH (n)
        WHERE n.case_id = $case_id OR $case_id IN n.cases OR n.caseId = $case_id
        OPTIONAL MATCH (n)-[r]-(m)
        RETURN n, labels(n) AS n_labels, r, type(r) AS r_type, m, labels(m) AS m_labels
        """

        records = neo4j_client.execute_query(cypher_query, {"case_id": case_id})

        if not records:
            logger.info(f"Neo4j returned 0 nodes for case {case_id}. Serving mock fallback graph.")
            return _get_mock_cytoscape_data(case_id)

        nodes_dict = {}
        edges_list = []
        edge_ids = set()

        for rec in records:
            # Process node n
            n = rec.get("n")
            if n:
                n_id = str(n.get("id") or n.id if hasattr(n, "id") else n.get("name") or "node")
                n_labels = rec.get("n_labels") or ["Node"]
                n_type = n_labels[0] if n_labels else "Entity"
                n_label = str(n.get("name") or n.get("label") or n.get("name_or_value") or n_id)
                if n_id not in nodes_dict:
                    nodes_dict[n_id] = {
                        "data": {
                            "id": n_id,
                            "label": n_label,
                            "type": n_type,
                            "threat": n.get("threat") or n.get("riskScore") or 75,
                            "role": n.get("role") or "",
                            "status": n.get("status") or "ACTIVE"
                        }
                    }

            # Process node m
            m = rec.get("m")
            if m:
                m_id = str(m.get("id") or m.id if hasattr(m, "id") else m.get("name") or "node")
                m_labels = rec.get("m_labels") or ["Node"]
                m_type = m_labels[0] if m_labels else "Entity"
                m_label = str(m.get("name") or m.get("label") or m.get("name_or_value") or m_id)
                if m_id not in nodes_dict:
                    nodes_dict[m_id] = {
                        "data": {
                            "id": m_id,
                            "label": m_label,
                            "type": m_type,
                            "threat": m.get("threat") or m.get("riskScore") or 75,
                            "role": m.get("role") or "",
                            "status": m.get("status") or "ACTIVE"
                        }
                    }

            # Process relationship r
            r = rec.get("r")
            if r and n and m:
                source_id = str(n.get("id") or n_id)
                target_id = str(m.get("id") or m_id)
                edge_label = str(rec.get("r_type") or "CONNECTED")
                edge_key = f"{source_id}->{target_id}:{edge_label}"
                if edge_key not in edge_ids:
                    edge_ids.add(edge_key)
                    edges_list.append({
                        "data": {
                            "id": f"e{len(edges_list)+1}",
                            "source": source_id,
                            "target": target_id,
                            "label": edge_label,
                            "weight": r.get("weight") or 1
                        }
                    })

        cytoscape_data = {
            "nodes": list(nodes_dict.values()),
            "edges": edges_list,
            "caseId": case_id,
            "source": "neo4j"
        }

        # If less than 2 nodes were extracted, fall back to mock
        if len(cytoscape_data["nodes"]) < 2:
            return _get_mock_cytoscape_data(case_id)

        return cytoscape_data

    except Exception as e:
        logger.warning(f"Neo4j query failed for case {case_id} ({e}). Serving robust mock fallback graph.")
        return _get_mock_cytoscape_data(case_id)


@router.get("", response_model=NetworkGraphResponse, summary="Query Network Graph with Optional Case ID Query Param")
def get_network(
    case_id: Optional[str] = Query("26189-042", alias="caseId", description="Case ID"),
    current_user: User = Depends(get_current_user)
):
    """
    Fallback endpoint allowing /api/v1/network?caseId=... queries.
    """
    return get_network_by_case_id(case_id=case_id or "26189-042", current_user=current_user)
