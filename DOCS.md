# QMS Agent Documentation Index

**Project:** ISO 13485-compliant Quality Management System (QMS) Agent
**Version:** 1.0.0
**Last Updated:** 2025-12-11

---

## 📋 Quick Reference (Root Level)

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](README.md) | Project overview, setup, usage | All users |
| [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) | Production deployment steps | DevOps, Admin |
| [PHASE5-VALIDATION-PROTOCOL.md](PHASE5-VALIDATION-PROTOCOL.md) | Validation test protocol (38 tests) | QA, Validation |
| [PHASE5-VALIDATION-EVIDENCE-PACKAGE.md](PHASE5-VALIDATION-EVIDENCE-PACKAGE.md) | Validation evidence (36/38 passed) | QA, Management |
| [PHASE5-MERGE-CHECKLIST.md](PHASE5-MERGE-CHECKLIST.md) | Phase 5 merge approval checklist | Engineering, QA |
| [PR-PHASE5-MERGE-TO-DEV.md](PR-PHASE5-MERGE-TO-DEV.md) | Phase 5 security hardening PR | Engineering |
| [RELEASE-RECORD-v1.0-OFFICIAL.md](RELEASE-RECORD-v1.0-OFFICIAL.md) | Official v1.0 release record | QA, Management |

---

## 📁 Documentation Structure

### Design History File (DHF)
**Location:** `documentation/DHF/`

```
DHF/
├── requirements/          # Requirements specifications
│   ├── Req-Phase3-Action-Layer.md
│   └── Req-Phase4-Portal-UI.md
├── design/               # Design specifications
│   └── PHASE4-ARCHITECTURE-SPECIFICATION.md
└── validation/           # Validation artifacts
    └── PHASE5-DEVIATION-RESOLUTIONS.md
```

### Device Master Record (DMR)
**Location:** `documentation/DMR/`

```
DMR/
├── release-v1.0-full-system.md       # Complete DMR for v1.0
└── SCMP-RELEASE-PLAN-v1.0.md         # Release execution plan
```

### Archived Documentation
**Location:** `documentation/archive/`

```
archive/
├── phase2/               # Phase 2 baseline validation
│   ├── PHASE2-RELEASE-CLOSURE.md
│   ├── PHASE2-RELEASE-PROCESS.md
│   ├── PHASE2-RELEASE-SUMMARY.md
│   ├── PR-PHASE2-RELEASE.md
│   └── RELEASE-NOTES-v1.0-phase2.md
├── phase4/               # Phase 4 portal development
│   ├── PHASE4-PORTAL-IMPLEMENTATION.md
│   ├── PHASE4-SIGNOFF-CHECKLIST.md
│   ├── PHASE4C-4D-CLOSEOUT.md
│   └── QA-VALIDATION-PHASE4C-4D.md
├── phase5/               # Phase 5 validation execution
│   ├── PHASE5-CLEAN-STATE-VERIFICATION.md (archived 2025-12-11)
│   ├── PHASE5-END-STATE-REPORT.txt (archived 2025-12-11)
│   ├── PHASE5-EVIDENCE-DIRECTORY-STRUCTURE.md
│   ├── PHASE5-EXECUTION-LOG-TEMPLATE.md
│   ├── PHASE5-FINAL-VALIDATION-REPORT.md
│   ├── PHASE5-MERGE-CHECKLIST-old.md (archived 2025-12-11)
│   ├── PHASE5-MERGE-PREP-FINAL-REPORT.md (archived 2025-12-11)
│   ├── PHASE5-QA-SIGN-OFF-FORM.md
│   ├── PHASE5-TEST-EXECUTION-TRACKER.md
│   ├── PHASE5-VALIDATION-EVIDENCE-TYPESCRIPT-FIXES.md (archived 2025-12-11)
│   ├── PHASE5-VALIDATION-EXECUTION-REPORT.md
│   ├── USER-VALIDATION-GUIDE.md
│   └── VALIDATION-STATUS.md
├── releases/             # Release documentation
│   ├── DEPLOYMENT-SUMMARY-v1.0-PROD.md
│   ├── QA-RELEASE-SIGN-OFF.md
│   ├── RELEASE-COMPLETE-SUMMARY.md
│   ├── RELEASE-DOCUMENTATION-INDEX.md
│   ├── RELEASE-PACKAGE-INDEX.md
│   └── release-manifest-v1.0.json (archived 2025-12-11)
├── scmp/                 # Software Configuration Management
│   ├── SCMP.md
│   ├── SCMP-CURRENT-POSITION.md
│   ├── SCMP-MERGE-BLOCKERS-RESOLVED.md
│   ├── SCMP-MERGE-READINESS.md
│   └── SCMP-PRE-MERGE-EXECUTION.md
├── security/             # Security remediation (archived 2025-12-11)
│   ├── SECURITY-REMEDIATION-DELIVERABLES-INDEX.md
│   ├── SECURITY-REMEDIATION-EXECUTIVE-CHECKLIST.md
│   ├── SECURITY-REMEDIATION-FINAL-VALIDATION-REPORT.md
│   ├── SECURITY-REMEDIATION-IAM.md
│   └── SECURITY-REMEDIATION-IMMEDIATE-ACTIONS-COMPLETION.md
├── build/                # Build artifacts (archived 2025-12-11)
│   ├── DHF-PACKAGE-MANIFEST.txt
│   └── FINAL-BUILD-TAG.txt
├── BRANCH-STRATEGY-PATH-B.md
├── EXECUTION-CERTIFICATION.md
├── EXECUTION-READY-FINAL-STATUS.md
├── FILE-HYGIENE-AUDIT-REPORT.md
├── FILE-HYGIENE-REPORT-2025-12-11.md (archived 2025-12-11)
├── ISO-13485-ARTIFACTS-MANIFEST.md
├── PATH-B-ACTIVATION-CONFIRMED.md
├── QUICK-START-MERGE.md
└── RUN-NOW.md
```

