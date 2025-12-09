pipeline {
    agent {
        label 'neuronomous'
    }
    triggers {
        githubPush()
    }
    environment {
        GIT_REPO = 'https://github.com/md-rejoyan-islam/sust_cctv.git'
        WORK_DIR = '/home/apps/cctv'
    }
    stages {
        // ==================== CLONE REPOSITORY ====================
        stage('Clone Repository') {
            steps {
                script {
                    echo '🔹 Cloning repository into workspace'
                    git branch: 'main', url: "${GIT_REPO}", credentialsId: 'rejoyan-github-repo'
                    echo '✅ Repository cloned successfully'

                    String branchName = sh(
                        script: 'git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()

                    String commitSHA = sh(
                        script: 'git rev-parse HEAD',
                        returnStdout: true
                    ).trim()

                    env.GIT_BRANCH = branchName
                    env.GIT_COMMIT = commitSHA

                    echo "Branch: ${env.GIT_BRANCH}"
                    echo "Commit: ${env.GIT_COMMIT}"
                }
            }
        }

        // ==================== SERVER BUILD ====================
        stage('Server: Generate .env file') {
            steps {
                script {
                    def envContent = '''# server configuration
NODE_ENV = production
PORT = 5505

# database configuration
MONGO_URI= mongodb://sust_eee:seueset_2_3_4@mongodb.neuronomous.net:27018/cctv?authSource=admin&ssl=true

# client configuration
CLIENT_URL = http://localhost:5506
WHITE_LISTED_DOMAINS = http://localhost:5506,http://localhost:3000,https://sust-cctv.neuronomous.net

# jwt secret
JWT_SECRET = 78a3bb40a0a5e4e41b41ff3f2ba15bd1
JWT_EXPIRES_IN = 3600
JWT_REFRESH_SECRET = 6b939fee1e33c4f5014cc328c9ea8051
JWT_REFRESH_EXPIRES_IN = 604800
'''
                    writeFile file: "${WORKSPACE}/server/.env", text: envContent
                    echo '✅ Server .env file generated'
                }
            }
        }

        stage('Server: Install & Build') {
            steps {
                script {
                    echo '🔹 Installing SERVER dependencies with pnpm...'
                    dir('server') {
                        sh '''
                            export PATH=/root/.nvm/versions/node/v22.19.0/bin:$PATH
                            if ! command -v pnpm &> /dev/null
                            then
                                npm install -g pnpm
                            fi
                            pnpm install
                            pnpm build
                        '''
                    }
                    echo '✅ Server build completed successfully'
                }
            }
        }

        // ==================== CLIENT BUILD ====================
        stage('Client: Generate .env file') {
            steps {
                script {
                    def envContent = '''API_URL = https://cctv-api.neuronomous.net/api/v1
NEXT_PUBLIC_API_URL = https://cctv-api.neuronomous.net/api/v1
NEXT_PUBLIC_NODE_ENV = production
NODE_ENV = production
'''
                    writeFile file: "${WORKSPACE}/client/.env", text: envContent
                    echo '✅ Client .env file generated'
                }
            }
        }

        stage('Client: Install & Build') {
            steps {
                script {
                    echo '🔹 Installing CLIENT dependencies with pnpm...'
                    dir('client') {
                        sh '''
                            export PATH=/root/.nvm/versions/node/v22.19.0/bin:$PATH
                            if ! command -v pnpm &> /dev/null
                            then
                                npm install -g pnpm
                            fi
                            pnpm install
                            pnpm build
                        '''
                    }
                    echo '✅ Client build completed successfully'
                }
            }
        }

        // ==================== DEPLOY ====================
        stage('Copy Project to VPS') {
            steps {
                script {
                    echo '🔹 Remove old WORK_DIR and create fresh'
                    sh """
                        if [ -d "${WORK_DIR}" ]; then
                            echo "Directory exists. Removing..."
                            rm -rf "${WORK_DIR}"
                        fi
                        mkdir -p "${WORK_DIR}"
                        echo "Directory ready: ${WORK_DIR}"
                    """
                    echo '🔹 Copy full project from workspace to work dir'
                    sh """
                        cp -a ${WORKSPACE}/. ${WORK_DIR}/
                    """
                    echo '✅ Project files copied to WORK_DIR successfully'
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    echo '🔹 Starting Docker containers'
                    sh """
                        cd ${WORK_DIR}
                        # Stop existing containers if running
                        docker-compose down || true
                        # Build and start containers
                        docker-compose up -d --build
                    """
                    echo '✅ Docker containers started successfully'
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up the build workspace directory'
                cleanWs()
                echo '✅ Workspace cleaned'
            }
        }
        success {
            script {
                node {
                    emailext(
                        subject: "✅ SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                        body: """
                            ✅ Jenkins Build Successful!

                            🔹 Job Name: ${env.JOB_NAME}
                            🔹 Build Number: #${env.BUILD_NUMBER}
                            🔹 Branch: ${env.GIT_BRANCH}
                            🔹 Commit: ${env.GIT_COMMIT}
                            🔹 Triggered By: ${currentBuild.getBuildCauses()[0].shortDescription}
                            🔹 Duration: ${currentBuild.durationString}

                            📂 Deployed to: /home/apps/cctv
                            🐳 Docker: Running
                            📄 Console Log: ${env.BUILD_URL}console
                            """,
                        to: 'rejoyanislam0014@gmail.com'
                    )
                }
            }
        }
        failure {
            script {
                node {
                    emailext(
                        subject: "❌ FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                        body: """
                            ❌ Jenkins Build Failed!

                            🔹 Job Name: ${env.JOB_NAME}
                            🔹 Build Number: #${env.BUILD_NUMBER}
                            🔹 Branch: ${env.GIT_BRANCH}
                            🔹 Commit: ${env.GIT_COMMIT}
                            🔹 Triggered By: ${currentBuild.getBuildCauses()[0].shortDescription}
                            🔹 Duration: ${currentBuild.durationString}

                            ⚠️ Console Output: ${env.BUILD_URL}console
                            """,
                        to: 'rejoyanislam0014@gmail.com'
                    )
                }
            }
        }
    }
}
