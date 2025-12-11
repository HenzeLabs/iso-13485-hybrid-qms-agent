# Phase 4C & 4D — Engineering & QA Signoff Checklist

**Release:** QMS Agent v1.0 Phase 4 Close-Out  
**Date:** December 9, 2025  
**Branch:** `feature/phase4-portal-ui`  
**Target Gate:** Phase 5 Entry

---

## Part 1: Engineering Sign-Off

### **Code Quality & Compilation**

| Task                                                                                                                 | Owner      | Status        | Notes                                      | Signature          |
| -------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- | ------------------------------------------ | ------------------ |
| ☐ All Phase 4C source files created (`function-calling.ts`, `conversation-state.ts`, `openai.ts`, `AIAssistant.tsx`) | [Eng Lead] | ✓ In Progress | Files created; pending integration testing | \_**\_/\_\_**/2025 |
| ☐ All Phase 4D source files created (`rbac.ts`, `audit.ts`, auth integrations)                                       | [Eng Lead] | ✓ In Progress | Files created; pending integration testing | \_**\_/\_\_**/2025 |
| ☐ TypeScript compilation passes (`npm run build`)                                                                    | [Eng Lead] | ⏳ Pending    | Must run after all edits finalized         | \_**\_/\_\_**/2025 |
| ☐ ESLint passes with zero errors (`npm run lint`)                                                                    | [Eng Lead] | ⏳ Pending    | No warnings allowed for Phase 4 files      | \_**\_/\_\_**/2025 |
| ☐ No console errors or warnings in browser DevTools                                                                  | [Eng Lead] | ⏳ Pending    | Validated during local testing             | \_**\_/\_\_**/2025 |
| ☐ Dependencies pinned to fixed versions (package.json)                                                               | [DevOps]   | ✓ Complete    | next-auth, openai, axios versioned         | \_**\_/\_\_**/2025 |

**Sign-Off:** Engineering Lead: ************\_************ Date: ******\_******

---

### **Unit Testing & Coverage**

| Component               | Test File                               | Coverage Target | Current | Status     | Owner |
| ----------------------- | --------------------------------------- | --------------- | ------- | ---------- | ----- |
| `function-calling.ts`   | `tests/ai/function-calling.test.ts`     | 80%+            | _TBD_   | ⏳ Pending | [QE]  |
| `conversation-state.ts` | `tests/ai/conversation-state.test.ts`   | 80%+            | _TBD_   | ⏳ Pending | [QE]  |
| `rbac.ts`               | `tests/auth/rbac.test.ts`               | 90%+            | _TBD_   | ⏳ Pending | [QE]  |
| `audit.ts`              | `tests/auth/audit.test.ts`              | 85%+            | _TBD_   | ⏳ Pending | [QE]  |
| `AIAssistant.tsx`       | `tests/components/AIAssistant.test.tsx` | 70%+            | _TBD_   | ⏳ Pending | [QE]  |

**Test Execution Command:**

```bash
npm run test -- --coverage --testPathPattern="(ai|auth|AIAssistant)"
```

**Sign-Off:** QA Engineer: ************\_************ Date: ******\_******

---

### **Code Review & Architecture**

| Aspect                                       | Reviewer      | Approved   | Comments                                                            | Date       |
| -------------------------------------------- | ------------- | ---------- | ------------------------------------------------------------------- | ---------- |
| **Phase 4C: Function-Calling Integration**   | [Sr Engineer] | ☐ Yes ☐ No | Function-calling.ts correctly wires LLM → Action Layer              | **/**/2025 |
| **Phase 4C: Conversation State Management**  | [Sr Engineer] | ☐ Yes ☐ No | localStorage persistence + rehydration correctly implemented        | **/**/2025 |
| **Phase 4C: Citations & Document Retrieval** | [Sr Engineer] | ☐ Yes ☐ No | Citation schema matches Action Layer response; UI rendering correct | **/**/2025 |
| **Phase 4D: RBAC Engine**                    | [Sr Engineer] | ☐ Yes ☐ No | Email→role mapping is deterministic; permission checks correct      | **/**/2025 |
| **Phase 4D: Audit Logger**                   | [Sr Engineer] | ☐ Yes ☐ No | AuditEvent schema complete; no PII leakage; immutable pattern       | **/**/2025 |
| **Phase 4D: Auth Integration**               | [Sr Engineer] | ☐ Yes ☐ No | NextAuth config correct; session + JWT lifecycle reviewed           | **/**/2025 |
| **Overall Architecture**                     | [Tech Lead]   | ☐ Yes ☐ No | Phase 4C/4D design aligns with ISO 13485 + FDA requirements         | **/**/2025 |

