# ISO 13485 QMS Compliance Agent

**Hybrid Architecture: Google Vertex AI Search + OpenAI GPT-4 Turbo**

A production-ready Quality Management System compliance assistant for medical device companies operating under ISO 13485:2016 standards.

---

## Project Purpose

This agent provides:

- **Grounded compliance responses** - All answers sourced from your QMS knowledge base via Vertex AI Search
- **Automatic citations** - Every response includes document references with titles and GCS URLs
- **CAPA drafting** - Generates structured responses to customer complaints with SOP citations
- **Audit trail** - Cloud Run logs capture all queries and compliance decisions

---

## Architecture

### Hybrid Design: Best of Both Worlds

```
┌─────────────────────────────────────────────┐
│   User Query                                │
│   "What are change control requirements?"  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│   FastAPI on Cloud Run                      │
│   (Thin REST API Layer)                     │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────────┐
│  Google       │    │  OpenAI GPT-4      │
│  Vertex AI    │───→│  Turbo             │
│  Search       │    │  (Reasoning)       │
│  (Retrieval)  │    │                    │
└───────────────┘    └────────────────────┘
        │                     │
        │                     │
        └──────────┬──────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│   Response with:                            │
│   • Grounded answer                         │
│   • Source citations                        │
│   • Document titles + GCS URLs              │
└─────────────────────────────────────────────┘
```

### Why Hybrid?

**Google Vertex AI Search (Retrieval)**
- ✅ Your data stays in Google Cloud
- ✅ Enterprise-grade search with semantic understanding
- ✅ Direct access to PDFs in GCS buckets
- ✅ HIPAA/SOC 2 compliant infrastructure

**OpenAI GPT-4 Turbo (Reasoning)**
- ✅ Superior natural language generation
- ✅ Better compliance reasoning and CAPA drafting
- ✅ No Google Workspace API restrictions
- ✅ Cost-effective (~$0.01 per query)

### Components

1. **app.py** - FastAPI server with `/query` and `/health` endpoints
2. **agent_logic.py** - Hybrid orchestration (Google Search → OpenAI reasoning)
3. **system_instructions.md** - ISO 13485 compliance persona (source-controlled)
4. **requirements.txt** - Python dependencies
5. **Dockerfile** - Cloud Run container image definition
6. **deploy.sh** - Automated deployment to Cloud Run
7. **.env.example** - Configuration template

---

## ISO 13485 Compliance Features

### Grounding

- All responses cite the QMS knowledge base via Vertex AI Search
- No hallucinations or unsourced claims
- GPT-4 instructed to answer STRICTLY from retrieved context

### Citations

- Every response includes:
  - Document title (e.g., "ENG-7.3.7-P-001 Engineering Change Procedure Rev 5")
  - Google Cloud Storage URL
  - Source document type (SOP, Work Instruction, Quality Plan, etc.)

### Honesty

- Agent acknowledges gaps: _"I cannot find a procedure for this in the current QMS."_
- No speculation on compliance requirements
- Formal, objective tone maintained throughout

### Audit Trail

- Cloud Run logs capture all queries and responses
- Queryable via:
  ```bash
  gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=qms-agent" --project lw-qms-rag
  ```

---

## Deployment Instructions

### Prerequisites

- Google Cloud Project with billing enabled
- Vertex AI Search datastore configured with QMS documents
- OpenAI API key (from https://platform.openai.com/api-keys)
- `gcloud` CLI installed and authenticated
- Docker installed (for local testing)

### Quick Deploy

1. **Clone and configure:**

   ```bash
   cd /Users/laurenadmin/Projects/qms-agent
   cp .env.example .env
   ```

2. **Edit .env with your values:**

   ```env
   PROJECT_ID=lw-qms-rag
   DATA_STORE_ID=lw-qms-connector_1765296802617_gcs_store
   DATA_STORE_LOCATION=us
   REGION=us-central1
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

   **Finding your DATA_STORE_ID:**
   - Go to: https://console.cloud.google.com/gen-app-builder/engines
   - Click on your datastore
   - Copy the "Data Store ID" from the details panel

3. **Deploy to Cloud Run:**

   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

   This will:
   - Validate environment variables
   - Build a container image
   - Deploy to Cloud Run
   - Return your service URL

---

## Local Testing

### Option 1: Python Development Server

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables:**

   ```bash
   export PROJECT_ID="lw-qms-rag"
   export DATA_STORE_ID="lw-qms-connector_1765296802617_gcs_store"
   export DATA_STORE_LOCATION="us"
   export OPENAI_API_KEY="sk-your-key"
   ```

3. **Run the FastAPI server:**

   ```bash
   uvicorn app:app --reload --port 8000
   ```

4. **Test endpoints:**

   ```bash
   # Health check
   curl http://localhost:8000/health

   # Query endpoint
   curl -X POST http://localhost:8000/query \
     -H 'Content-Type: application/json' \
     -d '{"query": "What is the change control procedure?"}'
   ```

### Option 2: Docker Local Build

```bash
docker build -t qms-agent:latest .
docker run -p 8080:8080 \
  -e PROJECT_ID="lw-qms-rag" \
  -e DATA_STORE_ID="lw-qms-connector_1765296802617_gcs_store" \
  -e DATA_STORE_LOCATION="us" \
  -e OPENAI_API_KEY="sk-your-key" \
  qms-agent:latest
```

---

## API Endpoints

### POST /query

**Request:**

```json
{
  "query": "What are our procedures for managing customer complaints?",
  "user_role": "staff"
}
```

**Response:**

```json
{
  "answer": "According to SOP-005 Section 3.2, customer complaints must be...",
  "citations": [
    {
      "title": "ENG-7.3.7-P-001 Engineering Change Procedure Rev 5",
      "url": "gs://lw-qms-source-of-truth/00_Staging/ISO 13485 - 2003/ENG-7.3.7-P-001 Engineering Change Procedure Rev 5.docx",
      "page": null
    },
    {
      "title": "QA-4.2.3-P-001 Document Control Procedure Rev 14",
      "url": "gs://lw-qms-source-of-truth/00_Staging/ISO 13485 - 2003/QA-4.2.3-P-001 Document Control Procedure Rev 14.docx",
      "page": null
    }
  ]
}
```

### GET /health

**Response:**

```json
{
  "status": "operational",
  "compliance_mode": "active",
  "service": "ISO 13485 QMS Agent"
}
```

---

## Updating System Instructions

The compliance persona is stored in [system_instructions.md](system_instructions.md). This file is:

- **Source-controlled** - Changes tracked in git
- **Versioned** - Deploy history preserved in Cloud Run
- **Auditable** - Every instruction version tied to a deployment

To update compliance rules:

1. **Edit the file:**

   ```bash
   nano system_instructions.md
   ```

2. **Commit changes:**

   ```bash
   git add system_instructions.md
   git commit -m "Update ISO 13485 compliance rules"
   ```

3. **Redeploy:**
   ```bash
   ./deploy.sh
   ```

All subsequent queries will use the updated instructions.

---

## Monitoring & Logging

### View Recent Queries

```bash
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=qms-agent" \
  --limit 50 \
  --project lw-qms-rag \
  --format json
```

### Monitor Service Metrics

Visit: https://console.cloud.google.com/run/detail/us-central1/qms-agent/metrics?project=lw-qms-rag

---

## Example Queries

### Basic Compliance Query

```bash
curl -X POST https://qms-agent-728802725258.us-central1.run.app/query \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "What are the change control requirements for software?"
  }'
