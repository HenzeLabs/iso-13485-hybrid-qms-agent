# Phase 5 System Validation & Production Rollout Protocol

**Release:** QMS Agent v1.0 Phase 5  
**Document Type:** Validation Protocol (ISO 13485:2016 & FDA 21 CFR Part 11)  
**Date:** December 9, 2025  
**Classification:** REGULATORY EVIDENCE — CONFIDENTIAL  
**Version:** 1.0

---

## 1. Validation Protocol Header

### **Title**

Phase 5 System Validation & Production Rollout — ISO 13485 Qualified Portal with LLM-Assisted Quality Management

### **Scope**

End-to-end system validation of Phase 4C (LLM Assistant Integration) and Phase 4D (Authentication & RBAC) as integrated into the QMS Portal. Validation confirms that:

- AI-assisted CAPA/DCR workflows operate safely with human confirmation
- User identity and role-based access control prevent unauthorized operations
- All actions are audited with complete traceability (ISO 13485:2016 Clause 7.3.6)
- System meets FDA 21 CFR Part 11 requirements for electronic records
- Performance meets operational thresholds
- Portal is production-ready for qualified user rollout

### **Validation Authorities**

| Role                           | Name                 | Organization  | Authority                                          | Signature          |
| ------------------------------ | -------------------- | ------------- | -------------------------------------------------- | ------------------ |
| **Validation Lead**            | [Quality Manager]    | QMS Program   | Owns protocol execution; approves test results     | \_**\_/\_\_**/2025 |
| **QA Testing Lead**            | [QA Manager]         | QA Department | Executes all test cases; documents evidence        | \_**\_/\_\_**/2025 |
| **Engineering Lead**           | [CTO/Tech Lead]      | Engineering   | Provides system access; reviews technical findings | \_**\_/\_\_**/2025 |
| **Compliance Officer**         | [Regulatory Affairs] | Compliance    | Validates regulatory mapping; approves release     | \_**\_/\_\_**/2025 |
| **Quality Manager (Approval)** | [Quality Manager]    | Quality       | Final signoff authority; release authorization     | \_**\_/\_\_**/2025 |

### **Document References**

This protocol supersedes and incorporates findings from:

- **PHASE4C-4D-CLOSEOUT.md** — Phase 4 implementation summary; API contracts; ISO mapping
- **QA-VALIDATION-PHASE4C-4D.md** — Detailed test plan with 21 test cases and pass criteria
- **ISO-13485-ARTIFACTS-MANIFEST.md** — Artifact registry; retention policy; dependency map
- **PHASE4-SIGNOFF-CHECKLIST.md** — Engineering/QA/Compliance approval template

### **Glossary**

| Term                  | Definition                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Validation**        | Comprehensive testing to confirm the system meets specified requirements (ISO 13485:2016 Clause 4.2.3) |
| **Verification**      | Confirmation that specified requirements have been fulfilled (Phase 4 sign-off)                        |
| **Traceability**      | Ability to link every action to user, timestamp, and resource (ISO 13485 7.3.6)                        |
| **RBAC**              | Role-Based Access Control — permission model restricting operations by user role                       |
| **Audit Trail**       | Immutable log of all security-relevant events (FDA 21 CFR Part 11 §11.10)                              |
| **Confirmation Gate** | Mandatory human review before AI-proposed action executes (safety requirement)                         |

---

## 2. Validation Objectives

### **Primary Objectives**

**2.1 Functional Validation**

- ✅ Verify AI assistant receives user queries and generates correct function calls
- ✅ Confirm LLM-proposed CAPA/DCR actions are displayed with citations and pending confirmation
- ✅ Validate user acceptance (confirm/reject) blocks or executes actions as intended
- ✅ Ensure conversation state persists across browser reload and network interruption
- ✅ Test field auto-population for CAPA/DCR forms using AI draft data

**2.2 Security & Access Control Validation**

- ✅ Verify Google OAuth sign-in flow and JWT session creation
- ✅ Confirm role mapping (email → Engineer/QA/Manager/Admin/Production) is correct for all 5 test users
- ✅ Validate RBAC enforcement: denied operations return 403; UI buttons hidden for unauthorized users
- ✅ Test session timeout (8-hour max age); verify forced re-authentication
- ✅ Confirm user logout clears session and cookies

**2.3 Audit & Traceability Validation (ISO 13485 & FDA)**

- ✅ Verify all security events are logged: USER_LOGIN, CAPA_CREATE, CAPA_APPROVE, DCR_CREATE, DCR_UPDATE, DCR_APPROVE, AI_QUERY, AI_ACTION_CONFIRMED, AI_ACTION_REJECTED, USER_LOGOUT
- ✅ Confirm audit log contains required fields: timestamp (ISO 8601), userId, userEmail, userRole, action, resourceId, ipAddress, userAgent, metadata
- ✅ Validate audit log is immutable (append-only); no editing or deletion of entries
- ✅ Ensure end-to-end traceability: AI_QUERY → AI_ACTION_CONFIRMED → CAPA_CREATE (linked by sessionId/userId)
- ✅ Verify no PII leakage in audit logs (form data, secrets, passwords excluded)

**2.4 Automated System Safety Validation (FDA 21 CFR Part 11 & ISO 13485 Clause 7.5.4.3)**

- ✅ Confirm AI-proposed actions display with source documentation (citations)
- ✅ Validate mandatory confirmation dialog blocks execution until explicit user approval
- ✅ Test rejection path: user cancels → action not executed; audit logged as AI_ACTION_REJECTED
- ✅ Verify system prevents accidental execution (e.g., no auto-confirm; no double-click exploit)

**2.5 Performance & Reliability Validation**

- ✅ Measure AI chat response time: user query → assistant response < 3 seconds (excluding OpenAI latency)
- ✅ Verify API latency: /api/ai/chat, /api/ai/confirm-action, /api/auth/user-role < 2 seconds each
- ✅ Test error handling: network failures, API timeouts, invalid tokens → user-friendly error messages + audit logged
- ✅ Confirm no memory leaks or console errors during extended conversation (100+ messages)
- ✅ Validate concurrent users (load test): 10+ simultaneous sessions without session collision

