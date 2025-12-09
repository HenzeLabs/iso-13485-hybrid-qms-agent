# QMS Agent - Quick Start Guide

Get your ISO 13485 QMS Compliance Agent running in **5 minutes**.

---

## Prerequisites

- ✅ Google Cloud Project: `lw-qms-rag`
- ✅ Vertex AI Search Datastore created
- ✅ OpenAI API key
- ✅ `gcloud` CLI installed

---

## Quick Deploy (5 Steps)

### 1. Configure Environment

```bash
cd /Users/laurenadmin/Projects/qms-agent
cp .env.example .env
```

Edit `.env`:
```env
PROJECT_ID=lw-qms-rag
DATA_STORE_ID=lw-qms-connector_1765296802617_gcs_store
DATA_STORE_LOCATION=us
REGION=us-central1
OPENAI_API_KEY=sk-your-actual-key-here
```

### 2. Set Active Project

```bash
gcloud config set project lw-qms-rag
```

### 3. Deploy to Cloud Run

```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Test Health Check

```bash
curl https://qms-agent-728802725258.us-central1.run.app/health
```

**Expected:**
```json
{"status":"operational","compliance_mode":"active","service":"ISO 13485 QMS Agent"}
```

### 5. Run First Query

```bash
curl -X POST https://qms-agent-728802725258.us-central1.run.app/query \
  -H 'Content-Type: application/json' \
  -d '{"query": "What are the change control requirements?"}'
```

**Expected:** Grounded answer with 5 citations from your QMS documents.

---

## ✅ Success Criteria

Your deployment is successful if:

1. Health check returns `"status":"operational"`
2. First query returns answer with citations
3. Citations reference real QMS documents (e.g., "ENG-7.3.7-P-001...")
4. No errors in Cloud Run logs

---

## Common Issues

### "DATA_STORE_ID not found"
- **Fix:** Verify datastore ID at https://console.cloud.google.com/gen-app-builder/engines
- Ensure `DATA_STORE_LOCATION=us` (not `global`)

### "Invalid API key"
- **Fix:** Generate new key at https://platform.openai.com/api-keys
- Update `.env` and redeploy

### "Permission denied"
- **Fix:** Ensure you're authenticated: `gcloud auth login`
- Verify project: `gcloud config get-value project`

---

## Next Steps

1. ✅ **Verify Deployment:** Use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. 📖 **Full Documentation:** See [README.md](README.md)
3. 🔒 **Restrict Access:** Remove `--allow-unauthenticated` for production
4. 📊 **Monitor Costs:** Set up billing alerts in GCP console
5. 🚀 **Integrate:** Connect frontend or workflow automation

---

## Architecture Recap

```
User Query → Cloud Run (FastAPI)
             ↓
       Google Vertex AI Search (retrieves 5 QMS documents)
             ↓
       OpenAI GPT-4 Turbo (reasons over documents)
             ↓
       Grounded Answer + Citations
```

**Cost:** ~$0.01-0.02 per query
**Response Time:** 5-30 seconds
**Data Privacy:** QMS docs stay in Google Cloud

---

**🎉 You're done! Your QMS Agent is live.**

**Service URL:** https://qms-agent-728802725258.us-central1.run.app

**Questions?** Check [README.md](README.md) or [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
