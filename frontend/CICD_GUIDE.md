# AI Notes Web - CI/CD Guide

## Overview

This guide covers the complete CI/CD setup for the AI Notes Web application, including Jenkins and GitHub Actions configurations for automated building and deployment to Docker Hub.

## 🚀 Quick Start

### Jenkins Pipeline
```bash
# 1. Configure Docker Hub credentials in Jenkins
# 2. Create new Pipeline job
# 3. Point to your Git repository
# 4. Use Jenkinsfile from repository
```

### GitHub Actions
```bash
# 1. Add secrets to GitHub repository
# 2. Push code to trigger workflow
# 3. Monitor Actions tab for build status
```

## 📁 File Structure

```
frontend/
├── Jenkinsfile                     # Full Jenkins pipeline
├── Jenkinsfile.simple             # Simplified Jenkins pipeline
├── .github/workflows/
│   └── docker-build-push.yml     # GitHub Actions workflow
├── docker-compose.yml             # Local development
├── docker-compose.staging.yml     # Staging environment
├── docker-compose.prod.yml        # Production environment
├── Dockerfile                     # Docker image definition
├── nginx.conf                     # Nginx configuration
├── JENKINS_SETUP.md              # Jenkins setup guide
└── CICD_GUIDE.md                 # This file
```

## 🔧 Jenkins Configuration

### Prerequisites
- Jenkins 2.400+
- Docker installed on Jenkins agent
- Required plugins: Pipeline, Docker Pipeline, NodeJS

### Setup Steps

1. **Configure Credentials**
   ```
   Jenkins → Manage Jenkins → Credentials → Global
   Add: Username with password
   ID: docker-hub-credentials
   Username: debabratap
   Password: <your-docker-hub-access-token>
   ```

2. **Configure Node.js**
   ```
   Jenkins → Manage Jenkins → Tools → NodeJS
   Name: 20
   Version: NodeJS 20.x.x
   Install automatically: ✓
   ```

3. **Create Pipeline Job**
   ```
   New Item → Pipeline
   Pipeline Definition: Pipeline script from SCM
   SCM: Git
   Repository URL: <your-repo-url>
   Script Path: Jenkinsfile
   ```

### Pipeline Features

#### 🔄 **Automated Stages**
1. **Checkout** - Get source code
2. **Environment Info** - Display build info
3. **Install Dependencies** - `npm ci`
4. **Lint Code** - ESLint validation
5. **Build Application** - `npm run build`
6. **Build Docker Image** - Create container
7. **Test Docker Image** - Basic validation
8. **Security Scan** - Vulnerability check
9. **Push to Docker Hub** - Registry upload
10. **Deploy** - Environment deployment

