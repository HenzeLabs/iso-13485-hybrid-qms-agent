# 🧪 QMS Portal User Validation Guide

**Target Users:** 2-3 Real Stakeholders  
**URL:** https://qms-agent-728802725258.us-central1.run.app  
**Duration:** 15-30 minutes per user  
**Goal:** Validate usability, trust, and process improvement

---

## 👥 IDENTIFIED TEST USERS

### 1. **Sarah Chen** - QA Lead
- **Role:** QA Manager
- **Test Focus:** CAPA creation, approval workflow, compliance validation
- **Email:** sarah.chen@lwscientific.com
- **Why:** Owns CAPA process, understands ISO 13485 requirements

### 2. **Mike Rodriguez** - Product Development Lead  
- **Role:** Engineer
- **Test Focus:** DCR creation, AI assistant queries, technical workflow
- **Email:** mike.rodriguez@lwscientific.com
- **Why:** Creates DCRs regularly, tech-savvy, process efficiency focused

### 3. **Jennifer Kim** - Operations Manager
- **Role:** Manager  
- **Test Focus:** Dashboard overview, system usability, security concerns
- **Email:** jennifer.kim@lwscientific.com
- **Why:** Non-technical user, security-conscious, process oversight

---

## 📝 USER TEST INSTRUCTIONS

### **Email Template:**

```
Subject: QMS Portal Beta Test - 15 minutes needed

Hi [Name],

We've built a new QMS portal to streamline our CAPA/DCR processes. Need 15 minutes of your time to test it before full rollout.

🔗 **URL:** https://qms-agent-728802725258.us-central1.run.app

**Quick Test Steps:**
1. Sign in with your Google account (@lwscientific.com)
2. Try creating a CAPA for any quality issue (real or hypothetical)
3. Submit a DCR for any document change
4. Ask the AI assistant: "What are the CAPA closure requirements?"
5. Explore the dashboard and any other features

**What I need from you:**
- Was this easier than our current process?
- Would you trust this system with compliance data?
- What felt missing or confusing?

Takes 15 minutes max. Your feedback determines if we go live next week.

Thanks!
```

---

## 🧪 SPECIFIC TEST SCENARIOS

### **Sarah Chen (QA Lead) - CAPA Testing**

**Scenario:** "Sterilization indicator inconsistency found in Lot #ST-2024-1205"

**Test Steps:**
1. Create CAPA with details:
   - Department: Manufacturing
   - Issue: Sterilization indicator showing inconsistent results
   - Severity: Major
   - Reporter: Sarah Chen

2. Add root cause analysis:
   - Root cause: Calibration drift in sterilization equipment
   - Corrective action: Recalibrate equipment, verify with test loads
   - Preventive action: Implement monthly calibration checks

3. Test approval workflow:
   - Assign action to Mike Rodriguez
   - Set due date: 2 weeks
   - Route for manager approval

**Questions for Sarah:**
- "Is this faster than our current CAPA spreadsheet?"
- "Do you trust the audit trail for FDA inspections?"
- "What's missing from your normal CAPA process?"

---

### **Mike Rodriguez (Product Dev) - DCR + AI Testing**

**Scenario:** "Update SOP-001 Manufacturing Process to include new sterilization parameters"

**Test Steps:**
1. Create DCR with details:
   - Document: SOP-001 Manufacturing Process
   - Change type: Process improvement
   - Reason: Incorporate new sterilization validation data
   - Affected process: Sterilization cycle parameters

2. Ask AI assistant:
   - "What are the requirements for updating an SOP?"
   - "How do I link this DCR to the sterilization CAPA?"
   - "What approvals do I need for process changes?"

3. Test document workflow:
   - Add supporting documents
   - Route for QA approval

**Questions for Mike:**
- "Is the AI assistant helpful or just marketing fluff?"
- "Would this replace your current DCR email chains?"
- "Does the system understand our actual processes?"

---

### **Jennifer Kim (Operations) - Security + Usability Testing**

**Scenario:** General system exploration and security validation

**Test Steps:**
1. Dashboard overview:
   - Review CAPA/DCR statistics
   - Check recent activity feed
   - Explore user permissions

2. Security testing:
   - Try accessing QA-only functions (should be blocked)
   - Test logout/login flow
   - Verify role-based restrictions

3. Usability assessment:
   - Navigation clarity
   - Mobile responsiveness
   - Error handling

**Questions for Jennifer:**
- "Do you feel comfortable with the security model?"
- "Is this intuitive for non-technical staff?"
- "Would you recommend this to other departments?"

---

## 📊 FEEDBACK COLLECTION

### **Critical Questions (Ask All Users):**

1. **Process Improvement:**
   - "Was this easier than our current process?"
   - "How much time would this save you weekly?"

2. **Trust & Compliance:**
   - "Would you trust this system with compliance data?"
   - "Does this meet your audit trail requirements?"

3. **Missing Features:**
   - "What felt missing or confusing?"
   - "What would prevent you from using this daily?"

4. **Deployment Readiness:**
   - "Should we go live next week or wait?"
   - "What's your biggest concern about rollout?"

### **Feedback Form Template:**

```
QMS Portal Beta Feedback

User: _______________
Role: _______________
Test Date: ___________

EASE OF USE (1-5): ___
TRUST LEVEL (1-5): ___
MISSING FEATURES: ________________
BIGGEST CONCERN: _________________
RECOMMENDATION: Go Live / Wait / Needs Work

Comments:
_________________________________
```

---

## 🚀 POST-VALIDATION DEPLOYMENT PLAN

### **If Feedback is Positive (Go/No-Go Decision):**

✅ **Immediate Actions:**
1. Address any critical usability issues
2. Update user training materials
3. Configure production environment variables
4. Execute Phase 5 validation protocol (21 test cases)

✅ **Week 1 Rollout:**
1. Deploy to production Cloud Run
2. Send company-wide announcement
3. Provide 1-hour training session
4. Monitor usage and support requests

✅ **Week 2-4 Monitoring:**
1. Daily usage metrics review
2. User support and feedback collection
3. Performance optimization
4. Plan Phase 6 enhancements

### **If Feedback Requires Changes:**

⚠️ **Hold Deployment:**
1. Document all feedback items
2. Prioritize critical vs. nice-to-have
3. Implement essential changes
4. Re-test with same users
5. Repeat validation cycle

---

## 📞 SUPPORT DURING TESTING

**Test Coordinator:** Available during business hours  
**Technical Issues:** Check browser console, try refresh  
**Access Problems:** Verify @lwscientific.com email domain  
**Questions:** Direct message or email for immediate support

**Expected Test Duration:** 15-30 minutes per user  
**Feedback Deadline:** 48 hours after test completion  
**Go/No-Go Decision:** Based on all 3 user responses

---

**VALIDATION GOAL:** Confirm system is ready for company-wide deployment with real user confidence and trust.