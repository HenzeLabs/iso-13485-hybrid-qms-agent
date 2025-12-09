# QMS Agent Deployment Verification Checklist

Use this checklist to verify successful deployment and operation of the ISO 13485 QMS Compliance Agent.

---

## Pre-Deployment Checklist

### Google Cloud Configuration

- [ ] **GCP Project Active:** Project ID = `lw-qms-rag`
- [ ] **Billing Enabled:** Confirmed at https://console.cloud.google.com/billing
- [ ] **gcloud CLI Authenticated:** `gcloud auth list` shows `laurenh@lwscientific.com`
- [ ] **gcloud Project Set:** `gcloud config get-value project` returns `lw-qms-rag`

### Vertex AI Search Datastore

- [ ] **Datastore Created:** Visible at https://console.cloud.google.com/gen-app-builder/engines
- [ ] **Datastore ID Copied:** `lw-qms-connector_1765296802617_gcs_store`
- [ ] **Location Confirmed:** `us` (not `global`)
- [ ] **Documents Indexed:** QMS PDFs visible in datastore
- [ ] **Search Working:** Test search in console returns results

### OpenAI Configuration

- [ ] **OpenAI Account Created:** https://platform.openai.com/
- [ ] **Billing Enabled:** Credit card added
- [ ] **API Key Generated:** Created at https://platform.openai.com/api-keys
- [ ] **API Key Format Valid:** Starts with `sk-proj-` or `sk-`

### Local Environment

- [ ] **.env File Created:** `cp .env.example .env` completed
- [ ] **PROJECT_ID Set:** Value = `lw-qms-rag`
- [ ] **DATA_STORE_ID Set:** Value = `lw-qms-connector_1765296802617_gcs_store`
- [ ] **DATA_STORE_LOCATION Set:** Value = `us`
- [ ] **REGION Set:** Value = `us-central1`
- [ ] **OPENAI_API_KEY Set:** Valid API key from OpenAI
- [ ] **deploy.sh Executable:** `chmod +x deploy.sh` run

---

## Deployment Verification

### Cloud Run Deployment

- [ ] **Deployment Started:** `./deploy.sh` executed without errors
- [ ] **Container Built:** Build logs show successful image creation
- [ ] **Service Deployed:** Cloud Run service `qms-agent` created
- [ ] **Service URL Obtained:** URL format: `https://qms-agent-*.us-central1.run.app`
- [ ] **Revision Active:** Latest revision shows "100% traffic"

### Service Health Check

**Command:**
```bash
curl -X GET https://qms-agent-728802725258.us-central1.run.app/health
```

**Expected Response:**
```json
{
  "status": "operational",
  "compliance_mode": "active",
  "service": "ISO 13485 QMS Agent"
}
```

- [ ] **Health Check Returns 200 OK**
- [ ] **Response JSON Valid**
- [ ] **Status = "operational"**

---

## Functional Testing

### Test Query 1: Change Control

**Command:**
```bash
curl -X POST https://qms-agent-728802725258.us-central1.run.app/query \
  -H 'Content-Type: application/json' \
  -d '{"query": "What are the requirements for change control in ISO 13485?"}'
```

**Verification:**
- [ ] **Response Returns 200 OK**
- [ ] **Answer Field Present:** Contains compliance text
- [ ] **Citations Field Present:** Array with 1+ citations
- [ ] **Citation Titles Include:** Document names (e.g., "ENG-7.3.7-P-001...")
- [ ] **Citation URLs Include:** GCS paths (e.g., "gs://lw-qms-source-of-truth/...")
- [ ] **Answer Cites Sources:** References specific documents
- [ ] **Tone Professional:** Formal ISO 13485 language

### Test Query 2: Document Lookup

**Command:**
```bash
curl -X POST https://qms-agent-728802725258.us-central1.run.app/query \
  -H 'Content-Type: application/json' \
  -d '{"query": "Which SOP covers design validation?"}'
```

**Verification:**
- [ ] **Response Returns 200 OK**
- [ ] **Answer References Specific SOP:** Document ID/title mentioned
- [ ] **Citations Match Answer:** Cited documents relevant
- [ ] **No Hallucination:** Only cites documents in datastore

### Test Query 3: Gap Acknowledgment

**Command:**
```bash
curl -X POST https://qms-agent-728802725258.us-central1.run.app/query \
  -H 'Content-Type: application/json' \
  -d '{"query": "What is the procedure for underwater basket weaving?"}'
```

**Verification:**
- [ ] **Response Returns 200 OK**
- [ ] **Answer Acknowledges Gap:** States information not found
- [ ] **No Fabrication:** Doesn't invent procedures
- [ ] **Professional Tone:** Maintains formal language

---

## Performance & Cost Verification

### Response Time

- [ ] **Health Check:** < 2 seconds
- [ ] **Simple Query:** < 15 seconds
- [ ] **Complex Query:** < 30 seconds
- [ ] **No Timeouts:** All queries complete within 900s limit