**Sign-Off:** Tech Lead: ************\_************ Date: ******\_******

---

### **Integration & Dependency Management**

| Task                                                                 | Owner      | Status     | Notes                                       |
| -------------------------------------------------------------------- | ---------- | ---------- | ------------------------------------------- |
| ☐ AI Assistant component integrates with LLMAssistant class          | [Eng]      | ✓ Complete | Tested locally; session ID generation works |
| ☐ Auth middleware chains correctly (NextAuth → RBAC → Audit)         | [Eng]      | ⏳ Pending | Integration test required                   |
| ☐ Action Layer APIs called correctly (executeFunction, getFunctions) | [Eng]      | ⏳ Pending | Mock endpoints created; real endpoints TBD  |
| ☐ BigQuery audit table schema matches AuditEvent interface           | [Data Eng] | ⏳ Pending | Table creation script needed                |
| ☐ Environment variables documented in .env.example                   | [Eng]      | ⏳ Pending | Template file created; values to be filled  |

**Sign-Off:** Integration Lead: ************\_************ Date: ******\_******

---

### **Security Review**

| Check                                                | Reviewer   | Passed     | Comments                                               |
| ---------------------------------------------------- | ---------- | ---------- | ------------------------------------------------------ |
| ☐ No hardcoded secrets in code (all in .env)         | [Security] | ☐ Yes ☐ No | Grep check for API keys, OAuth secrets                 |
| ☐ OAuth state parameter validated (NextAuth default) | [Security] | ☐ Yes ☐ No | CSRF protection enabled by default                     |
| ☐ JWT signature verified on all requests             | [Security] | ☐ Yes ☐ No | NextAuth middleware validates JWT                      |
| ☐ Audit logs do NOT contain PII/secrets              | [Security] | ☐ Yes ☐ No | Only userId, userEmail, role stored; no form data      |
| ☐ Session timeout enforced (8 hours max)             | [Security] | ☐ Yes ☐ No | NextAuth config: maxAge = 8*60*60                      |
| ☐ Password hashing not required (OAuth only)         | [Security] | ☐ Yes ☐ No | Google handles authentication; we handle authorization |
| ☐ HTTPS enforced in production                       | [Security] | ⏳ Pending | Deployment config review in Phase 5                    |

**Sign-Off:** Security Officer: ************\_************ Date: ******\_******

---

## Part 2: QA Sign-Off (Phase 5)

### **Functional Testing — Phase 4C (LLM Assistant)**

| Test Case                                   | Test ID | Expected                                                        | Actual | Pass/Fail | QA Lead | Date       |
| ------------------------------------------- | ------- | --------------------------------------------------------------- | ------ | --------- | ------- | ---------- |
| AI Assistant initializes with empty history | 4C-001  | Chat UI loads; session ID generated                             | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| User sends query; LLM responds              | 4C-002  | Message in chat; assistant response with function call          | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| CAPA proposal displayed                     | 4C-003  | Function call shows "create_capa" with parameters               | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| User confirms action                        | 4C-004  | CAPA created; audit log shows CAPA_CREATE + AI_ACTION_CONFIRMED | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| User rejects action                         | 4C-005  | Action cancelled; message says "Action cancelled"               | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| Citations displayed                         | 4C-006  | Citation panel visible with 3+ documents + clickable links      | _TBD_  | ☐/✗       | [QA]    | **/**/2025 |
| Conversation persists after reload          | 4C-007  | Page refresh; all messages + pending confirmations restored     | _TBD_  | ☐/✗       | [QA]    | **/**/2025 |
| Form field auto-population                  | 4C-008  | CAPA form pre-filled with assistant draft values                | _TBD_  | ☐/✗       | [QA]    | **/**/2025 |

**Phase 4C Result:** ☐ PASS ☐ FAIL | Blocker Issues: ****\_**** | QA Lead: ************\_************ Date: ******\_******

---

### **Functional Testing — Phase 4D (Auth + RBAC)**

