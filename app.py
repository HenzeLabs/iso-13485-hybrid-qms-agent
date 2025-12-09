"""
ISO 13485 QMS Agent FastAPI Service
Exposes REST endpoints for compliance queries with Gemini + Vertex AI Search.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agent_logic import run_agent_query
import logging

# Configure logging for audit trail
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="ISO 13485 QMS Agent API",
    description="Quality Management System compliance assistant powered by Vertex AI Search + Gemini 1.5 Pro",
    version="1.0.0"
)


class QueryRequest(BaseModel):
    """Request schema for QMS compliance queries."""
    query: str
    user_role: str = "staff"


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
        "service": "ISO 13485 QMS Agent"
    }
