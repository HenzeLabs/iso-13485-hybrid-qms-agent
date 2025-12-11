#!/bin/bash

# ISO 13485 QMS Agent - Cloud Run Deployment Script
# Deploys FastAPI service with Vertex AI Search grounding

set -e  # Exit on first error

echo "=========================================="
echo "ISO 13485 QMS Agent - Cloud Run Deploy"
echo "=========================================="

# Load environment variables
if [ ! -f .env ]; then
    echo "Error: .env file not found. Copy .env.example to .env and set your values."
    exit 1
fi

source .env

# Validate required variables
if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID not set in .env"
    exit 1
fi

if [ -z "$DATA_STORE_ID" ]; then
    echo "Error: DATA_STORE_ID not set in .env"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OPENAI_API_KEY not set in .env"
    exit 1
fi

if [ -z "$DATA_STORE_LOCATION" ]; then
    DATA_STORE_LOCATION="us"
    echo "DATA_STORE_LOCATION not set, using default: $DATA_STORE_LOCATION"
fi

if [ -z "$REGION" ]; then
    REGION="us-central1"
    echo "REGION not set, using default: $REGION"
fi

echo "Configuration:"
echo "  PROJECT_ID: $PROJECT_ID"
echo "  DATA_STORE_ID: $DATA_STORE_ID"
echo "  REGION: $REGION"
echo "  OPENAI_API_KEY: ${OPENAI_API_KEY:0:7}... (hidden)"
echo ""

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy qms-agent \
    --source . \
    --region "$REGION" \
    --platform managed \
    --no-allow-unauthenticated \
    --set-env-vars PROJECT_ID="$PROJECT_ID",DATA_STORE_ID="$DATA_STORE_ID",DATA_STORE_LOCATION="$DATA_STORE_LOCATION",REGION="$REGION",OPENAI_API_KEY="$OPENAI_API_KEY" \
    --memory 2Gi \
    --cpu 2 \
    --timeout 900 \
    --project "$PROJECT_ID"

# Get the deployed URL
SERVICE_URL=$(gcloud run services describe qms-agent \
    --region "$REGION" \
    --project "$PROJECT_ID" \
    --format 'value(status.url)')

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Service URL: $SERVICE_URL"
echo ""
echo "Test the service:"
echo "  curl -X GET $SERVICE_URL/health"
echo ""
echo "Query endpoint:"
echo "  curl -X POST $SERVICE_URL/query \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"query\": \"What are the requirements for change control?\"}'"
