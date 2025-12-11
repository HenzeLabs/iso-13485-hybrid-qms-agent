# sandbox/next-gen Architecture

**Branch:** sandbox/next-gen (unregulated development)  
**Status:** Active  
**Created:** December 10, 2025  
**Phase Target:** v1.1+ (post-v1.0.0)

---

## Design Principles

1. **No regulatory overhead** — Experiments, quick iterations, bold refactors allowed
2. **Maximum leverage of existing architecture** — Build on v1.0.0 foundation, don't duplicate
3. **Production-ready when needed** — Code is exploratory but structured; can be validated & released
4. **Independent validation path** — Features validated separately before being merged into regulated releases
5. **Parallel with v1.0.0** — Development continues while Phase 5 validation runs; zero impact to release timeline

---

## System Layers

### Layer 1: Frontend (Portal Next.js)

**Current State (v1.0.0):**

- Single-page authentication flow
- Basic CAPA/DCR list views
- LLM chat assistant (simple conversation)
- OAuth 2.0 + RBAC

**Next-Gen Enhancements (sandbox/next-gen):**

#### UI/UX Component Library

```
portal/components-next/
├── Widgets/
│   ├── StatusWidget.tsx            (real-time CAPA/DCR status)
│   ├── TimelineWidget.tsx           (activity feed, audit trail)
│   └── MetricsWidget.tsx            (dashboards, KPIs)
├── Dashboards/
│   ├── CADADashboard.tsx            (CAPA mgmt hub)
│   ├── DCRDashboard.tsx             (change request hub)
│   └── RiskDashboard.tsx            (risk scoring, trends)
├── LLMAssistant/
│   ├── ConversationPanel.tsx        (multi-turn with context)
│   ├── MemoryDisplay.tsx            (show conversation history)
│   └── SuggestionCard.tsx           (AI-generated recommendations)
└── Theme/
    ├── DarkModeToggle.tsx           (theme switcher)
    └── AccessibilityPanel.tsx       (WCAG compliance)
```

#### Advanced Hooks

```
portal/hooks-next/
├── useConversationMemory.ts         (persist chat history)
├── useSemanticSearch.ts             (find similar CAPAs)
├── useRealtimeUpdates.ts            (WebSocket subscriptions)
├── useLLMSuggestions.ts             (auto-generated recommendations)
└── useRoleBasedUI.ts                (dynamic view customization)
```

#### State Management (Zustand)

```
portal/stores-next/
├── conversationStore.ts             (LLM conversation state)
├── dashboardStore.ts                (widget state, filters)
├── notificationStore.ts             (real-time alerts)
└── themeStore.ts                    (dark mode, accessibility)
```

---

### Layer 2: LLM Assistant v2.0 (AI Core)

**Current State (v1.0.0):**

- Simple function calling
- Single-turn context (no memory)
- OpenAI API wrapper
- CAPA/DCR entity extraction

**Next-Gen Architecture (sandbox/next-gen):**

#### Memory System

```
backend/ai/memory/
├── ConversationMemory.py            (Redis/Firestore backend)
├── MemoryRetrieval.py               (semantic + keyword search)
├── MemoryCompression.py             (summarize old conversations)
└── ContextInjection.py              (inject memory into prompts)
```

**Behavior:**

- Every chat turn stored (user message + AI response)
- On new turn: retrieve relevant past messages (semantic search)
- Compress conversations older than 7 days
- Inject context into system prompt for coherence

#### Multi-Step Reasoning

```
backend/ai/reasoning/
├── ChainOfThought.py                (step-by-step prompting)
├── ReflectionLoop.py                (critique + revise)
├── PlanningAgent.py                 (decompose complex tasks)
└── ToolOrchestrator.py              (coordinate tool calls)
```

**Behavior:**

- Complex queries trigger multi-step reasoning
- LLM generates plan → executes steps → reflects on results
- Each step can invoke backend tools (create CAPA, fetch data, etc.)
- Final response synthesizes all steps

