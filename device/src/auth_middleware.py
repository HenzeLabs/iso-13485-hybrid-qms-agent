from fastapi import HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import List, Optional, Callable
import os
import sys
import logging

# Configure logging
logger = logging.getLogger(__name__)

security = HTTPBearer()

# CRITICAL: Enforce JWT secret configuration - fail startup if not set
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET or JWT_SECRET == "your-secret-key":
    print("FATAL: JWT_SECRET environment variable not configured or using default value")
    print("Set a strong JWT secret: export JWT_SECRET=$(openssl rand -base64 32)")
    sys.exit(1)

JWT_ALGORITHM = "HS256"

# CRITICAL: Set to True in production to enforce JWT on ALL requests
ENFORCE_AUTH = os.environ.get("ENFORCE_AUTH", "true").lower() == "true"

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verify JWT token and return payload.

    Raises:
        HTTPException: 401 if token invalid or expired
    """
    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        # Validate required claims
        if not payload.get("user"):
            logger.error("JWT missing 'user' claim")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token structure - missing user claim",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Log successful authentication
        logger.info(f"JWT validated for user: {payload.get('user', {}).get('email', 'unknown')}")

        return payload

    except JWTError as e:
        logger.error(f"JWT validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Unexpected error during JWT validation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

def enforce_role(required_roles: List[str]) -> Callable:
    """
    Dependency to enforce role-based access control.

    Args:
        required_roles: List of allowed roles (e.g., ["QA", "Manager", "Admin"])

    Returns:
        Callable dependency that validates user role

    Raises:
        HTTPException: 403 if user role not in required_roles
    """
    def role_checker(token_payload: dict = Depends(verify_jwt_token)) -> dict:
        user_data = token_payload.get("user", {})
        user_role = user_data.get("role")
        user_email = user_data.get("email", "unknown")

        # Admin role has access to everything
        if user_role == "Admin":
            logger.info(f"Admin access granted: {user_email}")
            return token_payload

        # Check if user role is in required roles
        if user_role not in required_roles:
            logger.warning(
                f"Access denied: {user_email} (role: {user_role}) "
                f"attempted to access endpoint requiring roles: {required_roles}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {required_roles}. Your role: {user_role}"
            )

        logger.info(f"Role-based access granted: {user_email} (role: {user_role})")
        return token_payload

    return role_checker

def optional_auth(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))) -> Optional[dict]:
    """
    Optional authentication - allows requests without token.
    Used for public endpoints or development environments.

    Returns:
        Token payload if valid token provided, None otherwise
    """
    if not credentials:
        logger.debug("No authentication credentials provided")
        return None

    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        logger.info(f"Optional auth: JWT validated for user: {payload.get('user', {}).get('email', 'unknown')}")
        return payload
    except JWTError as e:
        logger.warning(f"Optional auth: Invalid JWT provided: {str(e)}")
        return None

def audit_request(request: Request, auth: dict = Depends(verify_jwt_token)) -> dict:
    """
    Audit middleware that logs all authenticated requests.

    Args:
        request: FastAPI Request object
        auth: JWT payload from verify_jwt_token

    Returns:
        JWT payload (pass-through)
    """
    user_data = auth.get("user", {})

    logger.info(
        f"[AUDIT] API_REQUEST | "
        f"user={user_data.get('email', 'unknown')} | "
        f"role={user_data.get('role', 'unknown')} | "
        f"method={request.method} | "
        f"path={request.url.path} | "
        f"client={request.client.host if request.client else 'unknown'}"
    )

    return auth

# Export enforcement flag for conditional logic
def is_auth_enforced() -> bool:
    """Check if authentication is enforced in current environment."""
    return ENFORCE_AUTH
