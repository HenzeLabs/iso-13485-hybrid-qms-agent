# Release: vX.Y-phaseN-YYYYMMDD

## Release Information
- **Version:** vX.Y-phaseN-YYYYMMDD
- **Release Date:** Month DD, YYYY
- **Release Type:** [Major | Minor | Patch | Hotfix]
- **Git Tag:** release/vX.Y-phaseN-YYYYMMDD
- **Git Commit SHA:** [Full SHA]
- **Cloud Run Revision:** qms-agent-XXXXX-XXX
- **Service URL:** https://qms-agent-XXXXXXXXXXXX.us-central1.run.app

## Requirements Included
| Req ID | Description | Type |
|--------|-------------|------|
| Req-7.3.1 | [Description] | [feat\|fix\|chore] |
| Req-7.3.5 | [Description] | [feat\|fix\|chore] |

## Verification Status
- [ ] All unit tests pass (`pytest device/tests/`)
- [ ] All integration tests pass
- [ ] Citation validation passes
- [ ] Security scan clean (no HIGH or CRITICAL vulnerabilities)
- [ ] Code review completed by 2+ reviewers
- [ ] Documentation links verified

**Verification Report:** `documentation/DHF/verification/verification-report-vX.Y.md`

## Validation Status
- [ ] Validation protocol executed
- [ ] Validation report completed and signed
- [ ] Control queries validated (minimum 5)
- [ ] All acceptance criteria met
- [ ] User acceptance testing complete (if applicable)

**Validation Report:** `documentation/DHF/validation/validation-report-vX.Y.md`

## Risk Assessment
- [ ] Risk analysis current and complete
- [ ] All HIGH risks mitigated to acceptable levels
- [ ] Residual risks documented and acceptable
- [ ] Risk management file updated

**Risk Management File:** `documentation/DHF/risk-management/risk-analysis-vX.Y.md`

## Configuration Management
- **Source Code Branch:** release/vX.Y-phaseN-YYYYMMDD
- **Build Environment:** Cloud Build
- **Container Image:** gcr.io/lw-qms-rag/qms-agent:vX.Y-phaseN-YYYYMMDD
- **Image Digest:** sha256:[digest]
- **Deployment Region:** us-central1
- **Environment Variables:**
  - PROJECT_ID: lw-qms-rag
  - DATA_STORE_ID: [datastore ID]
  - DATA_STORE_LOCATION: us
  - REGION: us-central1

## Traceability
**Traceability Matrix:** `documentation/traceability/release-vX.Y-matrix.xlsx`

## Known Issues
| Issue ID | Description | Severity | Workaround | Target Fix Version |
|----------|-------------|----------|------------|-------------------|
| None | - | - | - | - |

## Deployment Instructions
1. Authenticate to GCP: `gcloud auth login`
2. Set project: `gcloud config set project lw-qms-rag`
3. Deploy: `scripts/deploy.sh`
4. Verify: `curl https://[service-url]/health`
5. Validate: Run validation protocol

## Rollback Procedure
In case of issues:
1. Identify previous stable revision
2. Route traffic: `gcloud run services update-traffic qms-agent --to-revisions=[previous-revision]=100`
3. Verify rollback: Check health endpoint
4. Document incident in DHF

## Change Summary
[Narrative description of what changed in this release]

## Regulatory Impact
- [ ] Changes affect patient safety controls: [Yes/No]
- [ ] Changes affect clinical claims: [Yes/No]
- [ ] Requires regulatory submission (510(k), PMA, etc.): [Yes/No]
- [ ] Changes affect labeling or IFU: [Yes/No]

**Regulatory Assessment:** [If yes to any above, provide details]

## Documentation Updates
- [ ] README.md updated
- [ ] API documentation updated
- [ ] User guide updated (if applicable)
- [ ] Training materials updated (if applicable)

## Deployment Manifest
**Manifest File:** `documentation/DMR/manifests/manifest-vX.Y-phaseN-YYYYMMDD.json`

## Approvals

### Engineering Approval
- **Name:** ___________________
- **Title:** Engineering Lead
- **Signature:** ___________________
- **Date:** _______

### Quality Approval
- **Name:** ___________________
- **Title:** Quality Manager
- **Signature:** ___________________
- **Date:** _______

### Regulatory Approval (if applicable)
- **Name:** ___________________
- **Title:** Regulatory Affairs
- **Signature:** ___________________
- **Date:** _______

---

**Release Status:** [Draft | Under Review | Approved | Released]

**Deployed to Production:** [Yes/No] Date: _______
