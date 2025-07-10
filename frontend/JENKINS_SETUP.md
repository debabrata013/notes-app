# Jenkins CI/CD Setup for AI Notes Web

## Prerequisites

### 1. Jenkins Server Requirements
- Jenkins 2.400+ with Pipeline plugin
- Docker installed on Jenkins agent
- Node.js plugin installed
- Git plugin installed

### 2. Required Jenkins Plugins
```bash
# Install these plugins in Jenkins
- Pipeline
- Docker Pipeline
- NodeJS Plugin
- Git Plugin
- Credentials Plugin
- Blue Ocean (optional, for better UI)
```

## Setup Instructions

### 1. Configure Docker Hub Credentials

1. Go to Jenkins Dashboard → Manage Jenkins → Credentials
2. Click on "Global" domain
3. Click "Add Credentials"
4. Select "Username with password"
5. Configure:
   - **ID**: `docker-hub-credentials`
   - **Username**: `debabratap` (your Docker Hub username)
   - **Password**: `your-docker-hub-token` (use access token, not password)
   - **Description**: `Docker Hub Credentials`

### 2. Configure Node.js

1. Go to Manage Jenkins → Tools
2. Find "NodeJS installations"
3. Click "Add NodeJS"
4. Configure:
   - **Name**: `20` (matches the Jenkinsfile)
   - **Version**: `NodeJS 20.x.x`
   - Check "Install automatically"

### 3. Create Jenkins Pipeline Job

#### Option A: Pipeline from SCM (Recommended)
1. New Item → Pipeline
2. Configure:
   - **Pipeline Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `your-git-repo-url`
   - **Branch**: `*/main` or `*/master`
   - **Script Path**: `Jenkinsfile`

#### Option B: Direct Pipeline Script
1. New Item → Pipeline
2. Configure:
   - **Pipeline Definition**: Pipeline script
   - Copy and paste the Jenkinsfile content

### 4. Configure Webhooks (Optional)

#### GitHub Webhook
1. Go to your GitHub repository
2. Settings → Webhooks → Add webhook
3. Configure:
   - **Payload URL**: `http://your-jenkins-url/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: Push events, Pull requests

#### GitLab Webhook
1. Go to your GitLab project
2. Settings → Webhooks
3. Configure:
   - **URL**: `http://your-jenkins-url/project/your-job-name`
   - **Trigger**: Push events, Merge request events

## Pipeline Features

### 🔄 **Automated Stages**
1. **Checkout**: Get source code from Git
2. **Environment Info**: Display build environment
3. **Install Dependencies**: Run `npm ci`
4. **Lint Code**: Run ESLint (optional)
5. **Build Application**: Run `npm run build`
6. **Build Docker Image**: Create Docker image
7. **Test Docker Image**: Basic container testing
8. **Security Scan**: Vulnerability scanning (optional)
9. **Push to Docker Hub**: Push to registry
10. **Deploy**: Deploy to staging/production

### 🎯 **Branch Strategy**
- **main/master**: Deploy to production (with approval)
- **develop**: Deploy to staging automatically
- **feature branches**: Build and test only

### 🏷️ **Tagging Strategy**
- Each build gets a unique tag: `build-${BUILD_NUMBER}`
- Latest tag updated only from main/master branch
- Version tags can be added for releases

## Environment Variables

The pipeline uses these environment variables:

```groovy
DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
DOCKER_IMAGE_NAME = 'debabratap/ai-notes-web'
DOCKER_TAG = "${BUILD_NUMBER}"
LATEST_TAG = 'latest'
NODE_VERSION = '20'
```

## Jenkinsfile Options

### 1. Full Pipeline (`Jenkinsfile`)
- Complete CI/CD with all stages
- Security scanning
- Multi-environment deployment
- Comprehensive error handling

### 2. Simple Pipeline (`Jenkinsfile.simple`)
- Basic build and push
- Minimal configuration
- Good for getting started

## Customization

### Adding Environment-Specific Deployments

```groovy
stage('Deploy to Staging') {
    when {
        branch 'develop'
    }
    steps {
        sh '''
            docker-compose -f docker-compose.staging.yml up -d
        '''
    }
}
```

### Adding Notifications

```groovy
post {
    success {
        slackSend(
            channel: '#deployments',
            message: "✅ AI Notes Web deployed successfully - Build ${BUILD_NUMBER}"
        )
    }
    failure {
        emailext(
            subject: "❌ Build Failed: AI Notes Web - ${BUILD_NUMBER}",
            body: "Build failed. Check Jenkins for details.",
            to: "team@company.com"
        )
    }
}
```

### Adding Tests

```groovy
stage('Run Tests') {
    steps {
        sh '''
            npm test -- --coverage --watchAll=false
        '''
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
    }
}
```

## Security Best Practices

### 1. Use Access Tokens
- Never use Docker Hub password directly
- Create and use Docker Hub access tokens
- Rotate tokens regularly

### 2. Secure Credentials
- Store all secrets in Jenkins Credentials
- Use credential IDs in pipeline
- Never hardcode sensitive data

### 3. Image Scanning
- Enable Trivy or similar security scanner
- Set security policies
- Fail builds on critical vulnerabilities

## Troubleshooting

### Common Issues

#### 1. Docker Permission Denied
```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

#### 2. Node.js Not Found
- Ensure Node.js plugin is installed
- Configure Node.js in Global Tool Configuration
- Match version name in Jenkinsfile

#### 3. Docker Hub Push Failed
- Verify credentials are correct
- Check Docker Hub access token permissions
- Ensure repository exists and is accessible

#### 4. Build Fails on Dependencies
```bash
# Clear npm cache
npm cache clean --force
# or use npm ci instead of npm install
```

### Debug Commands

```bash
# Check Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Check Docker on Jenkins agent
docker --version
docker info

# Test Docker Hub login
docker login -u debabratap

# Check Node.js
node --version
npm --version
```

## Monitoring and Maintenance

### 1. Build Metrics
- Monitor build success rate
- Track build duration
- Set up alerts for failed builds

### 2. Resource Management
- Clean up old Docker images
- Monitor disk space
- Archive old builds

### 3. Regular Updates
- Update Jenkins plugins
- Update Node.js version
- Update base Docker images

## Example Build Output

```
Started by user admin
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline
[Pipeline] node
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] checkout
[Pipeline] }
[Pipeline] stage
[Pipeline] { (Build Docker Image)
[Pipeline] script
[Pipeline] {
[Pipeline] sh
+ docker build -t debabratap/ai-notes-web:42 .
Successfully built abc123def456
Successfully tagged debabratap/ai-notes-web:42
[Pipeline] }
[Pipeline] }
[Pipeline] stage
[Pipeline] { (Push to Docker Hub)
[Pipeline] script
[Pipeline] {
[Pipeline] withDockerRegistry
[Pipeline] {
[Pipeline] sh
+ docker push debabratap/ai-notes-web:42
The push refers to repository [docker.io/debabratap/ai-notes-web]
✅ Build completed successfully!
```

This setup provides a robust CI/CD pipeline for your AI Notes Web application with Docker Hub integration.
