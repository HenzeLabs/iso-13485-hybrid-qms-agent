# Phase 5 Merge Checklist - sandbox/phase5-fixes → dev

**Branch:** sandbox/phase5-fixes  
**Target:** dev  
**Release:** v1.0 Phase 5 Production  
**Date:** December 10, 2025  
**Status:** PRE-MERGE VERIFICATION

---

## 1. PRECONDITIONS

### 1.1 Branch Status

- [x] All TypeScript errors resolved (0 errors)
- [x] Lint passes (`npm run lint` → 0 errors/warnings)
- [x] Build succeeds (`npm run build` → production bundle generated)
- [ ] No merge conflicts with `dev` branch
- [ ] All commits signed with GPG key
- [ ] Branch is up-to-date with `dev` (git pull origin dev)

### 1.2 Code Quality

- [x] No TODO/FIXME markers in modified files
- [x] No console.log() statements left for debugging
- [x] No commented-out code blocks
- [x] No hardcoded credentials or API keys
- [ ] All functions have proper TypeScript types
- [ ] No `any` types introduced

### 1.3 Testing Status

- [x] Unit tests pass (if applicable)
- [ ] Integration tests pass (if applicable)
- [ ] No test files broken by changes
- [ ] Test coverage maintained or improved

### 1.4 Documentation

- [x] PR description complete (`PR-PHASE5-MERGE-TO-DEV.md`)
- [x] Change log updated (file-by-file summary)
- [ ] README.md updated (if needed)
- [ ] API documentation current (if endpoints changed)

---

## 2. CODE-REVIEW CHECKLIST

### 2.1 Reviewer 1: Engineering Lead

**Focus Areas:**

- [ ] TypeScript type fixes are correct and maintainable
- [ ] No unintended behavioral changes introduced
- [ ] Code follows established patterns in codebase
- [ ] Dead code removal justified and safe

**Review Findings:**

- Finding 1: ******************\_\_\_******************
- Finding 2: ******************\_\_\_******************
- Finding 3: ******************\_\_\_******************

**Approval Status:** ☐ APPROVED ☐ CHANGES REQUESTED ☐ REJECTED

**Signature:** **********\_\_\_\_********** Date: ****\_\_\_****

---

### 2.2 Reviewer 2: QA Lead

**Focus Areas:**

- [ ] No regression risk to Phase 4 validation results
- [ ] Phase 5 validation protocol remains applicable
- [ ] No impact to audit trail or compliance controls
- [ ] Build artifacts match expected output

**Review Findings:**

- Finding 1: ******************\_\_\_******************
- Finding 2: ******************\_\_\_******************
- Finding 3: ******************\_\_\_******************

**Approval Status:** ☐ APPROVED ☐ CHANGES REQUESTED ☐ REJECTED

**Signature:** **********\_\_\_\_********** Date: ****\_\_\_****

---

## 3. SECURITY CHECKLIST

### 3.1 Authentication & Authorization

- [x] No changes to NextAuth configuration
- [x] No changes to RBAC middleware
- [x] No changes to JWT token handling
- [x] No changes to session management
- [x] No changes to user role mapping

### 3.2 Audit Logging

- [x] No changes to audit logger implementation
- [x] No changes to BigQuery schema
- [x] No changes to event types logged
- [x] No PII introduced into logs

### 3.3 API Security

- [x] No changes to API endpoints
- [x] No changes to request validation
- [x] No changes to error handling (that exposes sensitive data)
- [x] No changes to CORS configuration

### 3.4 Dependency Security

- [ ] `npm audit` shows acceptable risk level
- [ ] No new high/critical vulnerabilities introduced
- [ ] Dependencies pinned to exact versions (package-lock.json committed)

---

## 4. VALIDATION CHECKLIST

### 4.1 Phase 4 Validation Preservation

- [x] No functional changes that would invalidate Phase 4C validation
- [x] No functional changes that would invalidate Phase 4D validation
- [x] LLM assistant behavior unchanged
- [x] Authentication flow unchanged
- [x] RBAC enforcement unchanged

### 4.2 Phase 5 Validation Readiness

- [x] TypeScript compilation blockers removed (IQ-001 unblocked)
- [ ] Staging environment deployment ready
- [ ] IQ test procedures accessible
- [ ] OQ test procedures accessible
- [ ] Evidence collection templates prepared

### 4.3 Compliance Impact

- [x] No ISO 13485 Clause 7.3.6 requirements affected
- [x] No FDA 21 CFR Part 11 §11.10 requirements affected
- [x] No design outputs modified
- [x] No verification results invalidated

---

## 5. DEVOPS CHECKLIST

### 5.1 Build Verification

- [x] `npm install` completes without errors
- [x] `npx tsc --noEmit` passes (0 errors)
- [x] `npm run lint` passes (0 errors/warnings)
- [x] `npm run build` generates production bundle
- [ ] Docker image builds successfully (`docker build -t test-image .`)
- [ ] Docker image runs without errors (`docker run -p 3000:3000 test-image`)

### 5.2 Deployment Configuration

- [ ] Dockerfile unchanged (or reviewed if modified)
- [ ] `next.config.js` unchanged (or reviewed if modified)
- [ ] Environment variables unchanged (or documented if modified)
- [ ] Cloud Run configuration unchanged

### 5.3 Monitoring & Logging

- [x] No changes to application logging
- [x] No changes to error reporting
- [x] No changes to performance monitoring
- [x] No changes to health check endpoints

---

## 6. SIGN-OFF AUTHORITY

### 6.1 Technical Sign-Off

