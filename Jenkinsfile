pipeline {
    agent any

    environment {
        IMAGE_NAME = "bluegreen-app"     // your docker image name
        VERSION = "v1"           // can change to v2, v3 later
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Shreyash1928/blue-green-app'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME}:${VERSION} .
                """
            }
        }

        stage('Blue-Green Deployment') {
            steps {
                script {

                    echo "Checking if BLUE container is running"

                    def blueRunning = sh(
                        script: "docker ps --filter 'name=blue-app' -q",
                        returnStdout: true
                    ).trim()

                    if (blueRunning) {
                        //
                        // BLUE is already deployed → deploy new version as GREEN
                        //
                        echo "BLUE is running → Deploying GREEN"

                        sh "docker rm -f green-app || true"

                        sh """
                            docker run -d \
                            -p 8081:8080 \
                            --name green-app \
                            ${IMAGE_NAME}:${VERSION}
                        """

                        echo "Switching traffic from BLUE → GREEN"
                        sh "docker rm -f blue-app || true"
                        sh "docker rename green-app blue-app"

                    } else {
                        //
                        // BLUE is NOT deployed → deploy BLUE first time
                        //
                        echo "BLUE is not running → Deploying BLUE"

                        sh "docker rm -f blue-app || true"

                        sh """
                            docker run -d \
                            -p 8080:8080 \
                            --name blue-app \
                            ${IMAGE_NAME}:${VERSION}
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Blue-Green deployment completed successfully!"
        }
    }
}
