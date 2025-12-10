# sandbox/next-gen Development Log

**Branch:** sandbox/next-gen  
**Created:** December 10, 2025  
**Status:** ACTIVE

---

## Development Phases

### Phase 1: Foundation Setup (Dec 10-16)

- [ ] Directory structure created ✅
- [ ] Architecture documentation (ARCHITECTURE-NEXT-GEN.md) ✅
- [ ] Development environment configured
- [ ] Stub modules created (no implementation yet)
- [ ] Feature tracking spreadsheet initialized
- [ ] CI/CD pipeline configured (separate from v1.0.0)

### Phase 2: Core Prototyping (Dec 17-30)

- [ ] Memory system (conversation persistence)
- [ ] Batch ingestion (CAPA/DCR imports)
- [ ] Job scheduler (APScheduler integration)
- [ ] Notification system (email/Slack handlers)
- [ ] Analytics API skeleton

### Phase 3: Integration & Polish (Jan 1-7)

- [ ] Integration tests with v1.0.0 backend
- [ ] Semantic search indexing
- [ ] AI agents framework
- [ ] UI component library expansion
- [ ] Performance optimization

### Phase 4: Feature Selection (Jan 8+)

- [ ] Review completed features
- [ ] Select candidates for v1.1 validation
- [ ] Plan Phase 6 validation protocol
- [ ] Prepare feature documentation for regulatory phase

---

## Features in Development

### 1. Portal UI Enhancements

**Status:** Design phase  
**Lead:** TBD  
**Estimated Effort:** 3 weeks  
**Priority:** High (user-facing, high-impact)

**Components:**

- [ ] Real-time status widgets (CAPA/DCR)
- [ ] Comprehensive dashboards (CAPA, DCR, Risk)
- [ ] Timeline/activity feed visualization
- [ ] Dark mode toggle + theme system
- [ ] Role-based view customization

**Dependencies:** None (independent from LLM)

**Notes:**

- Builds on existing Tailwind + React foundation
- No backend changes required for initial version
- Can iterate fast; UI testing only

---

### 2. LLM Assistant v2.0 (Memory & Multi-Step Reasoning)

**Status:** Architecture phase  
**Lead:** TBD  
**Estimated Effort:** 4 weeks  
**Priority:** High (core to v1.1 value)

**Components:**

- [ ] Conversation memory system (Redis/Firestore)
- [ ] Semantic search for past conversations
- [ ] Multi-step reasoning engine
- [ ] Tool calling v2.0 (direct CAPA/DCR updates)
- [ ] Auto-drafting engines (CAPA, resolution, etc.)
- [ ] Context injection pipeline

**Dependencies:**

- Memory backend (Redis or Firestore)
- Embedding model (OpenAI ada)
- Existing OpenAI client

**Notes:**

- Backward compatible with v1.0.0 LLM interface
- Can be staged behind feature flag
- Memory queries must be optimized for latency

---

### 3. Backend Infrastructure

**Status:** Planning phase  
**Lead:** TBD  
**Estimated Effort:** 3 weeks  
**Priority:** Medium (enables automation)

**Components:**

- [ ] Job scheduler (daily/weekly tasks)
- [ ] Notification engine (email, Slack, webhook)
- [ ] Batch CAPA/DCR ingestion
- [ ] Analytics endpoints
- [ ] BigQuery materialized views

**Dependencies:**

- APScheduler or Celery
- SMTP/Slack webhook config
- BigQuery SQL expertise

**Notes:**

- Critical for automation roadmap
- Scheduler must be resilient (error handling, retries)
- Notifications need template system

---

### 4. AI Agents Framework

**Status:** Design phase  
**Lead:** TBD  
**Estimated Effort:** 4 weeks  
**Priority:** High (core future capability)

**Components:**

- [ ] Agent base class (abstract framework)
- [ ] Risk assessment agent
- [ ] Audit agent
- [ ] Document generation agent
- [ ] Workflow orchestration agent
- [ ] CAPA coaching agent
- [ ] Resolution drafting agent

**Dependencies:**

- LLM memory system (from Feature 2)
- Backend infrastructure (from Feature 3)
- Tool ecosystem

**Notes:**

- Agents share common framework (DRY)
- Each agent has own knowledge base
- Agents can call each other (orchestration)

---

### 5. Advanced Workflows

**Status:** Deferred (pending core features)  
**Lead:** TBD  
**Estimated Effort:** 2-3 weeks each  
**Priority:** Medium (nice-to-have for v1.1)

**Components:**

- [ ] Auto-approval system (ML classifier)
- [ ] LLM fine-tuning pipeline
- [ ] Visual CAPA graphs (D3.js)
- [ ] Compliance scoring system

**Dependencies:**

- Features 2, 3, 4 (all core features)
- ML libraries (Scikit-learn/PyTorch)
- Visualization library (D3.js)

**Notes:**

- Built on top of agents
- Most experimental; good candidates for learning
- Can be iterated independently once core is stable

---

## Code Organization

