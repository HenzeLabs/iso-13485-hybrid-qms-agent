"""
CAPA (Corrective and Preventive Action) Ingestion Module
Handles creation and management of CAPA cases in BigQuery.
"""

from bigquery_client import QMSBigQueryClient
from datetime import datetime, date
from typing import List, Dict, Optional
import uuid


class CAPAIngestion:
    """Handles CAPA workflow data ingestion to BigQuery."""
    
    def __init__(self):
        self.bq_client = QMSBigQueryClient()
    
    def create_capa(
        self,
        reported_by: str,
        department: str,
        issue_description: str,
        severity: str = "Minor",
        due_date: Optional[date] = None
    ) -> str:
        """
        Create a new CAPA case.
        
        Args:
            reported_by: Person reporting the issue
            department: Department where issue originated
            issue_description: Description of the issue
            severity: Minor, Major, or Critical
            due_date: Target completion date
            
        Returns:
            capa_id: Unique CAPA identifier
        """
        import logging
        logger = logging.getLogger("CAPAIngestion")
        capa_id = f"CAPA-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        capa_data = [{
            "capa_id": capa_id,
            "issue_date": date.today().isoformat(),
            "reported_by": reported_by,
            "department": department,
            "issue_description": issue_description,
            "root_cause": None,
            "correction": None,
            "corrective_action": None,
            "preventive_action": None,
            "effectiveness_check": None,
            "due_date": due_date.isoformat() if due_date else None,
            "status": "Open",
            "severity": severity,
            "updated_at": datetime.utcnow().isoformat()
        }]
        logger.debug(f"Creating CAPA: {capa_data}")
        try:
            self.bq_client.insert_rows("capa_cases", capa_data)
            logger.info(f"CAPA created successfully: {capa_id}")
        except Exception as e:
            logger.error(f"Failed to create CAPA: {e}")
            raise
        return capa_id
    
    def update_capa_analysis(
        self,
        capa_id: str,
        root_cause: Optional[str] = None,
        correction: Optional[str] = None,
        corrective_action: Optional[str] = None,
        preventive_action: Optional[str] = None
    ) -> bool:
        """
        Update CAPA with root cause analysis and actions.
        
        Args:
            capa_id: CAPA identifier
            root_cause: Root cause description
            correction: Immediate correction taken
            corrective_action: Corrective action plan
            preventive_action: Preventive action plan
            
        Returns:
            bool: True if successful
        """
        update_fields = []
        if root_cause:
            update_fields.append(f"root_cause = '{root_cause}'")
        if correction:
            update_fields.append(f"correction = '{correction}'")
        if corrective_action:
            update_fields.append(f"corrective_action = '{corrective_action}'")
        if preventive_action:
            update_fields.append(f"preventive_action = '{preventive_action}'")
        
        if not update_fields:
            return False
        
        update_fields.append("updated_at = CURRENT_TIMESTAMP()")
        
        sql = f"""
        UPDATE `{self.bq_client.project_id}.{self.bq_client.dataset_id}.capa_cases`
        SET {', '.join(update_fields)}
        WHERE capa_id = '{capa_id}'
        """
        
        query_job = self.bq_client.client.query(sql)
        query_job.result()
        return True
    
    def add_capa_action(
        self,
        capa_id: str,
        assigned_to: str,
        action_description: str,
        due_date: date,
        status: str = "Pending"
    ) -> str:
        """
        Add an action item to a CAPA.
        
        Args:
            capa_id: CAPA identifier
            assigned_to: Person assigned to action
            action_description: Description of action
            due_date: Action due date
            status: Pending, Completed, Overdue
            
        Returns:
            action_id: Unique action identifier
        """
        action_id = f"ACT-{str(uuid.uuid4())[:8].upper()}"
        
        action_data = [{
            "action_id": action_id,
            "capa_id": capa_id,
            "assigned_to": assigned_to,
            "action_description": action_description,
            "due_date": due_date.isoformat(),
            "completed_date": None,
            "status": status
        }]
        
        self.bq_client.insert_rows("capa_actions", action_data)
        return action_id
    
    def complete_capa_action(self, action_id: str) -> bool:
        """
        Mark a CAPA action as completed.
        
        Args:
            action_id: Action identifier
            
        Returns:
            bool: True if successful
        """
        sql = f"""
        UPDATE `{self.bq_client.project_id}.{self.bq_client.dataset_id}.capa_actions`
        SET status = 'Completed',
            completed_date = CURRENT_DATE()
        WHERE action_id = '{action_id}'
        """
        
        query_job = self.bq_client.client.query(sql)
        query_job.result()
        return True
    
    def add_capa_approval(
        self,
        capa_id: str,
        approver: str,
        role: str,
        approval_status: str = "Pending",
        comments: Optional[str] = None
    ) -> str:
        """
        Add an approval step to a CAPA.
        
        Args:
            capa_id: CAPA identifier
            approver: Name/email of approver
            role: Approver role
            approval_status: Pending, Approved, Rejected
            comments: Approval comments
            
        Returns:
            approval_id: Unique approval identifier
        """
        approval_id = f"CAPAA-{str(uuid.uuid4())[:8].upper()}"
        
        approval_data = [{
            "approval_id": approval_id,
            "capa_id": capa_id,
            "approver": approver,
            "role": role,
            "approval_status": approval_status,
            "approval_date": datetime.utcnow().isoformat() if approval_status != "Pending" else None,
            "comments": comments
        }]
        
        self.bq_client.insert_rows("capa_approvals", approval_data)
        return approval_id
    
    def update_capa_status(self, capa_id: str, new_status: str) -> bool:
        """
        Update CAPA status.
        
        Args:
            capa_id: CAPA identifier
            new_status: New status (Open, In Progress, Awaiting Verification, Closed)
            
        Returns:
            bool: True if successful
        """
        sql = f"""
        UPDATE `{self.bq_client.project_id}.{self.bq_client.dataset_id}.capa_cases`
        SET status = '{new_status}',
            updated_at = CURRENT_TIMESTAMP()
        WHERE capa_id = '{capa_id}'
        """
        
        query_job = self.bq_client.client.query(sql)
        query_job.result()
        return True
    
    def get_capa_details(self, capa_id: str) -> Dict:
        """
        Get comprehensive CAPA details with actions and approvals.
        
        Args:
            capa_id: CAPA identifier
            
        Returns:
            Dict with CAPA case, actions, and approvals
        """
        # Get CAPA case
        case_sql = f"""
        SELECT *
        FROM `{self.bq_client.project_id}.{self.bq_client.dataset_id}.capa_cases`
        WHERE capa_id = '{capa_id}'
        LIMIT 1
        """
        case = self.bq_client.query(case_sql)
        
        # Get actions
        actions_sql = f"""
        SELECT *
        FROM `{self.bq_client.project_id}.{self.bq_client.dataset_id}.capa_actions`
        WHERE capa_id = '{capa_id}'
        ORDER BY due_date
        """
        actions = self.bq_client.query(actions_sql)
        
        # Get approvals
        approvals_sql = f"""
        SELECT *
        FROM `{self.bq_client.project_id}.{self.bq_client.dataset_id}.capa_approvals`
        WHERE capa_id = '{capa_id}'
        ORDER BY created_at
        """
        approvals = self.bq_client.query(approvals_sql)
        
        return {
            "case": case[0] if case else {},
            "actions": actions,
            "approvals": approvals
        }
    
    def log_monthly_metrics(
        self,
        month_start: date,
        total_open: int,
        total_closed: int,
        avg_closure_time_days: int,
        overdue_actions: int,
        recurring_issues: int,
        notes: Optional[str] = None
    ) -> bool:
        """
        Log monthly CAPA metrics (from QA-8.5-F-003 checklist).
        
        Args:
            month_start: First day of the month
            total_open: Total open CAPAs
            total_closed: Total closed CAPAs this month
            avg_closure_time_days: Average days to close
            overdue_actions: Count of overdue actions
            recurring_issues: Count of recurring issues
            notes: Additional notes
            
        Returns:
            bool: True if successful
        """
        metrics_data = [{
            "month_start": month_start.isoformat(),
            "total_open": total_open,
            "total_closed": total_closed,
            "avg_closure_time_days": avg_closure_time_days,
            "overdue_actions": overdue_actions,
            "recurring_issues": recurring_issues,
            "notes": notes
        }]
        
        return self.bq_client.insert_rows("capa_metrics_monthly", metrics_data)
