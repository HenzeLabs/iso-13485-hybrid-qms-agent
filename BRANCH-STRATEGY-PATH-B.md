# Branch Strategy: Path B (Parallel Regulated + Sandbox)

**Status:** ACTIVE  
**Decision Date:** December 10, 2025  
**Release Target:** v1.0.0 on Jan 7, 2026 (regulated path only)

---

## Branch Architecture

### 1. `feature/phase4-portal-ui` — FROZEN REGULATED PATH

- **Purpose:** ISO 13485 / FDA 21 CFR 11 compliant delivery
- **Status:** Pre-merge ready (SCMP cleanup complete)
- **Current Position:** Pre-merge checks passed locally → awaiting code review → merge to dev
- **Scope Lock:** NO new features after this commit
- **Validation:** Phase 5 validation protocol (25 test cases, 6 categories)
- **Release Target:** v1.0.0 (Jan 7, 2026)
- **Protection Rules:**
  - ✅ All SCMP blockers resolved
  - ✅ Pre-merge checks documented
  - ✅ No modifications except SCMP-required fixes
  - ✅ All commits have regulatory traceability
- **Next Steps:**
  1. User runs 4 commands locally (npm lint, build, audit, commit)
  2. Code review (24-48 hours)
  3. Merge to dev branch
  4. Create release/v1.0-full-system
  5. Deploy to staging
  6. Phase 5 validation (Dec 13-31)
  7. QA sign-off (Jan 1-7)
  8. Merge to main + tag v1.0.0

---

### 2. `sandbox/next-gen` — UNREGULATED INNOVATION PATH

- **Purpose:** Phase 6+ feature development, experimentation, architecture exploration
- **Status:** Freshly created, ready for development
- **Scope:** All new features, LLM enhancements, UI improvements, backend optimizations
- **Validation:** None (developer testing only, no regulatory approval)
- **Release Target:** v1.1+ (post-v1.0.0 release)
- **Protection Rules:**
  - ✅ Completely independent from feature/phase4-portal-ui
  - ✅ No cherry-picks into regulated branch
  - ✅ No dependencies on Phase 5 validation
  - ✅ Can be rebased/rewritten without compliance impact
  - ✅ Features staged here for future regulated releases
- **Feature Categories:**
  - Portal UI enhancements (dashboards, real-time widgets, dark mode, RBAC views)
  - LLM assistant capabilities (memory, multi-step reasoning, semantic search, auto-summarization, CAPA/DCR auto-drafting)
  - Backend infrastructure (batch ingestion, scheduled jobs, notifications, analytics)
  - AI agents (risk agent, audit agent, document agent, workflow agent, CAPA coaching)
  - Advanced workflows (predictive failure, auto-approval, LLM-driven compliance scoring)

---

## Guardrails (Non-Negotiable)

| Principle                         | Implication                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| **No cross-contamination**        | sandbox/next-gen commits NEVER merged into feature/phase4-portal-ui                    |
| **No scope expansion of Phase 5** | New features cannot be added to regulated validation packet                            |
| **No timeline slip**              | v1.0.0 release stays Jan 7; sandbox/next-gen features ship in v1.1+ only               |
| **Independent deployment**        | sandbox/next-gen features require separate verification before production use          |
| **Clear traceability**            | Regulated branch has requirement IDs; sandbox has design docs but no regulatory tie-in |

---

## Directory Structure

```
/qms-agent/

├── feature/phase4-portal-ui (git branch) ← FROZEN
│   ├── portal/src/                    (Next.js portal)
│   ├── device/src/                    (Python backend)
│   ├── documentation/DHF/             (Design history)
│   └── [validation docs]              (Phase 5 artifacts)
│
├── sandbox/next-gen/                  ← SANDBOX (local dev only)
│   ├── features/
│   │   ├── 01-portal-ui-enhancements/
│   │   ├── 02-llm-assistant-v2/
│   │   ├── 03-backend-infrastructure/
│   │   ├── 04-ai-agents/
│   │   └── 05-advanced-workflows/
│   │
│   ├── portal/                        (Portal experimentation)
│   │   ├── components-next/
│   │   ├── hooks-next/
│   │   └── ai-assistant-v2/
│   │
│   ├── backend/                       (Backend experimentation)
│   │   ├── agents/
│   │   ├── workflow-engine/
│   │   └── analytics/
│   │
│   └── docs/
│       ├── ARCHITECTURE-NEXT-GEN.md
│       ├── FEATURE-ROADMAP.md
│       └── DEVELOPMENT-NOTES.md
│
└── [regulated branch artifacts]       (v1.0.0 release path)
    ├── PHASE5-VALIDATION-PROTOCOL.md
    ├── PHASE5-TEST-EXECUTION-TRACKER.md
    └── etc.
```

---

## Workflow: How Features Move From Sandbox to Production

**Timeline:**

```
NOW (Dec 10)
  ├─ sandbox/next-gen created
  ├─ feature/phase4-portal-ui frozen
  └─ Parallel development begins

JAN 7
  ├─ v1.0.0 released (from feature/phase4-portal-ui → main)
  └─ sandbox/next-gen accumulates 3-4 weeks of new features

JAN 8-21 (v1.1 Planning)
  ├─ Select sandbox/next-gen features for v1.1
  ├─ Create formal requirements (from design docs)
  ├─ Plan verification & validation
  └─ Establish Phase 6 validation protocol

JAN 22-FEB 4 (v1.1 Development)
  ├─ Integrate selected features into new regulated branch
  ├─ Execute Phase 6 validation
  └─ Prepare v1.1 release package

FEB 5
  └─ v1.1 released (with sandbox features that passed validation)
```