#### Tool Calling v2.0

```
backend/ai/tools/
├── CAPATools.py                     (create, update, analyze CAPA)
├── DCRTools.py                      (manage change requests)
├── DataTools.py                     (query BigQuery, fetch history)
├── AnalysisTools.py                 (risk scoring, compliance check)
└── NotificationTools.py             (send alerts, create tasks)
```

**New Capabilities:**

- LLM directly updates CAPA status (with guardrails)
- Create CAPA document from chat transcript
- Generate DCR summary
- Auto-calculate risk scores
- Trigger notifications based on conversation context

#### Auto-Drafting Engines

```
backend/ai/autogen/
├── CAPADrafter.py                   (generate CAPA structure)
├── ResolutionDrafter.py             (write technical resolution)
├── RootCauseDrafter.py              (analyze root causes)
└── EffectivenessPlanner.py          (plan verification steps)
```

**Behavior:**

- User describes issue in chat
- LLM extracts key data
- Drafting engine generates CAPA document
- User refines in UI; LLM learns from feedback

---

### Layer 3: Backend Infrastructure

**Current State (v1.0.0):**

- FastAPI app (agent_logic, bigquery_client)
- BigQuery append-only audit log
- OAuth + RBAC middleware
- Simple CAPA/DCR CRUD

**Next-Gen Enhancements (sandbox/next-gen):**

#### Job Scheduling System

```
backend/jobs/
├── ScheduledJobRunner.py            (APScheduler or Celery)
├── jobs/
│   ├── daily_metrics_compute.py      (aggregate analytics)
│   ├── weekly_report_generate.py     (email summaries)
│   ├── capa_effectiveness_review.py  (auto-scoring)
│   └── risk_trend_analysis.py        (ML pipeline)
└── storage/
    ├── JobResultsDB.py              (store job outputs)
    └── JobHistory.py                (audit trail)
```

#### Notification System

```
backend/notifications/
├── NotificationEngine.py            (route alerts)
├── handlers/
│   ├── EmailHandler.py              (SMTP)
│   ├── SlackHandler.py              (webhook)
│   └── WebhookHandler.py            (custom endpoints)
├── templates/
│   ├── capa_created.txt             (templated messages)
│   ├── dcr_approved.txt
│   └── risk_alert.txt
└── preferences/
    ├── UserPreferences.py           (notification opt-in/out)
    └── NotificationRules.py         (when to alert)
```

#### Batch Processing

```
backend/batch/
├── CADABatchIngestion.py            (import 100+ CAPAs from CSV)
├── DCRBatchProcessor.py             (bulk change requests)
├── DataValidation.py                (integrity checks)
└── ErrorRecovery.py                 (retry + fallback)
```

#### Analytics Layer

```
backend/analytics/
├── AnalyticsAPI.py                  (GET /api/analytics/*)
├── endpoints/
│   ├── capa_metrics.py              (resolution time, effectiveness)
│   ├── risk_trends.py               (risk by category, trend)
│   ├── workflow_efficiency.py       (approval times, bottlenecks)
│   └── ai_agent_performance.py      (LLM quality, suggestion accuracy)
└── materialized_views/
    ├── capa_resolution_stats.sql     (BigQuery view)
    ├── risk_distribution.sql
    └── agent_effectiveness.sql
```

---

### Layer 4: AI Agents (New System)

**Architecture:**

```
backend/agents/
├── AgentBase.py                     (abstract agent framework)
├── agents/
│   ├── RiskAgent.py                 (failure prediction, risk scoring)
│   ├── AuditAgent.py                (compliance audits, checklists)
│   ├── DocumentAgent.py             (regulatory doc generation)
│   ├── WorkflowAgent.py             (process automation)
│   ├── CAPACoachAgent.py            (guidance during creation)
│   └── ResolutionDraftAgent.py      (technical writing)
├── memory/
│   ├── AgentMemory.py               (persistent knowledge base)
│   └── LearningLoop.py              (feedback → improvement)
└── orchestration/
    ├── AgentRouter.py               (route user request → agent)
    ├── AgentChain.py                (coordinate multi-agent flows)
    └── AgentMonitor.py              (performance, drift detection)
```

