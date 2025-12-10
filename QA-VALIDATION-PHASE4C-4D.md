# Phase 4C & 4D Validation Test Plan

**Release:** QMS Agent v1.0 Phase 4  
**Test Lead:** QA Team  
**Validation Phase:** Phase 5 (System Validation)  
**Execution Date:** TBD

---

## Test Overview

This plan covers functional, security, and compliance validation of Phase 4C (LLM Assistant) and Phase 4D (Auth + RBAC). Tests are organized by feature area with explicit inputs, expected outputs, and pass/fail criteria.

---

## Phase 4C: LLM Assistant Integration Tests

### **4C.1 - AI Chat Initialization**

**Test ID:** 4C-001  
**Feature:** User initiates AI assistant conversation  
**Precondition:** User is authenticated and on QMS portal dashboard

| Step | Input | Action                   | Expected Output                                      | Pass/Fail |
| ---- | ----- | ------------------------ | ---------------------------------------------------- | --------- |
| 1    | N/A   | Click "AI Assistant" tab | Chat interface loads with empty message history      | ✓/✗       |
| 2    | N/A   | Verify localStorage      | Session ID created and stored as `qms-ai-session-id` | ✓/✗       |
| 3    | N/A   | Check welcome message    | "QMS Assistant" header + prompt text visible         | ✓/✗       |
| 4    | N/A   | Verify input box         | Textarea visible; Send button disabled (no text)     | ✓/✗       |

**Acceptance:** All 4 steps pass.

---

### **4C.2 - User Query Processing**

**Test ID:** 4C-002  
**Feature:** User sends query to AI assistant; assistant calls OpenAI  
**Precondition:** AI Assistant initialized; session exists

| Step | Input                                                   | Action                                      | Expected Output                                          | Pass/Fail |
| ---- | ------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------- | --------- |
| 1    | "Create a CAPA for sterilization temperature deviation" | Type into textarea + press Send             | User message appears in chat bubble; timestamp displayed | ✓/✗       |
| 2    | N/A                                                     | Wait for API response                       | Loading indicator ("Assistant is thinking...") appears   | ✓/✗       |
| 3    | N/A                                                     | OpenAI processes query with function schema | Assistant response displayed with function call info     | ✓/✗       |
| 4    | N/A                                                     | Check citations (if returned)               | Citation panel visible with title + snippet + URL        | ✓/✗       |
| 5    | N/A                                                     | Verify state saved                          | localStorage contains new message in conversation state  | ✓/✗       |

**Acceptance:** All 5 steps pass; no console errors.

---

### **4C.3 - Function Call Execution (CAPA Proposal)**

**Test ID:** 4C-003  
**Feature:** Assistant proposes CAPA creation; function call returned with parameters  
**Precondition:** User sent query that triggers CAPA creation (e.g., "Create CAPA...")

| Step | Input | Action                           | Expected Output                                                                    | Pass/Fail |
| ---- | ----- | -------------------------------- | ---------------------------------------------------------------------------------- | --------- |
| 1    | N/A   | Wait for assistant response      | Function call block displays: "I'd like to create_capa for you. Please confirm..." | ✓/✗       |
| 2    | N/A   | Inspect function call parameters | Parameters include: department, issue_description, severity (if provided)          | ✓/✗       |
| 3    | N/A   | Check pending confirmation UI    | Yellow confirmation box shows with "Confirm" and "Cancel" buttons                  | ✓/✗       |
| 4    | N/A   | Verify pending action storage    | Pending action added to conversation state in localStorage                         | ✓/✗       |

**Acceptance:** All 4 steps pass; function call parameters valid.

---

### **4C.4 - Confirmation Workflow (User Confirms)**

**Test ID:** 4C-004  
**Feature:** User approves AI-proposed CAPA; action executes  
**Precondition:** Pending confirmation displayed for CAPA creation

