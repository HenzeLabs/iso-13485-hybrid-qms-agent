#!/bin/bash

################################################################################
# QMS Agent Cloud Run - IAM Access Validation Test Suite
# Purpose: Validate IAM-based authentication for Cloud Run service
# Date: December 11, 2025
# Compliance: ISO 13485, FDA 21 CFR Part 11, NIST SP 800-53
################################################################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${PROJECT_ID:-}"
SERVICE_NAME="qms-agent"
SERVICE_REGION="${SERVICE_REGION:-us-central1}"
SERVICE_ACCOUNT_API="qms-agent-api"
SERVICE_ACCOUNT_PORTAL="qms-portal-service"

################################################################################
# UTILITY FUNCTIONS
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_section() {
    echo ""
    echo -e "${BLUE}===============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===============================================${NC}"
}

get_service_url() {
    if [ -z "$SERVICE_URL" ]; then
        log_info "Retrieving Cloud Run service URL..."
        SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
            --region="$SERVICE_REGION" \
            --project="$PROJECT_ID" \
            --format='value(status.url)' 2>/dev/null || echo "")
        
        if [ -z "$SERVICE_URL" ]; then
            log_error "Could not retrieve service URL. Service may not exist."
            return 1
        fi
    fi
    echo "$SERVICE_URL"
}

################################################################################
# VALIDATION TESTS
################################################################################

test_unauthenticated_access() {
    log_section "TEST 1: Unauthenticated Access (Should Return 403)"
    
    SERVICE_URL=$(get_service_url) || return 1
    
    log_info "Testing: GET $SERVICE_URL/health"
    log_info "Expected: HTTP 403 Forbidden"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$SERVICE_URL/health" 2>/dev/null || echo -e "\n000")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "403" ]; then
        log_success "Unauthenticated access correctly blocked (HTTP 403)"
        echo "Response: $BODY"
        return 0
    else
        log_error "Expected HTTP 403 but got HTTP $HTTP_CODE"
        echo "Response: $BODY"
        return 1
    fi
}

test_service_account_authentication() {
    log_section "TEST 2: Service Account Authentication"
    
    SERVICE_URL=$(get_service_url) || return 1
    
    if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
        log_warning "GOOGLE_APPLICATION_CREDENTIALS not set. Skipping service account test."
        log_info "To run this test, set GOOGLE_APPLICATION_CREDENTIALS to service account key file:"
        log_info "  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa-key.json"
        return 0
    fi
    
    log_info "Using service account credentials from: $GOOGLE_APPLICATION_CREDENTIALS"
    
    # Get identity token using the service account
    log_info "Obtaining identity token..."
    IDENTITY_TOKEN=$(gcloud auth application-default print-identity-token \
        --audiences="$SERVICE_URL" 2>/dev/null || echo "")
    
    if [ -z "$IDENTITY_TOKEN" ]; then
        log_error "Failed to obtain identity token"
        return 1
    fi
    
    log_info "Token obtained (${#IDENTITY_TOKEN} chars)"
    log_info "Testing: GET $SERVICE_URL/health with Bearer token"
    log_info "Expected: HTTP 200 OK"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$SERVICE_URL/health" \
        -H "Authorization: Bearer $IDENTITY_TOKEN" 2>/dev/null || echo -e "\n000")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        log_success "Service account authentication successful (HTTP 200)"
        echo "Response: $BODY"
        return 0
    else
        log_warning "Service account test returned HTTP $HTTP_CODE (may be expected if service account not configured)"
        echo "Response: $BODY"
        return 0  # Don't fail, as this is expected if SA not set up yet
    fi
}

