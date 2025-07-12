#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Push AI Notes Images to Docker Hub${NC}"
echo -e "${BLUE}====================================${NC}"

# Prompt for Docker Hub username
echo -e "${YELLOW}📝 Please enter your Docker Hub username:${NC}"
read -p "Username: " DOCKER_USERNAME

if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}❌ Docker Hub username is required!${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Using Docker Hub username: ${DOCKER_USERNAME}${NC}"

# Check if images exist
if ! docker image inspect inv-app-ai-notes-db:latest >/dev/null 2>&1; then
    echo -e "${RED}❌ ai-notes-db image not found! Please build first with: docker-compose build${NC}"
    exit 1
fi

if ! docker image inspect inv-app-ai-notes-backend:latest >/dev/null 2>&1; then
    echo -e "${RED}❌ ai-notes-backend image not found! Please build first with: docker-compose build${NC}"
    exit 1
fi

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

echo -e "${GREEN}✅ All images pushed successfully!${NC}"
echo -e "${GREEN}📋 Your images are now available at:${NC}"
echo -e "   🗄️  Database: ${DOCKER_USERNAME}/ai-notes-db:latest"
echo -e "   🖥️  Backend: ${DOCKER_USERNAME}/ai-notes-backend:latest"

echo -e "${BLUE}💡 To use these images on any machine:${NC}"
echo -e "${YELLOW}docker run -d --name ai-notes-db -p 3306:3306 ${DOCKER_USERNAME}/ai-notes-db:latest${NC}"
echo -e "${YELLOW}docker run -d --name ai-notes-backend -p 5000:5000 --link ai-notes-db ${DOCKER_USERNAME}/ai-notes-backend:latest${NC}"

echo -e "${GREEN}🎉 Push complete!${NC}"
