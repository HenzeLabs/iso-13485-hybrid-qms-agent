# Phase 5 Master Evidence Directory Structure

**Release:** QMS Agent v1.0 Phase 5  
**Purpose:** Audit-ready evidence organization for 7+ year retention  
**Classification:** REGULATORY EVIDENCE — CONFIDENTIAL

---

## Directory Tree Structure

```
Phase5-Evidence/
│
├── README.md (this file + instructions)
│
├── Category_A_UI/
│   ├── 4C-001_Chat_Initialization/
│   │   ├── test_result.md (see template below)
│   │   ├── screenshot_step1_message_appears.png
│   │   ├── screenshot_step2_loading.png
│   │   ├── screenshot_step3_response.png
│   │   ├── screenshot_step4_citations.png
│   │   ├── browser_console_log_step1.txt
│   │   ├── browser_console_log_step2.txt
│   │   ├── devtools_application_localstorage.json
│   │   └── evidence_manifest.txt
│   │
│   ├── 4C-004_Confirmation_Approve/
│   │   ├── test_result.md
│   │   ├── screenshot_confirm_dialog.png
│   │   ├── screenshot_pending_action.png
│   │   ├── screenshot_execution_success.png
│   │   ├── browser_console_log.txt
│   │   ├── devtools_network_confirm_action_request.json
│   │   ├── devtools_network_confirm_action_response.json
│   │   └── evidence_manifest.txt
│   │
│   ├── 4C-005_Confirmation_Reject/
│   │   ├── test_result.md
│   │   ├── screenshot_reject_dialog.png
│   │   ├── screenshot_cancel_message.png
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   └── 4C-006_Citation_Display/
│       ├── test_result.md
│       ├── screenshot_citations_panel.png
│       ├── screenshot_citation_link_click.png
│       ├── browser_console_log.txt
│       └── evidence_manifest.txt
│
├── Category_B_LLM/
│   ├── 4C-002_Query_Processing/
│   │   ├── test_result.md
│   │   ├── screenshot_user_message.png
│   │   ├── screenshot_loading_state.png
│   │   ├── screenshot_assistant_response.png
│   │   ├── devtools_network_ai_chat_request.json
│   │   ├── devtools_network_ai_chat_response.json
│   │   ├── openai_request_body.json
│   │   ├── openai_response_body.json
│   │   ├── response_time_measurement.txt
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4C-003_Function_Call_Execution/
│   │   ├── test_result.md
│   │   ├── screenshot_function_proposal.png
│   │   ├── screenshot_pending_action_created.png
│   │   ├── devtools_network_create_capa_request.json
│   │   ├── devtools_network_create_capa_response.json
│   │   ├── action_layer_function_call_payload.json
│   │   ├── action_layer_response_citations.json
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4C-007_State_Persistence/
│   │   ├── test_result.md
│   │   ├── screenshot_pre_reload_conversation.png
│   │   ├── screenshot_post_reload_conversation.png
│   │   ├── devtools_localstorage_before_reload.json
│   │   ├── devtools_localstorage_after_reload.json
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   └── 4C-008_Field_Auto_Population/
│       ├── test_result.md
│       ├── screenshot_draft_proposal.png
│       ├── screenshot_form_prefilled.png
│       ├── screenshot_form_submission.png
│       ├── browser_console_log.txt
│       └── evidence_manifest.txt
│
├── Category_C_Auth/
│   ├── 4D-001_OAuth_Sign_In/
│   │   ├── test_result.md
│   │   ├── screenshot_google_consent.png
│   │   ├── screenshot_portal_signed_in.png
│   │   ├── devtools_application_cookies.txt
│   │   ├── jwt_payload_decoded.json
│   │   ├── jwt_header_decoded.json
│   │   ├── session_user_data.json
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4D-002_RBAC_Deny_Engineer/
│   │   ├── test_result.md
│   │   ├── screenshot_capa_manager_no_button.png
│   │   ├── screenshot_permission_denied_error.png
│   │   ├── devtools_network_forbidden_403.json
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4D-003_RBAC_Allow_QA/
│   │   ├── test_result.md
│   │   ├── screenshot_capa_manager_button_visible.png
│   │   ├── screenshot_create_capa_form.png
│   │   ├── screenshot_capa_created_success.png
│   │   ├── devtools_network_create_success.json
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4D-004_Permission_Matrix/
│   │   ├── test_result.md
│   │   ├── 4D-004_Engineer_Test/
│   │   │   ├── screenshot_role_engineer.png
│   │   │   ├── role_permissions.txt
│   │   │   └── action_attempt_log.txt
│   │   ├── 4D-004_QA_Test/
│   │   │   ├── screenshot_role_qa.png
│   │   │   ├── role_permissions.txt
│   │   │   └── action_attempt_log.txt
│   │   ├── 4D-004_Manager_Test/
│   │   │   ├── screenshot_role_manager.png
│   │   │   ├── role_permissions.txt
│   │   │   └── action_attempt_log.txt
│   │   ├── 4D-004_Admin_Test/
│   │   │   ├── screenshot_role_admin.png
│   │   │   ├── role_permissions.txt
│   │   │   └── action_attempt_log.txt
│   │   ├── 4D-004_Production_Test/
│   │   │   ├── screenshot_role_production.png
│   │   │   ├── role_permissions.txt
│   │   │   └── action_attempt_log.txt
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4D-005_Session_Timeout/
│   │   ├── test_result.md
│   │   ├── screenshot_session_created.png
│   │   ├── screenshot_8hr_timeout_trigger.png
│   │   ├── screenshot_redirect_signin.png
│   │   ├── jwt_expiration_time.txt
│   │   ├── devtools_network_401_unauthorized.json
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4D-006_User_Logout/
│   │   ├── test_result.md
│   │   ├── screenshot_signout_button.png
│   │   ├── screenshot_after_logout.png
│   │   ├── devtools_application_cookies_cleared.txt
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4CD-001_AI_RBAC_Integration/
│   │   ├── test_result.md
│   │   ├── screenshot_engineer_query.png
│   │   ├── screenshot_permission_denied_ai.png
│   │   ├── screenshot_engineer_dcr_allowed.png
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   └── 4D-007_Audit_Event_Logging/
│       ├── test_result.md
│       ├── bigquery_audit_events_export.csv
│       ├── bigquery_query_all_events.sql
│       ├── audit_event_samples.json
│       ├── event_field_validation.txt
│       ├── browser_console_log.txt
│       └── evidence_manifest.txt
│
├── Category_D_Audit/
│   ├── 4D-007_Audit_Complete/
│   │   ├── test_result.md
│   │   ├── bigquery_event_types_inventory.csv
│   │   │   (USER_LOGIN, USER_LOGOUT, CAPA_CREATE, CAPA_APPROVE, etc.)
│   │   ├── bigquery_required_fields_check.txt
│   │   │   (timestamp, userId, userEmail, userRole, action, resourceId, ipAddress, userAgent)
│   │   ├── event_sample_USER_LOGIN.json
│   │   ├── event_sample_CAPA_CREATE.json
│   │   ├── event_sample_AI_QUERY.json
│   │   ├── event_sample_AI_ACTION_CONFIRMED.json
│   │   ├── event_sample_AI_ACTION_REJECTED.json
│   │   ├── event_sample_CAPA_APPROVE.json
│   │   ├── event_sample_DCR_CREATE.json
│   │   ├── event_sample_DCR_UPDATE.json
│   │   ├── event_sample_DCR_APPROVE.json
│   │   ├── event_sample_USER_LOGOUT.json
│   │   └── evidence_manifest.txt
│   │
│   ├── 4CD-002_Audit_Trail_E2E/
│   │   ├── test_result.md
│   │   ├── audit_chain_session_123_complete.json
│   │   │   (Linked events: AI_QUERY → AI_ACTION_CONFIRMED → CAPA_CREATE)
│   │   ├── bigquery_trace_timeline.csv
│   │   ├── event_linkage_validation.txt
│   │   ├── sessionId_userId_validation.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── 4CD-004_Audit_Security_NoPII/
│   │   ├── test_result.md
│   │   ├── bigquery_audit_table_export.csv
│   │   ├── pii_scan_results.txt
│   │   │   (Check for: passwords, form data, secrets, plaintext PII)
│   │   ├── audit_log_sample_no_violations.json
│   │   ├── browser_console_log.txt
│   │   └── evidence_manifest.txt
│   │
│   └── 4CD-005_ISO13485_Traceability/
│       ├── test_result.md
│       ├── iso_13485_clause_7_3_6_mapping.md
│       ├── traceability_evidence_capa_id_12345.json
│       │   (User + Timestamp + Action + Resource ID)
│       ├── traceability_evidence_dcr_id_67890.json
│       ├── audit_verification_complete.txt
│       └── evidence_manifest.txt
│
├── Category_E_Performance/
│   ├── 4CD-003_Response_Time_Load/
│   │   ├── test_result.md
│   │   ├── jmeter_load_test_plan.xml
│   │   ├── jmeter_results_10_concurrent_users.json
│   │   ├── response_time_histogram.png
│   │   ├── response_time_percentiles.csv
│   │   │   (50th, 90th, 95th, 99th percentile)
│   │   ├── api_latency_measurements.txt
│   │   │   (/api/ai/chat, /api/ai/confirm-action, /api/auth/user-role)
│   │   ├── concurrent_session_collision_check.txt
│   │   ├── browser_memory_profile.txt
│   │   ├── network_bandwidth_usage.txt
│   │   └── evidence_manifest.txt
│   │
│   └── 4C-007-Extended_Conversation_Resilience/
│       ├── test_result.md
│       ├── conversation_100_messages.json
│       ├── conversation_replay_after_reload.md
│       ├── memory_usage_before_after.txt
│       ├── browser_console_errors.txt
│       ├── network_requests_count.txt
│       ├── localstorage_size_bytes.txt
│       └── evidence_manifest.txt
│
├── Category_F_Compliance/
│   ├── ISO_13485_Clause_7.3.6/
│   │   ├── test_result.md
│   │   ├── requirement_traceability_evidenced.txt
│   │   ├── audit_trail_sample.json
│   │   ├── user_identity_verification.txt
│   │   ├── timestamp_format_validation.txt
│   │   ├── action_tracking_verification.txt
│   │   ├── resource_linkage_verification.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── ISO_13485_Clause_7.5.4.2/
│   │   ├── test_result.md
│   │   ├── authentication_oauth_flow.md
│   │   ├── authorization_rbac_matrix.txt
│   │   ├── jwt_token_validation.txt
│   │   ├── session_lifecycle.md
│   │   └── evidence_manifest.txt
│   │
│   ├── ISO_13485_Clause_7.5.4.3/
│   │   ├── test_result.md
│   │   ├── automated_system_requirements.md
│   │   ├── confirmation_gate_functional.md
│   │   ├── citation_retrieval_working.md
│   │   ├── human_review_enforced.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── FDA_21CFR11_Section_11.10/
│   │   ├── test_result.md
│   │   ├── audit_trail_immutability_verified.txt
│   │   ├── audit_trail_time_order_verified.txt
│   │   ├── audit_trail_completeness_verified.txt
│   │   ├── append_only_enforcement.txt
│   │   └── evidence_manifest.txt
│   │
│   ├── FDA_21CFR11_Section_11.100/
│   │   ├── test_result.md
│   │   ├── authentication_method_oauth.md
│   │   ├── user_identification_verified.txt
│   │   ├── session_management_checked.txt
│   │   └── evidence_manifest.txt
│   │
│   └── Compliance_Matrix/
│       ├── ISO_13485_FDA_Compliance_Matrix.xlsx
│       ├── compliance_mapping_results.txt
│       ├── regulatory_gaps_identified.md (if any)
│       └── evidence_manifest.txt
│
├── Metadata/
│   ├── test_environment_config.txt
│   │   (Portal URL, database schema, OpenAI version, BigQuery schema)
│   ├── test_user_accounts.txt
│   │   (test.engineer@..., test.qa@..., etc. with roles)
│   ├── execution_schedule.md
│   ├── test_data_manifest.txt
│   ├── known_issues_baseline.md
│   └── environment_validation_checklist.md
│
├── Supporting_Docs/
│   ├── PHASE5-VALIDATION-PROTOCOL.md (copy)
│   ├── QA-VALIDATION-PHASE4C-4D.md (copy)
│   ├── PHASE4C-4D-CLOSEOUT.md (copy)
│   └── evidence_retention_policy.md
│
└── Index.md
    (Master index of all evidence; generated after completion)

```

