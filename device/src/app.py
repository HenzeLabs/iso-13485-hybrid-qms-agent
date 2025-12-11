"""
ISO 13485 QMS Agent FastAPI Service
Exposes REST endpoints for compliance queries with Gemini + Vertex AI Search,
plus workflow operations (DCR/CAPA) via BigQuery.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from agent_logic import run_agent_query
from workflow_handler import WorkflowQueryHandler
from auth_middleware import enforce_role, verify_jwt_token, audit_request, is_auth_enforced
import logging

# Configure logging for audit trail
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="ISO 13485 QMS Agent API",
    description="Quality Management System compliance assistant + workflow engine",
    version="1.0.0"
)

# Initialize workflow handler
workflow_handler = WorkflowQueryHandler()


class QueryRequest(BaseModel):
    """Request schema for QMS compliance queries."""
    query: str
    user_role: str = "staff"
    user_email: str = None


class WorkflowQueryRequest(BaseModel):
    """Request schema for workflow operations (DCR/CAPA)."""
    query: str
    user_email: str = None


@app.post("/query", response_description="Compliance response with citations")
async def query_qms(
    request: QueryRequest,
    auth: dict = Depends(audit_request)
):
    """
    POST /query
    Execute a QMS compliance query against the knowledge base.

    REQUIRES AUTHENTICATION: Engineer, QA, Manager, or Admin role

    Args:
        request (QueryRequest): Query text and user role
        auth: JWT payload (validated by audit_request middleware)

    Returns:
        dict: answer (str) and citations (list of objects with title, url, page)

    Raises:
        HTTPException: 401 if unauthenticated, 403 if unauthorized, 500 on error
    """
    # Extract user from validated JWT
    user_data = auth.get("user", {})
    user_role = user_data.get("role", "unknown")
    user_email = user_data.get("email", "unknown")

    # Enforce role-based access
    allowed_roles = ["Engineer", "QA", "Manager", "Admin"]
    if user_role not in allowed_roles:
        logger.warning(f"Query access denied for role: {user_role}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. Required roles: {allowed_roles}"
        )

    logger.info(f"Received query from {user_email} ({user_role}): {request.query[:100]}...")

    try:
        result = run_agent_query(request.query)
        logger.info(f"Query processed successfully. Citations: {len(result['citations'])}")
        return result
    except Exception as e:
        logger.error(f"Query execution failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Agent query failed: {str(e)}"
        )


@app.post("/workflow", response_description="Workflow operation result")
async def handle_workflow(
    request: WorkflowQueryRequest,
    auth: dict = Depends(audit_request)
):
    """
    POST /workflow
    Handle workflow operations (DCR/CAPA creation, status queries, etc.).

    REQUIRES AUTHENTICATION: QA, Manager, or Admin role

    Automatically routes to:
    - BigQuery for workflow state (read/write)
    - Vertex AI Search for knowledge base context (if hybrid query)

    Args:
        request (WorkflowQueryRequest): Query text and user email
        auth: JWT payload (validated by audit_request middleware)

    Returns:
        dict: action, result, and message describing what was done

    Raises:
        HTTPException: 401 if unauthenticated, 403 if unauthorized, 500 on error

    Examples:
        - "Create a new DCR for ISO 7.3.5 design changes"
        - "Show me DCRs awaiting Quality approval"
        - "Update CAPA-001 root cause to calibration drift"
        - "List overdue CAPA actions"
    """
    # Extract user from validated JWT
    user_data = auth.get("user", {})
    user_role = user_data.get("role", "unknown")
    user_email = user_data.get("email", "unknown")

    # Enforce role-based access
    allowed_roles = ["QA", "Manager", "Admin"]
    if user_role not in allowed_roles:
        logger.warning(f"Workflow access denied for role: {user_role}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. Required roles: {allowed_roles}"
        )

    logger.info(f"Workflow query from {user_email} ({user_role}): {request.query[:100]}...")

    try:
        result = await workflow_handler.handle_workflow_query(
            query=request.query,
            user_email=request.user_email
        )
        logger.info(f"Workflow action: {result.get('action')} - Success: {result.get('success')}")
        return result
    except Exception as e:
        logger.error(f"Workflow query failed: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": f"Workflow operation failed: {str(e)}"
        }


@app.get("/dcr/{dcr_id}", response_description="DCR details with approvals")
async def get_dcr(
    dcr_id: str,
    auth: dict = Depends(enforce_role(["Engineer", "Manager", "Admin"]))
):
    """
    GET /dcr/{dcr_id}
    Retrieve DCR status and approval routing.
    
    Args:
        dcr_id: DCR identifier (e.g., DCR-20251209-B5DD089E)
        
    Returns:
        dict: DCR case details
    """
    try:
        dcr_data = workflow_handler.dcr.get_dcr_status(dcr_id)
        if not dcr_data:
            raise HTTPException(status_code=404, detail=f"DCR {dcr_id} not found")
        return dcr_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/capa/{capa_id}", response_description="CAPA details with actions and approvals")
async def get_capa(
    capa_id: str,
    auth: dict = Depends(enforce_role(["QA", "Manager", "Admin"]))
):
    """
    GET /capa/{capa_id}
    Retrieve CAPA case details, actions, and approvals.
    
    Args:
        capa_id: CAPA identifier (e.g., CAPA-20251209-980E3239)
        
    Returns:
        dict: CAPA case, actions, and approvals
    """
    try:
        capa_data = workflow_handler.capa.get_capa_details(capa_id)
        if not capa_data.get('case'):
            raise HTTPException(status_code=404, detail=f"CAPA {capa_id} not found")
        return capa_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health_check():
    """
    GET /health
    Public health check endpoint (no authentication required).

    Returns:
        dict: Service status and version
    """
    return {
        "status": "healthy",
        "service": "qms-agent-api",
        "version": "1.0.0",
        "auth_enforced": is_auth_enforced()
    }
