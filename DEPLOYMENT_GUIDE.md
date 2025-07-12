# 🚀 AI Notes - Docker Hub Deployment Guide

## ✅ Successfully Pushed to Docker Hub!

Your containers are now available on Docker Hub:

### 📦 **Available Images:**
- 🗄️ **Database**: `debabratap/ai-notes-db:latest`
- 🖥️ **Backend**: `debabratap/ai-notes-backend:latest`

## 🌐 **Deploy Anywhere in the World**

### Option 1: Using Docker Compose (Recommended)
```bash
# Download the production compose file
curl -O https://raw.githubusercontent.com/your-repo/docker-compose.prod.yml

# Or use the local file
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Manual Docker Commands
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
  debabratap/ai-notes-db:latest

# Wait for database to be ready (30 seconds)
sleep 30

# Run backend
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
  debabratap/ai-notes-backend:latest
```

### Option 3: One-liner for Quick Testing
```bash
# Pull and run both containers
docker run -d --name ai-notes-db -p 3306:3306 debabratap/ai-notes-db:latest && \
sleep 30 && \
docker run -d --name ai-notes-backend -p 5000:5000 --link ai-notes-db debabratap/ai-notes-backend:latest
```

## 🧪 **Test Your Deployment**

After deployment, test these endpoints:

```bash
# Health check
curl http://localhost:5000/health

# API test
curl http://localhost:5000/api/test

# Expected responses:
# Health: {"status":"OK","timestamp":"...","service":"ai-notes-backend"}
# API: {"message":"Backend is working!"}
```

## 🔧 **Management Commands**

```bash
# View running containers
docker ps

# View logs
docker logs ai-notes-backend
docker logs ai-notes-db

# Stop containers
docker stop ai-notes-backend ai-notes-db

# Remove containers
docker rm ai-notes-backend ai-notes-db

# Update to latest version
docker pull debabratap/ai-notes-db:latest
docker pull debabratap/ai-notes-backend:latest
```

## 🌍 **Cloud Deployment Examples**

### AWS EC2
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo usermod -aG docker ubuntu

# Deploy your app
docker run -d --name ai-notes-db -p 3306:3306 debabratap/ai-notes-db:latest
sleep 30
docker run -d --name ai-notes-backend -p 5000:5000 --link ai-notes-db debabratap/ai-notes-backend:latest

# Access via: http://your-ec2-ip:5000
```

### Google Cloud Run
```bash
# Deploy backend to Cloud Run
gcloud run deploy ai-notes-backend \
  --image debabratap/ai-notes-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean Droplet
```bash
# Create droplet with Docker pre-installed
# SSH and run:
docker run -d --name ai-notes-db -p 3306:3306 debabratap/ai-notes-db:latest
sleep 30
docker run -d --name ai-notes-backend -p 5000:5000 --link ai-notes-db debabratap/ai-notes-backend:latest
```

## 📊 **Resource Requirements**

- **Minimum**: 1GB RAM, 1 CPU core
- **Recommended**: 2GB RAM, 2 CPU cores
- **Storage**: 10GB for database growth

## 🔒 **Security Recommendations**

For production deployment:

1. **Change default passwords**:
   ```bash
   -e MYSQL_ROOT_PASSWORD=your-secure-password
   -e JWT_SECRET=your-secure-jwt-secret
   ```

2. **Use environment files**:
   ```bash
   docker run --env-file .env debabratap/ai-notes-backend:latest
   ```

3. **Enable firewall**:
   ```bash
   # Only allow necessary ports
   sudo ufw allow 5000
   sudo ufw enable
   ```

## 🎉 **Success!**

Your AI Notes application is now:
- ✅ Containerized with Docker
- ✅ Available on Docker Hub
- ✅ Ready for global deployment
- ✅ Scalable and portable

**Docker Hub Links:**
- Database: https://hub.docker.com/r/debabratap/ai-notes-db
- Backend: https://hub.docker.com/r/debabratap/ai-notes-backend

**Happy Deploying! 🚀**