---

## File Naming Conventions

All evidence files must follow this naming standard for traceability:

### **Screenshots**

```
screenshot_<test_id>_<step_number>_<description>.png
Example: screenshot_4C-002_step2_loading_indicator.png
```

### **JSON Exports (API/Audit)**

```
<system>_<operation>_<timestamp|identifier>.json
Example: devtools_network_ai_chat_request_20251209_143000.json
Example: bigquery_audit_events_export_20251209.json
Example: jwt_payload_decoded.json
```

### **Logs**

```
<system>_<component>_<timestamp>.txt
Example: browser_console_log_20251209_143500.txt
Example: network_trace_20251209.txt
Example: localstorage_dump_20251209.json
```

### **Analysis Documents**

```
<analysis_type>_<subject>_<date>.md or .txt
Example: event_completeness_check_20251209.txt
Example: permission_matrix_validation_results.txt
Example: performance_metrics_summary.md
```

---

## Evidence Capture Checklist

For each test case, capture:

### **Always Required**

- ☐ Test result document (`test_result.md`)
- ☐ At least 2 screenshots per test case (step start, step end)
- ☐ Browser console log (DevTools → Console)
- ☐ Evidence manifest (inventory of all files)

### **For API/Network Tests**

- ☐ DevTools Network tab capture (Request + Response JSON)
- ☐ Request headers
- ☐ Response body (including status code)
- ☐ Response timing (latency in milliseconds)