---

## 🎯 Common Tasks

### For Developers
1. **Getting Started:** [README.md](README.md)
2. **Architecture:** [documentation/DHF/design/PHASE4-ARCHITECTURE-SPECIFICATION.md](documentation/DHF/design/PHASE4-ARCHITECTURE-SPECIFICATION.md)
3. **Requirements:** [documentation/DHF/requirements/](documentation/DHF/requirements/)

### For QA/Validation
1. **Validation Protocol:** [PHASE5-VALIDATION-PROTOCOL.md](PHASE5-VALIDATION-PROTOCOL.md)
2. **Test Results:** [documentation/archive/phase5/PHASE5-VALIDATION-EXECUTION-REPORT.md](documentation/archive/phase5/PHASE5-VALIDATION-EXECUTION-REPORT.md)
3. **Deviation Resolutions:** [documentation/DHF/validation/PHASE5-DEVIATION-RESOLUTIONS.md](documentation/DHF/validation/PHASE5-DEVIATION-RESOLUTIONS.md)

### For DevOps/Deployment
1. **Deployment Checklist:** [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
2. **Release Plan:** [documentation/DMR/SCMP-RELEASE-PLAN-v1.0.md](documentation/DMR/SCMP-RELEASE-PLAN-v1.0.md)
3. **DMR (Production Config):** [documentation/DMR/release-v1.0-full-system.md](documentation/DMR/release-v1.0-full-system.md)

### For Management/Auditors
1. **Release Record:** [RELEASE-RECORD-v1.0-OFFICIAL.md](RELEASE-RECORD-v1.0-OFFICIAL.md)
2. **ISO 13485 Compliance:** [documentation/archive/ISO-13485-ARTIFACTS-MANIFEST.md](documentation/archive/ISO-13485-ARTIFACTS-MANIFEST.md)
3. **Traceability:** [documentation/DHF/](documentation/DHF/)

---

## 📊 ISO 13485 Compliance Mapping

| Clause | Requirement | Documentation |
|--------|-------------|---------------|
| 4.2.3 | Medical Device File | `documentation/DHF/` |
| 4.2.4 | Control of Records | Git version control |
| 7.3.2 | Design Inputs | `documentation/DHF/requirements/` |
| 7.3.3 | Design Outputs | `documentation/DHF/design/` |
| 7.3.6 | Design Validation | [PHASE5-VALIDATION-PROTOCOL.md](PHASE5-VALIDATION-PROTOCOL.md) |
| 8.5.2 | Corrective Action | CAPA workflow in application |

---

## 🔄 Document Lifecycle

- **Active Documents:** Root level (4 files)
- **Reference Documents:** `documentation/DHF/` and `documentation/DMR/`
- **Historical Documents:** `documentation/archive/`

**Retention Policy:**
- Active: Current version at root
- Superseded: Moved to `documentation/archive/`
- Git history maintains full audit trail

---

## 📞 Support

For questions about documentation:
- **Technical:** See [README.md](README.md)
- **Compliance:** See ISO 13485 artifacts in `documentation/DHF/`
- **Deployment:** See [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
