# ISO 13485 Artifacts Manifest — Phase 4C & 4D

**Release:** QMS Agent v1.0 Phase 4 Close-Out  
**Date:** December 9, 2025  
**Classification:** REGULATORY EVIDENCE  
**Retention Period:** 7 years (per FDA CFR Part 11)

---

## Purpose

This manifest enumerates all source code, configuration, and documentation artifacts created or modified during Phase 4C (LLM Assistant Integration) and Phase 4D (Authentication & RBAC). These artifacts must be version-controlled, archived, and available for regulatory audit and validation.

---

## Phase 4C Artifacts (LLM Assistant Integration)

### **Source Code Files**

| File Path                               | Purpose                                                                               | ISO 13485 Clause            | Audit Trail                          | Status      |
| --------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------ | ----------- |
| `portal/src/ai/function-calling.ts`     | Function-call handler; bridges LLM → Action Layer; CAPA/DCR proposal helpers          | 7.5.4.3 (Automated Systems) | Git commit hash; file version        | ✅ NEW      |
| `portal/src/ai/conversation-state.ts`   | Session persistence manager; tracks pending actions; manages multi-step workflows     | 7.3.6 (Traceability)        | Git commit hash; localStorage backup | ✅ NEW      |
| `portal/src/lib/openai.ts`              | LLM runtime wrapper; OpenAI API integration; session management; citation propagation | 7.5.4.3 (Automated Systems) | Git commit hash; API versioning      | ✅ MODIFIED |
| `portal/src/components/AIAssistant.tsx` | React component; chat UI; pending confirmation workflow; citation display             | 7.5.4.3 (Automated Systems) | Git commit hash; component version   | ✅ MODIFIED |

### **Configuration Files**

| File Path                                | Purpose                                 | Sensitive              | Versioning                               |
| ---------------------------------------- | --------------------------------------- | ---------------------- | ---------------------------------------- |
| `portal/.env` (template: `.env.example`) | OpenAI API key placeholder              | YES - secrets via .env | Exclude from repo; document requirements |
| `portal/package.json`                    | Dependencies (openai, axios, next-auth) | NO                     | Locked versions required                 |

### **Test Artifacts**

| File Path                                           | Purpose                              | Coverage              |
| --------------------------------------------------- | ------------------------------------ | --------------------- |
| TBD: `portal/tests/ai/function-calling.test.ts`     | Unit tests for function-call handler | Target: 80%+ coverage |
| TBD: `portal/tests/ai/conversation-state.test.ts`   | Unit tests for session persistence   | Target: 80%+ coverage |
| TBD: `portal/tests/components/AIAssistant.test.tsx` | React component tests                | Target: 70%+ coverage |

---

## Phase 4D Artifacts (Authentication & RBAC)

### **Source Code Files**

| File Path                                        | Purpose                                                          | ISO 13485 Clause                    | Audit Trail                          | Status      |
| ------------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------- | ------------------------------------ | ----------- |
| `portal/src/lib/auth/rbac.ts`                    | RBAC engine; email→role mapping; permission resolution           | 7.5.4.2 (User Access Control)       | Git commit hash; role definitions    | ✅ NEW      |
| `portal/src/lib/auth/audit.ts`                   | Audit logger interface; AuditEvent schema                        | 7.3.6 (Traceability); FDA 21 CFR 11 | Git commit hash; schema versioning   | ✅ NEW      |
| `portal/src/lib/auth.ts`                         | Auth integration; OAuth callback handlers; audit event routing   | 7.5.4.2 (User Access Control)       | Git commit hash; callback versioning | ✅ MODIFIED |
| `portal/src/lib/auth-config.ts`                  | NextAuth configuration; Google provider setup                    | 7.5.4.2 (User Access Control)       | Git commit hash; provider versioning | ✅ EXISTING |
| `portal/src/app/api/auth/[...nextauth]/route.ts` | NextAuth route handler                                           | 7.5.4.2 (User Access Control)       | Git commit hash; route versioning    | ✅ EXISTING |
| `portal/src/types/index.ts`                      | User, Role, Permission type definitions; UserRole union expanded | 7.5.4.2 (User Access Control)       | Git commit hash; schema versioning   | ✅ MODIFIED |

### **Configuration Files**

| File Path                                | Purpose                                             | Sensitive              | Versioning                               |
| ---------------------------------------- | --------------------------------------------------- | ---------------------- | ---------------------------------------- |
| `portal/.env` (template: `.env.example`) | GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, QMS_API_URL | YES - secrets via .env | Exclude from repo; document requirements |
| `portal/package.json`                    | Dependencies (next-auth, openai, axios)             | NO                     | Locked versions required                 |
| `portal/tsconfig.json`                   | TypeScript compiler config                          | NO                     | Versioned in repo                        |

### **Test Artifacts**

| File Path                                         | Purpose                     | Coverage              |
| ------------------------------------------------- | --------------------------- | --------------------- |
| TBD: `portal/tests/auth/rbac.test.ts`             | Unit tests for RBAC logic   | Target: 90%+ coverage |
| TBD: `portal/tests/auth/audit.test.ts`            | Unit tests for audit logger | Target: 85%+ coverage |
| TBD: `portal/tests/auth/auth-integration.test.ts` | Auth flow end-to-end tests  | Target: 80%+ coverage |