### **For RBAC Tests**

- ☐ JWT token payload (decoded, not secret)
- ☐ Session cookies (domain, path, secure flag)
- ☐ Role + permissions verification
- ☐ Permission denied error messages

### **For Audit Trail Tests**

- ☐ BigQuery query + results (CSV export)
- ☐ Sample audit events (JSON)
- ☐ Event field completeness check
- ☐ Timestamp format validation (ISO 8601)
- ☐ User ID linkage verification

### **For Performance Tests**

- ☐ Load test results (JMeter or Locust output)
- ☐ Response time histogram (screenshot or CSV)
- ☐ Concurrent user metrics
- ☐ Resource usage (CPU, memory, bandwidth)

### **For Compliance Tests**

- ☐ Regulatory requirement documentation
- ☐ Evidence linking to requirement
- ☐ Pass/fail justification
- ☐ Certification statement (if applicable)

---

## Evidence Manifest Template

Each test case folder must include `evidence_manifest.txt`:

```
TEST CASE: 4C-002 — Query Processing
EXECUTION DATE: ____/____/2025
EXECUTED BY: [QA Tester Name]
DURATION: [## minutes]

FILES CAPTURED:
1. test_result.md — Test case result document with pass/fail decision
2. screenshot_4C-002_step1_user_message.png — Message appearance
3. screenshot_4C-002_step2_loading_state.png — Loading indicator
4. screenshot_4C-002_step3_assistant_response.png — Assistant response
5. devtools_network_ai_chat_request.json — API request body
6. devtools_network_ai_chat_response.json — API response body + timing
7. openai_request_body.json — OpenAI API call payload
8. openai_response_body.json — OpenAI response (function calls + citations)
9. response_time_measurement.txt — Latency: [##] ms
10. browser_console_log.txt — Console output (no errors)

INTEGRITY CHECK:
☐ All files present
☐ All files readable
☐ File sizes reasonable (not corrupted)
☐ Timestamps on files match execution date

STORAGE LOCATION:
/Phase5-Evidence/Category_B_LLM/4C-002_Query_Processing/

ARCHIVAL DATE: ____/____/2025
ARCHIVE LOCATION: [S3/GCS bucket, tape drive, or retention system]

SIGNED BY: __________________ DATE: ____/____/2025
```