---

## Features Staged for sandbox/next-gen (Phase 6+)

### Category 1: Portal UI Enhancements

- Real-time status widgets (CAPA status, DCR approvals, pending actions)
- CAPA management dashboard (visualization, filtering, bulk actions)
- DCR workflow UI (approval chains, notifications, version control)
- Timeline + activity feed (audit trail visualization)
- Role-based view customization (Supervisor vs. Manager vs. Engineer views)
- Dark mode toggle (accessibility, UX polish)

### Category 2: LLM Assistant v2.0

- **Memory:** Persistent conversation history (Redis or Firestore)
- **Multi-step reasoning:** Chain-of-thought prompting for complex CAPA analysis
- **Conversation context:** Full thread retrieval for coherent multi-turn interactions
- **Semantic search:** Vector embeddings for finding similar historical CAPAs
- **Auto-summarization:** Generate executive summaries from CAPA transcripts
- **Tool calling:** LLM directly invokes backend APIs (create CAPA, update DCR, fetch data)
- **CAPA/DCR auto-drafting:** LLM generates initial CAPA/DCR documents from chat
- **Smart suggestions:** Recommend actions based on conversation context

### Category 3: Backend Infrastructure

- **Batch CAPA ingestion:** Process 100+ CAPAs in parallel from CSV/API
- **Scheduled jobs:** Recurring tasks (data sync, report generation, alert monitoring)
- **Notifications:** Email, Slack, webhook delivery for CAPA updates
- **Analytics endpoints:** Metrics (CAPA resolution time, effectiveness, trends)
- **BigQuery materialized views:** Pre-computed analytics tables for dashboard performance

### Category 4: AI Agents (New Capability)

- **Risk Agent:** Analyzes CAPA effectiveness and predicts failure likelihood
- **Audit Agent:** Generates audit checklists and compliance reports
- **Document Agent:** Drafts regulatory documentation from CAPA data
- **Workflow Agent:** Orchestrates multi-step CAPA processes autonomously
- **CAPA Coaching Agent:** Provides real-time guidance during CAPA creation
- **Resolution Drafting Agent:** Generates technical resolution text from root cause analysis

### Category 5: Advanced Workflows

- **Generate CAPA from Chat:** LLM extracts structured CAPA from user conversation
- **Auto-approve low-risk DCRs:** ML classifier approves changes below risk threshold
- **Train LLM on historical CAPAs:** Fine-tune model on organization's past resolutions
- **Visual CAPA graphs:** Dependency maps, cause-and-effect visualization
- **LLM-driven compliance scoring:** Automated assessment of regulatory alignment

---

## Implementation Sequence (Recommended)

**Week 1 (Dec 10-16):** Foundation

1. Branch created ✅
2. Scaffold all feature directories
3. Create architecture docs (ARCHITECTURE-NEXT-GEN.md)
4. Set up development environment (separate package.json, backend config)

**Week 2-3 (Dec 17-30):** Rapid Prototyping

1. Portal UI enhancements (high-impact, low-dependency)
2. LLM assistant memory layer (foundation for multi-step reasoning)
3. Backend job scheduler skeleton

**Week 4+ (Jan 1-7):** Polish While v1.0.0 Validates

1. Semantic search indexing
2. AI agent architecture (framework selection)
3. Analytics endpoints
4. Integration testing between new components

---

## Validation Strategy: How sandbox/next-gen Becomes Production Code

**After v1.0.0 Release (Jan 8+):**

1. **Feature Review:** Which sandbox features align with business priorities?
2. **Requirements Extraction:** Convert design docs → formal requirements
3. **Traceability Mapping:** Link features to use cases and test plans
4. **Risk Assessment:** Determine validation rigor needed (full Phase 5 or lighter Phase 6)
5. **Verification Planning:** Design test cases for selected features
6. **Validation Execution:** Run tests in staging environment
7. **Regulatory Packaging:** Create version-specific DHF/DMR for v1.1
8. **Release:** Merge validated features into production branch

---

## Commit Convention for sandbox/next-gen

**Format:**

```
[SANDBOX] <category> - <feature description>

Example:
[SANDBOX] UI - Add real-time CAPA status widget
[SANDBOX] LLM - Implement conversation memory layer
[SANDBOX] BACKEND - Add scheduled job framework
[SANDBOX] AGENTS - Scaffold risk assessment agent
```

**Why:** Makes it immediately clear that commits are non-regulated, experimental, and not yet validated.

---

## Emergency Rollback

If critical issues are discovered in feature/phase4-portal-ui:

- ✅ Rollback is scoped to regulated branch only
- ✅ sandbox/next-gen is unaffected
- ✅ Parallel development can continue
- ✅ No impact to v1.0.0 release timeline

---

## Status Checkpoints

**Dec 10 (TODAY):** Branch created, directories structured ✅  
**Dec 16:** Architecture documented, dev environments ready  
**Jan 7:** v1.0.0 released; sandbox/next-gen has 3+ weeks of active features  
**Jan 8:** Feature selection for v1.1 begins  
**Feb 5:** v1.1 release with validated sandbox features

---

## Sign-Off

- **Regulated Path:** feature/phase4-portal-ui (Jan 7 v1.0.0 release)
- **Innovation Path:** sandbox/next-gen (v1.1+ development)
- **Timeline:** Both parallel; zero impact to v1.0.0
- **Protection:** Complete branch isolation; no cross-contamination

**Path B is now active.**
