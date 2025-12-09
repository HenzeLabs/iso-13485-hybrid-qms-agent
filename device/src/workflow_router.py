"""
Workflow Query Router
Routes user queries to appropriate backend (Vertex AI Search, BigQuery, or both).
Determines intent and dispatches to correct handler.
"""

import re
from typing import Dict, List, Optional, Tuple
from enum import Enum


class QueryType(Enum):
    """Classification of user queries."""
    KNOWLEDGE_BASE = "knowledge_base"  # Vertex AI Search
    WORKFLOW_READ = "workflow_read"     # BigQuery SELECT
    WORKFLOW_WRITE = "workflow_write"   # BigQuery INSERT/UPDATE
    HYBRID = "hybrid"                   # Both Vertex AI + BigQuery


class WorkflowRouter:
    """Routes queries to appropriate backend based on intent detection."""
    
    # Knowledge base keywords - use Vertex AI Search
    KNOWLEDGE_KEYWORDS = [
        "procedure", "requirement", "regulation", "standard", "clause",
        "sop", "process", "policy", "control", "risk", "document",
        "definition", "explain", "what is", "how to", "why", "guidance"
    ]
    
    # DCR write keywords - use BigQuery INSERT
    DCR_CREATE_KEYWORDS = ["create dcr", "new dcr", "submit dcr", "initiate dcr"]
    DCR_UPDATE_KEYWORDS = ["update dcr", "change dcr", "dcr status", "dcr approval"]
    
    # CAPA write keywords - use BigQuery INSERT
    CAPA_CREATE_KEYWORDS = ["create capa", "new capa", "open capa", "file capa"]
    CAPA_UPDATE_KEYWORDS = ["update capa", "capa action", "close capa", "capa approval"]
    
    # Workflow read keywords - use BigQuery SELECT
    STATUS_KEYWORDS = ["status", "pending", "approved", "rejected", "open", "closed"]
    LIST_KEYWORDS = ["list", "show", "get", "find", "which", "who", "where", "count"]
    OVERDUE_KEYWORDS = ["overdue", "due", "deadline", "late"]
    
    def classify_query(self, query: str) -> QueryType:
        """
        Classify a query into a type.
        
        Args:
            query: User query text
            
        Returns:
            QueryType enum value
        """
        query_lower = query.lower().strip()
        
        # Check for DCR write operations
        if any(kw in query_lower for kw in self.DCR_CREATE_KEYWORDS):
            return QueryType.WORKFLOW_WRITE
        if any(kw in query_lower for kw in self.DCR_UPDATE_KEYWORDS):
            if "approval" in query_lower or "sign" in query_lower:
                return QueryType.WORKFLOW_READ  # Need to read status first
            return QueryType.WORKFLOW_WRITE
        
        # Check for CAPA write operations
        if any(kw in query_lower for kw in self.CAPA_CREATE_KEYWORDS):
            return QueryType.WORKFLOW_WRITE
        if any(kw in query_lower for kw in self.CAPA_UPDATE_KEYWORDS):
            if "approval" in query_lower or "sign" in query_lower:
                return QueryType.WORKFLOW_READ
            return QueryType.WORKFLOW_WRITE
        
        # Check for workflow read operations
        if any(kw in query_lower for kw in self.LIST_KEYWORDS):
            if any(status in query_lower for status in self.STATUS_KEYWORDS):
                return QueryType.WORKFLOW_READ
        
        if any(kw in query_lower for kw in self.OVERDUE_KEYWORDS):
            return QueryType.WORKFLOW_READ
        
        # Check for hybrid operations (knowledge + workflow)
        if ("draft" in query_lower or "response" in query_lower) and \
           any(kw in query_lower for kw in ["capa", "dcr"]):
            return QueryType.HYBRID
        
        # Default to knowledge base
        if any(kw in query_lower for kw in self.KNOWLEDGE_KEYWORDS):
            return QueryType.KNOWLEDGE_BASE
        
        # If contains workflow terms, default to workflow read
        if any(term in query_lower for term in ["dcr", "capa", "approval", "action"]):
            return QueryType.WORKFLOW_READ
        
        # Default: knowledge base
        return QueryType.KNOWLEDGE_BASE
    
    def extract_dcr_id(self, query: str) -> Optional[str]:
        """Extract DCR ID from query (e.g., 'DCR-20251209-B5DD089E')."""
        match = re.search(r'DCR-\d{8}-[A-F0-9]{8}', query, re.IGNORECASE)
        return match.group(0) if match else None
    
    def extract_capa_id(self, query: str) -> Optional[str]:
        """Extract CAPA ID from query (e.g., 'CAPA-20251209-980E3239')."""
        match = re.search(r'CAPA-\d{8}-[A-F0-9]{8}', query, re.IGNORECASE)
        return match.group(0) if match else None
    
    def extract_emails(self, query: str) -> List[str]:
        """Extract email addresses from query."""
        pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        return re.findall(pattern, query)
    
    def determine_workflow_action(self, query: str) -> Dict[str, any]:
        """
        Determine the specific workflow action and parameters.
        
        Returns:
            Dict with keys:
                - action: 'create_dcr', 'update_dcr', 'create_capa', 'update_capa', 'query_status', etc.
                - entity_type: 'dcr' or 'capa'
                - entity_id: ID if applicable
                - emails: List of emails if applicable
        """
        query_lower = query.lower()
        
        result = {
            "action": None,
            "entity_type": None,
            "entity_id": None,
            "emails": self.extract_emails(query),
            "raw_query": query
        }
        
        # DCR operations
        if any(kw in query_lower for kw in self.DCR_CREATE_KEYWORDS):
            result["action"] = "create_dcr"
            result["entity_type"] = "dcr"
        elif any(kw in query_lower for kw in self.DCR_UPDATE_KEYWORDS):
            result["action"] = "update_dcr"
            result["entity_type"] = "dcr"
            result["entity_id"] = self.extract_dcr_id(query)
        
        # CAPA operations - check first for create
        elif any(kw in query_lower for kw in self.CAPA_CREATE_KEYWORDS):
            result["action"] = "create_capa"
            result["entity_type"] = "capa"
        # Then check for other CAPA operations
        elif any(kw in query_lower for kw in self.CAPA_UPDATE_KEYWORDS):
            result["action"] = "update_capa"
            result["entity_type"] = "capa"
            result["entity_id"] = self.extract_capa_id(query)
        
        # Status queries
        elif "status" in query_lower or "pending" in query_lower:
            if "dcr" in query_lower:
                result["action"] = "get_dcr_status"
                result["entity_type"] = "dcr"
                result["entity_id"] = self.extract_dcr_id(query)
            elif "capa" in query_lower:
                result["action"] = "get_capa_status"
                result["entity_type"] = "capa"
                result["entity_id"] = self.extract_capa_id(query)
        
        # List queries
        elif any(kw in query_lower for kw in self.LIST_KEYWORDS):
            if "dcr" in query_lower:
                if "awaiting" in query_lower or "pending" in query_lower or "approval" in query_lower:
                    result["action"] = "list_dcr_pending_approval"
                else:
                    result["action"] = "list_dcr"
                result["entity_type"] = "dcr"
            elif "capa" in query_lower:
                if "overdue" in query_lower:
                    result["action"] = "list_capa_overdue"
                elif "pending" in query_lower or "open" in query_lower:
                    result["action"] = "list_capa_open"
                else:
                    result["action"] = "list_capa"
                result["entity_type"] = "capa"
        
        return result
