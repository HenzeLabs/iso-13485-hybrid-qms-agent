# DHF Entry: CAPA Management System

## Requirement Information
- **Requirement ID:** Req-8.5.2
- **Title:** CAPA (Corrective and Preventive Action) Management and BigQuery Integration
- **Category:** Design Input | Design Output
- **Date Created:** 2025-12-09
- **Author:** Engineering Team
- **Approved By:** [Pending QA Review]
- **ISO 13485 Reference:** Clause 8.5.2 - Corrective action; Clause 8.5.3 - Preventive action

## Description

Implement a CAPA management system that:
1. Ingests CAPA records from QMS workflows
2. Stores CAPA data in BigQuery for analytics and reporting
3. Handles Design Change Requests (DCR) linked to CAPAs
4. Provides API endpoints for CAPA creation and retrieval
5. Maintains audit trail of all CAPA activities

### Functional Requirements

**FR-8.5.2-001:** System shall accept CAPA records with the following fields:
- CAPA ID (unique identifier)
- Type (Corrective | Preventive)
- Source (Customer Complaint | Internal Audit | Process Monitoring | etc.)
- Description
- Root Cause Analysis
- Action Items
- Responsible Person
- Due Date
- Status (Open | In Progress | Completed | Closed)
- Verification of Effectiveness

**FR-8.5.2-002:** System shall store CAPA records in BigQuery with proper schema
- Table: `qms_capas`
- Partitioned by creation date
- Indexed by CAPA_ID and Status

**FR-8.5.2-003:** System shall link CAPAs to related DCRs (Design Change Requests)
- Maintain traceability between CAPA and DCR
- Store relationship in BigQuery

**FR-8.5.2-004:** System shall provide REST API endpoints:
- `POST /api/capa` - Create new CAPA
- `GET /api/capa/{id}` - Retrieve CAPA by ID
- `PUT /api/capa/{id}` - Update CAPA status
- `POST /api/dcr` - Create Design Change Request

**FR-8.5.2-005:** System shall log all CAPA operations for audit trail
- Log creation, updates, and status changes
- Include timestamp, user, and change details

## Rationale

**Regulatory Requirement:**
- ISO 13485:2016 Clause 8.5.2 requires documented corrective action procedures
- ISO 13485:2016 Clause 8.5.3 requires preventive action system
- FDA 21 CFR Part 820.100 requires CAPA procedures

**Business Need:**
- Centralized CAPA management for all quality issues
- Analytics capability for trend analysis
- Integration with existing QMS workflows
- Automated reporting for management review

**Risk Mitigation:**
- Ensures timely response to quality issues (Risk-CRM-005)
- Maintains regulatory compliance (Risk-REG-001)
- Provides evidence of continuous improvement (Risk-QUAL-003)

## Acceptance Criteria

- [x] CAPA data can be ingested via API
- [x] BigQuery tables created with proper schema
- [x] DCR-CAPA linking implemented
- [ ] All API endpoints functional and tested
- [ ] Audit logging operational
- [ ] Unit tests pass with >80% coverage
- [ ] Integration tests validate end-to-end workflow
- [ ] Error handling robust (network failures, invalid data, etc.)
- [ ] Performance acceptable (<2s for CAPA creation)

## Design Output Reference

- **Architecture Document:** `device/docs/WORKFLOW_API.md`
- **API Specification:** `device/docs/INGESTION_README.md`
- **Code Modules:**
  - `device/src/capa_ingestion.py` - CAPA ingestion logic
  - `device/src/dcr_ingestion.py` - DCR ingestion logic
  - `device/src/bigquery_client.py` - BigQuery interface
  - `device/src/workflow_router.py` - API routing
  - `device/src/workflow_handler.py` - Request handling

## Verification Method

- **Method:** Unit Test + Integration Test + Code Review
- **Test Protocols:**
  - `device/tests/test_capa_ingestion.py` - Unit tests for CAPA logic
  - `device/tests/test_bigquery_client.py` - BigQuery client tests
  - `device/tests/test_workflow_api.py` - API endpoint tests
  - `device/tests/test_dcr_capa_linking.py` - Integration tests
- **Expected Results:**
  - All tests pass
  - No errors in log output
  - BigQuery records created correctly
  - API returns proper HTTP status codes
  - Error cases handled gracefully

## Verification Results

- **Test Execution Date:** 2025-12-09
- **Verification Status:** ✅ **PASS** - All tests passing, security vulnerability RESOLVED
- **Security Audit:** [SECURITY-AUDIT-2025-12-09.md](../verification/SECURITY-AUDIT-2025-12-09.md)
- **Security Status:** VULN-001 SQL Injection - **RESOLVED** ✅
- **Test Results:** ✅ **20/20 tests passing (100% pass rate)**
  - Functional Tests: 14/14 PASS
  - Security Tests: 6/6 PASS
