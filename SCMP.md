# Software Configuration Management Plan

## Project Context

### Purpose of this SCMP
The ISO 13485 Hybrid QMS Agent delivers regulated medical device software, so this SCMP exists to document how configuration, branching, validation evidence, and traceability are managed to meet ISO 13485:2016 clause 7.3 design control expectations.

### ISO 13485 clause 7.3 linkage
Clause 7.3 requires a documented design and development process with traceable requirements, verification/validation, change control, and design outputs. This SCMP maps repository workflow artifacts directly back to that clause (change history in `documentation/DHF`, releases in `documentation/DMR`, and traceability matrices in `documentation/traceability`).

### Emphasis on traceability, validation, and regulatory controls
Every work item must link to a requirement-approved DHF entry, include validation evidence (unit tests, integration tests, or validation reports), and produce audit-ready artifacts. Traceability artifacts live in `documentation/traceability`, and evidence is stored near the related requirement so auditors can quickly review the implementation path.

## Repository Structure

```
/device/
  /src/
  /tests/
  /docs/
/documentation/
  /DHF/
  /DMR/
  /traceability/
/scripts/
.gitignore
README.md
SCMP.md
```

- `/device/`: production code and associated developer artifacts (source code under `/device/src`, automated verification suites under `/device/tests`, and module-specific developer notes under `/device/docs`).
- `/documentation/DHF/`: Design History File entries keyed to requirement IDs (implementation rationale, risk controls, verification/validation evidence, and reviewer sign-off). DHF files should reference requirement IDs such as `Req-7.3.5` and include links to validation reports in `/documentation/DHF/validation/`.
- `/documentation/DMR/`: Device Master Record documents describing the approved configuration baseline for each release branch (includes software version, configuration inputs/outputs, and release sign-offs).
- `/documentation/traceability/`: Matrices connecting requirements to source code, tests, and validation artifacts (e.g., `Req-7.3.5-matrix.xlsx`).
- `/scripts/`: Utility scripts (e.g., DHF entry growers, environment sanity checks) that do not produce regulated output but support reproducible setup.
- `README.md`: Project overview and high-level instructions for clinicians, auditors, and engineers.
- `.gitignore`: Ignore build artifacts while tracking documentation and validation assets.

## Branching Strategy (Tailored GitFlow)

- **`main`**: Protected release branch holding the most recently approved DMR baseline. Merges to `main` only occur from `release/*` after QA sign-off.
- **`release/*`** (e.g., `release/v1.0-phase2-dec9-2025`): Ship-ready candidate branches that bundle requirement IDs, DMR updates, and traceability matrices. Each release branch is paired with a document under `/documentation/DMR/` describing configuration and validation acceptance.
- **`dev`**: Integration branch that accumulates validated work from feature/hotfix branches. No direct commits; all changes enter via reviewed PRs.
- **`feature/Req-*`** (e.g., `feature/Req-7.3.5-prompt`): Implement a single requirement. Branch names encode the requirement ID for audit traceability.
- **`hotfix/Req-*`**: Emergency fixes tied to requirement IDs for critical compliance issues.
- **`audit/*`**: Short-lived branches created to address auditor requests or reproduce historical states without polluting `dev`.

Protection rules:
- Require status checks (unit tests, docs lint, validation link verification) before merging.
- Enforce signed commits from authorized contributors.
- Require two reviewers per PR: one engineering owner, one QA/quality representative.
- All merges reference associated requirement IDs and validation evidence in the PR description.

## GitHub Branch Protection & Validation Gates

Enforce ISO 13485 traceability by protecting the key branches and requiring validation evidence before merges. Run these commands with GitHub CLI as an administrator for the repository (`HenzeLabs/iso-13485-hybrid-qms-agent`):

```bash
gh api repos/HenzeLabs/iso-13485-hybrid-qms-agent/branches/main/protection -X PUT \
  -f required_status_checks.contexts='["validate-scm","unit-tests","doc-link-check"]' \
  -f required_status_checks.strict=true \
  -f enforce_admins=true \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=2

gh api repos/HenzeLabs/iso-13485-hybrid-qms-agent/branches/dev/protection -X PUT \
  -f required_status_checks.contexts='["validate-scm","unit-tests","doc-link-check"]' \
  -f required_status_checks.strict=true \
  -f enforce_admins=true \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=2
```

Repeat for `release/*` branches when they are created and ensure PR status checks report validation evidence (e.g., `validate-scm`, QA review, and update to DHF artifacts) before merging into `main`.

Use GitHub Actions to publish validation results to those status checks so auditors can easily review them before approving a PR.

## Pull Request Policy

All PRs target `dev` (or `release/*` for stabilization). The mandatory template is:

```markdown
## Description
- **Requirement ID(s):** Req-7.3.5
- **Summary:** fix(agent): enforce citations in OpenAI prompt

## Validation Evidence
- **Automated tests/results:** `npm run test -- Req-7.3.5`
- **Validation artifacts:** `documentation/DHF/validation/Req-7.3.5-validation.md`
- **Review minutes:** `documentation/DHF/reviews/2025-12-09-review.md`

## Impacted Documentation
- **Affected DHF file(s):** `documentation/DHF/Req-7.3.5.md`
- **DMR updates required?** Yes → `documentation/DMR/release-v1.0-phase2-dec9-2025.md`

## Risk Controls
- **Risk IDs:** risk-CRM-002
- **Description:** Updated logging to capture decision-tree context for compliance.

## Checklist
- [ ] Requirement traceability updated
- [ ] Risk/mitigation modules reviewed
- [ ] Validation evidence attached and accessible in repo
- [ ] Documentation updates committed
```

