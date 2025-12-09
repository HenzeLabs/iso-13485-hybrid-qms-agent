from device.src import agent_logic


def test_run_agent_query_returns_grounded_result(monkeypatch):
    monkeypatch.setattr(
        agent_logic,
        "search_qms",
        lambda query: [
            {
                "title": "SOP-7.3.1-001",
                "url": "gs://qms/sop",
                "content": "Design inputs are defined in the DHF.",
            }
        ],
    )

    def fake_completion(*args, **kwargs):
        class Message:
            content = "Cited response"

        class Choice:
            message = Message()

        class Response:
            choices = [Choice()]

        return Response()

    monkeypatch.setattr(
        agent_logic.openai_client.chat.completions,
        "create",
        fake_completion,
    )

    result = agent_logic.run_agent_query("What is the change control policy?")
    assert result["answer"] == "Cited response"
    assert result["citations"][0]["title"] == "SOP-7.3.1-001"


def test_run_agent_query_handles_no_context(monkeypatch):
    monkeypatch.setattr(agent_logic, "search_qms", lambda query: [])
    result = agent_logic.run_agent_query("Unknown inquiry")
    assert result["citations"] == []
    assert "could not find" in result["answer"]
