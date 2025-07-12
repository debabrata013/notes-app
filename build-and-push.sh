#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AI Notes - Docker Build and Push Script${NC}"
echo -e "${BLUE}===========================================${NC}"

# Prompt for Docker Hub username
echo -e "${YELLOW}📝 Please enter your Docker Hub username:${NC}"
read -p "Username: " DOCKER_USERNAME

if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}❌ Docker Hub username is required!${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Using Docker Hub username: ${DOCKER_USERNAME}${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Stop existing containers if running
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down 2>/dev/null || true

# Build images using docker-compose
echo -e "${YELLOW}📦 Building images with docker-compose...${NC}"
docker-compose build

# Tag images for Docker Hub
echo -e "${YELLOW}🏷️  Tagging images for Docker Hub...${NC}"
docker tag inv-app-ai-notes-db:latest $DOCKER_USERNAME/ai-notes-db:latest
docker tag inv-app-ai-notes-backend:latest $DOCKER_USERNAME/ai-notes-backend:latest

# Login to Docker Hub
echo -e "${YELLOW}🔐 Please login to Docker Hub...${NC}"
docker login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker Hub login failed!${NC}"
    exit 1
fi

# Push images to Docker Hub
echo -e "${YELLOW}⬆️  Pushing ai-notes-db to Docker Hub...${NC}"
docker push $DOCKER_USERNAME/ai-notes-db:latest

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push ai-notes-db!${NC}"
    exit 1
fi

echo -e "${YELLOW}⬆️  Pushing ai-notes-backend to Docker Hub...${NC}"
docker push $DOCKER_USERNAME/ai-notes-backend:latest

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push ai-notes-backend!${NC}"
    exit 1
fi

# Update production compose file
echo -e "${YELLOW}📝 Updating production compose file...${NC}"
sed "s/your-dockerhub-username/$DOCKER_USERNAME/g" docker-compose.prod.yml > docker-compose.prod.tmp
mv docker-compose.prod.tmp docker-compose.prod.yml

echo -e "${GREEN}✅ All images built and pushed successfully!${NC}"
echo -e "${GREEN}📋 Your images are now available at:${NC}"
echo -e "   🗄️  Database: ${DOCKER_USERNAME}/ai-notes-db:latest"
echo -e "   🖥️  Backend: ${DOCKER_USERNAME}/ai-notes-backend:latest"

echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "   1. To run locally: ${YELLOW}docker-compose up -d${NC}"
echo -e "   2. To run from Docker Hub: ${YELLOW}docker-compose -f docker-compose.prod.yml up -d${NC}"
echo -e "   3. To test: ${YELLOW}curl http://localhost:5000/health${NC}"

echo -e "${GREEN}🎉 Setup complete!${NC}"