---

## Documentation Artifacts

### **Close-Out & Validation Documentation**

| File Path                         | Purpose                                                                    | Audience                    | Update Frequency          |
| --------------------------------- | -------------------------------------------------------------------------- | --------------------------- | ------------------------- |
| `PHASE4C-4D-CLOSEOUT.md`          | Phase 4 close-out summary; features, validation mapping, signoff checklist | Engineering, QA, Compliance | Final after Phase 5       |
| `QA-VALIDATION-PHASE4C-4D.md`     | Detailed test plan with inputs/outputs/pass criteria                       | QA Team                     | Final after Phase 5       |
| `ISO-13485-ARTIFACTS-MANIFEST.md` | This file; artifact registry for audit                                     | Compliance, Auditors        | Updated with each release |
| `README.md` (portal root)         | Portal setup, OAuth configuration, environment variables                   | Developers, DevOps          | Ongoing                   |

### **API & Integration Documentation**

| File Path                                | Purpose                                                                              | Format                     | Update Frequency       |
| ---------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------- | ---------------------- |
| TBD: `portal/docs/API-SPEC-PHASE4.md`    | OpenAPI 3.0 spec for `/api/ai/chat`, `/api/ai/confirm-action`, `/api/auth/user-role` | Markdown + Swagger/OpenAPI | Final before Phase 5   |
| TBD: `device/src/system_instructions.md` | Action Layer integration notes; function schema expectations                         | Markdown                   | Updated as APIs change |

---

## Deployment & Release Artifacts

### **Version Control**

| Artifact                | Location                                            | Format   | Git Tag                                        |
| ----------------------- | --------------------------------------------------- | -------- | ---------------------------------------------- |
| **Phase 4 Release Tag** | Repository root                                     | Git tag  | `v1.0-phase4-rc1` (release candidate)          |
| **Commit History**      | `.git/logs`                                         | Git log  | Immutable; includes author, timestamp, message |
| **Change Log**          | `RELEASE-NOTES-v1.0-phase2.md` (extend for Phase 4) | Markdown | Document per release                           |

### **Build & Container Artifacts**

| Artifact                | Location                                    | Retention | Purpose                                    |
| ----------------------- | ------------------------------------------- | --------- | ------------------------------------------ |
| **Portal Docker Image** | gcr.io/qms-agent-project/portal:v1.0-phase4 | 7 years   | Production deployment; traceable to source |
| **Lint/Test Report**    | CI/CD pipeline output (GitHub Actions)      | 7 years   | Evidence of code quality checks            |
| **Build Log**           | CI/CD pipeline output                       | 7 years   | Traceability; audit trail                  |

---

## Data & Audit Artifacts

### **Audit Log Storage**

| Artifact                 | Location                                           | Schema                                                                                          | Retention                  |
| ------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------- |
| **Audit Events**         | BigQuery table: `qms_audit.events` (to be created) | AuditEvent interface (ISO timestamp, userId, userEmail, userRole, action, resourceId, metadata) | 7 years (FDA requirement)  |
| **Session Logs**         | BigQuery table: `qms_audit.sessions`               | userId, sessionId, loginTime, logoutTime, ipAddress, userAgent                                  | 1 year minimum             |
| **AI Conversation Logs** | BigQuery table: `qms_audit.ai_conversations`       | sessionId, userId, message, timestamp, functionCall, citations                                  | 7 years (quality evidence) |

**Note:** Audit logs must be immutable (append-only) and time-synchronized (NTP).

---

## Regulatory Compliance Mapping

### **ISO 13485:2016 Coverage**

| Clause      | Requirement                                                           | Phase 4C/4D Artifact                       | Evidence                              |
| ----------- | --------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------- |
| **7.3.6**   | Traceability — maintain links between need and delivered requirements | `conversation-state.ts`, `audit.ts`        | User ID + timestamp on every action   |
| **7.5.4.2** | User access control — authentication + authorization                  | `rbac.ts`, `auth.ts`, `auth-config.ts`     | Google OAuth + role-based permissions |
| **7.5.4.3** | Automated software — safety & validation                              | `function-calling.ts`, `AIAssistant.tsx`   | Confirmation workflow; cite sources   |
| **7.5.5**   | Software integrity — ensure software not altered maliciously          | TypeScript compilation, ESLint, unit tests | Automated checks on every commit      |

### **FDA 21 CFR Part 11 Coverage**

| Requirement               | Phase 4D Artifact     | Evidence                                 |
| ------------------------- | --------------------- | ---------------------------------------- |
| **Electronic Signatures** | Google OAuth + JWT    | User authentication via trusted provider |
| **Audit Trail**           | `audit.ts` + BigQuery | Immutable log of all transactions        |
| **Identification**        | `rbac.ts`             | User email + role on every action        |
| **Record Retention**      | BigQuery audit table  | 7-year retention policy                  |

