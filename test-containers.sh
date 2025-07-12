#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing AI Notes Containers${NC}"
echo -e "${BLUE}==============================${NC}"

# Check if containers are running
echo -e "${YELLOW}📋 Checking container status...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=ai-notes"

echo -e "\n${YELLOW}🔍 Testing database connection...${NC}"
if docker exec ai-notes-db mysqladmin ping -u root -proot >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Database is healthy${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}🔍 Testing backend health endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:5000/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
    echo -e "${BLUE}Response: ${HEALTH_RESPONSE}${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}🔍 Testing backend API endpoint...${NC}"
API_RESPONSE=$(curl -s http://localhost:5000/api/test)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend API is working${NC}"
    echo -e "${BLUE}Response: ${API_RESPONSE}${NC}"
else
    echo -e "${RED}❌ Backend API test failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📊 Container resource usage:${NC}"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" ai-notes-db ai-notes-backend

echo -e "\n${YELLOW}📝 Container logs (last 5 lines):${NC}"
echo -e "${BLUE}--- Database Logs ---${NC}"
docker logs --tail 5 ai-notes-db

echo -e "\n${BLUE}--- Backend Logs ---${NC}"
docker logs --tail 5 ai-notes-backend

echo -e "\n${GREEN}🎉 All tests passed! Your containers are working perfectly.${NC}"

echo -e "\n${BLUE}💡 Useful commands:${NC}"
echo -e "   View logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "   Stop containers: ${YELLOW}docker-compose down${NC}"
echo -e "   Restart containers: ${YELLOW}docker-compose restart${NC}"
echo -e "   Access database: ${YELLOW}docker exec -it ai-notes-db mysql -u root -proot notesdb${NC}"
