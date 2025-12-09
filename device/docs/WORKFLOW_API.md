# Workflow Integration Guide

Phase 3.5: Connect QMS Agent to BigQuery Workflow State

Your agent now has two distinct capabilities:

1. **Knowledge Base Queries** (`/query`) - Retrieval + Reasoning
2. **Workflow Operations** (`/workflow`) - DCR/CAPA state management

---

## New Endpoints

### POST /workflow

Execute workflow operations (DCR/CAPA creation, queries, updates).

**Request:**

```json
{
  "query": "Create a new DCR for ISO 7.3.5 design changes",
  "user_email": "john.doe@lwscientific.com"
}
```

**Response:**

```json
{
  "success": true,
  "action": "create_dcr",
  "result": {
    "dcr_id": "DCR-20251209-ABC12345"
  },
  "message": "Created DCR: DCR-20251209-ABC12345. Next: Add documents and route for approval."
}
```

### GET /dcr/{dcr_id}

Retrieve DCR status and approval routing.

**Example:**

```bash
curl https://your-service.run.app/dcr/DCR-20251209-B5DD089E
```

**Response:**

```json
{
  "dcr_id": "DCR-20251209-B5DD089E",
  "status": "In Review",
  "priority": "High",
  "requester": "john.doe@lwscientific.com",
  "request_date": "2025-12-09",
  "target_completion_date": "2026-01-08",
  "description": "Add verification test protocol section to SOP-023 Design Controls"
}
```

### GET /capa/{capa_id}

Retrieve CAPA case details, actions, and approvals.

**Example:**

```bash
curl https://your-service.run.app/capa/CAPA-20251209-980E3239
```

**Response:**

```json
{
  "case": {
    "capa_id": "CAPA-20251209-980E3239",
    "status": "Open",
    "severity": "Major",
    "issue_description": "Sterilization indicator inconsistent...",
    "root_cause": null,
    "due_date": "2026-01-23"
  },
  "actions": [
    {
      "action_id": "ACT-ABC12345",
      "assigned_to": "maintenance@lwscientific.com",
      "action_description": "Install temperature monitoring alerts",
      "due_date": "2025-12-23",
      "status": "Pending"
    }
  ],
  "approvals": [
    {
      "approval_id": "CAPAA-XYZ98765",
      "approver": "qa.manager@lwscientific.com",
      "role": "QA Manager",
      "approval_status": "Pending"
    }
  ]
}
```

---

## Workflow Query Examples

The `/workflow` endpoint accepts natural language queries. The system automatically classifies intent and routes to the appropriate handler.

### DCR Operations

**Create a DCR:**

```bash
curl -X POST https://your-service.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Create a new DCR to add verification protocol to SOP-023",
    "user_email": "john.doe@lwscientific.com"
  }'
```

**List DCRs awaiting approval:**

```bash
curl -X POST https://your-service.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Show me DCRs awaiting Quality approval"
  }'
```

**Get DCR status:**

```bash
curl -X POST https://your-service.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "What is the status of DCR-20251209-B5DD089E?"
  }'
```

**Update DCR:**

```bash
curl -X POST https://your-service.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Approve DCR-20251209-B5DD089E",
    "user_email": "qa.manager@lwscientific.com"
  }'
```

### CAPA Operations

**Create a CAPA:**

```bash
curl -X POST https://your-service.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Open a CAPA for sterilization indicator inconsistency on Lot #2024-1205",
    "user_email": "jane.smith@lwscientific.com"
  }'
```

**List overdue CAPA actions:**

```bash
curl -X POST https://your-service.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Show me overdue CAPA actions"
  }'
```

**Get CAPA status:**

```bash
curl -X POST https://your-service.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Get the status of CAPA-20251209-980E3239"
  }'
```

**Update CAPA:**

```bash
curl -X POST https://your-service.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Close CAPA-20251209-980E3239 - all actions completed",
    "user_email": "qa.manager@lwscientific.com"
  }'
```

---

## Query Router Logic

The `WorkflowRouter` classifies queries based on keywords:

### Knowledge Base Queries

Routed to **Vertex AI Search + Gemini**

- Keywords: "procedure", "requirement", "regulation", "what is", "how to", "explain"
- Example: "What are the requirements for design verification?"

### Workflow Read Queries

Routed to **BigQuery SELECT**

- Keywords: "status", "list", "show", "get", "find", "pending", "overdue"
- Example: "Show me overdue CAPA actions"

