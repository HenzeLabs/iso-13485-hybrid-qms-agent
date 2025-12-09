"""
ISO 13485 QMS Agent FastAPI Service
Exposes REST endpoints for compliance queries with Gemini + Vertex AI Search,
plus workflow operations (DCR/CAPA) via BigQuery.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agent_logic import run_agent_query
from workflow_handler import WorkflowQueryHandler
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
async def query_qms(request: QueryRequest):
    """
    POST /query
    Execute a QMS compliance query against the knowledge base.
    
    Args:
        request (QueryRequest): Query text and user role
        
    Returns:
        dict: answer (str) and citations (list of objects with title, url, page)
        
    Raises:
        HTTPException: 500 on agent execution failure
    """
    logger.info(f"Received query from {request.user_role}: {request.query[:100]}...")
    
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
async def handle_workflow(request: WorkflowQueryRequest):
    """
    POST /workflow
    Handle workflow operations (DCR/CAPA creation, status queries, etc.).
    
    Automatically routes to:
    - BigQuery for workflow state (read/write)
    - Vertex AI Search for knowledge base context (if hybrid query)
    
    Args:
        request (WorkflowQueryRequest): Query text and user email
        
    Returns:
        dict: action, result, and message describing what was done
        
    Examples:
        - "Create a new DCR for ISO 7.3.5 design changes"
        - "Show me DCRs awaiting Quality approval"
        - "Update CAPA-001 root cause to calibration drift"
        - "List overdue CAPA actions"
    """
    logger.info(f"Workflow query from {request.user_email}: {request.query[:100]}...")
    
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
async def get_dcr(dcr_id: str):
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
async def get_capa(capa_id: str):
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
    Health check endpoint for Cloud Run liveness probes.
    
    Returns:
        dict: Service status and compliance mode
    """
    return {
        "status": "operational",
        "compliance_mode": "active",
        "service": "ISO 13485 QMS Agent",
        "features": ["knowledge_base", "workflow_management"]
    }