**Engineering Lead:**

- [ ] Code review completed
- [ ] Build verification passed
- [ ] No regression risk identified

**Approved by:** **********\_\_\_\_********** Date: ****\_\_\_****

---

### 6.2 Quality Assurance Sign-Off

**QA Lead:**

- [ ] Validation impact assessed
- [ ] Compliance requirements verified
- [ ] Evidence documentation complete

**Approved by:** **********\_\_\_\_********** Date: ****\_\_\_****

---

### 6.3 Final Merge Authorization

**Quality Manager:**

- [ ] All preconditions met
- [ ] All checklists completed
- [ ] Reviewers approved
- [ ] Authorization granted for merge

**Approved by:** **********\_\_\_\_********** Date: ****\_\_\_****

---

## 7. MERGE EXECUTION

### 7.1 Pre-Merge Commands

```bash
# Ensure branch is up-to-date
git checkout sandbox/phase5-fixes
git pull origin sandbox/phase5-fixes

# Fetch latest dev
git fetch origin dev

# Check for merge conflicts
git merge --no-commit --no-ff origin/dev
git merge --abort  # If no conflicts, abort and proceed below
```

### 7.2 Merge Command

```bash
# Switch to dev
git checkout dev
git pull origin dev

# Merge with no-fast-forward (preserves PR context)
git merge --no-ff sandbox/phase5-fixes -m "fix(portal): resolve TypeScript compilation blockers for Phase 5"

# Push to remote
git push origin dev
```

### 7.3 Post-Merge Verification

- [ ] CI/CD pipeline passes
- [ ] GitHub Actions build succeeds
- [ ] No broken tests reported
- [ ] Dev branch builds successfully
- [ ] Docker image builds from dev branch

---

## 8. POST-MERGE ACTIONS

### 8.1 Immediate (< 1 hour)

- [ ] Monitor CI/CD pipeline for failures
- [ ] Verify GitHub Actions checks pass
- [ ] Check dev branch build status
- [ ] Notify team in Slack/channels

### 8.2 Short-Term (< 1 day)

- [ ] Deploy dev branch to staging environment
- [ ] Run smoke tests on staging
- [ ] Verify no runtime errors in browser console
- [ ] Test AI assistant functionality end-to-end

### 8.3 Phase 5 Validation Execution

- [ ] Execute IQ-001 through IQ-010 (Installation Qualification)
- [ ] Execute OQ tests across 6 categories (Operational Qualification)
- [ ] Collect validation evidence (screenshots, logs, API captures)
- [ ] Document any NCRs (non-conformance reports)
- [ ] Obtain QA sign-off from 5 regulatory authorities

### 8.4 Release Preparation

- [ ] Create release branch: `release/v1.0-phase5-prod-2025-12-XX`
- [ ] Update DMR with production configuration
- [ ] Prepare production deployment checklist
- [ ] Schedule production cutover date/time

---

## 9. ROLLBACK PLAN

**If Critical Issues Discovered Post-Merge:**

### 9.1 Immediate Rollback (< 15 minutes)

```bash
# Revert merge commit
git checkout dev
git revert -m 1 <merge-commit-sha>
git push origin dev
```

### 9.2 Incident Response

- [ ] Identify root cause of failure
- [ ] Document incident in DHF/reviews/
- [ ] Create hotfix branch if needed
- [ ] Re-execute merge checklist
- [ ] Notify stakeholders

---

## 10. SUCCESS CRITERIA

**Merge Considered Successful When:**

- [x] All preconditions met
- [ ] Minimum 2 reviewers approved
- [ ] All checklists completed with ✅ or documented exceptions
- [ ] CI/CD pipeline passes
- [ ] No merge conflicts
- [ ] Dev branch builds successfully
- [ ] Staging deployment succeeds
- [ ] Smoke tests pass

**Current Status:** 🟡 **PENDING REVIEWER APPROVAL**

---

## 11. NOTES & EXCEPTIONS

**Documented Exceptions:**

- None at this time

**Special Considerations:**

- TypeScript fixes are non-behavioral (pure type corrections)
- No regression testing required (no functional changes)
- Phase 4 validation results remain valid

**Risks Accepted:**

- None

---

## 12. REFERENCES

**Related Documents:**

- [PR-PHASE5-MERGE-TO-DEV.md](PR-PHASE5-MERGE-TO-DEV.md) - Pull request description
- [PHASE5-VALIDATION-PROTOCOL.md](PHASE5-VALIDATION-PROTOCOL.md) - Validation plan
- [SCMP.md](SCMP.md) - Software configuration management plan
- [SCMP-MERGE-BLOCKERS-RESOLVED.md](documentation/archive/scmp/SCMP-MERGE-BLOCKERS-RESOLVED.md) - Pre-merge cleanup

**Evidence Archive:**

- Pre-fix TypeScript errors: `[tsc-output-before.txt]`
- Post-fix TypeScript success: `[tsc-output-after.txt]`
- Lint results: `[lint-output.txt]`
- Build artifacts: `portal/.next/` (git-ignored, not committed)

---

**Checklist Status:** 🟡 **IN PROGRESS**  
**Last Updated:** December 10, 2025  
**Next Action:** Reviewers execute code review (Section 2)

---

**APPROVAL TO PROCEED TO MERGE:**

☐ **APPROVED** - All criteria met, proceed with merge  
☐ **CONDITIONAL APPROVAL** - Proceed with documented exceptions  
☐ **REJECTED** - Critical issues identified, do not merge

**Final Approval Signature:** **********\_\_\_\_********** Date: ****\_\_\_****
