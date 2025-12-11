"""
Unit tests for CAPA Ingestion Module
ISO 13485:2016 Clause 8.5.2 - Corrective Action

Requirement: Req-8.5.2-CAPA-Management
Test Coverage: FR-8.5.2-001, FR-8.5.2-002, FR-8.5.2-005
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import date, datetime
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from capa_ingestion import CAPAIngestion


class TestCAPAIngestion:
    """Test suite for CAPA ingestion functionality"""

    def setup_method(self):
        """Set up test fixtures"""
        # Mock the BigQuery client within CAPAIngestion
        with patch('capa_ingestion.QMSBigQueryClient') as mock_bq:
            self.mock_bq_client = Mock()
            mock_bq.return_value = self.mock_bq_client
            self.capa_ingestion = CAPAIngestion()

    def test_create_capa_success(self):
        """
        TC-8.5.2-001: Verify CAPA creation with valid data

        Expected: CAPA record created in BigQuery
        Risk Control: risk-CRM-005
        """
        # Arrange
        self.mock_bq_client.insert_rows.return_value = True

        # Act
        capa_id = self.capa_ingestion.create_capa(
            reported_by="john.doe@lwscientific.com",
            department="Production",
            issue_description="Product defect in Lot #2024-1205",
            severity="Major",
            due_date=date(2025, 12, 31)
        )

        # Assert
        assert capa_id.startswith("CAPA-")
        self.mock_bq_client.insert_rows.assert_called_once()
        args = self.mock_bq_client.insert_rows.call_args
        assert args[0][0] == "capa_cases"
        assert len(args[0][1]) == 1
        assert args[0][1][0]["reported_by"] == "john.doe@lwscientific.com"
        assert args[0][1][0]["severity"] == "Major"

    def test_create_capa_missing_department(self):
        """
        TC-8.5.2-002: Verify validation of required fields

        Expected: TypeError when required field missing
        Risk Control: risk-DATA-001
        """
        # Act & Assert
        with pytest.raises(TypeError):
            self.capa_ingestion.create_capa(
                reported_by="john.doe@lwscientific.com",
                issue_description="Product defect"
                # Missing department parameter
            )

    def test_create_capa_invalid_severity(self):
        """
        TC-8.5.2-003: Verify CAPA severity validation

        Expected: CAPA created but may need validation in future
        Note: Current implementation accepts any severity value
        """
        # Arrange
        self.mock_bq_client.insert_rows.return_value = True

        # Act
        capa_id = self.capa_ingestion.create_capa(
            reported_by="john.doe@lwscientific.com",
            department="Production",
            issue_description="Minor issue",
            severity="InvalidSeverity"  # Not in Minor/Major/Critical
        )

        # Assert
        assert capa_id.startswith("CAPA-")
        # Note: Current implementation does not validate severity enum

    def test_create_capa_bigquery_failure(self):
        """
        TC-8.5.2-004: Verify error handling for BigQuery failures

        Expected: Exception raised and logged
        Risk Control: risk-CRM-005
        """
        # Arrange
        self.mock_bq_client.insert_rows.side_effect = Exception("BigQuery connection failed")

        # Act & Assert
        with pytest.raises(Exception, match="BigQuery connection failed"):
            self.capa_ingestion.create_capa(
                reported_by="john.doe@lwscientific.com",
                department="Production",
                issue_description="Product defect"
            )

    def test_update_capa_status(self):
        """
        TC-8.5.2-005: Verify CAPA status updates with parameterized query

        Expected: Status updated in BigQuery using secure parameterized query
        Risk Control: risk-CRM-005
        Security: Verifies VULN-001 fix (parameterized queries)
        """
        # Arrange
        mock_query_job = Mock()
        mock_query_job.result.return_value = []
        self.mock_bq_client.client = Mock()
        self.mock_bq_client.client.query.return_value = mock_query_job
        self.mock_bq_client.project_id = "lw-qms-rag"
        self.mock_bq_client.dataset_id = "qms_workflows"

        # Act
        result = self.capa_ingestion.update_capa_status("CAPA-20251209-TEST", "Closed")

        # Assert
        assert result is True
        self.mock_bq_client.client.query.assert_called_once()

        # Verify SQL uses parameterized queries (not f-strings)
        sql_call = self.mock_bq_client.client.query.call_args[0][0]
        assert "UPDATE" in sql_call
        assert "status = @new_status" in sql_call  # Parameterized!
        assert "capa_id = @capa_id" in sql_call  # Parameterized!

        # Verify parameterized query config was passed
        job_config = self.mock_bq_client.client.query.call_args[1].get("job_config")
        assert job_config is not None
        assert len(job_config.query_parameters) == 2  # new_status and capa_id

        # Verify parameter values
        param_names = [p.name for p in job_config.query_parameters]
        assert "new_status" in param_names
        assert "capa_id" in param_names

    def test_add_capa_action(self):
        """
        TC-8.5.2-006: Verify CAPA action item creation

        Expected: Action item created and linked to CAPA
        """
        # Arrange
        self.mock_bq_client.insert_rows.return_value = True

        # Act
        action_id = self.capa_ingestion.add_capa_action(
            capa_id="CAPA-20251209-TEST",
            assigned_to="maintenance@lwscientific.com",
            action_description="Install temperature monitoring",
            due_date=date(2025, 12, 23),
            status="Pending"
        )

        # Assert
        assert action_id.startswith("ACT-")
        self.mock_bq_client.insert_rows.assert_called_once()
        args = self.mock_bq_client.insert_rows.call_args
        assert args[0][0] == "capa_actions"

    def test_add_capa_approval(self):
        """
        TC-8.5.2-007: Verify CAPA approval workflow

        Expected: Approval record created
        """
        # Arrange
        self.mock_bq_client.insert_rows.return_value = True

        # Act
        approval_id = self.capa_ingestion.add_capa_approval(
            capa_id="CAPA-20251209-TEST",
            approver="qa.manager@lwscientific.com",
            role="QA Manager",
            approval_status="Pending"
        )

        # Assert
        assert approval_id.startswith("CAPAA-")
        self.mock_bq_client.insert_rows.assert_called_once()

    def test_end_to_end_capa_workflow(self):
        """
        TC-8.5.2-008: Integration test for complete CAPA workflow

        Expected: CAPA created, action added, approval added, status updated
        """
        # Arrange
        self.mock_bq_client.insert_rows.return_value = True
        mock_query_job = Mock()
        mock_query_job.result.return_value = []
        self.mock_bq_client.client = Mock()
        self.mock_bq_client.client.query.return_value = mock_query_job
        self.mock_bq_client.project_id = "lw-qms-rag"
        self.mock_bq_client.dataset_id = "qms_workflows"

        # Act - Create CAPA
        capa_id = self.capa_ingestion.create_capa(
            reported_by="john.doe@lwscientific.com",
            department="Production",
            issue_description="Sterilization indicator inconsistent",
            severity="Major"
        )

        # Act - Add action
        action_id = self.capa_ingestion.add_capa_action(
            capa_id=capa_id,
            assigned_to="maintenance@lwscientific.com",
            action_description="Install monitoring alerts",
            due_date=date(2025, 12, 23)
        )

        # Act - Add approval
        approval_id = self.capa_ingestion.add_capa_approval(
            capa_id=capa_id,
            approver="qa.manager@lwscientific.com",
            role="QA Manager"
        )

        # Act - Update status
        result = self.capa_ingestion.update_capa_status(capa_id, "In Progress")

        # Assert
        assert capa_id.startswith("CAPA-")
        assert action_id.startswith("ACT-")
        assert approval_id.startswith("CAPAA-")
        assert result is True


class TestCAPAValidation:
    """Test suite for CAPA data validation"""

    def test_validate_capa_schema(self):
        """
        TC-8.5.2-VAL-001: Verify CAPA data schema compliance

        Expected: All required fields present in CAPA record
        """
        # Arrange
        with patch('capa_ingestion.QMSBigQueryClient') as mock_bq:
            mock_client = Mock()
            mock_client.insert_rows.return_value = True
            mock_bq.return_value = mock_client
            capa_ingestion = CAPAIngestion()

            # Act
            capa_id = capa_ingestion.create_capa(
                reported_by="test@example.com",
                department="Test",
                issue_description="Test issue"
            )

            # Assert
            args = mock_client.insert_rows.call_args[0][1]
            capa_record = args[0]

            # Verify required fields
            assert "capa_id" in capa_record
            assert "issue_date" in capa_record
            assert "reported_by" in capa_record
            assert "department" in capa_record
            assert "issue_description" in capa_record
            assert "status" in capa_record
            assert "severity" in capa_record
            assert "updated_at" in capa_record

    def test_validate_date_formats(self):
        """
        TC-8.5.2-VAL-002: Verify date fields use ISO 8601 format

        Expected: All dates in YYYY-MM-DD or ISO timestamp format
        """
        # Arrange
        with patch('capa_ingestion.QMSBigQueryClient') as mock_bq:
            mock_client = Mock()
            mock_client.insert_rows.return_value = True
            mock_bq.return_value = mock_client
            capa_ingestion = CAPAIngestion()

            # Act
            capa_id = capa_ingestion.create_capa(
                reported_by="test@example.com",
                department="Test",
                issue_description="Test issue",
                due_date=date(2025, 12, 31)
            )

            # Assert
            args = mock_client.insert_rows.call_args[0][1]
            capa_record = args[0]

            # Verify date formats
            assert capa_record["issue_date"] == date.today().isoformat()
            assert capa_record["due_date"] == "2025-12-31"
            # updated_at should be ISO timestamp
            assert "T" in capa_record["updated_at"]


# Run tests with: pytest device/tests/test_capa_ingestion.py -v