```

### CAPA Drafting

```bash
curl -X POST https://qms-agent-728802725258.us-central1.run.app/query \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Draft a response to a customer complaint about product durability"
  }'
```

### Document Lookup

```bash
curl -X POST https://qms-agent-728802725258.us-central1.run.app/query \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Which SOP covers design validation?"
  }'
```

---

## Project Structure

```
qms-agent/
├── app.py                      # FastAPI REST API
├── agent_logic.py              # Hybrid orchestration (Google + OpenAI)
├── system_instructions.md      # ISO 13485 compliance persona
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Cloud Run container
├── deploy.sh                   # Deployment automation script
├── .env                        # Local configuration (DO NOT COMMIT)
├── .env.example                # Configuration template
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## Security & Compliance

- ✅ **Audit logs** - Cloud Run logs retain query history
- ✅ **Access control** - Can be restricted via Cloud Run IAM policies
- ✅ **Data grounding** - No model training on proprietary QMS data
- ✅ **HIPAA-ready** - Can be deployed in HIPAA-compliant GCP environments
- ✅ **SOC 2** - Leverages GCP infrastructure auditing

### Restricting Access

```bash
# Remove public access
gcloud run services remove-iam-policy-binding qms-agent \
  --member=allUsers \
  --role=roles/run.invoker \
  --region us-central1 \
  --project lw-qms-rag

# Grant access to specific users
gcloud run services add-iam-policy-binding qms-agent \
  --member=user:manager@company.com \
  --role=roles/run.invoker \
  --region us-central1 \
  --project lw-qms-rag
```

---

## Cost Estimation

### OpenAI Costs (GPT-4 Turbo)

- **Input:** ~$0.01 per 1K tokens (~750 words)
- **Output:** ~$0.03 per 1K tokens (~750 words)
- **Typical query:** ~$0.01-0.02
- **100 queries/month:** ~$1-2
- **1000 queries/month:** ~$10-20

### Google Cloud Costs

- **Cloud Run:** ~$0.00002400 per vCPU-second + $0.00000250 per GiB-second
- **Vertex AI Search:** ~$0.50 per 1000 queries
- **Typical monthly cost (1000 queries):** ~$20-30 total

**Much cheaper than enterprise compliance software ($500-5000/month)!**

---

## Troubleshooting

### Agent fails with "DATA_STORE_ID not found"

- Verify the Datastore ID matches your Vertex AI Search configuration
- Check that the Datastore is in the correct location (e.g., `us` not `global`)
- Ensure the datastore path format is correct

### No citations returned

- Verify Vertex AI Search is properly configured and documents are indexed
- Check Cloud Logging for grounding-specific errors
- Ensure documents are in supported formats (PDF, DOCX, TXT)

### OpenAI API key errors

- Verify the key is valid at https://platform.openai.com/api-keys
- Check that billing is enabled on your OpenAI account
- Ensure the key has not been revoked or expired

### Service timeout (900 seconds)

- Vertex AI Search queries can be slow with large knowledge bases
- Consider reducing `page_size` in [agent_logic.py](agent_logic.py:43)
- Optimize your datastore by removing duplicate documents

### Environment variables not loaded locally

```bash
# Ensure .env file exists
cp .env.example .env

# Source it manually
source .env

# Or use python-dotenv (already in requirements.txt)
```

---

## License & Support

This is a compliance-first reference implementation for ISO 13485 quality systems.

- **GCP Support:** [Google Cloud Support Portal](https://cloud.google.com/support)
- **OpenAI Support:** [OpenAI Help Center](https://help.openai.com/)

---

**Service Status:** ✅ **LIVE AND OPERATIONAL**

**Service URL:** https://qms-agent-728802725258.us-central1.run.app

**Last Updated:** December 9, 2025

**Architecture:** Hybrid (Google Vertex AI Search + OpenAI GPT-4 Turbo)