**2.6 Regulatory Compliance Validation**

- ✅ Confirm system satisfies ISO 13485:2016 Clause 7.3.6 (Traceability): user + timestamp + action on every record
- ✅ Verify system satisfies ISO 13485:2016 Clause 7.5.4.2 (User Access Control): authentication + authorization enforced
- ✅ Validate system satisfies ISO 13485:2016 Clause 7.5.4.3 (Automated Software): safety gate (confirmation) functional
- ✅ Confirm system satisfies FDA 21 CFR Part 11 §11.10 (Audit Trails): immutable, time-ordered, user-attributable
- ✅ Verify system satisfies FDA 21 CFR Part 11 §11.100 (Authentication): user identification via OAuth + JWT

---

## 3. Validation Test Plan Overview

### **3.1 Test Categories**

Validation is organized into six complementary test categories:

#### **Category A: User Interface (UI) Validation**

Tests the AI assistant UI component, conversation rendering, confirmation dialogs, citation display, and form field interactions.

**Scope:** Portal frontend (`portal/src/components/AIAssistant.tsx`, LLMAssistant class)  
**Test Cases:** 4C-001 to 4C-008 (from QA-VALIDATION-PHASE4C-4D.md)  
**Owner:** QA Functional Testing Team  
**Execution:** Manual + browser DevTools (Chrome, Safari, Firefox)

#### **Category B: LLM & Function Calling Validation**

Tests OpenAI integration, function-calling schema, citation retrieval, draft generation, and proposal display.

**Scope:** `portal/src/ai/function-calling.ts`, `portal/src/lib/openai.ts`, Action Layer API  
**Test Cases:** 4C-002, 4C-003, 4C-004, 4C-006 (function call execution & citations)  
**Owner:** QA Integration Testing Team  
**Execution:** API testing (Postman/Insomnia) + browser network inspection

#### **Category C: Authentication & RBAC Validation**

Tests Google OAuth, role assignment, permission enforcement, role-based UI restrictions, and session lifecycle.

**Scope:** `portal/src/lib/auth/rbac.ts`, NextAuth configuration, `/api/auth/user-role`  
**Test Cases:** 4D-001 to 4D-008 (from QA-VALIDATION-PHASE4C-4D.md)  
**Owner:** QA Security Testing Team  
**Execution:** 5 test user accounts (Engineer, QA, Manager, Admin, Production) + JWT inspection

#### **Category D: Audit & Traceability Validation**

Tests audit logger output, event capture, immutability, timestamp accuracy, and end-to-end traceability chains.

**Scope:** `portal/src/lib/auth/audit.ts`, BigQuery audit table, `/api/audit/logs`  
**Test Cases:** 4D-007, 4CD-002, 4CD-005, 4CD-006 (audit events; ISO/FDA compliance)  
**Owner:** QA Security + Compliance Testing Team  
**Execution:** BigQuery query inspection; audit log verification

#### **Category E: Performance & Reliability Validation**

Tests response times, error handling, load capacity, session concurrency, and browser reload resilience.

**Scope:** Portal backend performance; network resilience; state management  
**Test Cases:** 4C-007 (state persistence), 4CD-003 (performance), 4CD-004 (error handling)  
**Owner:** QA Performance Testing Team  
**Execution:** Load testing (JMeter), network throttling (Chrome DevTools), error injection

#### **Category F: Regulatory Compliance Validation**

Tests ISO 13485 and FDA 21 CFR Part 11 compliance; traceability; electronic records authenticity.

**Scope:** All components; validation of artifacts against regulatory standards  
**Test Cases:** 4CD-005, 4CD-006 (ISO 13485 7.3.6, FDA 21 CFR 11)  
**Owner:** QA Compliance + Quality Assurance Manager  
**Execution:** Document review; evidence gathering; compliance matrix completion

---

### **3.2 Test Execution Timeline**

| Phase                                                  | Duration | Owner                           | Deliverable                                                           |
| ------------------------------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------- |
| **Phase 5A: Setup & Prerequisites**                    | 2 days   | QA + DevOps                     | Test environment ready; 5 test users provisioned; BQ audit table live |
| **Phase 5B: Category A–C Testing (UI/LLM/Auth)**       | 5 days   | QA Functional + Security        | Test results; screenshots; evidence log                               |
| **Phase 5D: Category D–E Testing (Audit/Performance)** | 3 days   | QA Security + Performance       | Audit log analysis; performance report; load test results             |
| **Phase 5F: Category F Testing (Compliance)**          | 2 days   | QA Compliance + Quality Manager | Compliance matrix; regulatory mapping; non-conformance report         |
| **Phase 5G: Issue Remediation & Re-Test**              | 3 days   | Engineering + QA                | Root cause analysis; fix verification; final evidence                 |
| **Phase 5H: Sign-Off & Release**                       | 1 day    | Quality Manager + Compliance    | Final approval; release tag; deployment authorization                 |

**Total Duration:** 16 calendar days (subject to issue discovery)

---

## 4. Test Case Structure & Format

### **4.1 Test Case Template**

All test cases follow this standardized format:

```
Test Case ID: [4C-###] or [4D-###] or [4CD-###]
Feature: [Feature name]
Category: [A: UI | B: LLM | C: Auth | D: Audit | E: Perf | F: Compliance]
Precondition: [System state before test starts]
Owner: [QA Tester Name]
Execution Date: [____/____/2025]

| Step # | Input | Action | Expected Output | Evidence | Pass/Fail | Notes |
|--------|-------|--------|-----------------|----------|-----------|-------|
| 1 | [specific input] | [user/system action] | [desired result] | [artifact to capture] | ☐/✗ | [observations] |
| 2 | ... | ... | ... | ... | ☐/✗ | ... |

**Pass Criteria:** [Acceptance threshold: all steps pass, no blockers]
**Root Cause (if fail):** [To be filled if test fails]
**Evidence Files:** [List screenshots, logs, JSON exports, timestamps]
**QA Sign-Off:** [Signature] ____/____/2025
```

