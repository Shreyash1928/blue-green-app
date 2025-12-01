pipeline {
    agent any

    environment {
        IMAGE_NAME = "bluegreen-app"
        VERSION = "v1"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Shreyash1928/blue-green-app'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$VERSION ."
            }
        }

        stage('Blue-Green Deployment') {
            steps {
                script {
                    echo "Checking if BLUE container is running"
                    def BLUE = sh(script: "docker ps --filter name=blue-app -q", returnStdout: true).trim()

                    if (BLUE) {
                        echo "BLUE is running → Deploy GREEN on port 8082"
                        sh """
                            docker rm -f green-app || true
                            docker run -d -p 8082:8080 --name green-app $IMAGE_NAME:$VERSION
                        """
                    } else {
                        echo "BLUE is NOT running → Deploy BLUE on port 8081"
                        sh """
                            docker rm -f blue-app || true
                            docker run -d -p 8081:8080 --name blue-app $IMAGE_NAME:$VERSION
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Visit Blue-Green:"
            echo "BLUE  → http://localhost:8081"
            echo "GREEN → http://localhost:8082"
        }
    }
}
