dock# AI Notes - Docker Setup

This project contains separate Docker containers for the backend and database components of the AI Notes application.

## 🏗️ Architecture

- **ai-notes-backend**: Node.js/Express backend API
- **ai-notes-db**: MySQL 8.0 database with initialization scripts

## 🚀 Quick Start

### Option 1: Build and Run Locally
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Use Pre-built Images from Docker Hub
```bash
# Update docker-compose.prod.yml with your Docker Hub username
# Then run:
docker-compose -f docker-compose.prod.yml up -d
```

## 📦 Building and Pushing to Docker Hub

1. **Update the build script** with your Docker Hub username:
   ```bash
   # Edit build-and-push.sh
   DOCKER_USERNAME="your-dockerhub-username"
   ```

2. **Run the build and push script**:
   ```bash
   ./build-and-push.sh
   ```

3. **Update production compose file** with your username:
   ```bash
   # Edit docker-compose.prod.yml
   image: your-dockerhub-username/ai-notes-db:latest
   image: your-dockerhub-username/ai-notes-backend:latest
   ```

## 🔧 Manual Docker Commands

### Build Images Separately
```bash
# Build database image
cd database
docker build -t ai-notes-db:latest .

# Build backend image
cd backend
docker build -t ai-notes-backend:latest .
```

### Run Containers Separately
```bash
# Create network
docker network create ai-notes-network

# Run database
docker run -d \
  --name ai-notes-db \
  --network ai-notes-network \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=notesdb \
  ai-notes-db:latest

# Wait for database to be ready, then run backend
docker run -d \
  --name ai-notes-backend \
  --network ai-notes-network \
  -p 5000:5000 \
  -e DB_HOST=ai-notes-db \
  -e DB_USER=root \
  -e DB_PASSWORD=root \
  -e DB_NAME=notesdb \
  -e JWT_SECRET=op_secretkey \
  -e GEMINI_API_KEY=AIzaSyCXIN8mpvGqbeE8_h2I8tMtLAfOm-uZRL0 \
  ai-notes-backend:latest
```

## 🔍 Health Checks

Both containers include health checks:

- **Database**: `mysqladmin ping`
- **Backend**: HTTP GET to `/health` endpoint

Check health status:
```bash
docker ps
docker inspect ai-notes-db | grep Health -A 10
docker inspect ai-notes-backend | grep Health -A 10
```

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f ai-notes-backend
docker-compose logs -f ai-notes-db
```

### Access Database
```bash
# Connect to MySQL
docker exec -it ai-notes-db mysql -u root -proot notesdb
```

### Access Backend Container
```bash
# Shell access
docker exec -it ai-notes-backend sh
```

## 🌐 API Endpoints

Once running, the backend will be available at:
- **Base URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **Test Endpoint**: http://localhost:5000/api/test

## 🔒 Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production deployments
- The containers run with non-root users where possible

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3306 and 5000 are available
2. **Database connection**: Backend waits for database health check
3. **Environment variables**: Check all required env vars are set

### Debug Commands
```bash
# Check container status
docker ps -a

# View container logs
docker logs ai-notes-backend
docker logs ai-notes-db

# Test database connection
docker exec ai-notes-db mysqladmin ping -u root -proot

# Test backend health
curl http://localhost:5000/health
```

## 📝 Environment Variables

### Backend (.env)
```
JWT_SECRET=op_secretkey
PORT=5000
DB_HOST=ai-notes-db
DB_USER=root
DB_PASSWORD=root
DB_NAME=notesdb
DB_PORT=3306
GEMINI_API_KEY=your-api-key
```

### Database
```
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=notesdb
MYSQL_USER=appuser
MYSQL_PASSWORD=apppass
```