### **4.2 Evidence Capture Requirements**

For each test case, QA must capture and archive:

1. **Screenshots:** UI state at each step (showing confirmation dialogs, role restrictions, error messages)
2. **Browser Console Log:** DevTools → Console tab (no errors; verify timestamps)
3. **Network Request/Response:** DevTools → Network tab (API call, response code, JSON body)
4. **Audit Log Extract:** BigQuery query result showing relevant events (timestamps, userId, action, resourceId)
5. **Video Recording (optional):** Test execution video for complex workflows (e.g., multi-step confirmation)

All evidence must be tagged with:

- Test case ID
- Date/time (UTC)
- Tester name
- System version/build ID

---

### **4.3 Test Case Examples**

#### **Example: 4C-002 — User Query Processing**

```
Test Case ID: 4C-002
Feature: AI Chat Message Sending
Category: A (UI) + B (LLM)
Precondition: AI Assistant initialized; user authenticated; session exists

Step 1: User Types Query
| Input | "Create a CAPA for sterilization temperature deviation in Manufacturing dept" |
| Action | Type into textarea; press Send |
| Expected | User message appears in chat bubble with timestamp; textarea clears |
| Evidence | Screenshot of chat UI; timestamp formatted YYYY-MM-DD HH:MM:SS UTC |
| Fail If | Message not visible; timestamp missing or incorrect format |

Step 2: Assistant Processing Starts
| Input | N/A (triggered by Step 1) |
| Action | System forwards message to /api/ai/chat endpoint |
| Expected | Loading indicator ("Assistant is thinking...") visible; Send button disabled |
| Evidence | DevTools Network tab: POST /api/ai/chat; status 200; latency < 2s |
| Fail If | Loading indicator missing; button remains enabled; timeout > 3s |

Step 3: OpenAI Function Call
| Input | N/A (OpenAI processes query) |
| Action | OpenAI returns function call or text response |
| Expected | Assistant response visible in chat; function call block shows (if applicable) |
| Evidence | DevTools Network tab: response JSON includes functionCalls array; citations array |
| Fail If | No response; function call malformed; citations missing |

Step 4: State Persisted
| Input | N/A (automatic) |
| Action | localStorage updated with new message |
| Expected | DevTools → Application → localStorage: qms-ai-conversation-state contains message |
| Evidence | localStorage JSON export; message ID, role, timestamp, content |
| Fail If | localStorage empty; message not saved; state corrupted |

Pass Criteria: All 4 steps pass; response time < 3 seconds (excluding OpenAI latency)
```

#### **Example: 4D-004 — RBAC Permission Denial**

```
Test Case ID: 4D-004
Feature: Engineer Denied CAPA Creation
Category: C (Auth + RBAC)
Precondition: Engineer user (engineer@lwscientific.com) signed in; dashboard visible

Step 1: Check UI Button State
| Input | Role = "Engineer"; permissions = ["dcr:create", "dcr:update", "dcr:view", "capa:view"] |
| Action | Navigate to CAPA Manager page (/dashboard/capa) |
| Expected | "Create CAPA" button NOT visible (hidden or disabled); only "View" actions available |
| Evidence | Screenshot of CAPA Manager UI; inspect element shows display:none or disabled attribute |
| Fail If | Button visible; enabled; color same as other roles |

Step 2: Attempt API Call (Developer Test)
| Input | POST /action/execute with function_name: "create_capa"; user_id: engineer@... |
| Action | Send API request (if button can be bypassed via console) |
| Expected | Response: 403 Forbidden; message: "Permission denied: capa:create not allowed for Engineer" |
| Evidence | DevTools Network tab: response code 403; response body JSON |
| Fail If | Response 200; CAPA created; no permission error |

Step 3: Audit Event Logged
| Input | N/A (triggered by Step 2 attempt) |
| Action | Check BigQuery audit table for permission denial event |
| Expected | Event: action=PERMISSION_DENIED, userId=engineer@..., resource=capa, action_requested=capa:create |
| Evidence | BigQuery query result; timestamp, userId, action fields |
| Fail If | No event logged; event missing userId; timestamp not ISO 8601 |

Step 4: User Notification
| Input | N/A (UI response to Step 2) |
| Action | User sees error message (if button somehow clicked) |
| Expected | Error dialog: "You do not have permission to create CAPAs. Contact your QA Manager." |
| Evidence | Screenshot of error dialog; accessibility check (alt text, focus) |
| Fail If | No error shown; message unclear; technical jargon |

Pass Criteria: Button hidden + API call denied + audit logged + user notified
```

---

## 5. Pass/Fail Criteria

### **5.1 System-Level Pass/Fail Thresholds**

The entire Phase 5 validation **PASSES** if and only if:

1. **All Critical Test Cases Pass (0% failure rate)**

   - Critical: 4C-001, 4C-004, 4C-005, 4D-001, 4D-004, 4D-005, 4D-007, 4CD-002, 4CD-005
   - Failure of any critical test case = validation FAIL; blocks release

2. **High Test Cases Pass (≥95% pass rate)**

   - High: 4C-002, 4C-003, 4C-006, 4C-007, 4D-002, 4D-003, 4D-006, 4D-008, 4CD-001, 4CD-006
   - Up to 1 high test case may fail if root cause is non-blocking; requires engineering fix + re-test

3. **Medium Test Cases Pass (≥90% pass rate)**

   - Medium: 4C-008, 4CD-003, 4CD-004
   - Performance/non-functional issues; may defer to post-release if critical path unaffected

4. **Audit Trail Completeness: 100%**

   - All 8 event types logged (USER_LOGIN, CAPA_CREATE, CAPA_APPROVE, DCR_CREATE, DCR_UPDATE, DCR_APPROVE, AI_QUERY, AI_ACTION_CONFIRMED, AI_ACTION_REJECTED, USER_LOGOUT)
   - All 8 required audit fields present on every entry
   - Zero PII leakage in logs
   - Zero audit log corruption/gaps

