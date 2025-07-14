pipeline {
    agent any;
    environment {
      MYSQL_ROOT_PASSWORD = credentials('mysql-root-password')
      MYSQL_DATABASE = credentials('mysql-database')
      JWT_SECRET = credentials('jwt-secret')
      PORT = credentials('backend-port')
      DB_HOST = credentials('db-host')
      DB_USER = credentials('db-user')
      DB_PASSWORD = credentials('db-password')
      DB_NAME = credentials('db-name')
      DB_PORT = credentials('db-port')
      GEMINI_API_KEY = credentials('gemini-api-key')
      VITE_BACKEND_URL = credentials('vite-backend-url')
    }
    stages{
        stage("clone code from github"){
            steps{
                git branch: 'master', url: 'https://github.com/debabrata013/notes-app.git'
            }
        }
        stage("build an image"){
            steps{
                sh "docker build -t notes-frontend-image ./frontend"
                sh "docker build -t notes-backend-image ./backend"
            }
        }
        stage("push image on dockerhub"){
            steps{
                withCredentials([usernamePassword(
                    credentialsId: "dockerhubcreds",
                    usernameVariable: "dockerHubUser",
                    passwordVariable: "dockerHubPass"
                )]){
                    sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
                    sh "docker tag notes-frontend-image ${env.dockerHubUser}/notes-frontend-image:latest"
                    sh "docker push ${env.dockerHubUser}/notes-frontend-image:latest"
                    sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
                    sh "docker tag notes-backend-image ${env.dockerHubUser}/notes-backend-image:latest"
                    sh "docker push ${env.dockerHubUser}/notes-backend-image:latest"
                }
            }
       }
       stage("deploy code"){
           steps{
               sh "docker compose up -d"
           }
       }
    }
    
    
    }