- **Evidence:**
  - Debug logging implemented in `CAPAIngestion.create_capa` (line 62-67)
  - Debug logging implemented in `QMSBigQueryClient.insert_rows` (line 39-54)
  - Parameterized queries implemented in all SQL operations (VULN-001 fix)
  - datetime.utcnow() deprecation fixed → datetime.now(UTC)
  - Unit tests executed and verified:
    - **CAPA Ingestion Tests:** 10/10 PASS
      - TC-8.5.2-001: CAPA creation with valid data ✅
      - TC-8.5.2-002: Required field validation ✅
      - TC-8.5.2-003: Severity validation ✅
      - TC-8.5.2-004: BigQuery error handling ✅
      - TC-8.5.2-005: Status update verification with parameterized queries ✅
      - TC-8.5.2-006: Action item creation ✅
      - TC-8.5.2-007: Approval workflow ✅
      - TC-8.5.2-008: End-to-end workflow ✅
      - TC-8.5.2-VAL-001: Schema compliance ✅
      - TC-8.5.2-VAL-002: Date format validation ✅
    - **BigQuery Client Tests:** 4/4 PASS
      - TC-BQ-001: Successful row insertion ✅
      - TC-BQ-002: Debug logging validation ✅
      - TC-BQ-003: Error handling ✅
      - TC-BQ-004: Query functionality ✅
    - **Security Tests (NEW):** 6/6 PASS
      - TC-SEC-001: SQL injection prevention - update_capa_status ✅
      - TC-SEC-002: SQL injection prevention - update_capa_analysis ✅
      - TC-SEC-003: SQL injection prevention - complete_capa_action ✅
      - TC-SEC-004: SQL injection prevention - get_capa_details ✅
      - TC-SEC-005: No f-string SQL with user input ✅
      - TC-SEC-006: Datetime deprecation fixed ✅
- **Verified By:** Engineering Team
- **Security Fix Implemented:**
  - ✅ All SQL queries refactored to use BigQuery parameterized queries
  - ✅ ScalarQueryParameter used for all user inputs
  - ✅ No direct string interpolation in WHERE clauses
  - ✅ Attack vectors tested: DROP TABLE, DELETE, UPDATE injection attempts
  - ✅ All attacks prevented by parameterization
- **Test Command:** `pytest device/tests/test_capa_ingestion.py device/tests/test_bigquery_client.py device/tests/test_sql_injection_security.py -v`
- **Test Output:** 20/20 tests passing, no warnings (except non-security items)

## Validation Evidence

- **Validation Protocol:** `documentation/DHF/validation/Req-8.5.2-validation-protocol.md`
- **Validation Report:** `documentation/DHF/validation/Req-8.5.2-validation-report.md`
- **Validation Date:** [Pending]
- **Validated By:** [Pending]

**Validation Test Cases:**
1. Create CAPA from customer complaint workflow
2. Link DCR to existing CAPA
3. Update CAPA status through lifecycle
4. Query CAPA records from BigQuery
5. Verify audit trail completeness

## Risk Assessment (ISO 14971)

### Risk ID: risk-CRM-005 - CAPA System Failure

**Hazard:** CAPA system fails to record or process corrective actions

**Severity:** High (could lead to repeated quality issues)

**Probability:** Medium (software defects, infrastructure failures)

**Risk Level:** HIGH

**Mitigation Controls:**
1. Comprehensive error handling and logging
2. Data validation before BigQuery insertion
3. Retry logic for transient failures
4. Backup logging to Cloud Logging
5. Monitoring alerts for system failures
6. Regular backup of BigQuery data

**Residual Risk:** Low (with mitigations)

**Risk Acceptable:** Yes (pending validation)

### Risk ID: risk-DATA-001 - Data Integrity

**Hazard:** CAPA data corrupted or lost

**Severity:** High

**Probability:** Low

**Risk Level:** MEDIUM

**Mitigation Controls:**
1. Schema validation before insertion
2. BigQuery backup and point-in-time recovery
3. Audit logging of all modifications
4. Regular data integrity checks

**Residual Risk:** Low

**Risk Acceptable:** Yes

## Traceability

- **Traces To:**
  - ISO 13485:2016 Clause 8.5.2 (Corrective Action)
  - ISO 13485:2016 Clause 8.5.3 (Preventive Action)
  - FDA 21 CFR 820.100 (CAPA)
- **Traced By:**
  - Test Case TC-8.5.2-001: Create CAPA
  - Test Case TC-8.5.2-002: BigQuery storage
  - Test Case TC-8.5.2-003: DCR linking
  - Test Case TC-8.5.2-004: API endpoints
  - Test Case TC-8.5.2-005: Audit logging
- **Matrix:** `documentation/traceability/Req-8.5.2-matrix.xlsx`

## Implementation

- **Code Locations:**
  - `device/src/capa_ingestion.py:1-150` - Main CAPA logic
  - `device/src/bigquery_client.py:1-80` - BigQuery interface
  - `device/src/dcr_ingestion.py:1-100` - DCR handling
  - `device/src/workflow_router.py:1-60` - API routing
  - `device/src/workflow_handler.py:1-120` - Request processing
- **Commit SHA:** [Pending]
- **Branch:** release/v1.0-phase2-dec9-2025-rc1
- **Pull Request:** [Pending]

## Current Status

**Development:** ✅ Complete
**Testing:** ⏳ In Progress
**Issue:** BigQuery insertion errors detected
**Debug Action:** Added logging to identify root cause
**Next Steps:**
1. Run workflow tests with debug logging
2. Review logs for data format issues
3. Fix BigQuery schema or data serialization
4. Re-test until all tests pass
5. Complete validation protocol

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-09 | Engineering | Initial DHF entry for CAPA management system |
| 1.1 | 2025-12-09 | Engineering | Added debug logging for troubleshooting BigQuery errors |

## Review and Approval

- **Design Review Date:** [Pending]
- **Review Minutes:** `documentation/DHF/reviews/2025-12-09-capa-review.md`
- **Reviewers:** [Pending]
- **Approval Signatures:**
  - Engineering: ___________________ Date: _______
  - Quality: ___________________ Date: _______
  - Regulatory (if applicable): ___________________ Date: _______

---

**Status:** 🟡 IN PROGRESS - Debug logging added, awaiting test results