---

## Test Result Document Template

Each test case must include `test_result.md` with this structure:

```markdown
# Test Case Result: 4C-002 — Query Processing

**Test ID:** 4C-002  
**Feature:** AI Chat Message Sending  
**Category:** B (LLM & Function Calling)  
**Executed By:** [QA Tester Name]  
**Execution Date:** \_**\_/\_\_**/2025  
**Duration:** [## minutes]

## Test Steps & Results

### Step 1: User Types Query

**Expected:** Message appears in chat bubble; textarea clears  
**Actual:** [Result achieved / Result NOT achieved]  
**Evidence:** screenshot_4C-002_step1_user_message.png  
**Pass/Fail:** ☐ PASS ☐ FAIL

### Step 2: Assistant Processing Starts

**Expected:** Loading indicator visible; Send button disabled  
**Actual:** [Result]  
**Evidence:** screenshot_4C-002_step2_loading_state.png  
**Pass/Fail:** ☐ PASS ☐ FAIL

### Step 3: OpenAI Function Call

**Expected:** Assistant response visible; function calls returned  
**Actual:** [Result]  
**Evidence:** devtools_network_ai_chat_response.json  
**Pass/Fail:** ☐ PASS ☐ FAIL

### Step 4: State Persisted

**Expected:** localStorage updated with message  
**Actual:** [Result]  
**Evidence:** devtools_application_localstorage.json  
**Pass/Fail:** ☐ PASS ☐ FAIL

## Overall Result

**Pass Criteria:** All 4 steps PASS; response time < 3 seconds  
**Overall:** ☐ PASS ☐ FAIL ☐ CONDITIONAL PASS

## Observations & Notes

[Any deviations from expected behavior; environmental issues; workarounds]

## Root Cause (if FAIL)

[Describe why test failed; reference logs/screenshots]

## Sign-Off

**QA Tester:** ********\_\_******** **Date:** \_**\_/\_\_**/2025  
**QA Reviewer:** ********\_\_******** **Date:** \_**\_/\_\_**/2025
```