| Step | Input | Action                                  | Expected Output                                                                                   | Pass/Fail |
| ---- | ----- | --------------------------------------- | ------------------------------------------------------------------------------------------------- | --------- |
| 1    | N/A   | Click "Confirm" button                  | Loading indicator shown; button disabled                                                          | ✓/✗       |
| 2    | N/A   | Action Layer executes `/action/execute` | Backend creates CAPA record                                                                       | ✓/✗       |
| 3    | N/A   | Response returned with CAPA ID          | Assistant message: "✅ CAPA created successfully: **CAPA-20251209-ABC123**"                       | ✓/✗       |
| 4    | N/A   | Pending confirmation removed            | Confirmation box disappears; action moved to history                                              | ✓/✗       |
| 5    | N/A   | Audit event logged                      | Backend audit log shows: action=CAPA_CREATE, userId=user@company.com, capaId=CAPA-20251209-ABC123 | ✓/✗       |
| 6    | N/A   | State updated                           | Conversation state saved with new message + removed pending action                                | ✓/✗       |

**Acceptance:** All 6 steps pass; CAPA visible in CAPA Manager.

---

### **4C.5 - Confirmation Workflow (User Rejects)**

**Test ID:** 4C-005  
**Feature:** User rejects AI-proposed action; action cancelled  
**Precondition:** Pending confirmation displayed

| Step | Input | Action                                        | Expected Output                                                             | Pass/Fail |
| ---- | ----- | --------------------------------------------- | --------------------------------------------------------------------------- | --------- |
| 1    | N/A   | Click "Cancel" button                         | Loading indicator shown; button disabled                                    | ✓/✗       |
| 2    | N/A   | Action Layer validation confirms no execution | No CAPA/DCR created                                                         | ✓/✗       |
| 3    | N/A   | Assistant responds                            | Message: "Action cancelled. Is there anything else I can help you with?"    | ✓/✗       |
| 4    | N/A   | Pending confirmation removed                  | Confirmation box disappears                                                 | ✓/✗       |
| 5    | N/A   | Audit event logged                            | Backend audit log shows: action=AI_ACTION_REJECTED, userId=user@company.com | ✓/✗       |

**Acceptance:** All 5 steps pass; no unintended records created.

---

### **4C.6 - Citation Display & Document Retrieval**

**Test ID:** 4C-006  
**Feature:** Citations retrieved from Action Layer + displayed in UI  
**Precondition:** Assistant query returned with citations

| Step | Input                            | Action                      | Expected Output                                                           | Pass/Fail |
| ---- | -------------------------------- | --------------------------- | ------------------------------------------------------------------------- | --------- |
| 1    | N/A                              | Wait for assistant response | Citation panel visible with "Supporting documents" header + FileText icon | ✓/✗       |
| 2    | N/A                              | Inspect citation entries    | Each citation shows: title, snippet, clickable URL                        | ✓/✗       |
| 3    | "SOP-001: Sterilization Process" | Click citation URL          | Document opens in new tab (external link verification)                    | ✓/✗       |
| 4    | N/A                              | Verify citation aggregation | Multiple citations across conversation displayed in single panel          | ✓/✗       |

**Acceptance:** All 4 steps pass; citations are valid + clickable.

---

### **4C.7 - Multi-Step Conversation Persistence**

**Test ID:** 4C-007  
**Feature:** Conversation state persists across browser reload  
**Precondition:** User has active conversation with 3+ messages + pending action

| Step | Input | Action                                                                | Expected Output                                              | Pass/Fail |
| ---- | ----- | --------------------------------------------------------------------- | ------------------------------------------------------------ | --------- |
| 1    | N/A   | Open browser DevTools; verify localStorage `qms-ai-session-id` exists | Session ID present (UUID format)                             | ✓/✗       |
| 2    | N/A   | Refresh page (Cmd+R)                                                  | Page reloads; localStorage accessible                        | ✓/✗       |
| 3    | N/A   | Check message history                                                 | All previous messages + timestamps restored exactly          | ✓/✗       |
| 4    | N/A   | Check pending confirmations                                           | Pending action still displayed with same confirmation dialog | ✓/✗       |
| 5    | N/A   | Verify citations aggregated                                           | All citations from previous conversation still visible       | ✓/✗       |
| 6    | N/A   | Resume conversation                                                   | User can continue typing + sending new messages              | ✓/✗       |

**Acceptance:** All 6 steps pass; no data loss.

---

### **4C.8 - Field Auto-Population (CAPA/DCR Form)**

**Test ID:** 4C-008  
**Feature:** AI draft fills form fields automatically  
**Precondition:** CAPA/DCR form visible; assistant proposed draft

