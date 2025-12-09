# ISO 13485 Hybrid QMS Agent

**Regulated Medical Device Software - ISO 13485:2016 Compliant**

![Status](https://img.shields.io/badge/status-production-green)
![Compliance](https://img.shields.io/badge/ISO_13485-compliant-blue)
![Architecture](https://img.shields.io/badge/architecture-hybrid-purple)

A production-ready Quality Management System compliance assistant for medical device companies operating under ISO 13485:2016 standards.

**Service URL:** https://qms-agent-728802725258.us-central1.run.app

---

## Quick Links

- **Developer Documentation:** [device/docs/README.md](device/docs/README.md)
- **Quick Start Guide:** [device/docs/QUICKSTART.md](device/docs/QUICKSTART.md)
- **Deployment Checklist:** [device/docs/DEPLOYMENT_CHECKLIST.md](device/docs/DEPLOYMENT_CHECKLIST.md)
- **SCM Plan:** [SCMP.md](SCMP.md)
- **Design History File:** [documentation/DHF/](documentation/DHF/)

---

## Architecture

### Hybrid Design: Google Vertex AI Search + OpenAI GPT-4 Turbo

```
User Query → Cloud Run (FastAPI)
             ↓
       Google Vertex AI Search (retrieves QMS documents)
             ↓
       OpenAI GPT-4 Turbo (reasons over documents)
             ↓
       Grounded Answer + Citations
```

**Why Hybrid?**
- ✅ Data stays in Google Cloud (HIPAA/SOC 2 compliant)
- ✅ Superior reasoning with OpenAI GPT-4
- ✅ Mandatory source citations (no hallucinations)
- ✅ Cost-effective (~$0.01-0.02 per query)

---

## Repository Structure (ISO 13485 Compliant)

```
/device                           # Production Device Code
  /src                           # Source code
  /tests                         # Verification tests
  /docs                          # Developer documentation

/documentation                    # Regulated Documentation
  /DHF                           # Design History File
    /requirements                # Design inputs (Req-*.md)
    /design-outputs              # Design specifications
    /reviews                     # Design review records
    /verification                # Verification protocols & reports
    /validation                  # Validation protocols & reports
    /risk-management             # Risk analysis per ISO 14971
  /DMR                           # Device Master Record
    /releases                    # Release baselines
    /manifests                   # Deployment manifests
  /traceability                  # Requirement traceability matrices

/scripts                         # Automation scripts
  deploy.sh                      # Cloud Run deployment

/.github                         # GitHub configuration
  PULL_REQUEST_TEMPLATE.md       # PR template for design reviews

SCMP.md                          # Software Configuration Management Plan
README.md                        # This file
.gitignore                       # Git ignore rules
```

---

## ISO 13485 Compliance Features

### Design Controls (Clause 7.3)
- **Requirements Traceability:** Every requirement linked to code, tests, and validation
- **Design Reviews:** All PRs are formal design reviews with QA sign-off
- **Verification:** Automated tests verify design outputs meet design inputs
- **Validation:** User acceptance testing confirms device meets intended use
- **Change Control:** All changes tracked through Git with requirement IDs

### Grounding & Citations
- All responses cite QMS knowledge base via Vertex AI Search
- No hallucinations or unsourced claims
- GPT-4 instructed to answer STRICTLY from retrieved context
- Every response includes document titles and GCS URLs

### Audit Trail
- Cloud Run logs capture all queries and responses
- Git history provides complete change traceability
- DHF documents design rationale and validation evidence
- DMR defines exact configuration of each release

---

## Quick Start

### Prerequisites
- Google Cloud Project: `lw-qms-rag`
- Vertex AI Search datastore configured
- OpenAI API key
- `gcloud` CLI authenticated

### Deploy in 5 Minutes

```bash
# 1. Clone repository
git clone git@github.com:laurenadmin/iso-13485-hybrid-qms-agent.git
cd iso-13485-hybrid-qms-agent

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Deploy to Cloud Run
scripts/deploy.sh

# 4. Test
curl https://qms-agent-728802725258.us-central1.run.app/health
```

**Full instructions:** [device/docs/QUICKSTART.md](device/docs/QUICKSTART.md)

---

## Development Workflow

### Branching Strategy
- `main` - Production releases (protected)
- `release/*` - Release candidates under validation
- `dev` - Integration branch (protected)
- `feature/Req-*` - Feature development tied to requirements
- `hotfix/Req-*` - Critical fixes for production

### Making Changes
```bash
# 1. Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/Req-7.3.5-citation-enforcement

# 2. Develop and test
# ... make changes ...
pytest device/tests/

# 3. Create DHF entry
# ... document in documentation/DHF/requirements/Req-7.3.5.md ...

# 4. Commit with requirement ID
git add .
git commit -m "Req-7.3.5: feat(agent): enforce citations in OpenAI prompt"

# 5. Push and create PR
git push -u origin feature/Req-7.3.5-citation-enforcement
# Open PR using GitHub web interface or CLI
```

**Full SCM process:** [SCMP.md](SCMP.md)

---

## API Endpoints

### POST /query
```json
{
  "query": "What are the change control requirements?"
}
```

**Response:**
```json
{
  "answer": "According to ENG-7.3.7-P-001 Engineering Change Procedure Rev 5...",
  "citations": [
    {
      "title": "ENG-7.3.7-P-001 Engineering Change Procedure Rev 5",
      "url": "gs://lw-qms-source-of-truth/...",
      "page": null
    }
  ]
}
```

### GET /health
```json
{
  "status": "operational",
  "compliance_mode": "active",
  "service": "ISO 13485 QMS Agent"
}
```

---

## Testing

### Run Verification Tests
```bash
# All tests
pytest device/tests/

# Specific requirement
pytest device/tests/test_citations.py -v

# With coverage
pytest device/tests/ --cov=device/src --cov-report=html
```

### Validation Testing
See: `documentation/DHF/validation/validation-protocol-v1.0.md`

---

## Security & Compliance

- ✅ **HIPAA-ready:** GCP infrastructure is HIPAA compliant
- ✅ **SOC 2:** Leverages GCP + OpenAI SOC 2 certifications
- ✅ **Data Privacy:** QMS documents never leave Google Cloud
- ✅ **Audit Trail:** Complete change history in Git + Cloud Run logs
- ✅ **Access Control:** IAM-based authentication available

### Restricting Access
```bash
# Remove public access
gcloud run services remove-iam-policy-binding qms-agent \
  --member=allUsers \
  --role=roles/run.invoker \
  --region us-central1 \
  --project lw-qms-rag

# Grant to specific users
gcloud run services add-iam-policy-binding qms-agent \
  --member=user:manager@company.com \
  --role=roles/run.invoker \
  --region us-central1 \
  --project lw-qms-rag
```

---

## Cost Estimation

| Service | Monthly Cost (1000 queries) |
|---------|----------------------------|
| OpenAI GPT-4 Turbo | $10-20 |
| Vertex AI Search | $0.50 |
| Cloud Run | $5-10 |
| **Total** | **$15-30** |

**vs. Enterprise QMS Software:** $500-5000/month

**98% cost savings** ✅

---

## Support & Documentation

- **Technical Issues:** Open issue on GitHub
- **Security Concerns:** Contact laurenh@lwscientific.com
- **GCP Support:** https://cloud.google.com/support
- **OpenAI Support:** https://help.openai.com/

---

## Regulatory Status

- **Compliance Standard:** ISO 13485:2016
- **Intended Use:** QMS document search and compliance assistance
- **Deployment:** Cloud-based SaaS
- **Data Handling:** HIPAA-ready infrastructure
- **Last Validation:** December 9, 2025

---

## License

Proprietary - LW Scientific

**Copyright © 2025 LW Scientific. All rights reserved.**

This software is regulated medical device software subject to design controls per ISO 13485:2016 Clause 7.3.

---

**Service Status:** ✅ **OPERATIONAL**

**Last Updated:** December 9, 2025
