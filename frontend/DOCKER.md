# AI Notes Web - Docker Deployment

## Docker Hub Repository
- **Image Name**: `debabratap/ai-notes-web`
- **Tags**: `latest`, `v1.0.0`
- **Docker Hub URL**: https://hub.docker.com/r/debabratap/ai-notes-web

## Quick Start

### Using Docker Run
```bash
docker run -d \
  --name ai-notes-web \
  -p 3000:80 \
  debabratap/ai-notes-web:latest
```

### Using Docker Compose
```bash
docker-compose up -d
```

## Access the Application
- Open your browser and go to: http://localhost:3000

## Available Tags
- `latest` - Latest stable version
- `v1.0.0` - Version 1.0.0

## Environment Variables
- `NODE_ENV` - Set to `production` for production deployment

## Ports
- **Container Port**: 80 (nginx)
- **Host Port**: 3000 (configurable)

## Architecture
- **Base Image**: nginx:alpine
- **Build**: Multi-stage build with Node.js 20
- **Web Server**: Nginx with optimized configuration
- **Size**: Optimized for production

## Features
- ✅ Production-ready nginx configuration
- ✅ Gzip compression enabled
- ✅ Static asset caching
- ✅ SPA routing support
- ✅ Security headers
- ✅ Multi-stage build for smaller image size

## Building Locally
```bash
# Build the image
docker build -t ai-notes-web .

# Run locally
docker run -p 3000:80 ai-notes-web
```

## Deployment Options

### 1. Standalone Container
```bash
docker run -d \
  --name ai-notes-web \
  -p 80:80 \
  --restart unless-stopped \
  debabratap/ai-notes-web:latest
```

### 2. With Custom Port
```bash
docker run -d \
  --name ai-notes-web \
  -p 8080:80 \
  debabratap/ai-notes-web:latest
```

### 3. With Docker Compose (Recommended)
```yaml
version: '3.8'
services:
  ai-notes-web:
    image: debabratap/ai-notes-web:latest
    ports:
      - "3000:80"
    restart: unless-stopped
```

## Health Check
```bash
# Check if container is running
docker ps | grep ai-notes-web

# Check logs
docker logs ai-notes-web

# Access container shell
docker exec -it ai-notes-web sh
```

## Updating
```bash
# Pull latest image
docker pull debabratap/ai-notes-web:latest

# Stop and remove old container
docker stop ai-notes-web
docker rm ai-notes-web

# Run new container
docker run -d \
  --name ai-notes-web \
  -p 3000:80 \
  debabratap/ai-notes-web:latest
```

## Troubleshooting

### Container won't start
```bash
docker logs ai-notes-web
```

### Port already in use
```bash
# Use different port
docker run -p 3001:80 debabratap/ai-notes-web:latest
```

### Check container status
```bash
docker inspect ai-notes-web
```

## Support
For issues and questions:
- Check container logs: `docker logs ai-notes-web`
- Verify port availability: `netstat -tulpn | grep :3000`
- Ensure Docker is running: `docker --version`