---

## Artifact Sign-Off & Approval

### **Engineering Sign-Off**

| Component         | Lead            | Date   | Approved   |
| ----------------- | --------------- | ------ | ---------- |
| AI Assistant (4C) | [Engineer Name] | [Date] | ☐ Yes ☐ No |
| Auth + RBAC (4D)  | [Engineer Name] | [Date] | ☐ Yes ☐ No |
| Documentation     | [Engineer Name] | [Date] | ☐ Yes ☐ No |

### **QA Sign-Off**

| Test Area                    | Lead      | Date   | Approved   |
| ---------------------------- | --------- | ------ | ---------- |
| AI Assistant Validation (4C) | [QA Lead] | [Date] | ☐ Yes ☐ No |
| Auth + RBAC Validation (4D)  | [QA Lead] | [Date] | ☐ Yes ☐ No |
| Security & Compliance        | [QA Lead] | [Date] | ☐ Yes ☐ No |

### **Compliance Review**

| Role               | Name         | Date   | Approved   |
| ------------------ | ------------ | ------ | ---------- |
| Quality Manager    | [Manager]    | [Date] | ☐ Yes ☐ No |
| Regulatory Affairs | [Specialist] | [Date] | ☐ Yes ☐ No |

---

## Critical Artifact Dependencies

```
┌────────────────────────────────────────────────────────────┐
│                    Phase 4 Artifacts                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │          LLM Assistant (4C)                          │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ function-calling.ts                          │   │ │
│  │  │ → depends on: ActionAPI, AuditLogger         │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ conversation-state.ts                        │   │ │
│  │  │ → stores: messages, pendingActions, audit    │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ openai.ts                                    │   │ │
│  │  │ → integrates: OpenAI API, ActionAPI          │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────┘ │
│                           ▼                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        Auth + RBAC (4D)                              │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ rbac.ts                                      │   │ │
│  │  │ → enforces: permissions, role-based access  │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ audit.ts                                     │   │ │
│  │  │ → logs: AuditEvent (userId, action, etc.)   │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ auth.ts, auth-config.ts                      │   │ │
│  │  │ → manages: OAuth, JWT, role assignment       │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────┘ │
│                           ▼                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        Type Definitions & Integration                │ │
│  │  ┌──────────────────────────────────────────────┐   │ │
│  │  │ types/index.ts                               │   │ │
│  │  │ → User, Role, Permission, AuditEvent, etc.  │   │ │
│  │  └──────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Release Package Contents

**Package Name:** `qms-agent-v1.0-phase4-release.zip`

```
qms-agent-v1.0-phase4-release/
├── source-code/
│   ├── portal/src/ai/
│   ├── portal/src/lib/auth/
│   ├── portal/src/lib/openai.ts
│   ├── portal/src/components/AIAssistant.tsx
│   ├── portal/src/types/index.ts
│   └── portal/.env.example
├── documentation/
│   ├── PHASE4C-4D-CLOSEOUT.md
│   ├── QA-VALIDATION-PHASE4C-4D.md
│   ├── ISO-13485-ARTIFACTS-MANIFEST.md (this file)
│   └── API-SPEC-PHASE4.md (OpenAPI)
├── tests/
│   ├── portal/tests/ai/
│   ├── portal/tests/auth/
│   └── coverage-report.html
├── deployment/
│   ├── Dockerfile (portal)
│   ├── docker-compose.yml
│   └── deployment-checklist.md
└── audit/
    └── git-log-phase4.txt (immutable commit history)
```

---

## Retention & Archive Policy

### **Long-Term Storage**

- **Duration:** 7 years (FDA 21 CFR Part 11 requirement)
- **Format:** Version control (Git) + artifact repository (S3/GCS)
- **Access:** Read-only for auditors; backup copies in geographically distributed locations
- **Integrity:** SHA-256 checksums; immutable snapshots

### **End-of-Life Disposal**

After 7 years, artifacts may be archived to cold storage or securely destroyed with documented approval from Quality & Compliance.

---

## Checklist for Phase 4 Close-Out

- ☐ All source files committed to `feature/phase4-portal-ui` branch
- ☐ Git tags created: `v1.0-phase4-rc1` (release candidate)
- ☐ Code review completed (Engineering sign-off)
- ☐ Unit tests written and passing (80%+ coverage on new files)
- ☐ TypeScript compilation successful
- ☐ ESLint passing (no warnings)
- ☐ `.env.example` created with required variables documented
- ☐ API spec (OpenAPI 3.0) finalized and added to docs/
- ☐ QA validation test plan executed (all tests pass)
- ☐ Audit logger wired to BigQuery (or staging equivalent)
- ☐ Documentation complete (close-out, test plan, this manifest)
- ☐ QA sign-off checklist completed
- ☐ Compliance review approved
- ☐ Release notes updated
- ☐ Deployment package created + uploaded to artifact repository

---

**Document Version:** 1.0  
**Date Created:** December 9, 2025  
**Last Updated:** TBD (after Phase 5)  
**Classification:** REGULATORY EVIDENCE — CONFIDENTIAL