| Step | Input                                                                                           | Action                                                 | Expected Output                                                                                      | Pass/Fail |
| ---- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | --------- |
| 1    | "Create CAPA with department=Manufacturing, issue=Sterilization temp deviation, severity=Major" | User sends query                                       | Assistant proposes CAPA draft                                                                        | ✓/✗       |
| 2    | N/A                                                                                             | Click "Use Draft" button (if exists) or manually apply | Form fields pre-filled: Department=Manufacturing, Issue Description=Sterilization..., Severity=Major | ✓/✗       |
| 3    | N/A                                                                                             | User can edit fields                                   | Fields are editable (not locked)                                                                     | ✓/✗       |
| 4    | N/A                                                                                             | Submit form                                            | CAPA created with populated values + any user edits                                                  | ✓/✗       |

**Acceptance:** All 4 steps pass; draft reduces data entry burden.

---

## Phase 4D: Authentication & RBAC Tests

### **4D.1 - Google OAuth Sign-In Flow**

**Test ID:** 4D-001  
**Feature:** User authenticates via Google OAuth; JWT session created  
**Precondition:** Portal sign-in page loaded

| Step | Input                       | Action                             | Expected Output                                                                  | Pass/Fail |
| ---- | --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------- | --------- |
| 1    | N/A                         | Click "Sign in with Google" button | User redirected to Google OAuth consent screen                                   | ✓/✗       |
| 2    | qa.manager@lwscientific.com | Select Google account              | User redirected back to portal with JWT cookie                                   | ✓/✗       |
| 3    | N/A                         | Verify JWT created                 | NextAuth session contains: userId, email, role, permissions                      | ✓/✗       |
| 4    | N/A                         | Verify role assigned               | Role = "QA" (email mapped correctly)                                             | ✓/✗       |
| 5    | N/A                         | Verify permissions loaded          | Permissions array includes: capa:create, capa:approve, dcr:view, etc.            | ✓/✗       |
| 6    | N/A                         | Dashboard loads                    | User greeted by name; dashboard visible                                          | ✓/✗       |
| 7    | N/A                         | Audit log checked                  | Entry created: event=USER_LOGIN, userId=qa.manager@lwscientific.com, userRole=QA | ✓/✗       |

**Acceptance:** All 7 steps pass; user authenticated with correct role.

---

### **4D.2 - Role-Based Access Control (Engineer - Denied CAPA Create)**

**Test ID:** 4D-002  
**Feature:** Engineer lacks `capa:create` permission; UI hides button  
**Precondition:** Engineer user signed in

| Step | Input                     | Action                                  | Expected Output                                                                        | Pass/Fail |
| ---- | ------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------- | --------- |
| 1    | engineer@lwscientific.com | Sign in; verify role = "Engineer"       | Dashboard loads with Engineer role                                                     | ✓/✗       |
| 2    | N/A                       | Check CAPA Manager UI                   | "Create CAPA" button NOT visible (hidden or disabled)                                  | ✓/✗       |
| 3    | N/A                       | Attempt API call (if button accessible) | POST /action/execute with create_capa rejected with 403 Forbidden                      | ✓/✗       |
| 4    | N/A                       | Verify error message                    | User sees: "Permission denied: capa:create not allowed for Engineer role"              | ✓/✗       |
| 5    | N/A                       | Audit logged                            | Entry: event=PERMISSION_DENIED, userId=engineer@..., action=capa:create, resource=capa | ✓/✗       |

**Acceptance:** All 5 steps pass; RBAC enforced.

---

### **4D.3 - Role-Based Access Control (QA - Allowed CAPA Create)**

**Test ID:** 4D-003  
**Feature:** QA has `capa:create` permission; can create CAPA  
**Precondition:** QA user signed in

| Step | Input                                                    | Action                          | Expected Output                                                              | Pass/Fail |
| ---- | -------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------- | --------- |
| 1    | qa.manager@lwscientific.com                              | Sign in; verify role = "QA"     | Dashboard loads with QA role                                                 | ✓/✗       |
| 2    | N/A                                                      | Check CAPA Manager UI           | "Create CAPA" button visible + enabled                                       | ✓/✗       |
| 3    | Issue: "Sterilization temp deviation"; Severity: "Major" | Click "Create CAPA" + fill form | Form submission succeeds                                                     | ✓/✗       |
| 4    | N/A                                                      | Backend executes CAPA creation  | CAPA ID returned (e.g., CAPA-20251209-ABC123)                                | ✓/✗       |
| 5    | N/A                                                      | Audit logged                    | Entry: event=CAPA_CREATE, userId=qa.manager@..., capaId=CAPA-20251209-ABC123 | ✓/✗       |

