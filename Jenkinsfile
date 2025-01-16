pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent-kubernetes'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: nodejs
    image: node:18
    command: ['cat']
    tty: true
    env:
    - name: NODE_ENV
      value: production
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
  volumes:
  - name: kaniko-secret
    projected:
      sources:
      - secret:
          name: kaniko-secret
          items:
            - key: config.json
              path: config.json
"""
        }
    }
    environment {
        APP_NAME = "webapp"
        RELEASE = "1.0.4"
        REGISTERY = "https://hub.intellectera.ai"
        REGISTERY_NAME = "hub.intellectera.ai"
        PROJECT = "intelcloud"
        IMAGE_NAME = "${REGISTERY_NAME}/${PROJECT}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        PATH = "/busybox:$PATH"
    }
    stages {
        stage("Checkout from SCM") {
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/Intellectera/webapp'
            }
            post {
                always {
                    echo "========Checkout from SCM========"
                }
                success {
                    echo "========Checkout from SCM executed successfully========"
                }
                failure {
                    echo "========Checkout from SCM Failed========"
                }
            }
        }
        stage("Install Dependencies") {
            steps {
                container('nodejs') {
                    sh 'npm install'
                }
            }
            post {
                always {
                    echo "========Install Dependencies========"
                }
                success {
                    echo "========Install Dependencies executed successfully========"
                }
                failure {
                    echo "========Install Dependencies Failed========"
                }
            }
        }
        stage("Build & Push container image") {
            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                    sh '''#!/busybox/sh
                    /kaniko/executor \
                    --context `pwd` \
                    --dockerfile Dockerfile \
                    --destination ${IMAGE_NAME}:${IMAGE_TAG} \
                    '''
                }
            }
            post {
                always {
                    echo "========Build & Push container image========"
                }
                success {
                    echo "========Build & Push container image executed successfully========"
                }
                failure {
                    echo "========Build & Push container image Failed========"
                }
            }
        }
    }
    post {
        always {
            echo "========(webapp pipeline)========"
        }
        success {
            echo "========Build execution Successful========"
        }
        failure {
            echo "========Build execution failed========"
        }
    }
}