---

## Retention & Archive Policy

### **Short-Term (During Validation)**

- Evidence stored in Phase5-Evidence/ directory (project repository or shared storage)
- All files backed up daily
- Access: QA team + Engineering

### **Long-Term (7+ Years)**

- After Phase 5 sign-off, evidence archived to:
  - **Primary:** Cloud storage (GCS Archive class or S3 Glacier)
  - **Secondary:** Offline tape or external drive (geographically separate)
- Checksums (SHA-256) computed and stored
- Access restricted to Quality/Compliance team + auditors

### **Disposal**

After 7 years, evidence may be securely destroyed with documented approval from Quality Manager + Compliance Officer.

---

## Access & Permissions

| Role               | Read | Write | Delete | Archive |
| ------------------ | ---- | ----- | ------ | ------- |
| QA Tester          | ✓    | ✓     | ✗      | ✗       |
| QA Lead            | ✓    | ✓     | ✗      | ✓       |
| Quality Manager    | ✓    | ✗     | ✗      | ✓       |
| Compliance Officer | ✓    | ✗     | ✗      | ✓       |
| Auditor (external) | ✓    | ✗     | ✗      | ✗       |

---

**Document Version:** 1.0  
**Date Created:** December 9, 2025  
**Last Updated:** [After initial evidence captured]  
**Retention Period:** 7 years
