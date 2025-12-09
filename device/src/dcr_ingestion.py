"""
DCR (Document Change Request) Ingestion Module
Handles creation and routing of DCRs into BigQuery.
"""

from bigquery_client import QMSBigQueryClient
from datetime import datetime, date
from typing import List, Dict, Optional
import uuid


class DCRIngestion:
    """Handles DCR workflow data ingestion to BigQuery."""
    
    def __init__(self):
        self.bq_client = QMSBigQueryClient()
    
    def create_dcr(
        self,
        requester: str,
        department: str,
        change_type: str,
        reason: str,
        description: str,
        affected_process: str,
        priority: str = "Medium",
        target_completion_date: Optional[date] = None
    ) -> str:
        """
        Create a new Document Change Request.
        
        Args:
            requester: Name/email of person requesting change
            department: Department initiating the DCR
            change_type: Type of change (addition, deletion, correction, etc.)
            reason: Justification for the change
            description: Detailed description of the change
            affected_process: Process area affected
            priority: Low, Medium, or High
            target_completion_date: Target date for completion
            
        Returns:
            dcr_id: Unique DCR identifier
        """
        dcr_id = f"DCR-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        dcr_data = [{
            "dcr_id": dcr_id,
            "request_date": date.today().isoformat(),
            "requester": requester,
            "department": department,
            "change_type": change_type,
            "reason": reason,
            "description": description,
            "affected_process": affected_process,
            "priority": priority,
            "status": "Draft",
            "target_completion_date": target_completion_date.isoformat() if target_completion_date else None,
            "updated_at": datetime.utcnow().isoformat()
        }]
        
        self.bq_client.insert_rows("dcr_requests", dcr_data)
        return dcr_id
    
    def add_dcr_documents(
        self,
        dcr_id: str,
        documents: List[Dict[str, str]]
    ) -> bool:
        """
        Link documents to a DCR.
        
        Args:
            dcr_id: DCR identifier
            documents: List of dicts with keys:
                - document_id: Document identifier
                - document_title: Document title
                - current_revision: Current revision (e.g., "Rev A")
                - proposed_revision: Proposed revision (e.g., "Rev B")
                - notes: Optional notes
                
        Returns:
            bool: True if successful
        """
        rows = []
        for doc in documents:
            rows.append({
                "dcr_id": dcr_id,
                "document_id": doc.get("document_id"),
                "document_title": doc.get("document_title"),
                "current_revision": doc.get("current_revision"),
                "proposed_revision": doc.get("proposed_revision"),
                "notes": doc.get("notes", "")
            })
        
        return self.bq_client.insert_rows("dcr_documents", rows)
    
    def add_dcr_approval(
        self,
        dcr_id: str,
        approver: str,
        role: str,
        approval_status: str = "Pending",
        comments: Optional[str] = None
    ) -> str:
        """
        Add an approval step to a DCR.
        
        Args:
            dcr_id: DCR identifier
            approver: Name/email of approver
            role: Approver role (QA, Engineering, Management, etc.)
            approval_status: Pending, Approved, Rejected
            comments: Approval comments
            
        Returns:
            approval_id: Unique approval identifier
        """
        approval_id = f"DCRA-{str(uuid.uuid4())[:8].upper()}"
        
        approval_data = [{
            "approval_id": approval_id,
            "dcr_id": dcr_id,
            "approver": approver,
            "role": role,
            "approval_status": approval_status,
            "approval_date": datetime.utcnow().isoformat() if approval_status != "Pending" else None,
            "comments": comments
        }]
        
        self.bq_client.insert_rows("dcr_approvals", approval_data)
        return approval_id
    
    def update_dcr_status(self, dcr_id: str, new_status: str) -> bool:
        """
        Update DCR status.
        
        Args:
            dcr_id: DCR identifier
            new_status: New status (Draft, In Review, Approved, Rejected, Implemented)
            
        Returns:
            bool: True if successful
        """
        # BigQuery doesn't support UPDATE via insert_rows_json
        # Use SQL UPDATE or implement with merge
        sql = f"""
        UPDATE `{self.bq_client.project_id}.{self.bq_client.dataset_id}.dcr_requests`
        SET status = '{new_status}',
            updated_at = CURRENT_TIMESTAMP()
        WHERE dcr_id = '{dcr_id}'
        """
        
        query_job = self.bq_client.client.query(sql)
        query_job.result()  # Wait for completion
        return True
    
    def get_dcr_status(self, dcr_id: str) -> Dict:
        """
        Get current DCR status with all details.
        
        Args:
            dcr_id: DCR identifier
            
        Returns:
            Dict with DCR details
        """
        sql = f"""
        SELECT *
        FROM `{self.bq_client.project_id}.{self.bq_client.dataset_id}.dcr_requests`
        WHERE dcr_id = '{dcr_id}'
        LIMIT 1
        """
        
        results = self.bq_client.query(sql)
        return results[0] if results else {}
