pipeline {
    agent {
        label "jenkins-agent-hetzner"
    }
    tools {
        nodejs "Node"
    }
    environment {
        APP_NAME = "webapp"
        RELEASE = "1.0.3"
        REGISTERY = "https://hub.reznetdevops.com"
        REGISTERY_NAME = "hub.reznetdevops.com"
        PROJECT = "intelprod"
        IMAGE_NAME = "${REGISTERY_NAME}/${PROJECT}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        HARBOR_PASS = 'harbortoken'
        SONARQUBE_ENV = "sonarqube-scanner"
    }
    stages {
        stage("Clean workspace") {
            steps {
                script {
                    slackSend botUser: true, channel: '#monitoring', color: 'warning', message: "Build started: `${BUILD_TAG} Url:${JOB_URL}`", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
                    cleanWs()
                }
            }
            post {
                always { echo "========Clean workspace========" }
                success { echo "========Cleaning Workspace executed successfully========" }
                failure { 
                    slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Clean workspace` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
                }
            }
        }
        stage("Checkout from SCM") {
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/Intellectera/webapp'
            }
            post {
                always { echo "========Checkout from SCM========" }
                success { echo "========Checkout from SCM executed successfully========" }
                failure { 
                    slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Checkout from SCM` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
                }
            }
        }
        stage("Install Dependencies") {
            steps {
                sh 'npm install'
            }
            post {
                always { echo "========Install Dependencies========" }
                success { echo "========Install Dependencies executed successfully========" }
                failure { 
                    slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Install Dependencies` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
                }
            }
        }
        stage("Trivy FS scan") {
            steps {
                script {
                    sh "trivy scan2html fs --scanners vuln,secret,misconfig . ${APP_NAME}fsscan${IMAGE_TAG}.html"
                    def filePath = "${APP_NAME}fsscan${IMAGE_TAG}.html"
                    if (fileExists(filePath)) {
                        slackUploadFile(
                            channel: 'C06U0G3TWVA',
                            credentialId: 'slackBotToken',
                            filePath: filePath,
                            initialComment: 'Trivy FS scan result:'
                        )
                    } else {
                        error "File not found: ${filePath}"
                    }
                }
            }
            post {
                always { echo "========Trivy FS scan========" }
                success { echo "========Trivy FS scan executed successfully========" }
                failure { 
                    slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Trivy FS scan` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
                }
            }
        }
        //stage("Build Application") {
        //    steps {
        //        sh 'npm run build'
        //    }
        //    post {
        //        always { echo "========Build Application========" }
        //        success { echo "========Build Application executed successfully========" }
        //        failure { 
        //            slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Build Application` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
        //        }
        //    }
        //}
        //stage("SonarQube Analysis") {
        //    steps {
        //        script {
        //            withSonarQubeEnv('sonarqube-scanner') {
        //                sh "${env.SONARQUBE_SCANNER_HOME}/bin/sonar-scanner \
        //                -Dsonar.projectKey=${APP_NAME} \
        //                -Dsonar.projectName=${APP_NAME} \
        //                -Dsonar.projectVersion=${RELEASE} \
        //                -Dsonar.sources=src \
        //                -Dsonar.language=js \
        //                -Dsonar.sourceEncoding=UTF-8"
        //            }
        //        }
        //    }
        //    post {
        //        always { echo "========SonarQube Analysis========" }
        //        success { echo "========SonarQube Analysis executed successfully========" }
        //        failure { 
        //            slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `SonarQube Analysis` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
        //        }
        //    }
        //}
        //stage("Quality Gate") {
        //    steps {
        //        script {
        //            waitForQualityGate abortPipeline: false, credentialsId: 'jenkins-sonarqube-token'
        //        }
        //    }
        //    post {
        //        always { echo "========Quality Gate========" }
        //        success { echo "========Quality Gate executed successfully========" }
        //        failure { 
        //            slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Quality Gate` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
        //        }
        //    }
        //}
        stage("Build & Push container image") {
            steps {
                script {
                    docker.withRegistry(REGISTERY, HARBOR_PASS) {
                        def dockerImage = docker.build "${IMAGE_NAME}"
                        dockerImage.push("${IMAGE_TAG}")
                    }
                }
            }
            post {
                always { echo "========Build & Push container image========" }
                success { echo "========Build & Push container image executed successfully========" }
                failure { 
                    slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Build & Push container image` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
                }
            }
        }
        stage("Trivy Image scan") {
            steps {
                script {
                    sh "trivy scan2html image ${IMAGE_NAME}:${IMAGE_TAG} ${APP_NAME}ImageScan${IMAGE_TAG}.html"
                    def filePath = "${APP_NAME}ImageScan${IMAGE_TAG}.html"
                    if (fileExists(filePath)) {
                        slackUploadFile(
                            channel: 'C06U0G3TWVA',
                            credentialId: 'slackBotToken',
                            filePath: filePath,
                            initialComment: 'Trivy image scan result:'
                        )
                    } else {
                        error "File not found: ${filePath}"
                    }
                }
            }
            post {
                always { echo "========Trivy Image scan========" }
                success { echo "========Trivy Image scan executed successfully========" }
                failure { 
                    slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Trivy Image scan` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
                }
            }
        }
        stage("Cleanup Artifacts") {
            steps {
                script {
                    sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
            post {
                always { echo "========Cleanup Artifacts========" }
                success { echo "========Cleanup Artifacts executed successfully========" }
                failure { 
                    slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed at `Cleanup Artifacts` stage Url:${JOB_URL}", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
                }
            }
        }
    }
    post {
        always {
            echo "========(React Frontend Pipeline)========"
        }
        success {
            slackSend botUser: true, channel: '#monitoring', color: 'good', message: "Build Successful `${BUILD_TAG} Url:${BUILD_URL}`", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
        }
        failure {
            slackSend botUser: true, channel: '#monitoring', color: 'danger', message: "Build failed `${BUILD_TAG} Url:${BUILD_URL}`", teamDomain: 'intellectera', tokenCredentialId: 'slackBotToken'
        }
    }
}