**Acceptance:** All 5 steps pass; QA can create CAPA.

---

### **4D.4 - RBAC Permission Matrix Validation**

**Test ID:** 4D-004  
**Feature:** All roles tested against permission matrix  
**Precondition:** 5 test users (Engineer, QA, Manager, Admin, Production) signed in sequentially

**Test Matrix:**

| Role       | capa:create | capa:approve | dcr:create | dcr:approve | Expected                         |
| ---------- | ----------- | ------------ | ---------- | ----------- | -------------------------------- |
| Engineer   | ✗           | ✗            | ✓          | ✗           | Create DCR only                  |
| QA         | ✓           | ✓            | ✗          | ✓           | Create/approve CAPA; approve DCR |
| Manager    | ✓           | ✓            | ✓          | ✓           | All CAPA + DCR operations        |
| Admin      | ✓           | ✓            | ✓          | ✓           | All operations                   |
| Production | ✗           | ✗            | ✗          | ✗           | Read-only                        |

**Acceptance:** All 5 rows tested; results match matrix.

---

### **4D.5 - Session Management & Timeout**

**Test ID:** 4D-005  
**Feature:** JWT session expires after 8 hours; user re-authenticated  
**Precondition:** User signed in

| Step | Input | Action                                          | Expected Output                                                                      | Pass/Fail |
| ---- | ----- | ----------------------------------------------- | ------------------------------------------------------------------------------------ | --------- |
| 1    | N/A   | Sign in; check JWT expiration                   | JWT contains `exp` claim = current time + 8 hours                                    | ✓/✗       |
| 2    | N/A   | Simulate time passing (dev tools or clock mock) | 8 hours elapsed                                                                      | ✓/✗       |
| 3    | N/A   | Attempt API call after expiration               | Request rejected with 401 Unauthorized                                               | ✓/✗       |
| 4    | N/A   | User redirected to sign-in                      | Portal redirects to /auth/signin                                                     | ✓/✗       |
| 5    | N/A   | User signs in again                             | New JWT issued; session restarted                                                    | ✓/✗       |
| 6    | N/A   | Audit logged                                    | Entry: event=SESSION_EXPIRED, userId=user@...; Entry: event=USER_LOGIN (new session) | ✓/✗       |

**Acceptance:** All 6 steps pass; session lifecycle validated.

---

### **4D.6 - User Logout & Audit Trail**

**Test ID:** 4D-006  
**Feature:** User logs out; session cleared; audit logged  
**Precondition:** User signed in

| Step | Input | Action                           | Expected Output                                              | Pass/Fail |
| ---- | ----- | -------------------------------- | ------------------------------------------------------------ | --------- |
| 1    | N/A   | Click "Sign Out" button          | User redirected to /auth/signin                              | ✓/✗       |
| 2    | N/A   | Verify JWT cleared               | Browser cookies cleared; NextAuth session removed            | ✓/✗       |
| 3    | N/A   | Attempt to access protected page | Request redirected to /auth/signin                           | ✓/✗       |
| 4    | N/A   | Audit logged                     | Entry: event=USER_LOGOUT, userId=user@..., timestamp=ISO8601 | ✓/✗       |

**Acceptance:** All 4 steps pass; logout clean + audited.

---

### **4D.7 - Audit Log Completeness (All Event Types)**

**Test ID:** 4D-007  
**Feature:** All security-relevant events captured in audit log  
**Precondition:** Various user actions performed (sign in, CAPA creation, AI action, logout)

