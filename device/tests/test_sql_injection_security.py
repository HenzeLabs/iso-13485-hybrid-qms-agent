"""
Security Tests for SQL Injection Prevention
ISO 13485:2016 Clause 7.3.5 - Design Verification (Security Testing)

Verifies VULN-001 resolution: All SQL queries use parameterized queries
to prevent SQL injection attacks.

Test Coverage: Security risk-DATA-001, risk-CRM-005
"""

import pytest
from unittest.mock import Mock, patch
from datetime import date
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from capa_ingestion import CAPAIngestion
from google.cloud import bigquery


class TestSQLInjectionPrevention:
    """Test suite for SQL injection prevention (VULN-001 fix verification)"""

    def setup_method(self):
        """Set up test fixtures"""
        with patch('capa_ingestion.QMSBigQueryClient') as mock_bq:
            self.mock_bq_client = Mock()
            mock_bq.return_value = self.mock_bq_client
            self.capa_ingestion = CAPAIngestion()

    def test_update_capa_status_prevents_sql_injection(self):
        """
        TC-SEC-001: Verify SQL injection is prevented in update_capa_status

        Attack Vector: Malicious status value attempting SQL injection
        Expected: Parameterized query prevents injection
        Risk Control: risk-DATA-001
        """
        # Arrange
        mock_query_job = Mock()
        mock_query_job.result.return_value = []
        self.mock_bq_client.client = Mock()
        self.mock_bq_client.client.query.return_value = mock_query_job
        self.mock_bq_client.project_id = "lw-qms-rag"
        self.mock_bq_client.dataset_id = "qms_workflows"

        # SQL injection attempt in status
        malicious_status = "Closed'; DROP TABLE capa_cases; --"
        malicious_capa_id = "CAPA-123'; DELETE FROM capa_cases WHERE '1'='1"

        # Act
        self.capa_ingestion.update_capa_status(malicious_capa_id, malicious_status)

        # Assert
        sql_call = self.mock_bq_client.client.query.call_args[0][0]
        job_config = self.mock_bq_client.client.query.call_args[1].get("job_config")

        # Verify parameterized queries used (no direct string interpolation)
        assert "@new_status" in sql_call  # Parameterized
        assert "@capa_id" in sql_call  # Parameterized
        assert malicious_status not in sql_call  # NOT directly in SQL!
        assert malicious_capa_id not in sql_call  # NOT directly in SQL!

        # Verify parameters passed safely
        assert job_config is not None
        assert len(job_config.query_parameters) == 2

        # Malicious strings passed as PARAMETERS, not raw SQL
        param_values = {p.name: p.value for p in job_config.query_parameters}
        assert param_values["new_status"] == malicious_status  # Safe parameter
        assert param_values["capa_id"] == malicious_capa_id  # Safe parameter

    def test_update_capa_analysis_prevents_sql_injection(self):
        """
        TC-SEC-002: Verify SQL injection is prevented in update_capa_analysis

        Attack Vector: Malicious root_cause attempting SQL injection
        Expected: Parameterized query prevents injection
        Risk Control: risk-DATA-001
        """
        # Arrange
        mock_query_job = Mock()
        mock_query_job.result.return_value = []
        self.mock_bq_client.client = Mock()
        self.mock_bq_client.client.query.return_value = mock_query_job
        self.mock_bq_client.project_id = "lw-qms-rag"
        self.mock_bq_client.dataset_id = "qms_workflows"

        # SQL injection attempts
        malicious_root_cause = "Test'; UPDATE capa_cases SET status='Closed' WHERE '1'='1'; --"
        malicious_correction = "Fix'; DROP TABLE capa_approvals; --"

        # Act
        self.capa_ingestion.update_capa_analysis(
            capa_id="CAPA-001",
            root_cause=malicious_root_cause,
            correction=malicious_correction
        )

        # Assert
        sql_call = self.mock_bq_client.client.query.call_args[0][0]
        job_config = self.mock_bq_client.client.query.call_args[1].get("job_config")

        # Verify parameterized queries
        assert "@root_cause" in sql_call
        assert "@correction" in sql_call
        assert "@capa_id" in sql_call

        # Malicious strings NOT in raw SQL
        assert malicious_root_cause not in sql_call
        assert malicious_correction not in sql_call

        # Verify parameters
        assert job_config is not None
        param_names = [p.name for p in job_config.query_parameters]
        assert "root_cause" in param_names
        assert "correction" in param_names
        assert "capa_id" in param_names

    def test_complete_capa_action_prevents_sql_injection(self):
        """
        TC-SEC-003: Verify SQL injection is prevented in complete_capa_action

        Attack Vector: Malicious action_id attempting SQL injection
        Expected: Parameterized query prevents injection
        Risk Control: risk-DATA-001
        """
        # Arrange
        mock_query_job = Mock()
        mock_query_job.result.return_value = []
        self.mock_bq_client.client = Mock()
        self.mock_bq_client.client.query.return_value = mock_query_job
        self.mock_bq_client.project_id = "lw-qms-rag"
        self.mock_bq_client.dataset_id = "qms_workflows"

        # SQL injection attempt
        malicious_action_id = "ACT-123'; UPDATE capa_actions SET status='Completed'; --"

        # Act
        self.capa_ingestion.complete_capa_action(malicious_action_id)

        # Assert
        sql_call = self.mock_bq_client.client.query.call_args[0][0]
        job_config = self.mock_bq_client.client.query.call_args[1].get("job_config")

        # Verify parameterized query
        assert "@action_id" in sql_call
        assert malicious_action_id not in sql_call

        # Verify parameter
        assert job_config is not None
        assert len(job_config.query_parameters) == 1
        assert job_config.query_parameters[0].name == "action_id"
        assert job_config.query_parameters[0].value == malicious_action_id

    def test_get_capa_details_prevents_sql_injection(self):
        """
        TC-SEC-004: Verify SQL injection is prevented in get_capa_details

        Attack Vector: Malicious capa_id attempting SQL injection
        Expected: Parameterized queries prevent injection in all 3 queries
        Risk Control: risk-DATA-001
        """
        # Arrange
        self.mock_bq_client.query = Mock(return_value=[])
        self.mock_bq_client.project_id = "lw-qms-rag"
        self.mock_bq_client.dataset_id = "qms_workflows"

        # SQL injection attempt
        malicious_capa_id = "CAPA-001' OR '1'='1'; --"

        # Act
        result = self.capa_ingestion.get_capa_details(malicious_capa_id)

        # Assert
        # Should be called 3 times (case, actions, approvals)
        assert self.mock_bq_client.query.call_count == 3

        # Check all 3 queries use parameterized queries
        for call in self.mock_bq_client.query.call_args_list:
            sql_call = call[0][0]
            job_config = call[0][1] if len(call[0]) > 1 else None

            # Verify parameterized
            assert "@capa_id" in sql_call
            assert malicious_capa_id not in sql_call

            # Verify job_config passed
            assert job_config is not None
            assert len(job_config.query_parameters) == 1
            assert job_config.query_parameters[0].name == "capa_id"
            assert job_config.query_parameters[0].value == malicious_capa_id

    def test_no_f_string_sql_in_queries(self):
        """
        TC-SEC-005: Code review verification - no f-string SQL with user input

        This test verifies the fix for VULN-001 by ensuring
        parameterized queries are used instead of f-strings.

        Expected: All WHERE clauses use @parameters, not f-strings
        Risk Control: risk-DATA-001
        """
        # Arrange
        mock_query_job = Mock()
        mock_query_job.result.return_value = []
        self.mock_bq_client.client = Mock()
        self.mock_bq_client.client.query.return_value = mock_query_job
        self.mock_bq_client.project_id = "test-project"
        self.mock_bq_client.dataset_id = "test_dataset"

        # Act - test update_capa_status
        self.capa_ingestion.update_capa_status("CAPA-001", "Closed")

        # Assert
        sql_call = self.mock_bq_client.client.query.call_args[0][0]

        # SQL should contain project/dataset (safe - not user input)
        assert "test-project" in sql_call
        assert "test_dataset" in sql_call

        # But user input should be parameterized
        assert "WHERE capa_id = @capa_id" in sql_call  # ✅ Parameterized
        assert "WHERE capa_id = 'CAPA-001'" not in sql_call  # ❌ No f-string!


class TestDeprecationFixes:
    """Verify deprecation warnings are fixed"""

    def test_datetime_utc_not_deprecated(self):
        """
        TC-SEC-006: Verify datetime.utcnow() replaced with datetime.now(UTC)

        Expected: No DeprecationWarning for datetime usage
        """
        with patch('capa_ingestion.QMSBigQueryClient') as mock_bq:
            mock_client = Mock()
            mock_client.insert_rows.return_value = True
            mock_bq.return_value = mock_client

            # This should not raise DeprecationWarning
            import warnings
            with warnings.catch_warnings(record=True) as w:
                warnings.simplefilter("always")

                capa_ingestion = CAPAIngestion()
                capa_ingestion.create_capa(
                    reported_by="test@example.com",
                    department="Test",
                    issue_description="Test"
                )

                # Check no datetime deprecation warnings
                datetime_warnings = [
                    warning for warning in w
                    if "datetime.utcnow" in str(warning.message)
                ]
                assert len(datetime_warnings) == 0, "datetime.utcnow() still used!"


# Run tests with: pytest device/tests/test_sql_injection_security.py -v