- Evidence (validation reports, DHF updates, review minutes) must exist inside the repository; PRs without accessible artifacts fail reviews.
- Reviewers: at least two approvals — one engineer familiar with the module (agent/build) and one QA representative to verify compliance artifacts.

## Commit Message Conventions

- Format: `Req-<ID>: <type>(<scope>): <summary>`
- Example: `Req-7.3.5: fix(agent): enforce citations in OpenAI prompt`
- Types allowed: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
- Scopes correspond to modules (e.g., `agent`, `build`, `docs`, `validation`).
- Every commit must trace back to a requirement ID already registered in `documentation/traceability/` and reference the DHF entry.
- Merge commits for releases must list encompassed requirement IDs (e.g., `Release: Req-7.3.1, Req-7.3.5`).

## Repository Setup Instructions

1. Create the required folder structure and initialize Git:  
```bash
mkdir -p device/{src,tests,docs} documentation/{DHF,DMR,traceability} scripts
git init
git checkout -b dev
```

2. Configure remote and baseline files:
```bash
git remote add origin git@github.com:laurenadmin/iso-13485-hybrid-qms-agent.git
cat <<'EOF' > .gitignore
# Python artifacts
__pycache__/
*.py[cod]
*.egg-info/
*.pyo
*.pyd

# Environment files
.env
.env.*

# Build
device/build/
.device/

# VS Code
.vscode/

# macOS
.DS_Store

# Logs
*.log

# Docker
docker-compose.override.yml

# Node modules
node_modules/
EOF
```

3. Add baseline documentation placeholders:
```bash
cat <<'EOF' > documentation/DHF/Req-template.md
# DHF Entry Template
- **Requirement ID:** Req-7.3.x
- **Description:** _Brief requirement description_
- **Trace to:** documentation/traceability/Req-7.3.x-matrix
- **Verification Method:** _Unit test, integration test, design review_
- **Validation Evidence:** _See documentation/DHF/validation/_
- **Change Control:** _Reference relevant change request ID_
EOF

cat <<'EOF' > documentation/traceability/Req-7.3.5-matrix.xlsx
Requirement ID,Module,Test Case,Validation Reference
Req-7.3.5,agent,TC-7.3.5-01,documentation/DHF/Req-7.3.5.md
EOF
```

4. Capture SCMP and initial docs, then create the first commit:
```bash
git add .
git commit -m "Req-7.3.1: chore(config): establish SCMP baseline"
```

5. Create and merge a sample feature branch:
```bash
git checkout -b feature/Req-7.3.5-prompt
# introduce placeholder change, e.g. touch file
mkdir -p device/docs && echo "Placeholder DHF notes" > device/docs/req-7.3.5-notes.md
git add device/docs/req-7.3.5-notes.md
git commit -m "Req-7.3.5: docs(agent): stash implementation notes"
git checkout dev
git merge --no-ff feature/Req-7.3.5-prompt -m "Req-7.3.5: merge feature signal"
```

6. Push the `dev` branch to GitHub:
```bash
git push -u origin dev
```

## Release & Verification Workflow

- **Release branch naming:** `release/v1.0-phase2-dec9-2025` (example). Branches include fully reviewed DHF entries and DMR updates inside `/documentation/DMR/release-v1.0-phase2-dec9-2025.md`.
- **QA sign-off:** Store signed review minutes under `/documentation/DHF/reviews/` (e.g., `2025-12-09-review.md`) and reference them in PR validation evidence.
- **Traceability:** Each release also updates `/documentation/traceability/Req-*.xlsx`, ensuring every requirement maps to code, tests, and validation deliverables.
- **Merge criteria:** Releases merge into `main` only after validation automation runs, two approvals, and DMR artifact finalization.
- **Release candidates:** Before cutting `release/v1.0-phase2-dec9-2025-rc1`, update `documentation/DMR/release-v1.0-phase2-dec9-2025.md` (RC section) and log QA validation minutes (e.g., `documentation/DHF/reviews/2025-12-12-qa-rc1.md`) so that reviewers can confirm the validated test suites (`device/tests/`) are tied to DHF/traceability artifacts prior to tagging.

## Phase 4: Deployment Automation Preview

- **Trigger strategy:** GitHub Actions pipelines trigger on `push` to `main`, release branch merges, or tags following `deploy/v1.0-phase2-dec9-2025`.
- **Workflow steps:** checkout; install dependencies; run `scripts/validate-scm.sh` (validation script); build/package device artifacts; call Google Cloud Build with a `cloudbuild.yaml` that stages the artifact; upload results to Cloud Storage and update `/documentation/DMR/manifests/deploy-v1.0-phase2-dec9-2025.json`.
- **Manifest:** The deployment manifest records image digests, validation status, requirement IDs included, and Cloud Build logs so auditors see the promoted assets.
- **Tag-based promotion:** Pushing a tag like `deploy/v1.0-phase2-dec9-2025` triggers the Cloud Build matrix to push to staging/production and generates release notes referencing the DHF entries in the release's traceability matrix.

## Appendices

### Example release artifact references
- `documentation/DMR/release-v1.0-phase2-dec9-2025.md`
- `documentation/DHF/Req-7.3.5.md`
- `documentation/traceability/Req-7.3.5-matrix.xlsx`
- `documentation/DHF/reviews/2025-12-09-review.md`
- Deployment manifest: `documentation/DMR/manifests/deploy-v1.0-phase2-dec9-2025.json`

### Important notes for auditors
- Evidence is version-controlled, reviewers note the requirement ID, and automation log outputs sit alongside code to satisfy ISO 13485 clause 7.3 traceability demands.