### Cloud Run Metrics

Visit: https://console.cloud.google.com/run/detail/us-central1/qms-agent/metrics?project=lw-qms-rag

- [ ] **Request Count:** Queries logged
- [ ] **Error Rate:** < 5%
- [ ] **Memory Usage:** < 1.5 GB (out of 2 GB allocated)
- [ ] **CPU Utilization:** Spikes during queries, drops to 0 when idle

### Cost Monitoring

**OpenAI Usage:**
- [ ] **Usage Dashboard:** https://platform.openai.com/usage
- [ ] **Cost Per Query:** ~$0.01-0.02
- [ ] **Daily Spend:** Aligned with query volume

**GCP Costs:**
- [ ] **Billing Dashboard:** https://console.cloud.google.com/billing
- [ ] **Cloud Run Costs:** Visible and reasonable
- [ ] **Vertex AI Search Costs:** ~$0.50 per 1000 queries

---

## Security & Compliance Verification

### Access Control

**Current State:** Public (`--allow-unauthenticated`)

- [ ] **Service Accessible:** Can query without auth (for testing)
- [ ] **Plan for IAM:** Know how to restrict access later

**To Restrict (Post-Testing):**
```bash
gcloud run services remove-iam-policy-binding qms-agent \
  --member=allUsers \
  --role=roles/run.invoker \
  --region us-central1 \
  --project lw-qms-rag
```

### Audit Logging

**View Logs:**
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=qms-agent" --limit 10 --project lw-qms-rag
```

- [ ] **Logs Accessible:** Command returns results
- [ ] **Queries Logged:** User questions visible
- [ ] **Responses Logged:** Agent answers visible
- [ ] **Timestamps Present:** Log entries have timestamps
- [ ] **Retention Policy:** Logs retained per compliance requirements

### Data Privacy

- [ ] **QMS Data in GCP:** Documents never leave Google Cloud
- [ ] **OpenAI Context Only:** Only retrieved snippets sent to OpenAI
- [ ] **No Training:** OpenAI doesn't train on API data (per ToS)
- [ ] **API Keys Secure:** Never committed to git (.gitignore in place)

---

## Documentation Verification

### Code Files

- [ ] **app.py:** FastAPI endpoints documented
- [ ] **agent_logic.py:** Functions have docstrings
- [ ] **system_instructions.md:** Compliance persona defined
- [ ] **requirements.txt:** Dependencies listed
- [ ] **Dockerfile:** Container config present
- [ ] **deploy.sh:** Deployment script executable

### Documentation Files

- [ ] **README.md:** Updated with hybrid architecture
- [ ] **.env.example:** All variables documented
- [ ] **DEPLOYMENT_CHECKLIST.md:** This file
- [ ] **.gitignore:** Excludes .env and cache files

### Version Control (Optional)

- [ ] **Git Initialized:** `git init` (if not already)
- [ ] **Initial Commit:** Core files committed
- [ ] **.env Excluded:** Not in git (verified with `git status`)

---

## Post-Deployment Actions

### Operational Readiness

- [ ] **Service URL Documented:** Team knows endpoint
- [ ] **API Documentation Shared:** Endpoint specs distributed
- [ ] **Cost Alerts Set:** Billing alerts configured in GCP
- [ ] **On-Call Defined:** Team member assigned for issues

### Monitoring Setup

- [ ] **Uptime Monitoring:** Consider https://uptimerobot.com/
- [ ] **Alert Thresholds:** Error rate > 10% triggers alert
- [ ] **Log Review Schedule:** Weekly log analysis planned

### User Onboarding

- [ ] **Training Material:** Usage examples prepared
- [ ] **Access Grants:** Users added to IAM (if private)
- [ ] **Feedback Channel:** Way for users to report issues

---

## Troubleshooting Reference

### Common Issues

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| 404 DataStore not found | Wrong datastore ID or location | Verify ID at https://console.cloud.google.com/gen-app-builder/engines |
| 401 Invalid API key | OpenAI key expired/invalid | Generate new key at https://platform.openai.com/api-keys |
| 500 Agent query failed | Check Cloud Run logs | `gcloud logging read "..."` |
| Timeout (900s) | Query too complex or datastore slow | Reduce `page_size` in agent_logic.py |
| No citations | Datastore not indexed | Check datastore has documents indexed |

### Support Contacts

- **GCP Support:** https://cloud.google.com/support
- **OpenAI Support:** https://help.openai.com/
- **Project Owner:** laurenh@lwscientific.com

---

## Sign-Off

**Deployment Date:** _________________

**Deployed By:** _________________

**Verified By:** _________________

**Production Approved:** ☐ Yes  ☐ No

**Notes:**
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

**✅ All checks passed? Congratulations! Your QMS Agent is production-ready.**

**Next Phase:** Frontend integration, advanced features, or user testing.