5. **Regulatory Compliance: PASS**

   - ISO 13485 Clause 7.3.6: User + timestamp + action traceability verified
   - ISO 13485 Clause 7.5.4.2: Authentication + authorization verified
   - ISO 13485 Clause 7.5.4.3: Automated system safety gate verified
   - FDA 21 CFR Part 11 §11.10: Audit trail immutability + time order verified
   - FDA 21 CFR Part 11 §11.100: User authentication via OAuth verified

6. **Performance: PASS**
   - Mean AI chat response: < 3 seconds
   - API latency (99th percentile): < 2 seconds
   - Zero unhandled exceptions in console
   - Concurrent session test (10 users): no session collision or data leak

### **5.2 Per-Test Case Pass/Fail Logic**

Each test case has two possible outcomes:

**PASS:** All steps completed as expected; all evidence captured; no deviations from expected output.

**FAIL:** One or more steps did not produce expected output; OR expected output occurred but with unexpected side effects; OR evidence could not be captured.

**Conditional PASS (for Medium-criticality tests):** Test produces expected output, but with minor deviations (e.g., response time 2.5s vs. 2.0s target). Acceptable if:

- Deviation documented in "Notes" field
- Root cause identified (e.g., network latency)
- Does not impact primary functionality
- Quality Manager approves deferral

**Non-Test FAIL Reasons:**

- Insufficient evidence captured (e.g., screenshot missing) — must re-test
- Test case poorly defined; cannot be executed — documented as "Test Error"; blocked by Engineering
- Test environment unavailable (e.g., BigQuery table offline) — documented as "Environmental Blocker"; must resolve before re-test

---

### **5.3 Test Execution Failure Resolution**

If a test case **FAIL**s:

1. **Root Cause Analysis (4 hours)**

   - QA documents failure in detail: which step failed; what was expected vs. actual
   - Engineering reviews logs/screenshots to identify root cause
   - Triage meeting (QA + Eng): Assign severity (Critical/High/Medium)

2. **Fix Planning (1–2 days)**

   - Engineering assesses fix effort + risk
   - For Critical failures: emergency fix + deployment to test environment
   - For High failures: standard fix cycle
   - For Medium failures: may defer to post-release patch if agreed by Quality Manager

3. **Verification & Re-Test (1–3 days)**

   - Engineering deploys fix to test environment
   - QA re-executes test case with same steps and evidence capture
   - Test case marked PASS only after successful re-test

4. **Non-Conformance Report (Ongoing)**
   - All failures logged in Phase 5 Non-Conformance Report
   - Linked to root cause, resolution, and verification evidence
   - Retained for 7-year audit trail

---

## 6. Traceability Reference

This validation protocol is linked to prior Phase 4 documentation as follows:

### **6.1 Artifact Cross-References**

| Test Category                          | Phase 4 Source                  | Reference Section                                         |
| -------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| **Category A: UI Validation**          | PHASE4C-4D-CLOSEOUT.md          | Section: Implementation Details → Phase 4C → Key Features |
| **Category B: LLM & Function Calling** | QA-VALIDATION-PHASE4C-4D.md     | Test Cases: 4C-001 to 4C-008                              |
| **Category C: Auth & RBAC**            | PHASE4C-4D-CLOSEOUT.md          | Section: Implementation Details → Phase 4D → Key Features |
| **Category D: Audit & Traceability**   | ISO-13485-ARTIFACTS-MANIFEST.md | Section: Artifacts for Version Control; Audit Log Storage |
| **Category E: Performance**            | QA-VALIDATION-PHASE4C-4D.md     | Test Case: 4CD-003 (Performance benchmarks)               |
| **Category F: Compliance**             | PHASE4C-4D-CLOSEOUT.md          | Section: ISO 13485 Validation Coverage                    |

### **6.2 Regulatory Mapping**

| Regulation             | Clause  | Requirement                          | Validation Test Case                            |
| ---------------------- | ------- | ------------------------------------ | ----------------------------------------------- |
| **ISO 13485:2016**     | 7.3.6   | Traceability: user + time + action   | 4CD-002, 4CD-005 (Audit trail chain)            |
| **ISO 13485:2016**     | 7.5.4.2 | User Access Control: auth + authz    | 4D-001 to 4D-008 (OAuth + RBAC)                 |
| **ISO 13485:2016**     | 7.5.4.3 | Automated Software: safety gate      | 4C-004, 4C-005 (Confirmation workflow)          |
| **FDA 21 CFR Part 11** | §11.10  | Audit Trails: immutable + time-order | 4D-007, 4CD-002 (Audit log format/immutability) |
| **FDA 21 CFR Part 11** | §11.100 | Authentication: user identification  | 4D-001 (OAuth sign-in)                          |

### **6.3 Evidence Chain**

```
Phase 4 Implementation
   ↓
Phase 4 Documentation (PHASE4C-4D-CLOSEOUT.md, etc.)
   ↓
Phase 4 Sign-Off (PHASE4-SIGNOFF-CHECKLIST.md) ← Engineering + QA approved
   ↓
Phase 5 Validation Protocol (THIS DOCUMENT) ← Defines test strategy
   ↓
Phase 5 Test Execution ← QA runs tests; captures evidence
   ↓
Phase 5 Test Results ← Evidence stored in TestRail/Jira; BigQuery queries
   ↓
Phase 5 Non-Conformance Report ← Issues documented + resolved
   ↓
Phase 5 Final Sign-Off ← Quality Manager approves release
   ↓
Production Deployment + Audit Trail
```

---

## 7. Required Tools & Infrastructure

### **7.1 Software Tools**

| Tool                                     | Purpose                                                         | Access Required                          | Provided By        |
| ---------------------------------------- | --------------------------------------------------------------- | ---------------------------------------- | ------------------ |
| **Browser (Chrome 120+)**                | Frontend testing; DevTools inspection                           | QA workstation                           | [IT]               |
| **Postman or Insomnia**                  | API testing; request/response inspection                        | QA workstation                           | [IT]               |
| **BigQuery (GCP)**                       | Audit log query + analysis                                      | GCP project access; appropriate IAM role | [DevOps/Cloud Eng] |
| **Google Chrome DevTools**               | Network monitoring; localStorage inspection; session inspection | Browser built-in                         | Standard           |
| **Jira (or TestRail)**                   | Test case management; evidence attachment; status tracking      | QA project                               | [IT]               |
| **Video Recording Tool** (optional)      | Screen recording for complex workflows                          | OBS or built-in Mac/Windows              | QA team            |
| **Load Testing Tool** (JMeter or Locust) | Concurrent session testing                                      | Test environment                         | [QA]               |

