# Pull Request - ISO 13485 Design Review

## Description
- **Requirement ID(s):** Req-X.Y.Z
- **Summary:** [type]([scope]): [brief description]
- **Type:** [feat | fix | docs | chore | test | refactor]
- **Scope:** [agent | api | search | openai | deploy | dhf | dmr]

## Validation Evidence (ISO 13485 Clause 7.3)
- [ ] **Unit/Integration tests performed:** `pytest device/tests/test_*.py`
- [ ] **Test results:** [Pass/Fail] - [Link to test output or attach screenshot]
- [ ] **Validation report:** `documentation/DHF/validation/Req-X.Y.Z-validation.md`
- [ ] **Design review minutes:** `documentation/DHF/reviews/YYYY-MM-DD-review.md`

## Impacted Documentation
- [ ] **DHF entry updated:** `documentation/DHF/requirements/Req-X.Y.Z.md`
- [ ] **DMR update required:** [Yes/No] - If yes: `documentation/DMR/releases/release-vX.Y-phaseN-YYYYMMDD.md`
- [ ] **Traceability matrix updated:** `documentation/traceability/Req-X.Y.Z-matrix.xlsx`
- [ ] **Developer docs updated:** `device/docs/`

## Risk Assessment (ISO 14971)
- **Risk IDs affected:** risk-CRM-XXX
- **Severity:** [Low | Medium | High]
- **Probability:** [Remote | Occasional | Frequent]
- **Hazards addressed:** [Describe hazards]
- **Mitigation description:** [Describe risk controls implemented]
- **Residual risk level:** [Low | Medium | High]
- **Residual risk acceptable:** [Yes | No]

## Regulatory Impact
- [ ] **Changes affect patient safety controls:** [Yes/No]
- [ ] **Changes affect clinical claims:** [Yes/No]
- [ ] **Requires regulatory submission:** [Yes/No]
- [ ] **Changes affect device labeling:** [Yes/No]

**If yes to any above, explain:**
[Provide regulatory impact assessment]

## Code Changes Summary
[Provide a brief narrative of what changed and why]

### Files Changed
- `device/src/[filename]` - [Description of changes]
- `device/tests/[filename]` - [Description of test changes]
- `documentation/DHF/requirements/[filename]` - [Description of DHF updates]

## Review Checklist (Reviewer Responsibilities)
- [ ] Requirement traceability verified and complete
- [ ] Risk controls implemented and tested
- [ ] Validation evidence attached and accessible in repository
- [ ] DHF entries complete with all required sections
- [ ] Code follows design specifications
- [ ] No security vulnerabilities introduced (OWASP Top 10)
- [ ] No hardcoded secrets or credentials
- [ ] Commit messages follow convention: `Req-X.Y.Z: type(scope): description`
- [ ] All automated tests pass
- [ ] Code coverage acceptable (>80% for critical paths)
- [ ] Documentation is clear and accurate

## Testing Performed
### Manual Testing
- [ ] Health endpoint returns 200 OK
- [ ] Query endpoint returns grounded answers with citations
- [ ] Error handling works as expected
- [ ] Performance acceptable (<30s response time)

### Automated Testing
```bash
# Command used to run tests
pytest device/tests/ -v

# Test results summary
[Paste test output here]
```

## Deployment Impact
- [ ] **Requires environment variable changes:** [Yes/No]
- [ ] **Requires database migration:** [Yes/No]
- [ ] **Requires infrastructure changes:** [Yes/No]
- [ ] **Backward compatible:** [Yes/No]

**If not backward compatible, describe migration path:**
[Explain how to migrate]

## Screenshots / Evidence
[If applicable, attach screenshots showing:
- Test results passing
- Validation protocol execution
- Before/after behavior
- UI changes (if any)]

## Related Issues / PRs
- Closes #[issue number]
- Related to #[PR number]
- Depends on #[PR number]

## Additional Notes for Reviewers
[Any special instructions, context, or areas that need particular attention]

---

## Reviewer Sign-Off

### Engineering Reviewer
- **Name:** ___________________
- **Reviewed:** [Yes/No]
- **Date:** _______
- **Comments:**

### Quality Reviewer
- **Name:** ___________________
- **Reviewed:** [Yes/No]
- **Date:** _______
- **Comments:**

---

**PR Status:** [Draft | Ready for Review | Changes Requested | Approved | Merged]