### Workflow Write Queries

Routed to **BigQuery INSERT/UPDATE**

- Keywords: "create", "submit", "open", "update", "approve", "reject"
- Example: "Create a new DCR for design changes"

### Hybrid Queries

Routed to **Both Vertex AI + BigQuery**

- Combines knowledge base context with workflow creation
- Example: "Draft a CAPA response based on SOP-018 and file it for CAPA-001"

---

## Integration Points

### From Knowledge Base Query to Workflow Creation

Enhance agent responses with automatic workflow creation:

```python
# In agent_logic.py or new automation module
from workflow_handler import WorkflowQueryHandler

async def intelligent_workflow_creation(query: str, user_email: str):
    """
    If agent detects a compliance issue, automatically create a CAPA.
    """
    # Run knowledge base query
    response = run_agent_query(query)

    # Check if response indicates a compliance gap
    if "non-conformance" in response["answer"].lower() or \
       "gap" in response["answer"].lower():

        # Auto-create CAPA
        handler = WorkflowQueryHandler()
        capa_result = await handler.handle_workflow_query(
            query=f"Create CAPA for: {query}",
            user_email=user_email
        )

        return {
            "knowledge_response": response,
            "workflow_action": capa_result
        }
```

### Embedding Workflow Context in Agent Responses

Make agent responses aware of existing DCR/CAPA status:

```python
async def query_with_workflow_context(query: str, user_email: str):
    """
    Answer compliance questions while also showing relevant DCRs/CAPAs.
    """
    # Get knowledge base answer
    kb_answer = run_agent_query(query)

    # Check for related workflow items
    handler = WorkflowQueryHandler()
    related_dcrs = await handler.handle_workflow_query(
        query="Show open DCRs related to this topic",
        user_email=user_email
    )

    return {
        "answer": kb_answer["answer"],
        "citations": kb_answer["citations"],
        "related_workflows": related_dcrs.get("result", [])
    }
```

---

## Supported Workflow Actions

| Query Type      | Recognized Phrases                                      | Handler              | BigQuery Table |
| --------------- | ------------------------------------------------------- | -------------------- | -------------- |
| Create DCR      | "new dcr", "create dcr", "submit dcr"                   | `create_dcr()`       | dcr_requests   |
| Update DCR      | "update dcr", "approve dcr", "reject dcr"               | `update_dcr()`       | dcr_requests   |
| List DCRs       | "list dcr", "show pending dcr", "dcr awaiting approval" | SQL query            | dcr_requests   |
| Get DCR status  | "status of DCR-_", "dcr-_ details"                      | `get_dcr_status()`   | dcr_requests   |
| Create CAPA     | "new capa", "open capa", "file capa"                    | `create_capa()`      | capa_cases     |
| Update CAPA     | "update capa", "close capa", "capa action"              | `update_capa()`      | capa_cases     |
| List CAPAs      | "list capa", "overdue actions", "open capa"             | SQL query            | capa_cases     |
| Get CAPA status | "status of CAPA-_", "capa-_ details"                    | `get_capa_details()` | capa_cases     |

---

## Error Handling

If query cannot be parsed:

```json
{
  "success": false,
  "error": "Could not determine workflow action from query"
}
```

If entity ID is missing:

```json
{
  "success": false,
  "error": "DCR ID not found in query"
}
```

---

## Audit Trail

All workflow operations are logged to Cloud Logging:

```bash
gcloud logging read \
  "resource.type=cloud_run_revision AND \
   resource.labels.service_name=qms-agent AND \
   jsonPayload.action=workflow" \
  --limit 50
```

Each log entry includes:

- Query text
- Detected action
- Entity IDs
- Success/failure status
- User email
- Timestamp

---

## Testing

Deploy and test the workflow endpoint:

```bash
# Create DCR
curl -X POST https://qms-agent-xxxxx.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{"query": "Create a new DCR", "user_email": "test@example.com"}'

# Get status
curl https://qms-agent-xxxxx.run.app/dcr/DCR-20251209-B5DD089E

# List pending
curl -X POST https://qms-agent-xxxxx.run.app/workflow \
  -H 'Content-Type: application/json' \
  -d '{"query": "Show DCRs awaiting approval"}'
```

---

## Next Phase: Phase 4

- Automate approval routing via email
- Real-time BigQuery streaming
- Webhook notifications for status changes
- Advanced NLP entity extraction for DCR fields
- Dashboard integration (Looker Studio)