```
sandbox/next-gen/
├── features/
│   ├── 01-portal-ui-enhancements/
│   │   ├── DESIGN.md
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── tests/
│   │   └── IMPLEMENTATION-NOTES.md
│   ├── 02-llm-assistant-v2/
│   │   ├── DESIGN.md
│   │   ├── backend/
│   │   ├── portal/
│   │   ├── tests/
│   │   └── INTEGRATION-CHECKLIST.md
│   ├── 03-backend-infrastructure/
│   ├── 04-ai-agents/
│   └── 05-advanced-workflows/
├── portal/
│   ├── components-next/
│   ├── hooks-next/
│   ├── stores-next/
│   └── lib-next/
├── backend/
│   ├── ai/
│   ├── jobs/
│   ├── notifications/
│   ├── batch/
│   ├── analytics/
│   ├── agents/
│   ├── ml/
│   ├── compliance/
│   └── tests/
├── docs/
│   ├── ARCHITECTURE-NEXT-GEN.md ✅
│   ├── DEVELOPMENT-LOG.md ✅ (this file)
│   └── FEATURE-ROADMAP.md
└── .sandbox-env                    (separate from v1.0.0 .env)
```

---

## Git Workflow

**Commit Convention:**

```
[SANDBOX] <category> - <description>

Examples:
[SANDBOX] PORTAL - Add real-time status widget
[SANDBOX] LLM - Implement conversation memory
[SANDBOX] BACKEND - Add email notification handler
[SANDBOX] AGENTS - Scaffold risk assessment agent
```

**Branch Protection:**

- ✅ sandbox/next-gen is independent (no merges to feature/phase4-portal-ui)
- ✅ Can rebase/force-push without approval (experimental branch)
- ✅ No automatic CI/CD gating (developer testing only)

---

## Testing & Quality Assurance

**Testing Levels:**

| Level       | Scope                             | Tools                  | Required?            |
| ----------- | --------------------------------- | ---------------------- | -------------------- |
| Unit        | Individual functions/classes      | pytest, Jest           | ✅ Yes (confidence)  |
| Integration | Feature + v1.0.0 backend          | pytest, manual testing | ✅ Yes (viability)   |
| End-to-End  | Full workflow (UI → backend → DB) | Selenium/Playwright    | ⏳ When ready        |
| Validation  | Formal verification               | TBD (Phase 6)          | ❌ No (post-release) |

**Testing Strategy:**

- Unit tests added as each component completed
- Integration tests when feature is feature-complete
- E2E tests optional (not required for sandbox)
- NO validation/compliance testing (that comes Phase 6)

---

## Performance & Scalability Considerations

### Memory System

- Conversation retrieval must be <100ms
- Semantic search with embeddings (batched for efficiency)
- Archive old conversations monthly

### Job Scheduler

- Handle 100+ jobs/day without bottlenecking main API
- Retry logic with exponential backoff
- Failure alerting (email on job failure)

### Analytics API

- Materialized views for fast dashboard queries
- Cache computed metrics (update daily)
- Support 1000+ concurrent dashboard users

### AI Agents

- Agent memory must not bloat (cleanup strategy)
- Tool calls must be atomic (idempotent)
- Agent orchestration must handle failures gracefully

---

## Integration Points with v1.0.0

**Read-Only Access (Safe):**

- BigQuery tables (CAPA, DCR, audit logs)
- OAuth user context
- Existing API endpoints

**Controlled Mutation (With Care):**

- Creating new CAPAs (via tool calling)
- Updating CAPA status
- Creating notifications

**Off-Limits (Never Touch):**

- Phase 5 validation artifacts
- Regulatory documentation
- Signed commits / release tags

---

## Known Constraints & Risks

| Constraint                         | Mitigation                                               |
| ---------------------------------- | -------------------------------------------------------- |
| Memory system latency              | Use async/await; cache frequently accessed items         |
| BigQuery costs (new queries)       | Use materialized views; batch queries                    |
| OpenAI API costs (fine-tuning)     | Careful experimentation; monitor usage                   |
| Agent hallucination (LLM)          | Add guardrails; human-in-the-loop for critical decisions |
| Code drift (diverging from v1.0.0) | Regular rebase against dev; shared utilities             |

---

## Success Metrics

By Jan 7 (v1.0.0 release):

- ✅ 2-3 core features (Portal UI, LLM v2, Backend Infrastructure) prototyped
- ✅ Integration tested with v1.0.0 backend
- ✅ >80% unit test coverage
- ✅ Zero production blocking issues

By Feb 5 (v1.1 release):

- ✅ Selected features validated (Phase 6 protocol)
- ✅ Formal requirements documented
- ✅ All validation tests passing
- ✅ v1.1 released to production

---

## Next Steps

1. **TODAY (Dec 10):** Create development environment
2. **This Week:** Stub out all feature modules
3. **Next Week:** Start prototyping Portal UI (highest impact, lowest risk)
4. **Late Dec:** Begin LLM v2.0 memory system
5. **Early Jan:** Integration testing; v1.0.0 validation proceeds in parallel

---

## Status Updates

**Dec 10, 2025:**

- ✅ sandbox/next-gen branch strategy defined
- ✅ Architecture documentation complete
- ✅ Development log created
- ⏳ Next: Configure local dev environment
