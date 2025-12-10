# 🚀 FINAL DEPLOYMENT CHECKLIST

**System:** ISO 13485 QMS Portal + Backend Agent  
**Release:** v1.0-phase5-prod-2025-12-10  
**Target:** Production Cloud Run Deployment

---

## ✅ PRE-DEPLOYMENT VALIDATION

### **Phase 1: Real User Testing** ⏳ IN PROGRESS

- [ ] **Sarah Chen (QA Lead)** - CAPA workflow testing
- [ ] **Mike Rodriguez (Product Dev)** - DCR + AI assistant testing  
- [ ] **Jennifer Kim (Operations)** - Security + usability testing
- [ ] **Feedback Collection** - All 3 users respond within 48 hours
- [ ] **Go/No-Go Decision** - Based on user confidence and trust levels

**User Test URL:** https://qms-agent-728802725258.us-central1.run.app  
**Test Guide:** [USER-VALIDATION-GUIDE.md](USER-VALIDATION-GUIDE.md)

### **Phase 2: Technical Validation** ✅ COMPLETE

- [x] **Security Hardening** - All P0/P1 audit findings resolved
- [x] **Environment Configuration** - `.env.production` template ready
- [x] **API Routes** - Server-side OpenAI and audit logging implemented
- [x] **Authentication** - Google OAuth + JWT + RBAC functional
- [x] **Git Hygiene** - Clean repository, production tagged

---

## 🔧 PRODUCTION ENVIRONMENT SETUP

### **Required Environment Variables:**

```bash
# Google Cloud Configuration
PROJECT_ID=lw-qms-rag
DATA_STORE_ID=lw-qms-connector_1765296802617_gcs_store
DATA_STORE_LOCATION=us
REGION=us-central1

# OpenAI Configuration
OPENAI_API_KEY=[CONFIGURE_BEFORE_DEPLOYMENT]

# Google OAuth Configuration  
GOOGLE_CLIENT_ID=[CONFIGURE_BEFORE_DEPLOYMENT]
GOOGLE_CLIENT_SECRET=[CONFIGURE_BEFORE_DEPLOYMENT]

# JWT Configuration
JWT_SECRET=[CONFIGURE_BEFORE_DEPLOYMENT]

# Domain Access Control
ALLOWED_DOMAINS=lwscientific.com

# NextAuth Configuration
NEXTAUTH_URL=https://qms-agent-728802725258.us-central1.run.app
NEXTAUTH_SECRET=[CONFIGURE_BEFORE_DEPLOYMENT]
```

### **Security Configuration Steps:**

1. **Generate JWT Secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Configure Google OAuth:**
   - Create OAuth 2.0 credentials in Google Cloud Console
   - Add authorized redirect URI: `https://qms-agent-728802725258.us-central1.run.app/api/auth/callback/google`

3. **Set OpenAI API Key:**
   - Use production OpenAI account
   - Set usage limits and monitoring

