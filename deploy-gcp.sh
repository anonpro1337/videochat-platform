#!/bin/bash

# ========================================
# GOOGLE CLOUD RUN DEPLOYMENT SCRIPT
# Deploys VideoChatApp API to Google Cloud Run
# ========================================

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables from .env.production
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.production"
if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
  echo -e "${GREEN}✓ Loaded environment from .env.production${NC}"
else
  echo -e "${RED}ERROR: .env.production not found at ${ENV_FILE}${NC}"
  exit 1
fi

# Configuration
PROJECT_ID="vibechat-497310"
REGION="us-central1"
SERVICE_NAME="videochat-api"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}VIDEOCHAT PLATFORM - DEPLOYMENT SCRIPT${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check if gcloud is installed
echo -e "${YELLOW}[1/7] Checking for gcloud CLI...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}ERROR: gcloud CLI not found. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
echo -e "${GREEN}✓ gcloud CLI found${NC}"
echo ""

# Step 2: Authenticate with Google Cloud
echo -e "${YELLOW}[2/7] Authenticating with Google Cloud...${NC}"
gcloud auth login
gcloud config set project ${PROJECT_ID}
echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# Step 3: Build Docker image
echo -e "${YELLOW}[3/7] Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:latest .
echo -e "${GREEN}✓ Docker image built${NC}"
echo ""

# Step 4: Push image to Google Container Registry
echo -e "${YELLOW}[4/7] Pushing image to Google Container Registry...${NC}"
docker push ${IMAGE_NAME}:latest
echo -e "${GREEN}✓ Image pushed${NC}"
echo ""

# Step 5: Deploy to Cloud Run
echo -e "${YELLOW}[5/7] Deploying to Google Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600 \
  --max-instances 100 \
  --port 8080 \
  --set-env-vars-from-file .env.production

echo -e "${GREEN}✓ Deployment complete${NC}"
echo ""

# Step 6: Get the service URL
echo -e "${YELLOW}[6/7] Retrieving service URL...${NC}"
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --platform managed --region ${REGION} --format='value(status.url)')
echo -e "${GREEN}✓ Service URL: ${SERVICE_URL}${NC}"
echo ""

# Step 7: Test health check
echo -e "${YELLOW}[7/7] Testing health check...${NC}"
sleep 5
if curl -f "${SERVICE_URL}/api/v1/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}⚠ Health check failed - service may still be starting${NC}"
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "API URL: ${SERVICE_URL}"
echo -e "API Endpoint: ${SERVICE_URL}/api/v1"
echo -e "WebSocket URL: ${SERVICE_URL}"
echo ""
echo -e "Next steps:"
echo -e "1. Update DNS to point to this URL"
echo -e "2. Deploy frontend to Vercel"
echo -e "3. Run database migrations"
echo -e "4. Test the full application"