### **7.2 System Access & Credentials**

| System                      | Access Level                         | Credential Type                 | Owner       | Notes                                      |
| --------------------------- | ------------------------------------ | ------------------------------- | ----------- | ------------------------------------------ |
| **Test Portal (QMS Agent)** | QA URL: https://qms-test.example.com | 5 test user accounts (see 7.3)  | [DevOps]    | Non-prod; separate from prod               |
| **Google Cloud Console**    | BigQuery project; audit table        | GCP service account (read-only) | [Cloud Eng] | Audit table: `qms_audit.events`            |
| **OpenAI API**              | Function calling + chat completion   | API key in test `.env`          | [Eng Lead]  | Test quota; non-prod API key               |
| **GitHub**                  | Code repository access; tag creation | OAuth (existing)                | [DevOps]    | Feature branch: `feature/phase4-portal-ui` |
| **Docker Registry**         | Portal image pull (if applicable)    | GCR credentials                 | [DevOps]    | Build from feature branch for test         |

### **7.3 Test User Accounts**

Five test user accounts must be pre-provisioned in the OAuth provider (Google Workspace):

| User Email                         | Role       | Purpose                                         | Permissions                                                   |
| ---------------------------------- | ---------- | ----------------------------------------------- | ------------------------------------------------------------- |
| `test.engineer@lwscientific.com`   | Engineer   | Test RBAC denial for CAPA; allowed DCR creation | dcr:create, dcr:update, dcr:view, capa:view                   |
| `test.qa@lwscientific.com`         | QA         | Test CAPA creation/approval; DCR approval       | capa:create, capa:update, capa:approve, dcr:approve, dcr:view |
| `test.manager@lwscientific.com`    | Manager    | Full CAPA/DCR management                        | All CAPA/DCR operations                                       |
| `test.admin@lwscientific.com`      | Admin      | System administration; audit log review         | All permissions (`*`)                                         |
| `test.production@lwscientific.com` | Production | Read-only; no create/update                     | capa:view, dcr:view, dashboard:view                           |

**Account Setup:** Each account must have Google Workspace email + valid MFA (for security testing).

### **7.4 Test Data Requirements**

| Data Type                     | Sample Size                                                                                | Notes                                |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------ |
| **CAPA templates**            | 3 different scenarios (e.g., manufacturing issue, documentation error, customer complaint) | Pre-loaded into system               |
| **DCR templates**             | 2 scenarios (e.g., SOP update, form revision)                                              | Pre-loaded into system               |
| **Existing CAPA/DCR records** | 5 past records                                                                             | Used for "draft from existing" tests |
| **BigQuery audit table**      | Empty (or pre-cleared)                                                                     | Ready to log test events             |

---

## 8. Validation Roles & Responsibilities

### **8.1 Validation Team Structure**

```
Quality Manager (Validation Lead)
├── QA Functional Testing Lead
│   ├── QA Tester (UI validation)
│   ├── QA Tester (LLM integration)
│   └── QA Tester (Performance)
├── QA Security Testing Lead
│   ├── QA Tester (Auth/RBAC)
│   └── QA Tester (Audit trail)
├── Engineering Technical Lead
│   ├── Backend Engineer (action layer support)
│   └── DevOps Engineer (test environment)
└── Compliance Officer
    └── Regulatory Affairs Specialist
```

### **8.2 Role Definitions**

#### **Quality Manager (Validation Lead)**

- **Owns:** Validation protocol execution; approval authority for Phase 5 release
- **Responsibilities:**
  - Define validation scope + success criteria (this protocol)
  - Schedule test phases; allocate resources
  - Review test results daily; escalate blockers
  - Approve fixes for failed test cases
  - Sign Phase 5 non-conformance report
  - Final sign-off for production release authorization
- **Signature Authority:** YES (final release approval)

#### **QA Functional Testing Lead**

- **Owns:** Test execution for Categories A (UI), B (LLM), E (Performance)
- **Responsibilities:**
  - Execute all 4C & LLM-related test cases (4C-001 to 4C-008)
  - Capture screenshots, logs, network traces as evidence
  - Document test results in Jira/TestRail
  - Report failures to Quality Manager + Engineering within 4 hours
  - Co-lead performance testing (load, concurrency, memory)
- **QA Tester under this lead:**
  - Each tester assigned 2-3 test cases per day
  - Sign off on test case completion + evidence capture
  - Participate in root cause analysis for failures

#### **QA Security Testing Lead**

- **Owns:** Test execution for Categories C (Auth) and D (Audit)
- **Responsibilities:**
  - Execute RBAC test cases (4D-001 to 4D-008)
  - Query BigQuery audit tables; validate event structure + immutability
  - Inspect JWT tokens (payload, expiration, signature)
  - Coordinate with Security Officer for security scan
  - Document audit trail findings in compliance report
- **QA Tester under this lead:**
  - Test user role assignment (5 roles × 5 test cases = 25 scenarios)
  - Verify audit event presence + completeness
  - Perform session timeout + logout tests

#### **Engineering Technical Lead**

- **Owns:** System access; technical support during validation
- **Responsibilities:**
  - Ensure test environment matches production configuration
  - Provide OpenAI API key + Action Layer endpoint access
  - Review validation failures; identify root causes
  - Coordinate fix deployment to test environment
  - Re-deploy portal between test cycles if needed
  - NOT executing tests; support role only

#### **Compliance Officer / Regulatory Affairs**