| Event Type          | Trigger                 | Required Fields                                                                | Pass/Fail |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------ | --------- |
| USER_LOGIN          | User signs in           | timestamp, userId, userEmail, userRole, action=USER_LOGIN                      | ✓/✗       |
| CAPA_CREATE         | QA creates CAPA         | timestamp, userId, userEmail, userRole, action=CAPA_CREATE, resourceId=capaId  | ✓/✗       |
| CAPA_APPROVE        | QA approves CAPA        | timestamp, userId, userEmail, userRole, action=CAPA_APPROVE, resourceId=capaId | ✓/✗       |
| DCR_CREATE          | Manager creates DCR     | timestamp, userId, userEmail, userRole, action=DCR_CREATE, resourceId=dcrId    | ✓/✗       |
| AI_QUERY            | User sends chat message | timestamp, userId, userEmail, userRole, action=AI_QUERY                        | ✓/✗       |
| AI_ACTION_CONFIRMED | User confirms AI action | timestamp, userId, userEmail, userRole, action=AI_ACTION_CONFIRMED             | ✓/✗       |
| AI_ACTION_REJECTED  | User rejects AI action  | timestamp, userId, userEmail, userRole, action=AI_ACTION_REJECTED              | ✓/✗       |
| USER_LOGOUT         | User signs out          | timestamp, userId, userEmail, action=USER_LOGOUT                               | ✓/✗       |

**Acceptance:** All 8 event types logged with correct fields.

---

## Phase 4C + 4D Integration Tests

### **4C+D.1 - AI Assistant with Role-Based Restrictions**

**Test ID:** 4CD-001  
**Feature:** AI respects user role when proposing actions  
**Precondition:** Engineer signed in; AI assistant open

| Step | Input                          | Action                           | Expected Output                                                                                                                                   | Pass/Fail |
| ---- | ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1    | "Create a CAPA for this issue" | Engineer sends chat query        | Assistant responds: "I can help, but only QA can create CAPAs. I can help you draft the issue for a QA to create." OR system denies function call | ✓/✗       |
| 2    | N/A                            | Verify function call denied      | Engineer cannot confirm CAPA creation via AI                                                                                                      | ✓/✗       |
| 3    | "Create a DCR instead"         | Engineer sends alternative query | Assistant proposes DCR creation (Engineer has dcr:create)                                                                                         | ✓/✗       |
| 4    | N/A                            | Engineer confirms DCR            | DCR created successfully                                                                                                                          | ✓/✗       |
| 5    | N/A                            | Audit logged                     | Entry: action=DCR_CREATE, userId=engineer@..., source=ai_assistant                                                                                | ✓/✗       |

**Acceptance:** All 5 steps pass; AI respects RBAC.

---

### **4C+D.2 - Audit Trail for AI-Assisted CAPA Creation**

**Test ID:** 4CD-002  
**Feature:** End-to-end audit trail: AI query → proposal → confirmation → execution  
**Precondition:** QA signed in; AI query logged

**Audit Sequence Expected:**

```
1. AI_QUERY
   timestamp: 2025-12-09T14:30:00Z
   userId: qa.manager@lwscientific.com
   action: AI_QUERY
   metadata: { message: "Create CAPA for sterilization", function: "create_capa" }

2. AI_ACTION_CONFIRMED
   timestamp: 2025-12-09T14:30:15Z
   userId: qa.manager@lwscientific.com
   action: AI_ACTION_CONFIRMED
   resourceId: pending-action-123

3. CAPA_CREATE
   timestamp: 2025-12-09T14:30:16Z
   userId: qa.manager@lwscientific.com
   action: CAPA_CREATE
   resourceId: CAPA-20251209-ABC123
   metadata: { source: "ai_assistant" }
```

**Acceptance:** All 3 events logged in sequence; timestamps coherent; source=ai_assistant captured.

---

## Non-Functional Tests

### **4C+D.3 - Performance: AI Chat Response Time**

**Test ID:** 4CD-003  
**Performance Requirement:** < 3 seconds for user query → assistant response (excluding OpenAI latency)

| Step | Measured                          | Target          | Actual | Pass/Fail |
| ---- | --------------------------------- | --------------- | ------ | --------- |
| 1    | Frontend message send → UI update | < 500ms         | \_ms   | ✓/✗       |
| 2    | Backend /api/ai/chat latency      | < 2s            | \_s    | ✓/✗       |
| 3    | OpenAI function calling latency   | < 5s (external) | \_s    | ✓/✗       |

**Acceptance:** All 3 under target.

---

### **4C+D.4 - Security: No Sensitive Data in Audit Log**

**Test ID:** 4CD-004  
**Feature:** Audit logs do NOT contain PII, secrets, or form data  
**Precondition:** Multiple user actions logged