**Example: Risk Agent**

```python
class RiskAgent:
    """
    Analyzes CAPA effectiveness and predicts failure risk.

    Inputs:
      - CAPA document (root cause, resolution, verification)
      - Historical similar CAPAs (semantic match)
      - Production failure data

    Analysis:
      1. Extract resolution quality (technical depth, completeness)
      2. Find similar past CAPAs and their effectiveness
      3. ML model predicts re-failure likelihood
      4. Score on 1-5 scale with confidence bounds

    Output:
      - Risk score + reasoning
      - Recommendations (additional verification, design review, etc.)
      - Confidence intervals
    """
```

---

### Layer 5: Advanced Workflows

#### Auto-Approval System

```
backend/workflows/auto_approval/
├── ApprovalClassifier.py            (ML model for low-risk DCRs)
├── RiskThresholds.py                (configurable approval rules)
├── ApprovalAudit.py                 (log all auto-approvals)
└── AppealProcess.py                 (human override mechanism)
```

#### LLM Fine-Tuning Pipeline

```
backend/ml/finetuning/
├── HistoricalDataPrep.py            (extract training data from BigQuery)
├── FineTuneRunner.py                (OpenAI API integration)
├── ModelEvaluation.py               (test quality before deployment)
└── ModelVersioning.py               (track model versions)
```

#### Visual CAPA Graphs

```
portal/visualization/
├── CauseEffectGraph.tsx             (D3.js visualization)
├── DependencyMap.tsx                (CAPA relationships)
├── TimelineVisualization.tsx        (effectiveness over time)
└── RiskHeatmap.tsx                  (risk by category, over time)
```

#### Compliance Scoring

```
backend/compliance/
├── ComplianceScorer.py              (LLM + rules-based assessment)
├── ScoringRules.py                  (ISO 13485, FDA 21 CFR 11)
├── ScoreExplanation.py              (why this score?)
└── TrendAnalysis.py                 (improving vs. declining compliance)
```

---

## Data Flow Example: "Generate CAPA from Chat Transcript"

```
User Chat:
  "We found 5 devices with battery failures in the field.
   Root cause is the charging circuit is undersized.
   We're redesigning the power board and adding more filtering.
   Testing on Friday."

↓ (LLM Assistant v2.0)
  1. Extract entities: issue (battery failure), root cause (undersized circuit),
     resolution (power board redesign), timeline (Friday)
  2. Retrieve similar past CAPAs (semantic search)
  3. Generate CAPA structure (title, description, root cause, resolution, etc.)
  4. Call CAPADrafter tool → create CAPA document
  5. Call EffectivenessPlanner → suggest verification tests

↓ (Backend Processing)
  1. Store CAPA in BigQuery (append-only)
  2. RiskAgent analyzes: similar failures, past resolutions
  3. Risk score: 3.2/5 (moderate risk; recommend extended testing)
  4. Trigger notification: PM, QA lead (new critical CAPA)
  5. Schedule follow-up job: check status Friday

↓ (Portal UI)
  1. Real-time widget shows new CAPA
  2. Dashboard highlights risk score
  3. Activity feed shows: "CAPA created from chat", RiskAgent analysis
  4. LLM suggests next actions: "Schedule design review", "Prepare test plan"

↓ (Follow-Up - Friday)
  1. Scheduled job checks: status updated by user?
  2. If verified → RiskAgent re-scores (lower risk)
  3. If not updated → NotificationEngine sends reminder
```

---

## Development Workflow

### Getting Started