- **Owns:** Regulatory mapping; compliance validation (Category F)
- **Responsibilities:**
  - Map validation results to ISO 13485 + FDA 21 CFR 11 requirements
  - Review audit trail for compliance with electronic records rules
  - Approve traceability evidence (timestamp format, user ID, action links)
  - Generate regulatory compliance statement
  - Sign Phase 5 compliance report

---

## 9. Validation Schedule & Milestones

### **9.1 Phase 5 Timeline**

| Phase               | Dates   | Owner                     | Deliverable                                                 | Gate                         |
| ------------------- | ------- | ------------------------- | ----------------------------------------------------------- | ---------------------------- |
| **5A: Setup**       | D1–D2   | DevOps + QA               | Test environment ready; users provisioned; audit table live | Env validation               |
| **5B: UI/LLM/Auth** | D3–D7   | QA Functional + Security  | All Category A, B, C tests executed; evidence logged        | Critical tests pass          |
| **5D: Audit/Perf**  | D8–D10  | QA Security + Performance | Category D, E tests executed; audit log analyzed            | Audit completeness           |
| **5F: Compliance**  | D11–D12 | Compliance + QA           | Category F tests completed; regulatory mapping validated    | Compliance sign-off          |
| **5G: Remediation** | D13–D15 | Engineering + QA          | Failures root-caused; fixes deployed; re-tests passed       | All critical issues resolved |
| **5H: Sign-Off**    | D16     | Quality Manager           | Final approval; release tag created; deployment authorized  | Go/No-Go decision            |

**Total Duration:** 16 calendar days

---

### **9.2 Key Milestones & Go/No-Go Gates**

| Milestone                            | Date   | Approval Gate                                                       | Owner                                |
| ------------------------------------ | ------ | ------------------------------------------------------------------- | ------------------------------------ |
| **Test Environment Ready**           | Day 2  | All critical systems online; test data loaded; users can sign in    | DevOps + QA Lead                     |
| **Category A–C Testing Complete**    | Day 7  | ≥95% of UI/LLM/Auth tests pass                                      | QA Functional + Security Lead        |
| **Category D–E Testing Complete**    | Day 10 | 100% audit events logged; performance targets met                   | QA Security + Performance Lead       |
| **Category F (Compliance) Complete** | Day 12 | All regulatory requirements mapped + verified                       | Compliance Officer                   |
| **Non-Conformance Report Finalized** | Day 14 | All issues root-caused + resolved OR formally deferred              | Quality Manager + Engineering        |
| **Phase 5 Sign-Off**                 | Day 16 | Final approval from Quality Manager + Compliance; go/no-go decision | Quality Manager + Compliance Officer |

---

## 10. Validation Sign-Off Authority

### **10.1 Sign-Off Table**

This table documents approval at the completion of Phase 5 validation. All signatures required for release authorization.

| Authority  | Title                      | Organization  | Responsibility                             | Approval           | Date               | Comments                       |
| ---------- | -------------------------- | ------------- | ------------------------------------------ | ------------------ | ------------------ | ------------------------------ |
| **[Name]** | Quality Manager            | QMS Program   | Owns validation protocol; approves release | ☐ APPROVE ☐ REJECT | \_**\_/\_\_**/2025 | [Details of approval decision] |
| **[Name]** | QA Functional Testing Lead | QA Department | UI/LLM/Performance testing                 | ☐ APPROVE ☐ REJECT | \_**\_/\_\_**/2025 | [Test results summary]         |
| **[Name]** | QA Security Testing Lead   | QA Department | Auth/RBAC/Audit testing                    | ☐ APPROVE ☐ REJECT | \_**\_/\_\_**/2025 | [Security findings]            |
| **[Name]** | Engineering Technical Lead | Engineering   | System support; fix verification           | ☐ APPROVE ☐ REJECT | \_**\_/\_\_**/2025 | [Engineering sign-off]         |
| **[Name]** | Compliance Officer         | Compliance    | Regulatory mapping; compliance validation  | ☐ APPROVE ☐ REJECT | \_**\_/\_\_**/2025 | [Regulatory assessment]        |

### **10.2 Release Authorization Decision Matrix**

The **release decision** is determined by the following matrix:

| Condition                                                                                    | Decision                                              | Authority                                                             |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------- |
| All critical tests PASS; audit trail 100% complete; compliance verified                      | **✅ APPROVED FOR PRODUCTION**                        | Quality Manager + Compliance Officer                                  |
| Critical tests PASS; ≤1 High test FAIL (non-blocking); remediation plan approved             | **✅ APPROVED FOR PRODUCTION (with risk acceptance)** | Quality Manager + Compliance Officer + CTO                            |
| Any Critical test FAIL; OR ≥2 High tests FAIL; OR audit trail gaps; OR compliance violations | **❌ HOLD FOR ENGINEERING FIX**                       | Quality Manager (requires engineering remediation + re-test)          |
| Test environment unavailable; cannot complete testing                                        | **❌ DELAY VALIDATION**                               | Quality Manager + DevOps (must resolve environment + restart Phase 5) |

---

## 11. Test Execution Log & Evidence Management

### **11.1 Evidence Artifact Directory Structure**

All validation evidence must be organized and stored as follows:

```
Phase5-Evidence/
├── Category_A_UI/
│   ├── 4C-001_Chat_Initialization/
│   │   ├── screenshot_step1.png
│   │   ├── screenshot_step2.png
│   │   ├── browser_console.txt
│   │   └── test_result.md
│   ├── 4C-002_Query_Processing/
│   │   └── [evidence files]
│   └── [remaining 4C tests]
├── Category_B_LLM/
│   ├── 4C-003_Function_Call_Execution/
│   │   ├── api_request.json
│   │   ├── api_response.json
│   │   ├── openai_function_call.json
│   │   └── test_result.md
│   └── [remaining LLM tests]
├── Category_C_Auth/
│   ├── 4D-001_OAuth_Sign_In/
│   │   ├── jwt_payload.json
│   │   ├── session_cookie.txt
│   │   ├── user_role_verification.txt
│   │   └── test_result.md
│   └── [remaining Auth tests]
├── Category_D_Audit/
│   ├── 4D-007_Audit_Event_Logging/
│   │   ├── bigquery_query_result.csv
│   │   ├── audit_event_sample.json
│   │   ├── event_completeness_check.txt
│   │   └── test_result.md
│   └── [remaining Audit tests]
├── Category_E_Performance/
│   ├── 4CD-003_Response_Time/
│   │   ├── load_test_results.json
│   │   ├── response_time_histogram.png
│   │   ├── performance_metrics.csv
│   │   └── test_result.md
│   └── [remaining Performance tests]
├── Category_F_Compliance/
│   ├── ISO_13485_Mapping/
│   │   ├── clause_7_3_6_evidence.md
│   │   ├── clause_7_5_4_2_evidence.md
│   │   ├── clause_7_5_4_3_evidence.md
│   │   └── compliance_matrix.xlsx
│   └── FDA_21_CFR_11/
│       ├── section_11_10_evidence.md
│       ├── section_11_100_evidence.md
│       └── electronic_records_compliance.md
├── Test_Execution_Log.xlsx
├── Non_Conformance_Report.md
└── Phase5_Sign_Off.md
```

### **11.2 Test Execution Log (Master Spreadsheet)**

A single master Excel file tracks all test cases:

| Test ID | Feature    | Category | Assigned To | Scheduled Date | Execution Date | Status   | Evidence Link                         | Notes              | Pass/Fail | Sign-Off |
| ------- | ---------- | -------- | ----------- | -------------- | -------------- | -------- | ------------------------------------- | ------------------ | --------- | -------- |
| 4C-001  | Chat Init  | A        | [QA Name]   | D3             | **/**/2025     | Complete | Phase5-Evidence/Category_A_UI/4C-001/ | No issues          | ☐/✗       | [Sig]    |
| 4C-002  | Query Proc | A+B      | [QA Name]   | D3             | **/**/2025     | Complete | Phase5-Evidence/Category_A_UI/4C-002/ | Response time 2.8s | ☐/✗       | [Sig]    |
| ...     | ...        | ...      | ...         | ...            | ...            | ...      | ...                                   | ...                | ...       | ...      |

---

## 12. Non-Conformance & Issue Management

### **12.1 Non-Conformance Report (NCR)**

If any test fails, a non-conformance is logged immediately. Format:

```
NCR-PHASE5-001: [Brief Title]
Date Discovered: ____/____/2025
Discovered By: [QA Tester Name]
Test Case: [4C-###]
Severity: [Critical | High | Medium]

Description:
[What was expected vs. what actually occurred; include screenshots/logs]

Root Cause:
[Why did this happen? Code defect? Test environment issue? Design gap?]

Remediation Plan:
[What action will fix this? Code change? Design change? Test environment fix?]

Owner: [Engineering Lead]
Target Resolution Date: ____/____/2025

Verification:
[How will we confirm the fix works? Re-test plan]
Verified By: [QA Tester] Date: ____/____/2025

Status: [Open | In Progress | Resolved | Deferred]
```

### **12.2 Issue Triage & Escalation**

| Severity     | Response Time     | Escalation                       | Resolution Path                                       |
| ------------ | ----------------- | -------------------------------- | ----------------------------------------------------- |
| **Critical** | < 4 hours         | QA Lead → Engineering Lead → CTO | Emergency fix; deploy to test env; re-test same day   |
| **High**     | < 1 business day  | QA Lead → Engineering Lead       | Standard fix; 1–2 day turnaround; re-test             |
| **Medium**   | < 3 business days | QA Lead (internal)               | May defer post-release if approved by Quality Manager |

---

## 13. Final Validation Report & Release Authorization

### **13.1 Phase 5 Validation Report (Template)**

**Title:** Phase 5 System Validation Report — QMS Agent v1.0 Portal with LLM Assistant & RBAC

**Executive Summary:**

