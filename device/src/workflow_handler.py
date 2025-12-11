"""
Workflow Query Handler
Bridges agent queries to BigQuery workflow functions.
Converts natural language intent to specific workflow operations.
"""

from typing import Dict, Any, List, Optional
from dcr_ingestion import DCRIngestion
from capa_ingestion import CAPAIngestion
from workflow_router import WorkflowRouter, QueryType
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)


class WorkflowQueryHandler:
    """Handles workflow-related queries by dispatching to BigQuery ingestion APIs."""
    
    def __init__(self):
        self.router = WorkflowRouter()
        self.dcr = DCRIngestion()
        self.capa = CAPAIngestion()
    
    async def handle_workflow_query(self, query: str, user_email: str = None) -> Dict[str, Any]:
        """
        Process a workflow query and return results.
        
        Args:
            query: User's natural language query
            user_email: Email of the user making the query
            
        Returns:
            Dict with keys:
                - success: bool
                - action: str (what was done)
                - result: dict or list (the outcome)
                - message: str (human-readable summary)
                - error: str (if failed)
        """
        
        query_type = self.router.classify_query(query)
        action_info = self.router.determine_workflow_action(query)
        
        logger.info(f"Workflow query: {query_type.value} - Action: {action_info.get('action')}")
        
        try:
            # Route to appropriate handler
            if query_type == QueryType.WORKFLOW_READ:
                return await self._handle_read_query(action_info, query)
            elif query_type == QueryType.WORKFLOW_WRITE:
                return await self._handle_write_query(action_info, query, user_email)
            elif query_type == QueryType.HYBRID:
                return await self._handle_hybrid_query(action_info, query, user_email)
            else:
                return {
                    "success": False,
                    "error": "Could not classify query type"
                }
        
        except Exception as e:
            logger.error(f"Workflow query error: {str(e)}", exc_info=True)
            return {
                "success": False,
                "error": f"Query execution failed: {str(e)}"
            }
    
    async def _handle_read_query(self, action_info: Dict, query: str) -> Dict[str, Any]:
        """Handle workflow read operations (queries)."""
        
        action = action_info.get("action")
        
        if action == "get_dcr_status":
            dcr_id = action_info.get("entity_id")
            if not dcr_id:
                return {"success": False, "error": "DCR ID not found in query"}
            
            dcr_data = self.dcr.get_dcr_status(dcr_id)
            return {
                "success": True,
                "action": "get_dcr_status",
                "result": dcr_data,
                "message": f"DCR {dcr_id} status: {dcr_data.get('status', 'Unknown')}"
            }
        
        elif action == "get_capa_status":
            capa_id = action_info.get("entity_id")
            if not capa_id:
                return {"success": False, "error": "CAPA ID not found in query"}
            
            capa_data = self.capa.get_capa_details(capa_id)
            return {
                "success": True,
                "action": "get_capa_status",
                "result": capa_data,
                "message": f"CAPA {capa_id}: {capa_data['case'].get('status', 'Unknown')} ({len(capa_data['actions'])} actions)"
            }
        
        elif action == "list_dcr_pending_approval":
            sql = f"""
            SELECT 
                d.dcr_id, d.status, d.priority, d.requester,
                COUNT(a.approval_id) as total_approvals,
                SUM(CASE WHEN a.approval_status = 'Pending' THEN 1 ELSE 0 END) as pending_approvals
            FROM `{self.dcr.bq_client.project_id}.{self.dcr.bq_client.dataset_id}.dcr_requests` d
            LEFT JOIN `{self.dcr.bq_client.project_id}.{self.dcr.bq_client.dataset_id}.dcr_approvals` a ON d.dcr_id = a.dcr_id
            WHERE d.status IN ('In Review', 'Draft')
            GROUP BY d.dcr_id, d.status, d.priority, d.requester
            ORDER BY d.dcr_id DESC
            LIMIT 20
            """
            results = self.dcr.bq_client.query(sql)
            return {
                "success": True,
                "action": "list_dcr_pending_approval",
                "result": results,
                "message": f"Found {len(results)} DCRs awaiting approval"
            }
        
        elif action == "list_capa_overdue":
            sql = f"""
            SELECT 
                c.capa_id, c.status, c.severity, c.due_date,
                COUNT(a.action_id) as total_actions,
                SUM(CASE WHEN a.status = 'Overdue' THEN 1 ELSE 0 END) as overdue_actions
            FROM `{self.capa.bq_client.project_id}.{self.capa.bq_client.dataset_id}.capa_cases` c
            LEFT JOIN `{self.capa.bq_client.project_id}.{self.capa.bq_client.dataset_id}.capa_actions` a ON c.capa_id = a.capa_id
            WHERE c.status != 'Closed' AND c.due_date < CURRENT_DATE()
            GROUP BY c.capa_id, c.status, c.severity, c.due_date
            ORDER BY c.due_date ASC
            LIMIT 20
            """
            results = self.capa.bq_client.query(sql)
            return {
                "success": True,
                "action": "list_capa_overdue",
                "result": results,
                "message": f"Found {len(results)} overdue CAPA items"
            }
        
        else:
            return {"success": False, "error": f"Unknown read action: {action}"}
    
    async def _handle_write_query(self, action_info: Dict, query: str, user_email: str) -> Dict[str, Any]:
        """Handle workflow write operations (creates/updates)."""
        
        action = action_info.get("action")
        
        if action == "create_dcr":
            # Parse DCR creation details from query
            # This is a simplified extraction; in production, use entity parsing
            dcr_id = self.dcr.create_dcr(
                requester=user_email or "unknown",
                department="Quality Assurance",
                change_type="correction",
                reason="Extracted from user query",
                description=query,
                affected_process="General",
                priority="Medium"
            )
            return {
                "success": True,
                "action": "create_dcr",
                "result": {"dcr_id": dcr_id},
                "message": f"Created DCR: {dcr_id}. Next: Add documents and route for approval."
            }
        
        elif action == "create_capa":
            capa_id = self.capa.create_capa(
                reported_by=user_email or "unknown",
                department="Quality Assurance",
                issue_description=query,
                severity="Major"
            )
            return {
                "success": True,
                "action": "create_capa",
                "result": {"capa_id": capa_id},
                "message": f"Created CAPA: {capa_id}. Next: Add root cause analysis and actions."
            }
            # Parse DCR creation details from query
            # This is a simplified extraction; in production, use entity parsing
            dcr_id = self.dcr.create_dcr(
                requester=user_email or "unknown",
                department="Quality Assurance",
                change_type="correction",
                reason="Extracted from user query",
                description=query,
                affected_process="General",
                priority="Medium"
            )
            return {
                "success": True,
                "action": "create_dcr",
                "result": {"dcr_id": dcr_id},
                "message": f"Created DCR: {dcr_id}. Next: Add documents and route for approval."
            }
        
        elif action == "create_capa":
            capa_id = self.capa.create_capa(
                reported_by=user_email or "unknown",
                department="Quality Assurance",
                issue_description=query,
                severity="Major"
            )
            return {
                "success": True,
                "action": "create_capa",
                "result": {"capa_id": capa_id},
                "message": f"Created CAPA: {capa_id}. Next: Add root cause analysis and actions."
            }
        
        elif action == "update_dcr":
            dcr_id = action_info.get("entity_id")
            if not dcr_id:
                return {"success": False, "error": "DCR ID not found"}
            
            # Determine status from query context
            status = "In Review"  # Default
            if "approve" in query.lower():
                status = "Approved"
            elif "reject" in query.lower():
                status = "Rejected"
            
            self.dcr.update_dcr_status(dcr_id, status)
            return {
                "success": True,
                "action": "update_dcr",
                "result": {"dcr_id": dcr_id, "new_status": status},
                "message": f"Updated DCR {dcr_id} status to '{status}'"
            }
        
        elif action == "update_capa":
            capa_id = action_info.get("entity_id")
            if not capa_id:
                return {"success": False, "error": "CAPA ID not found"}
            
            status = "In Progress"
            if "close" in query.lower() or "closed" in query.lower():
                status = "Closed"
            
            self.capa.update_capa_status(capa_id, status)
            return {
                "success": True,
                "action": "update_capa",
                "result": {"capa_id": capa_id, "new_status": status},
                "message": f"Updated CAPA {capa_id} status to '{status}'"
            }
        
        else:
            return {"success": False, "error": f"Unknown write action: {action}"}
    
    async def _handle_hybrid_query(self, action_info: Dict, query: str, user_email: str) -> Dict[str, Any]:
        """Handle hybrid queries that need both knowledge base and workflow state."""
        
        return {
            "success": True,
            "action": "hybrid_query",
            "message": "Hybrid query detected - will search knowledge base and create workflow record",
            "note": "Full implementation pending agent integration"
        }