| Check                                               | Expected Result | Pass/Fail |
| --------------------------------------------------- | --------------- | --------- |
| No plaintext passwords in audit                     | ✓               | ✓/✗       |
| No form field values in audit (only action name)    | ✓               | ✓/✗       |
| No JWT tokens in audit                              | ✓               | ✓/✗       |
| User email + ID only (necessary for accountability) | ✓               | ✓/✗       |

**Acceptance:** All 4 checks pass.

---

## Compliance Validation

### **4C+D.5 - ISO 13485 Traceability (Clause 7.3.6)**

**Test ID:** 4CD-005  
**Requirement:** Every CAPA/DCR operation has complete traceability

| Requirement                            | Evidence                                   | Pass/Fail |
| -------------------------------------- | ------------------------------------------ | --------- |
| User identity captured                 | Audit log userId + userEmail               | ✓/✗       |
| Action timestamp (ISO 8601)            | Audit log timestamp field                  | ✓/✗       |
| What action taken                      | Audit log action field (CAPA_CREATE, etc.) | ✓/✗       |
| Result recorded (ID of created record) | Audit log resourceId field                 | ✓/✗       |
| Confirmation recorded (if required)    | Audit log AI_ACTION_CONFIRMED entry        | ✓/✗       |

**Acceptance:** All 5 fields present + auditable.

---

### **4C+D.6 - FDA 21 CFR Part 11 (Electronic Records)**

**Test ID:** 4CD-006  
**Requirement:** Electronic records authenticated + audit trail maintained

| Requirement                                       | Evidence                          | Pass/Fail |
| ------------------------------------------------- | --------------------------------- | --------- |
| User authentication (Google OAuth)                | NextAuth session + JWT            | ✓/✗       |
| System audit trail (all transactions logged)      | AuditLogger output                | ✓/✗       |
| Identification + signature (user email on action) | Audit log userId + userEmail      | ✓/✗       |
| Original record preserved                         | Audit log immutable (append-only) | ✓/✗       |

**Acceptance:** All 4 requirements demonstrated.

---

## Test Execution Summary

**Test Execution Dates:** [TBD - to be filled during Phase 5]

| Test ID | Feature                 | Status        | Notes |
| ------- | ----------------------- | ------------- | ----- |
| 4C-001  | Chat Initialization     | _PASS_/_FAIL_ |       |
| 4C-002  | Query Processing        | _PASS_/_FAIL_ |       |
| 4C-003  | Function Call Execution | _PASS_/_FAIL_ |       |
| 4C-004  | Confirmation (Approve)  | _PASS_/_FAIL_ |       |
| 4C-005  | Confirmation (Reject)   | _PASS_/_FAIL_ |       |
| 4C-006  | Citation Display        | _PASS_/_FAIL_ |       |
| 4C-007  | State Persistence       | _PASS_/_FAIL_ |       |
| 4C-008  | Field Auto-Population   | _PASS_/_FAIL_ |       |
| 4D-001  | OAuth Sign-In           | _PASS_/_FAIL_ |       |
| 4D-002  | RBAC Deny (Engineer)    | _PASS_/_FAIL_ |       |
| 4D-003  | RBAC Allow (QA)         | _PASS_/_FAIL_ |       |
| 4D-004  | Permission Matrix       | _PASS_/_FAIL_ |       |
| 4D-005  | Session Timeout         | _PASS_/_FAIL_ |       |
| 4D-006  | User Logout             | _PASS_/_FAIL_ |       |
| 4D-007  | Audit Log Events        | _PASS_/_FAIL_ |       |
| 4CD-001 | AI + RBAC Integration   | _PASS_/_FAIL_ |       |
| 4CD-002 | Audit Trail (E2E)       | _PASS_/_FAIL_ |       |
| 4CD-003 | Performance             | _PASS_/_FAIL_ |       |
| 4CD-004 | Audit Security          | _PASS_/_FAIL_ |       |
| 4CD-005 | ISO 13485 7.3.6         | _PASS_/_FAIL_ |       |
| 4CD-006 | FDA 21 CFR 11           | _PASS_/_FAIL_ |       |

**Overall Result:** _PASS_/_FAIL_

---

**Test Plan Created:** 2025-12-09  
**Version:** 1.0  
**Next Review:** Phase 5 Entry
