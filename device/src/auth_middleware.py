from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import List, Optional
import os
import sys

security = HTTPBearer()

# CRITICAL: Enforce JWT secret configuration - fail startup if not set
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET or JWT_SECRET == "your-secret-key":
    print("FATAL: JWT_SECRET environment variable not configured or using default value")
    print("Set a strong JWT secret: export JWT_SECRET=$(openssl rand -base64 32)")
    sys.exit(1)

JWT_ALGORITHM = "HS256"

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def enforce_role(required_roles: List[str]):
    """Dependency to enforce role-based access control."""
    def role_checker(token_payload: dict = Depends(verify_jwt_token)) -> dict:
        user_role = token_payload.get("user", {}).get("role")
        if user_role not in required_roles and "Admin" not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {required_roles}"
            )
        return token_payload
    return role_checker