# 📋 QUICK REFERENCE — RUN THESE 4 COMMANDS

**Copy and paste into your terminal (from repository root):**

```bash
npm run lint -- --fix && npm run build && npm audit && git commit -S -am "chore: pre-merge cleanup"
```

Or run them one at a time:

```bash
npm run lint -- --fix
npm run build
npm audit
git commit -S -am "chore: pre-merge cleanup"
```

---

## ✅ What This Accomplishes

| Command                   | Purpose                       | Time   | Outcome                    |
| ------------------------- | ----------------------------- | ------ | -------------------------- |
| `npm run lint -- --fix`   | Fix linting violations        | 5 min  | Code formatted to standard |
| `npm run build`           | Verify TypeScript compilation | 10 min | No type errors             |
| `npm audit`               | Check dependency security     | 2 min  | Vulnerabilities assessed   |
| `git commit -S -am "..."` | Sign and commit changes       | 3 min  | Changes recorded in git    |

**Total Time:** ~20 minutes

---

## ✅ Expected Outcomes

- ✅ Zero linting errors
- ✅ TypeScript build succeeds
- ✅ Dependencies are secure
- ✅ Commit is signed and recorded
- ✅ **BRANCH IS MERGE-READY**

---

## ✅ What Happens Next

Once all four commands succeed:

1. Push branch to origin (if not already done)
2. Create Pull Request: feature/phase4-portal-ui → dev
3. Request code review (2+ approvers)
4. Merge when approved
5. → Release branch creation
6. → Staging deployment
7. → Phase 5 validation
8. → v1.0.0 release

---

## 🆘 If Something Fails

See **SCMP-PRE-MERGE-EXECUTION.md** for troubleshooting guide.

---

**Current Status:** Ready to execute  
**Do This:** Run the 4 commands above  
**Result:** Merge-safe state achieved in ~20 minutes