4. **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```

---

## 🧪 PHASE 5 VALIDATION EXECUTION

### **Validation Protocol:** [PHASE5-VALIDATION-PROTOCOL.md](PHASE5-VALIDATION-PROTOCOL.md)

**Test Categories:**
- [ ] **Category A: UI Validation** (4C-001 to 4C-008) - 8 test cases
- [ ] **Category B: LLM Integration** (4C-002, 4C-003, 4C-004, 4C-006) - 4 test cases  
- [ ] **Category C: Auth & RBAC** (4D-001 to 4D-008) - 8 test cases
- [ ] **Category D: Audit Trail** (4D-007, 4CD-002, 4CD-005, 4CD-006) - 4 test cases
- [ ] **Category E: Performance** (4CD-003, 4CD-004) - 2 test cases
- [ ] **Category F: Compliance** (4CD-005, 4CD-006) - 2 test cases

**Total Test Cases:** 21  
**Execution Time:** ~6 hours  
**Pass Criteria:** 100% critical tests, ≥95% high tests, ≥90% medium tests

### **Evidence Collection:**
- [ ] Screenshots for each test step
- [ ] Browser console logs (no errors)
- [ ] Network request/response logs
- [ ] BigQuery audit log extracts
- [ ] Performance metrics (response times <3s)

---

## 📋 QA SIGN-OFF REQUIREMENTS

### **Quality Gates:**
- [ ] **All Critical Tests Pass** (0% failure rate)
- [ ] **High Tests Pass** (≥95% pass rate)  
- [ ] **Audit Trail Complete** (100% event coverage)
- [ ] **Regulatory Compliance** (ISO 13485 + FDA 21 CFR Part 11)
- [ ] **Performance Targets Met** (<3s response time, <2s API latency)

### **Sign-Off Authorities:**
- [ ] **QA Manager** - Validation protocol execution approval
- [ ] **Engineering Lead** - Technical implementation approval
- [ ] **Compliance Officer** - Regulatory compliance approval
- [ ] **Quality Manager** - Final release authorization

**Sign-Off Form:** [PHASE5-QA-SIGN-OFF-FORM.md](PHASE5-QA-SIGN-OFF-FORM.md)

---

## 🚀 DEPLOYMENT EXECUTION

### **Cloud Run Deployment Commands:**

```bash
# 1. Build and push container
cd portal/
docker build -t gcr.io/lw-qms-rag/qms-portal:v1.0-phase5-prod .
docker push gcr.io/lw-qms-rag/qms-portal:v1.0-phase5-prod

# 2. Deploy to Cloud Run
gcloud run deploy qms-portal \
  --image gcr.io/lw-qms-rag/qms-portal:v1.0-phase5-prod \
  --region us-central1 \
  --platform managed \
  --set-env-vars-file .env.production \
  --allow-unauthenticated

# 3. Verify deployment
curl https://qms-agent-728802725258.us-central1.run.app/health
```

### **Backend Service Deployment:**

```bash
# Deploy FastAPI backend
cd device/
gcloud run deploy qms-backend \
  --source . \
  --region us-central1 \
  --platform managed \
  --set-env-vars-file ../.env.production
```

---

## 📊 POST-DEPLOYMENT MONITORING

### **Week 1: Launch Monitoring**
- [ ] **Daily Usage Metrics** - User sign-ins, CAPA/DCR creation
- [ ] **Performance Monitoring** - Response times, error rates
- [ ] **Security Monitoring** - Failed auth attempts, audit log integrity
- [ ] **User Support** - Help desk tickets, training requests

### **Week 2-4: Optimization**
- [ ] **User Feedback Collection** - Survey all active users
- [ ] **Performance Optimization** - Database query optimization
- [ ] **Feature Requests** - Prioritize Phase 6 enhancements
- [ ] **Compliance Review** - Audit trail validation with QA

### **Success Metrics:**
- **Adoption Rate:** >80% of target users active within 2 weeks
- **Process Efficiency:** >50% reduction in CAPA/DCR processing time
- **User Satisfaction:** >4.0/5.0 average rating
- **Compliance:** 100% audit trail integrity maintained

---

## 🚨 ROLLBACK PLAN

### **Rollback Triggers:**
- Critical security vulnerability discovered
- >20% user adoption failure
- Compliance audit trail corruption
- System performance degradation >5s response time

### **Rollback Procedure:**
1. **Immediate:** Revert Cloud Run to previous stable version
2. **Communication:** Notify all users of temporary rollback
3. **Investigation:** Root cause analysis within 24 hours
4. **Resolution:** Fix issues and re-deploy with validation
5. **Documentation:** Update DHF with deviation report

---

## 📞 DEPLOYMENT SUPPORT

**Deployment Lead:** Available 24/7 during launch week  
**Technical Support:** Engineering team on-call  
**User Training:** Scheduled sessions Week 1  
**Escalation:** Quality Manager for compliance issues

**Go-Live Target:** After successful user validation + QA sign-off  
**Rollout Strategy:** Phased deployment (QA team → Engineering → All users)

---

**DEPLOYMENT STATUS:** ⏳ **PENDING USER VALIDATION**  
**Next Milestone:** Complete 3-user validation testing  
**Estimated Go-Live:** Within 1 week of validation completion