- Test execution dates: \_**\_/\_\_**/2025 to \_**\_/\_\_**/2025
- Total test cases executed: [##]
- Pass rate: [##]%
- Critical failures: [##] (all resolved: YES/NO)
- High failures: [##] (all resolved: YES/NO)
- Regulatory compliance: PASS / FAIL

**Test Results by Category:**
| Category | Pass | Fail | Pass Rate | Status |
| --- | --- | --- | --- | --- |
| A: UI | ## | ## | ##% | ☐ PASS ☐ FAIL |
| B: LLM | ## | ## | ##% | ☐ PASS ☐ FAIL |
| C: Auth | ## | ## | ##% | ☐ PASS ☐ FAIL |
| D: Audit | ## | ## | ##% | ☐ PASS ☐ FAIL |
| E: Performance | ## | ## | ##% | ☐ PASS ☐ FAIL |
| F: Compliance | ## | ## | ##% | ☐ PASS ☐ FAIL |

**Regulatory Compliance Assessment:**

- ISO 13485:2016 Clause 7.3.6 (Traceability): ☐ PASS ☐ FAIL
- ISO 13485:2016 Clause 7.5.4.2 (Access Control): ☐ PASS ☐ FAIL
- ISO 13485:2016 Clause 7.5.4.3 (Automated Software): ☐ PASS ☐ FAIL
- FDA 21 CFR Part 11 §11.10 (Audit Trails): ☐ PASS ☐ FAIL
- FDA 21 CFR Part 11 §11.100 (Authentication): ☐ PASS ☐ FAIL

**Key Findings:**

- [Summary of critical issues discovered + resolved]
- [Performance metrics achieved]
- [Security findings + mitigations]
- [Audit trail validation results]

**Non-Conformances:**

- Total NCRs: [##]
- Critical: [##] (all resolved: YES/NO)
- High: [##]
- Medium: [##]

**Recommendation:**
☐ **APPROVED FOR PRODUCTION RELEASE** — System meets all regulatory requirements; ready for qualified user rollout.
☐ **APPROVED WITH CAVEATS** — Minor issues acceptable; post-release fix plan in place.
☐ **HOLD FOR ENGINEERING** — Critical issues remain; require remediation before release.

**Approved By:**

- Quality Manager: ************\_************ Date: \_**\_/\_\_**/2025
- Compliance Officer: ************\_************ Date: \_**\_/\_\_**/2025

---

### **13.2 Production Release Authorization**

Upon completion of Phase 5 validation, the following authorization must be executed:

**PHASE 5 VALIDATION COMPLETE — RELEASE AUTHORIZATION**

Date: \_**\_/\_\_**/2025

I hereby certify that the QMS Agent v1.0 Portal (with Phase 4C LLM Assistant Integration and Phase 4D Authentication & RBAC) has been thoroughly validated according to the Phase 5 System Validation & Production Rollout Protocol and meets all specified requirements for ISO 13485:2016 and FDA 21 CFR Part 11 compliance.

**Validation Summary:**

- All critical test cases passed
- Regulatory compliance verified
- Audit trail complete + immutable
- Non-conformances resolved or formally deferred
- System ready for production deployment

**Release Status:**
☐ **APPROVED FOR PRODUCTION** — Immediate deployment authorized
☐ **CONDITIONAL APPROVAL** — Deployment authorized with noted conditions/caveats
☐ **HOLD** — System not approved; requires remediation

**Authorizing Signatures:**

| Authority              | Signature                  | Date               | Authorization Level |
| ---------------------- | -------------------------- | ------------------ | ------------------- |
| Quality Manager        | ************\_************ | \_**\_/\_\_**/2025 | FULL AUTHORITY      |
| Compliance Officer     | ************\_************ | \_**\_/\_\_**/2025 | REGULATORY APPROVAL |
| Engineering Lead (CTO) | ************\_************ | \_**\_/\_\_**/2025 | TECHNICAL APPROVAL  |

---

## 14. Appendices

### **A. Regulatory Reference Map**

| Standard       | Clause     | Topic                      | Validation Test(s)                 |
| -------------- | ---------- | -------------------------- | ---------------------------------- |
| ISO 13485:2016 | 4.2.3      | Validation Definition      | Protocol Section 1 (this document) |
| ISO 13485:2016 | 7.3.6      | Traceability               | 4CD-002, 4CD-005, Category D tests |
| ISO 13485:2016 | 7.5.4.2    | User Access Control        | 4D-001 to 4D-008, Category C tests |
| ISO 13485:2016 | 7.5.4.3    | Automated/Computed Systems | 4C-004, 4C-005, Category B tests   |
| FDA 21 CFR 11  | §11.10(e)  | Audit Trail Requirements   | 4D-007, Category D tests           |
| FDA 21 CFR 11  | §11.100(a) | Authentication             | 4D-001, Category C tests           |

### **B. Test Case Quick Reference**

| Test ID | Feature                 | Category | Owner          | Duration |
| ------- | ----------------------- | -------- | -------------- | -------- |
| 4C-001  | Chat Initialization     | A        | QA Functional  | 15 min   |
| 4C-002  | Query Processing        | A+B      | QA Functional  | 20 min   |
| 4C-003  | Function Call Execution | B        | QA Functional  | 15 min   |
| 4C-004  | Confirmation (Approve)  | A        | QA Functional  | 15 min   |
| 4C-005  | Confirmation (Reject)   | A        | QA Functional  | 15 min   |
| 4C-006  | Citation Display        | A        | QA Functional  | 10 min   |
| 4C-007  | State Persistence       | A        | QA Functional  | 20 min   |
| 4C-008  | Field Auto-Population   | A        | QA Functional  | 15 min   |
| 4D-001  | OAuth Sign-In           | C        | QA Security    | 15 min   |
| 4D-002  | RBAC Deny (Engineer)    | C        | QA Security    | 15 min   |
| 4D-003  | RBAC Allow (QA)         | C        | QA Security    | 15 min   |
| 4D-004  | Permission Matrix       | C        | QA Security    | 30 min   |
| 4D-005  | Session Timeout         | C        | QA Security    | 20 min   |
| 4D-006  | User Logout             | C        | QA Security    | 10 min   |
| 4D-007  | Audit Event Logging     | D        | QA Security    | 30 min   |
| 4CD-001 | AI + RBAC Integration   | C+B      | QA Functional  | 20 min   |
| 4CD-002 | Audit Trail (E2E)       | D        | QA Security    | 30 min   |
| 4CD-003 | Performance             | E        | QA Performance | 45 min   |
| 4CD-004 | Audit Security          | D        | QA Security    | 20 min   |
| 4CD-005 | ISO 13485 7.3.6         | F        | QA Compliance  | 30 min   |
| 4CD-006 | FDA 21 CFR 11           | F        | QA Compliance  | 30 min   |

**Total Execution Time (sequential):** ~6 hours per tester; ~15–20 hours for full QA team

### **C. Environment & Access Checklist**

- ☐ Test portal deployed to non-prod environment
- ☐ 5 test user accounts created in OAuth provider
- ☐ BigQuery audit table schema created & ready
- ☐ OpenAI API key configured in test `.env`
- ☐ Action Layer mock endpoints available (or real endpoints in test mode)
- ☐ DevTools access available on test machines (Chrome, Safari, Firefox)
- ☐ Postman/Insomnia installed for API testing
- ☐ GCP BigQuery console access (read-only for QA; write access for DevOps)
- ☐ Jira/TestRail project created for test case tracking
- ☐ Video recording tool available (optional)

---

## 15. Document Control

| Version | Date       | Author          | Change                                  | Approved |
| ------- | ---------- | --------------- | --------------------------------------- | -------- |
| 1.0     | 2025-12-09 | Validation Lead | Initial protocol for Phase 5 validation | [TBD]    |
| 2.0     | [TBD]      | [TBD]           | Updates post-test execution             | [TBD]    |

**Retention:** 7 years (FDA 21 CFR Part 11 requirement)  
**Classification:** REGULATORY EVIDENCE — CONFIDENTIAL  
**Distribution:** QA Team, Engineering, Quality Management, Compliance

---

**END OF PHASE 5 VALIDATION PROTOCOL**

**Effective Date:** December 9, 2025  
**Next Review:** Upon completion of Phase 5 test execution or if changes to Phase 4 implementation occur