| Test Case                                    | Test ID | Expected                                                                 | Actual | Pass/Fail | QA Lead | Date       |
| -------------------------------------------- | ------- | ------------------------------------------------------------------------ | ------ | --------- | ------- | ---------- |
| Google OAuth sign-in completes               | 4D-001  | User redirected to Google → back to portal with JWT                      | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| User role assigned correctly (Engineer)      | 4D-002  | Role = "Engineer"; permissions include dcr:create, dcr:view              | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| User role assigned correctly (QA)            | 4D-003  | Role = "QA"; permissions include capa:create, capa:approve               | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| RBAC denies Engineer from CAPA create        | 4D-004  | Engineer clicks "Create CAPA" → 403 Forbidden OR button hidden           | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| RBAC allows QA to create CAPA                | 4D-005  | QA clicks "Create CAPA" → form opens; submit succeeds                    | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| All 5 roles tested against permission matrix | 4D-006  | Engineer, QA, Manager, Admin, Production; all match expected permissions | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| Session timeout enforced (8 hours)           | 4D-007  | After 8 hours idle; next action redirects to sign-in                     | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| User logout clears session                   | 4D-008  | Click "Sign Out" → redirected to /auth/signin; JWT removed               | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |

**Phase 4D Result:** ☐ PASS ☐ FAIL | Blocker Issues: ****\_**** | QA Lead: ************\_************ Date: ******\_******

---

### **Audit & Compliance Testing**

| Test Case                                                                                       | Test ID | Expected                                                  | Actual | Pass/Fail | QA Lead | Date       |
| ----------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------- | ------ | --------- | ------- | ---------- |
| All auth events logged (USER_LOGIN, USER_LOGOUT, CAPA_CREATE, etc.)                             | 4D-007  | 8+ event types captured in audit log                      | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| Audit log contains required fields (timestamp, userId, userEmail, userRole, action, resourceId) | 4D-007  | All 6 fields present on every audit entry                 | _TBD_  | ☐/☐       | [QA]    | **/**/2025 |
| Audit log timestamps are ISO 8601                                                               | 4D-007  | Format: 2025-12-09T14:30:00Z (UTC)                        | _TBD_  | ☐/✗       | [QA]    | **/**/2025 |
| No PII in audit log                                                                             | 4D-007  | No form data, passwords, or secrets in metadata           | _TBD_  | ☐/✗       | [QA]    | **/**/2025 |
| AI actions traced end-to-end                                                                    | 4CD-002 | Audit chain: AI_QUERY → AI_ACTION_CONFIRMED → CAPA_CREATE | _TBD_  | ☐/✗       | [QA]    | **/**/2025 |
| ISO 13485 Clause 7.3.6 (Traceability) satisfied                                                 | 4CD-005 | User + timestamp + action + resource ID on every record   | _TBD_  | ☐/✗       | [QA]    | **/**/2025 |
| FDA 21 CFR Part 11 (Electronic Records) satisfied                                               | 4CD-006 | Authentication (OAuth) + audit trail + immutable records  | _TBD_  | ☐/✗       | [QA]    | **/**/2025 |

**Compliance Result:** ☐ PASS ☐ FAIL | Non-Conformances: ****\_**** | QA Lead: ************\_************ Date: ******\_******

---

### **Security & Performance Testing**

| Test Case                                               | Test ID | Requirement                      | Actual   | Pass/Fail | QA Lead | Date       |
| ------------------------------------------------------- | ------- | -------------------------------- | -------- | --------- | ------- | ---------- |
| AI chat response time < 3 seconds                       | 4CD-003 | User query → assistant response  | _TBD_ ms | ☐/✗       | [QA]    | **/**/2025 |
| API latency for /api/ai/chat < 2 seconds (excl. OpenAI) | 4CD-003 | Backend processing               | _TBD_ s  | ☐/✗       | [QA]    | **/**/2025 |
| No unhandled exceptions in console                      | 4CD-004 | Browser DevTools error count = 0 | _TBD_    | ☐/✗       | [QA]    | **/**/2025 |
| HTTPS enforced in production                            | TBD     | All traffic encrypted            | _TBD_    | ☐/✗       | [QA]    | **/**/2025 |

**Performance Result:** ☐ PASS ☐ FAIL | Issues: ****\_**** | QA Lead: ************\_************ Date: ******\_******

---

### **Documentation Verification**

