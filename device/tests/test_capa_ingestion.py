"""
Unit tests for CAPA Ingestion Module
ISO 13485:2016 Clause 8.5.2 - Corrective Action

Requirement: Req-8.5.2-CAPA-Management
Test Coverage: FR-8.5.2-001, FR-8.5.2-002, FR-8.5.2-005
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from capa_ingestion import CAPAIngestion
from bigquery_client import QMSBigQueryClient


class TestCAPAIngestion:
    """Test suite for CAPA ingestion functionality"""

    def setup_method(self):
        """Set up test fixtures"""
        self.mock_bq_client = Mock(spec=QMSBigQueryClient)
        self.capa_ingestion = CAPAIngestion(self.mock_bq_client)

    def test_create_capa_success(self):
        """
        TC-8.5.2-001: Verify CAPA creation with valid data

        Expected: CAPA record created in BigQuery
        Risk Control: risk-CRM-005
        """
        # Arrange
        capa_data = {
            "capa_id": "CAPA-2025-001",
            "type": "Corrective",
            "source": "Customer Complaint",
            "description": "Product defect reported",
            "root_cause": "Manufacturing process deviation",
            "action_items": ["Review process", "Retrain staff"],
            "responsible": "QA Manager",
            "due_date": "2025-12-31",
            "status": "Open"
        }
        self.mock_bq_client.insert_rows.return_value = True

        # Act
        result = self.capa_ingestion.create_capa(capa_data)

        # Assert
        assert result is True
        self.mock_bq_client.insert_rows.assert_called_once()
        call_args = self.mock_bq_client.insert_rows.call_args
        assert call_args[0][0] == "qms_capas"  # table name
        assert "capa_id" in call_args[0][1][0]  # data contains capa_id

    def test_create_capa_missing_required_field(self):
        """
        TC-8.5.2-002: Verify validation of required fields

        Expected: ValueError raised for missing fields
        Risk Control: risk-DATA-001
        """
        # Arrange
        invalid_data = {
            "type": "Corrective",
            # Missing capa_id
        }

        # Act & Assert
        with pytest.raises(ValueError, match="capa_id is required"):
            self.capa_ingestion.create_capa(invalid_data)

    def test_create_capa_invalid_type(self):
        """
        TC-8.5.2-003: Verify CAPA type validation

        Expected: ValueError for invalid type
        """
        # Arrange
        invalid_data = {
            "capa_id": "CAPA-2025-002",
            "type": "Invalid",  # Should be Corrective or Preventive
        }

        # Act & Assert
        with pytest.raises(ValueError, match="Invalid CAPA type"):
            self.capa_ingestion.create_capa(invalid_data)

    def test_create_capa_bigquery_failure(self):
        """
        TC-8.5.2-004: Verify error handling for BigQuery failures

        Expected: Exception raised and logged
        Risk Control: risk-CRM-005
        """
        # Arrange
        capa_data = {
            "capa_id": "CAPA-2025-003",
            "type": "Corrective",
            "description": "Test CAPA"
        }
        self.mock_bq_client.insert_rows.side_effect = Exception("BigQuery connection failed")

        # Act & Assert
        with pytest.raises(Exception, match="BigQuery connection failed"):
            self.capa_ingestion.create_capa(capa_data)

    def test_update_capa_status(self):
        """
        TC-8.5.2-005: Verify CAPA status update

        Expected: Status updated in BigQuery with audit log
        """
        # Arrange
        capa_id = "CAPA-2025-001"
        new_status = "In Progress"
        self.mock_bq_client.update_row.return_value = True

        # Act
        result = self.capa_ingestion.update_status(capa_id, new_status)

        # Assert
        assert result is True
        self.mock_bq_client.update_row.assert_called_once()

    @pytest.mark.integration
    def test_end_to_end_capa_workflow(self):
        """
        TC-8.5.2-006: End-to-end CAPA workflow

        Tests: Create → Update → Close
        Validation: Full lifecycle test
        """
        # This test requires actual BigQuery connection
        # Mark as integration test, skip in unit test runs
        pytest.skip("Integration test - requires BigQuery connection")


class TestCAPAValidation:
    """Test suite for CAPA data validation"""

    def test_validate_capa_schema(self):
        """
        TC-8.5.2-007: Verify CAPA schema validation

        Expected: All required fields present and correct types
        """
        # TODO: Implement schema validation tests
        pass

    def test_validate_date_formats(self):
        """
        TC-8.5.2-008: Verify date format validation

        Expected: Dates in ISO 8601 format
        """
        # TODO: Implement date validation tests
        pass


# Run tests with: pytest device/tests/test_capa_ingestion.py -v
# Coverage: pytest device/tests/test_capa_ingestion.py --cov=device/src/capa_ingestion --cov-report=html