#### 🌿 **Branch Strategy**
- **main/master**: Production deployment (with approval)
- **develop**: Staging deployment (automatic)
- **feature/***: Build and test only

#### 🏷️ **Tagging Strategy**
- Build number: `debabratap/ai-notes-web:${BUILD_NUMBER}`
- Latest: `debabratap/ai-notes-web:latest` (main branch only)
- Version: `debabratap/ai-notes-web:v1.0.0` (manual tags)

## 🐙 GitHub Actions Configuration

### Prerequisites
- GitHub repository
- Docker Hub account
- Repository secrets configured

### Setup Steps

1. **Configure Repository Secrets**
   ```
   GitHub Repository → Settings → Secrets and variables → Actions
   
   Add secrets:
   - DOCKER_HUB_USERNAME: debabratap
   - DOCKER_HUB_ACCESS_TOKEN: <your-access-token>
   ```

2. **Workflow Features**
   - Multi-platform builds (AMD64, ARM64)
   - Automatic tagging
   - Security scanning with Trivy
   - Caching for faster builds
   - Environment-specific deployments

### Workflow Triggers
```yaml
on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master ]
```

## 🐳 Docker Hub Integration

### Repository Details
- **Name**: `debabratap/ai-notes-web`
- **URL**: https://hub.docker.com/r/debabratap/ai-notes-web
- **Visibility**: Public

### Available Tags
```bash
# Latest stable version
docker pull debabratap/ai-notes-web:latest

# Specific build number
docker pull debabratap/ai-notes-web:42

# Branch-specific
docker pull debabratap/ai-notes-web:develop

# Version tags
docker pull debabratap/ai-notes-web:v1.0.0
```

## 🚀 Deployment Strategies

### 1. Local Development
```bash
docker-compose up -d
# Access: http://localhost:3000
```

### 2. Staging Environment
```bash
BUILD_NUMBER=42 docker-compose -f docker-compose.staging.yml up -d
# Access: http://localhost:3001
```

### 3. Production Environment
```bash
BUILD_NUMBER=42 docker-compose -f docker-compose.prod.yml up -d
# Access: http://localhost:80
```

### 4. Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-notes-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-notes-web
  template:
    metadata:
      labels:
        app: ai-notes-web
    spec:
      containers:
      - name: ai-notes-web
        image: debabratap/ai-notes-web:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: ai-notes-web-service
spec:
  selector:
    app: ai-notes-web
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔒 Security Best Practices

### 1. Credentials Management
- ✅ Use Docker Hub access tokens (not passwords)
- ✅ Store secrets in Jenkins Credentials or GitHub Secrets
- ✅ Rotate tokens regularly
- ❌ Never commit secrets to code

### 2. Image Security
- ✅ Use official base images
- ✅ Run vulnerability scans
- ✅ Keep dependencies updated
- ✅ Use multi-stage builds
- ❌ Don't run as root user

### 3. Access Control
- ✅ Limit Docker Hub repository access
- ✅ Use least privilege principle
- ✅ Enable 2FA on accounts
- ✅ Monitor access logs

## 📊 Monitoring and Alerts

### Build Monitoring
```bash
# Jenkins build status
curl -s "http://jenkins.example.com/job/ai-notes-web/lastBuild/api/json" | jq '.result'

# GitHub Actions status
gh run list --repo your-username/ai-notes-web
```

### Docker Hub Monitoring
```bash
# Check image pulls
curl -s "https://hub.docker.com/v2/repositories/debabratap/ai-notes-web/" | jq '.pull_count'

# List tags
curl -s "https://hub.docker.com/v2/repositories/debabratap/ai-notes-web/tags/" | jq '.results[].name'
```

### Application Monitoring
```bash
# Health check
curl -f http://localhost:3000 || echo "App is down"

# Container status
docker ps | grep ai-notes-web
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Docker Build Fails
```bash
# Check Dockerfile syntax
docker build --no-cache -t test .

# Check build context
docker build --progress=plain -t test .
```

#### 2. Push to Docker Hub Fails
```bash
# Test credentials
docker login -u debabratap

# Check repository permissions
docker push debabratap/ai-notes-web:test
```

#### 3. Jenkins Pipeline Fails
```bash
# Check Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Verify plugins
curl -s "http://jenkins.example.com/pluginManager/api/json?depth=1" | jq '.plugins[].shortName'
```

#### 4. GitHub Actions Fails
```bash
# Check workflow syntax
gh workflow view docker-build-push.yml

# View run logs
gh run view --log
```

### Debug Commands

```bash
# Test Docker build locally
docker build -t ai-notes-web-test .
docker run -p 8080:80 ai-notes-web-test

# Test Node.js build
npm ci
npm run build
npm run lint

# Check environment
node --version
npm --version
docker --version
```

## 📈 Performance Optimization

### Build Optimization
- ✅ Use npm ci instead of npm install
- ✅ Enable Docker layer caching
- ✅ Use multi-stage builds
- ✅ Optimize .dockerignore

### Runtime Optimization
- ✅ Use nginx for serving static files
- ✅ Enable gzip compression
- ✅ Set proper cache headers
- ✅ Use CDN for assets

### CI/CD Optimization
- ✅ Parallel job execution
- ✅ Build caching
- ✅ Conditional deployments
- ✅ Resource limits

## 🔄 Maintenance

### Regular Tasks
- Update base Docker images monthly
- Rotate access tokens quarterly
- Review and update dependencies
- Monitor build performance
- Clean up old images and builds

### Version Management
```bash
# Tag new version
git tag v1.1.0
git push origin v1.1.0

# Update Docker image
docker tag debabratap/ai-notes-web:latest debabratap/ai-notes-web:v1.1.0
docker push debabratap/ai-notes-web:v1.1.0
```

## 📚 Additional Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review build logs
3. Verify configuration
4. Test locally first
5. Create an issue in the repository

---

This CI/CD setup provides a robust, automated pipeline for building, testing, and deploying your AI Notes Web application to Docker Hub with proper security and monitoring practices.