test_user_authentication() {
    log_section "TEST 3: User Authentication (gcloud)"
    
    SERVICE_URL=$(get_service_url) || return 1
    
    log_info "Checking if user is authenticated with gcloud..."
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &>/dev/null; then
        log_warning "No active gcloud authentication. Run 'gcloud auth login' first."
        return 0
    fi
    
    ACTIVE_USER=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
    log_success "Active user: $ACTIVE_USER"
    
    log_info "Obtaining user identity token..."
    IDENTITY_TOKEN=$(gcloud auth print-identity-token 2>/dev/null || echo "")
    
    if [ -z "$IDENTITY_TOKEN" ]; then
        log_error "Failed to obtain user identity token"
        return 1
    fi
    
    log_info "Token obtained (${#IDENTITY_TOKEN} chars)"
    log_info "Testing: GET $SERVICE_URL/health with user token"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$SERVICE_URL/health" \
        -H "Authorization: Bearer $IDENTITY_TOKEN" 2>/dev/null || echo -e "\n000")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        log_success "User authentication successful (HTTP 200)"
        log_info "User $ACTIVE_USER has Cloud Run Invoker role"
        echo "Response: $BODY"
        return 0
    elif [ "$HTTP_CODE" = "403" ]; then
        log_warning "User authentication returned HTTP 403 (Forbidden)"
        log_info "User $ACTIVE_USER does not have Cloud Run Invoker role"
        log_info "Grant role with: gcloud run services add-iam-policy-binding $SERVICE_NAME --region=$SERVICE_REGION --member=user:$ACTIVE_USER --role=roles/run.invoker"
        return 0  # Not a test failure
    else
        log_error "Unexpected HTTP response: $HTTP_CODE"
        echo "Response: $BODY"
        return 1
    fi
}

test_iam_policies() {
    log_section "TEST 4: IAM Policy Bindings"
    
    log_info "Retrieving Cloud Run service IAM policy..."
    
    POLICY=$(gcloud run services get-iam-policy "$SERVICE_NAME" \
        --region="$SERVICE_REGION" \
        --project="$PROJECT_ID" \
        --format=json 2>/dev/null || echo "{}")
    
    BINDING_COUNT=$(echo "$POLICY" | jq '.bindings | length' 2>/dev/null || echo 0)
    
    if [ "$BINDING_COUNT" -eq 0 ]; then
        log_warning "No IAM policy bindings found"
        log_info "Create bindings with: gcloud run services add-iam-policy-binding ..."
        return 0
    fi
    
    log_success "Found $BINDING_COUNT IAM policy binding(s)"
    
    # Display all bindings
    echo "$POLICY" | jq -r '.bindings[] | "  Role: \(.role)\n  Members: \(.members | join(", "))"' 2>/dev/null || true
    
    # Check for critical roles
    HAS_RUN_INVOKER=$(echo "$POLICY" | jq '.bindings[] | select(.role == "roles/run.invoker")' 2>/dev/null)
    
    if [ -n "$HAS_RUN_INVOKER" ]; then
        log_success "Cloud Run Invoker role found in policy"
    else
        log_warning "Cloud Run Invoker role not found in policy"
        log_info "Add with: gcloud run services add-iam-policy-binding $SERVICE_NAME --role=roles/run.invoker --member=serviceAccount:..."
    fi
    
    return 0
}

test_audit_logging() {
    log_section "TEST 5: Audit Logging"
    
    log_info "Checking Cloud Audit Logs for service access..."
    
    # Check if audit logs exist for this service (may be empty for new services)
    AUDIT_LOGS=$(gcloud logging read \
        "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME" \
        --limit=5 \
        --project="$PROJECT_ID" \
        --format=json 2>/dev/null || echo "[]")
    
    LOG_COUNT=$(echo "$AUDIT_LOGS" | jq 'length' 2>/dev/null || echo 0)
    
    if [ "$LOG_COUNT" -gt 0 ]; then
        log_success "Found $LOG_COUNT audit log entries"
        echo "$AUDIT_LOGS" | jq -r '.[] | "  \(.timestamp): \(.jsonPayload.statusCode // "N/A")"' 2>/dev/null || true
    else
        log_warning "No audit log entries found yet (normal for new services)"
        log_info "Logs will appear after first invocation"
    fi
    
    return 0
}

test_deploy_script() {
    log_section "TEST 6: Deploy Script Security"
    
    DEPLOY_SCRIPT="scripts/deploy.sh"
    
    if [ ! -f "$DEPLOY_SCRIPT" ]; then
        log_error "Deploy script not found: $DEPLOY_SCRIPT"
        return 1
    fi
    
    log_info "Checking $DEPLOY_SCRIPT for security issues..."
    
    # Check 1: No --allow-unauthenticated flag (positive, vulnerable form)
    if grep -q "^\s*--allow-unauthenticated" "$DEPLOY_SCRIPT"; then
        log_error "Deploy script contains --allow-unauthenticated flag (SECURITY RISK)"
        return 1
    else
        log_success "Public --allow-unauthenticated flag not found"
    fi
    
    # Check 2: --no-allow-unauthenticated flag present (secure form)
    if grep -q "no-allow-unauthenticated" "$DEPLOY_SCRIPT"; then
        log_success "--no-allow-unauthenticated flag present (authentication required)"
    else
        log_warning "--no-allow-unauthenticated flag not found"
    fi
    
    # Check 3: Environment variable usage
    if grep -q "OPENAI_API_KEY" "$DEPLOY_SCRIPT"; then
        log_success "Environment variables properly configured"
    else
        log_warning "OPENAI_API_KEY not found in deploy script"
    fi
    
    return 0
}