| Document                        | Required | Complete   | Accuracy   | QA Lead | Date       |
| ------------------------------- | -------- | ---------- | ---------- | ------- | ---------- |
| PHASE4C-4D-CLOSEOUT.md          | ✓        | ☐ Yes ☐ No | ☐ Yes ☐ No | [QA]    | **/**/2025 |
| QA-VALIDATION-PHASE4C-4D.md     | ✓        | ☐ Yes ☐ No | ☐ Yes ☐ No | [QA]    | **/**/2025 |
| ISO-13485-ARTIFACTS-MANIFEST.md | ✓        | ☐ Yes ☐ No | ☐ Yes ☐ No | [QA]    | **/**/2025 |
| API Spec (OpenAPI 3.0)          | ✓        | ☐ Yes ☐ No | ☐ Yes ☐ No | [QA]    | **/**/2025 |
| README.md (OAuth setup)         | ✓        | ☐ Yes ☐ No | ☐ Yes ☐ No | [QA]    | **/**/2025 |

**QA Lead:** ************\_************ Date: ******\_******

---

## Part 3: Compliance & Quality Manager Sign-Off

### **Regulatory Readiness**

| Requirement                                 | ISO Clause    | Satisfied  | Evidence                               | QM Review               |
| ------------------------------------------- | ------------- | ---------- | -------------------------------------- | ----------------------- |
| User identity & access control              | 7.5.4.2       | ☐ Yes ☐ No | Google OAuth + RBAC                    | ☐ Approved ☐ Needs Work |
| Traceability (user + action + time)         | 7.3.6         | ☐ Yes ☐ No | Audit logger + timestamps              | ☐ Approved ☐ Needs Work |
| Automated system safety (confirmation)      | 7.5.4.3       | ☐ Yes ☐ No | Pending confirmation workflow          | ☐ Approved ☐ Needs Work |
| Electronic records (authentication + audit) | FDA 21 CFR 11 | ☐ Yes ☐ No | OAuth + immutable audit logs           | ☐ Approved ☐ Needs Work |
| Change control (approval roles)             | 8.5.2         | ☐ Yes ☐ No | QA approves CAPA; Manager approves DCR | ☐ Approved ☐ Needs Work |

**Quality Manager:** ************\_************ Date: ******\_******

---

### **Known Issues & Remediation Plan**

| Issue ID   | Description                                                            | Severity | Remediation                                                         | Owner     | Target Date | Status  |
| ---------- | ---------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- | --------- | ----------- | ------- |
| PHASE4-001 | [Example: Audit logger not wired to BigQuery]                          | HIGH     | Connect AuditLogger.log() to BigQuery insert                        | [DevOps]  | **/**/2025  | ⏳ Open |
| PHASE4-002 | [Example: AI function calls missing confirmation gate in Action Layer] | CRITICAL | Update Action Layer /action/execute to return confirmation_required | [Backend] | **/**/2025  | ⏳ Open |
| —          | —                                                                      | —        | —                                                                   | —         | —           | ⏳ —    |

**All Critical & High Issues Must Be Resolved Before Phase 5 Entry.**

---

## Part 4: Final Signoff

### **Approval Authority**

| Role                   | Name                   | Signature              | Date       | Approved   |
| ---------------------- | ---------------------- | ---------------------- | ---------- | ---------- |
| **Engineering Lead**   | **********\_********** | **********\_********** | **/**/2025 | ☐ Yes ☐ No |
| **QA Lead**            | **********\_********** | **********\_********** | **/**/2025 | ☐ Yes ☐ No |
| **Quality Manager**    | **********\_********** | **********\_********** | **/**/2025 | ☐ Yes ☐ No |
| **Compliance Officer** | **********\_********** | **********\_********** | **/**/2025 | ☐ Yes ☐ No |

---

## Phase 5 Entry Criteria Checklist

- ☐ All items in Part 1 (Engineering) signed off
- ☐ All items in Part 2 (QA) signed off
- ☐ All items in Part 3 (Compliance) approved
- ☐ All Critical & High issues resolved
- ☐ Code merged to `main` branch + tagged with `v1.0-phase4-rc1`
- ☐ Deployment artifacts created (Docker image, release package)
- ☐ Release notes updated (RELEASE-NOTES-v1.0-phase4.md)

**Phase 4 Close-Out Status:** ☐ READY FOR PHASE 5 ☐ BLOCKED

---

## Document Tracking

| Version | Date               | Author         | Change                                   |
| ------- | ------------------ | -------------- | ---------------------------------------- |
| 1.0     | 2025-12-09         | Engineering    | Initial signoff template for Phase 4C/4D |
| 2.0     | \_**\_/\_\_**/2025 | ******\_****** | [Updates after Phase 5 testing]          |

**Retention:** This signoff document must be retained for 7 years per FDA 21 CFR Part 11 & ISO 13485.

---

**End of Signoff Checklist**