```bash
# Clone/checkout sandbox/next-gen branch
git checkout -b sandbox/next-gen origin/dev

# Set up local dev environment (separate from v1.0.0)
cd portal && npm install
cd ../device && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Stub out new modules (don't implement yet)
mkdir -p sandbox/next-gen/{portal,backend,features}

# Create feature tracking doc
touch sandbox/next-gen/DEVELOPMENT-LOG.md
```

### Feature Implementation Pattern

```
1. Create feature directory under sandbox/next-gen/features/
2. Write design doc (what, why, how)
3. Scaffold components/modules
4. Implement core logic
5. Add unit tests (developer testing, no validation)
6. Integration test (does it work with v1.0.0 backend?)
7. Document in DEVELOPMENT-LOG.md
8. Commit with [SANDBOX] prefix
```

### Example Feature: Memory System

```
sandbox/next-gen/features/02-llm-assistant-v2/
├── DESIGN.md                        (architecture, data model)
├── backend/
│   ├── memory.py                    (ConversationMemory class)
│   ├── retrieval.py                 (semantic search)
│   └── test_memory.py               (unit tests)
├── portal/
│   ├── hooks/useConversationMemory.ts
│   ├── components/MemoryDisplay.tsx
│   └── test.tsx
└── INTEGRATION-CHECKLIST.md         (how to connect to v1.0.0)
```

---

## Testing Strategy

**For sandbox/next-gen:**

- Unit tests (fast, local, no external dependencies)
- Integration tests (connect to v1.0.0 backend APIs, staging BigQuery)
- NO validation tests (those happen post-v1.0.0 release)
- NO regulatory documentation (that comes during Phase 6)

```
sandbox/next-gen/tests/
├── unit/
│   ├── test_memory_system.py
│   ├── test_agents.py
│   └── test_analytics.py
├── integration/
│   ├── test_llm_with_backend.py
│   ├── test_ui_with_api.py
│   └── test_notification_pipeline.py
└── fixtures/
    └── sample_data.py
```

---

## Dependency Management

**Shared with v1.0.0:**

- ✅ React, Next.js, Tailwind (portal)
- ✅ FastAPI, BigQuery client (backend)
- ✅ OpenAI API

**New Dependencies (sandbox only):**

- Redis or Firestore (conversation memory)
- APScheduler or Celery (job scheduling)
- D3.js or Plotly (visualization)
- Scikit-learn or PyTorch (ML models)
- Additional NLP libraries as needed

All new dependencies are scoped to sandbox/next-gen and do NOT affect v1.0.0 build.

---

## Milestone Timeline

| Date   | Milestone                | Deliverables                              |
| ------ | ------------------------ | ----------------------------------------- |
| Dec 10 | Branch created           | Directories, architecture docs            |
| Dec 16 | Foundation ready         | Dev environments, stubbed modules         |
| Dec 23 | Core features prototyped | Memory system, scheduler, batch ingestion |
| Dec 30 | Integration tested       | Features connect to v1.0.0 backend        |
| Jan 7  | v1.0.0 released          | sandbox/next-gen continues development    |
| Jan 14 | Feature selection        | Choose features for v1.1                  |
| Jan 21 | Validation planning      | Design Phase 6 validation protocol        |
| Feb 5  | v1.1 released            | With validated sandbox features           |

---

## Success Criteria

- ✅ sandbox/next-gen develops in parallel without impacting v1.0.0
- ✅ Features are production-ready quality (good code, tested, documented)
- ✅ Zero cross-contamination (no sandbox code in regulated branch)
- ✅ v1.0.0 releases on Jan 7 without delay
- ✅ v1.1 ships 3-4 weeks later with validated features from sandbox
- ✅ Team velocity increases (can experiment freely)
- ✅ Regulatory compliance is maintained (v1.0.0 audit-ready, v1.1 planned for validation)

---

**This architecture enables rapid innovation while protecting the regulated v1.0.0 release.**
