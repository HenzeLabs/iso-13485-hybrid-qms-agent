from fastapi.testclient import TestClient

from device.src.app import app

client = TestClient(app)


def test_health_endpoint_reports_status():
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "operational"
    assert payload["compliance_mode"] == "active"


def test_query_endpoint_returns_citations(monkeypatch):
    def fake_run_agent_query(query_text):
        return {
            "answer": "Grounded response",
            "citations": [
                {"title": "SOP-TEST-001", "url": "gs://compliance", "page": None}
            ],
        }

    monkeypatch.setattr("device.src.app.run_agent_query", fake_run_agent_query)
    response = client.post(
        "/query",
        json={"query": "What is change control?", "user_role": "qa"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["answer"].startswith("Grounded response")
    assert len(body["citations"]) == 1
    assert body["citations"][0]["title"] == "SOP-TEST-001"


def test_query_endpoint_handles_failures(monkeypatch):
    class DownstreamError(RuntimeError):
        pass

    def failing_query(query_text):
        raise DownstreamError("search service offline")

    monkeypatch.setattr("device.src.app.run_agent_query", failing_query)
    response = client.post(
        "/query",
        json={"query": "Needs makeup", "user_role": "engineer"},
    )
    assert response.status_code == 500
    assert "Agent query failed" in response.json()["detail"]
