# 🚀 SCMP PRE-MERGE EXECUTION CHECKLIST

**Current Stage:** SCMP Pre-Merge Checks  
**Target Stage:** Merge to dev → Release Branch → Phase 5 Validation  
**Date:** December 10, 2025  
**Branch:** feature/phase4-portal-ui

---

## YOUR TASK (Run These 4 Commands Locally)

Copy and execute these commands in order in your terminal, from the repository root:

```bash
# Step 1: Fix any linting violations (auto-fix mode)
npm run lint -- --fix

# Step 2: Verify TypeScript compilation
npm run build

# Step 3: Check dependency vulnerabilities
npm audit

# Step 4: Sign and commit the cleanup
git commit -S -am "chore: pre-merge cleanup"
```

**Total Time:** ~20 minutes  
**Expected Result:** All checks pass → READY FOR MERGE

---

## What These Commands Do

### Command 1: `npm run lint -- --fix`

- **Purpose:** Fix any ESLint violations automatically
- **Expected Output:** "No errors found" or list of auto-fixed issues
- **Time:** ~5 minutes
- **Success Indicator:** Zero errors reported

### Command 2: `npm run build`

- **Purpose:** Compile TypeScript and build Next.js portal
- **Expected Output:** "Build successful" message
- **Time:** ~10 minutes
- **Success Indicator:** No type errors, build completes

### Command 3: `npm audit`

- **Purpose:** Verify no high/critical vulnerabilities in dependencies
- **Expected Output:** Audit summary with vulnerability count
- **Time:** ~2 minutes
- **Success Indicator:** Zero high/critical vulnerabilities (low/moderate acceptable)

### Command 4: `git commit -S -am "chore: pre-merge cleanup"`

- **Purpose:** Sign and commit the TODO resolution (api.ts fix)
- **Expected Output:** Commit hash, signed by your GPG key
- **Time:** ~3 minutes
- **Success Indicator:** Commit appears in git log with [S] signature flag

---

## What Happens After You Run These Commands

### ✅ Immediate (Your Repository State)

- All pending changes committed
- Branch is clean (git status shows nothing)
- Code passes all quality checks
- Ready for code review

### ✅ Next Steps (Merge Process)

1. **Code Review:** Minimum 2 approvals (engineering + QA)

   - Review of Phase 4C/4D code
   - Verification of SCMP compliance
   - Timeline: 24-48 hours

2. **PR Merge:** feature/phase4-portal-ui → dev

   - Automatic CI/CD checks run
   - All tests must pass
   - Timeline: Immediate (if review passes)

3. **Release Branch Creation:** release/v1.0-phase4-portal

   - Baseline commit recorded
   - DMR updated with configuration
   - Timeline: Same day as merge

4. **Staging Deployment:** Portal container to Cloud Run

   - Docker image built and pushed
   - Service deployed to staging environment
   - Timeline: Same day

5. **Phase 5 Validation:** Execute 25 test cases

   - Category A: UI (Chat & Confirmation Flow) — 4 tests
   - Category B: LLM & Function Calling — 4 tests
   - Category C: Authentication & Authorization — 8 tests
   - Category D: Audit Trail & Traceability — 4 tests
   - Category E: Performance & Load Testing — 2 tests
   - Category F: Regulatory Compliance — 5 tests
   - Timeline: 2-4 weeks

6. **Final Sign-Off:** QA + 4 regulatory authorities

   - PHASE5-FINAL-VALIDATION-REPORT.md completed
   - All evidence archived
   - Timeline: 1 week after Phase 5 validation

7. **Release to Main:** release/v1.0-phase4-portal → main
   - v1.0-phase4-portal git tag created
   - Release record finalized
   - Timeline: 3-4 weeks from now

---

## Pre-Command Checklist (Before You Execute)

- [ ] You are in the repository root directory
- [ ] You are on branch `feature/phase4-portal-ui`
- [ ] You have Node.js 18+ installed (`node --version`)
- [ ] You have GPG key configured for commit signing (`git config user.signingkey`)
- [ ] You have run `npm install` (dependencies installed)
- [ ] No local changes that you want to keep (or they're already staged)

---

## Troubleshooting (If Commands Fail)

### If `npm run lint -- --fix` fails:

```bash
# Manually run ESLint to see specific errors
npm run lint

# If formatting issues, run Prettier
npx prettier --write "portal/src/**/*.{ts,tsx}"
```

### If `npm run build` fails:

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check build output
npm run build 2>&1 | head -20  # Show first 20 lines of error
```

### If `npm audit` shows vulnerabilities:

```bash
# See detailed report
npm audit

# Try automatic fixes
npm audit fix

# If manual fix needed, update package.json and run npm install
```

### If `git commit -S` fails (GPG signing):

```bash
# Verify GPG key is configured
git config user.signingkey

# List available GPG keys
gpg --list-secret-keys

# If not configured, set it:
git config user.signingkey YOUR_GPG_KEY_ID
```

---

## Success Criteria

Once all four commands complete successfully, you will have achieved:

✅ **SCMP Pre-Merge Stage Complete**
✅ **Code Quality Verified**
✅ **Security Audit Passed**
✅ **Merge-Ready State**

At that point:

- Create a Pull Request from `feature/phase4-portal-ui` to `dev`
- Request reviews (minimum 2 approvers)
- Merge when approved

---

## Timeline to v1.0.0 Release

```
TODAY (Dec 10)       → Run these 4 commands ← YOU ARE HERE
↓
Dec 10-11            → Code review + merge to dev
↓
Dec 11-13            → Create release branch, deploy to staging
↓
Dec 13 - Dec 31      → Phase 5 validation (25 test cases)
↓
Jan 1-7, 2026        → Resolve any NCRs, final sign-off
↓
Jan 7, 2026          → Merge to main, tag v1.0.0, announce GA
```

---

## Reference Files

Created for your tracking:

- `SCMP-MERGE-BLOCKERS-RESOLVED.md` — What was fixed
- `SCMP-MERGE-READINESS.md` — Detailed status tracking
- `FILE-HYGIENE-AUDIT-REPORT.md` — Complete hygiene assessment

---

## Questions?

If any command fails or you need clarification:

1. Check the troubleshooting section above
2. Review the error message carefully
3. Refer to SCMP.md for branching rules and policy

---

**Status:** READY FOR EXECUTION  
**Next Action:** Run the 4 commands above  
**Target Outcome:** SCMP Merge-Ready State
