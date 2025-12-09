# QMS Agent BigQuery Ingestion Scripts

Python modules for writing DCR and CAPA workflow data to BigQuery.

## Structure

```
qms-agent/
├── bigquery_client.py      # Base BigQuery client
├── dcr_ingestion.py         # DCR workflow ingestion
├── capa_ingestion.py        # CAPA workflow ingestion
└── examples/
    ├── dcr_example.py       # DCR usage example
    └── capa_example.py      # CAPA usage example
```

## Installation

```bash
pip install google-cloud-bigquery>=3.11.0
```

Or update `requirements.txt` and run:

```bash
pip install -r requirements.txt
```

## Usage

### Creating a DCR (Document Change Request)

```python
from dcr_ingestion import DCRIngestion
from datetime import date, timedelta

dcr = DCRIngestion()

# Create DCR
dcr_id = dcr.create_dcr(
    requester="john.doe@company.com",
    department="Quality Assurance",
    change_type="correction",
    reason="ISO 13485 compliance update",
    description="Add verification protocol to SOP-023",
    affected_process="Design and Development",
    priority="High",
    target_completion_date=date.today() + timedelta(days=30)
)

# Link documents
dcr.add_dcr_documents(dcr_id, [
    {
        "document_id": "SOP-023",
        "document_title": "Design Control Procedure",
        "current_revision": "Rev C",
        "proposed_revision": "Rev D"
    }
])

# Add approvals
dcr.add_dcr_approval(dcr_id, "qa.manager@company.com", "QA Manager")

# Update status
dcr.update_dcr_status(dcr_id, "In Review")
```

### Creating a CAPA Case

```python
from capa_ingestion import CAPAIngestion
from datetime import date, timedelta

capa = CAPAIngestion()

# Create CAPA
capa_id = capa.create_capa(
    reported_by="jane.smith@company.com",
    department="Manufacturing",
    issue_description="Sterilization indicator inconsistent",
    severity="Major",
    due_date=date.today() + timedelta(days=45)
)

# Add root cause analysis
capa.update_capa_analysis(
    capa_id=capa_id,
    root_cause="Temperature deviation due to calibration drift",
    corrective_action="Implement weekly temperature checks"
)

# Add action items
capa.add_capa_action(
    capa_id=capa_id,
    assigned_to="maintenance@company.com",
    action_description="Install temperature monitoring alerts",
    due_date=date.today() + timedelta(days=14)
)

# Add approvals
capa.add_capa_approval(capa_id, "qa.manager@company.com", "QA Manager")

# Update status
capa.update_capa_status(capa_id, "In Progress")
```

## Integration with Cloud Run Agent

### Option 1: Add endpoints to existing FastAPI app

```python
# In app.py
from dcr_ingestion import DCRIngestion
from capa_ingestion import CAPAIngestion

dcr_client = DCRIngestion()
capa_client = CAPAIngestion()

@app.post("/dcr/create")
async def create_dcr(request: DCRCreateRequest):
    dcr_id = dcr_client.create_dcr(
        requester=request.requester,
        department=request.department,
        change_type=request.change_type,
        reason=request.reason,
        description=request.description,
        affected_process=request.affected_process,
        priority=request.priority
    )
    return {"dcr_id": dcr_id, "status": "created"}

@app.post("/capa/create")
async def create_capa(request: CAPACreateRequest):
    capa_id = capa_client.create_capa(
        reported_by=request.reported_by,
        department=request.department,
        issue_description=request.issue_description,
        severity=request.severity
    )
    return {"capa_id": capa_id, "status": "created"}
```

### Option 2: Agent-triggered ingestion

Use the QMS Agent to analyze issues and automatically create CAPA records:

```python
# In agent_logic.py or new workflow_automation.py
from capa_ingestion import CAPAIngestion

def analyze_and_create_capa(issue_text: str, user_email: str):
    """
    Use Gemini to analyze an issue and create a CAPA.
    """
    # Run agent analysis
    response = run_agent_query(
        f"Analyze this quality issue and determine if CAPA is required: {issue_text}"
    )

    # If CAPA recommended, create it
    if "CAPA recommended" in response["answer"]:
        capa = CAPAIngestion()
        capa_id = capa.create_capa(
            reported_by=user_email,
            department="Quality Assurance",
            issue_description=issue_text,
            severity="Major"
        )
        return capa_id
```

## Environment Variables

Set in `.env`:

```env
PROJECT_ID=lw-qms-rag
REGION=us-central1
```

## Running Examples

```bash
cd examples
python dcr_example.py
python capa_example.py
```

## BigQuery Schema

The ingestion scripts write to these tables:

- `qms_workflows.dcr_requests`
- `qms_workflows.dcr_documents`
- `qms_workflows.dcr_approvals`
- `qms_workflows.capa_cases`
- `qms_workflows.capa_actions`
- `qms_workflows.capa_approvals`
- `qms_workflows.capa_metrics_monthly`

See BigQuery console for full schema.

## ISO 13485 Compliance Notes

- All timestamps use UTC
- `created_at` automatically added to all records
- Status transitions are logged via `updated_at`
- Approval routing supports multi-level sign-off
- Monthly metrics align with QA-8.5-F-003 checklist