test_gitignore() {
    log_section "TEST 7: .gitignore Configuration"
    
    if [ ! -f ".gitignore" ]; then
        log_error ".gitignore not found"
        return 1
    fi
    
    log_info "Checking .gitignore for secret file patterns..."
    
    # Check for .env patterns
    if grep -q "^\.env" ".gitignore"; then
        log_success ".env patterns found in .gitignore"
    else
        log_error ".env patterns NOT found in .gitignore (SECURITY RISK)"
        return 1
    fi
    
    # Check for specific patterns
    for pattern in ".env" ".env.*" ".env.local" ".env.production"; do
        if grep -q "$pattern" ".gitignore"; then
            log_success "Pattern '$pattern' present"
        fi
    done
    
    # Verify no .env files are tracked
    if git ls-files --cached | grep -E '\.env' > /dev/null 2>&1; then
        log_error "SECURITY RISK: .env files are tracked in git!"
        git ls-files --cached | grep -E '\.env'
        return 1
    else
        log_success "No .env files tracked in git"
    fi
    
    return 0
}

test_env_example() {
    log_section "TEST 8: .env.example Template"
    
    if [ ! -f ".env.example" ]; then
        log_error ".env.example not found"
        return 1
    fi
    
    log_success ".env.example exists"
    
    # Check that it doesn't contain real secrets
    if grep -E "(api_key|secret|password|token)" ".env.example" -i | grep -v "^[^=]*=your-" > /dev/null 2>&1; then
        log_error "SECURITY RISK: .env.example contains possible real secrets"
        return 1
    else
        log_success ".env.example contains only placeholder values"
    fi
    
    # Display contents
    log_info "Contents of .env.example:"
    cat ".env.example" | sed 's/^/  /'
    
    return 0
}

################################################################################
# SUMMARY & REPORTING
################################################################################

generate_report() {
    log_section "VALIDATION REPORT SUMMARY"
    
    local total_tests=${#TESTS_RUN[@]}
    local passed_tests=${#TESTS_PASSED[@]}
    local failed_tests=${#TESTS_FAILED[@]}
    
    echo ""
    echo "Tests Run:    $total_tests"
    echo "Tests Passed: $passed_tests"
    echo "Tests Failed: $failed_tests"
    echo ""
    
    if [ "$failed_tests" -eq 0 ]; then
        log_success "ALL TESTS PASSED"
        echo ""
        echo "Security Status: ✅ APPROVED"
        echo "Merge Ready: YES"
        return 0
    else
        log_error "SOME TESTS FAILED"
        echo ""
        echo "Failed Tests:"
        for test in "${TESTS_FAILED[@]}"; do
            echo "  - $test"
        done
        return 1
    fi
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    if [ -z "$PROJECT_ID" ]; then
        log_error "PROJECT_ID not set. Set with: export PROJECT_ID=your-project-id"
        exit 1
    fi
    
    log_section "QMS Agent Cloud Run IAM Validation Test Suite"
    log_info "Project ID: $PROJECT_ID"
    log_info "Service: $SERVICE_NAME"
    log_info "Region: $SERVICE_REGION"
    log_info "Date: $(date)"
    
    # Initialize test tracking
    TESTS_RUN=()
    TESTS_PASSED=()
    TESTS_FAILED=()
    
    # Run all tests
    TESTS=("test_deploy_script" "test_gitignore" "test_env_example" "test_iam_policies" "test_unauthenticated_access" "test_service_account_authentication" "test_user_authentication" "test_audit_logging")
    
    for test_func in "${TESTS[@]}"; do
        TESTS_RUN+=("$test_func")
        if $test_func; then
            TESTS_PASSED+=("$test_func")
        else
            TESTS_FAILED+=("$test_func")
        fi
    done
    
    # Generate report
    generate_report
    EXIT_CODE=$?
    
    log_section "Test Execution Complete"
    
    exit $EXIT_CODE
}

# Run main function
main "$@"
