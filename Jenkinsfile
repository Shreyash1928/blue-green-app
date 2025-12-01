pipeline {
    agent any

    environment {
        BLUE_IMAGE = "blue-app:v1"
        GREEN_IMAGE = "green-app:v2"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Shreyash1928/blue-green-app'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building BLUE and GREEN images"
                    sh "docker build -t $BLUE_IMAGE ."
                    sh "docker build -t $GREEN_IMAGE ."
                }
            }
        }

        stage('Blue-Green Deployment') {
            steps {
                script {
                    def BLUE = sh(script: "docker ps --filter name=blue-app -q", returnStdout: true).trim()

                    if (BLUE) {
                        echo "BLUE is running → Deploying GREEN on 8082"
                        sh """
                            docker rm -f green-app || true
                            docker run -d -p 8082:8080 --name green-app $GREEN_IMAGE
                        """
                    } else {
                        echo "BLUE is NOT running → Deploying BLUE on 8081"
                        sh """
                            docker rm -f blue-app || true
                            docker run -d -p 8081:8080 --name blue-app $BLUE_IMAGE
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Access URLs:"
            echo "BLUE  → http://localhost:8081"
            echo "GREEN → http://localhost:8082"
        }
    }
}
