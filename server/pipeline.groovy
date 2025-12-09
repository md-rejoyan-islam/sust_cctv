pipeline {
    agent {
        label 'neuronomous'
    }
    triggers {
        githubPush()
    }
    environment {
        WORKSPACE_DIR = '/home/workspace/cctv-api'
        WORK_DIR = '/home/apps/cctv-api'
        GIT_REPO = 'https://github.com/md-rejoyan-islam/sust_cctv_api.git'
    }
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    echo 'Cloning repository into workspace'
                    git branch: 'main', url: "${GIT_REPO}", credentialsId: 'rejoyan-github-repo'
                    echo '✅ Repository cloned successfully'

                    // Get current branch name and commit SHA
                    String branchName = sh(
                        script: 'git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()

                    String commitSHA = sh(
                        script: 'git rev-parse HEAD',
                        returnStdout: true
                    ).trim()

                    // Store in environment for later use
                    env.GIT_BRANCH = branchName
                    env.GIT_COMMIT = commitSHA

                    echo "Current Branch: ${env.GIT_BRANCH}"
                    echo "Current Commit: ${env.GIT_COMMIT}"
                }
            }
        }

        stage('Generate .env file') {
            steps {
                script {
                    def envContent = '''
                        # server configuration
                        NODE_ENV = production
                        PORT = 5505

                        # database configuration
                        MONGO_URI= mongodb://sust_eee:seueset_2_3_4@mongodb.neuronomous.net:27018/cctv?authSource=admin&ssl=true

                        # client configuration
                        CLIENT_URL = http://localhost:5506
                        WHITE_LISTED_DOMAINS = http://localhost:5506,http://localhost:3000,https://sust-cctv.neuronomous.net

                        # jwt secret
                        JWT_SECRET = 78a3bb40a0a5e4e41b41ff3f2ba15bd1
                        JWT_EXPIRES_IN = 3600 # 1 hour
                        JWT_REFRESH_SECRET = 6b939fee1e33c4f5014cc328c9ea8051
                        JWT_REFRESH_EXPIRES_IN = 604800 # 7 days
                        '''
                    writeFile file: "${WORKSPACE}/.env", text: envContent
                    echo '✅ .env file generated'
                }
            }
        }

        stage('PNPM Build') {
            steps {
                script {
                    echo '🔹 Installing dependencies with pnpm...'
                    sh '''
                        # Ensure Node and PNPM paths
                        export PATH=/root/.nvm/versions/node/v22.19.0/bin:$PATH
                        # Install PNPM if not installed
                        if ! command -v pnpm &> /dev/null
                        then
                            npm install -g pnpm
                        fi
                        pnpm install
                        pnpm build
                    '''
                    echo '✅ PNPM Build completed successfully'
                }
            }
        }

        stage('Copy Build Files') {
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
                    echo '🔹 Copy files from workspace to work dir'
                    sh """
                        cp -a ${WORKSPACE_DIR}/. ${WORK_DIR}/
                    """
                    echo '✅ Files copied to WORK_DIR successfully'
                }
            }
        }

        stage('Reload PM2') {
            steps {
                script {
                    echo '🔹 Reloading PM2'
                    sh """
                        # Ensure PM2 path
                        export PATH=/root/.nvm/versions/node/v22.19.0/bin:\$PATH
                        cd ${WORK_DIR}
                        # Reload if running, else start
                        pm2 reload cctv-api || pm2 start npm --name "cctv-api" -- run start
                    """
                    echo '✅ PM2 reloaded successfully'
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

                                    📂 Workspace: ${env.WORKSPACE}
                                    📄 Console Log: ${env.BUILD_URL}console
                                    📦 Artifacts: ${env.BUILD_URL}artifact
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
                            📦 Artifacts: ${env.BUILD_URL}artifact
                            """,
                        to: 'rejoyanislam0014@gmail.com'
                    )
                }
            }
        }
    }
}
