import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="module")
def auth_headers(client):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"badgeNumber": "INSP-26189", "password": "password123"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["token"]
    return {"Authorization": f"Bearer {token}"}


def test_network_unauthorized(client):
    res = client.get("/api/v1/network/26189-042")
    assert res.status_code == 401


def test_network_authenticated_cytoscape_structure(client, auth_headers):
    res = client.get("/api/v1/network/26189-042", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()

    assert "nodes" in data
    assert "edges" in data
    assert isinstance(data["nodes"], list)
    assert isinstance(data["edges"], list)

    # Validate Cytoscape node data format
    for node in data["nodes"]:
        assert "data" in node
        node_data = node["data"]
        assert "id" in node_data
        assert "label" in node_data
        assert "type" in node_data

    # Validate Cytoscape edge data format
    for edge in data["edges"]:
        assert "data" in edge
        edge_data = edge["data"]
        assert "source" in edge_data
        assert "target" in edge_data
        assert "label" in edge_data


def test_network_fallback_counts_and_types(client, auth_headers):
    res = client.get("/api/v1/network/26189-042", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()

    nodes = data["nodes"]
    edges = data["edges"]

    # Must contain at least 10 nodes and 15 edges
    assert len(nodes) >= 10, f"Expected at least 10 nodes, got {len(nodes)}"
    assert len(edges) >= 15, f"Expected at least 15 edges, got {len(edges)}"

    # Check mixed node types (Person, Phone, Location, etc.)
    node_types = {n["data"]["type"] for n in nodes}
    assert "Person" in node_types
    assert "Phone" in node_types
    assert "Location" in node_types


def test_network_alias_and_query_endpoints(client, auth_headers):
    # Alias /api/network/{case_id}
    res1 = client.get("/api/network/26189-042", headers=auth_headers)
    assert res1.status_code == 200
    assert len(res1.json()["nodes"]) >= 10

    # Query param /api/v1/network?caseId=26189-042
    res2 = client.get("/api/v1/network?caseId=26189-042", headers=auth_headers)
    assert res2.status_code == 200
    assert len(res2.json()["nodes"]) >= 10
