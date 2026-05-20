pipeline {
    agent any

    environment {
        EC2_USER = "ec2-user"
        EC2_HOST = "34.204.75.205"
        KEY = "/var/lib/jenkins/.ssh/jenkins.pem"
    }

    stages {

        /* ================= CHECKOUT ================= */
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Rushikpatel08/frontendDemo.git'
            }
        }

        /* ================= INSTALL DEPENDENCIES ================= */
        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing npm dependencies..."
                npm install
                '''
            }
        }

        /* ================= BUILD ANGULAR ================= */
        stage('Build Angular') {
            steps {
                sh '''
                echo "Building Angular project..."
                npm run build --configuration production
                '''
            }
        }

        /* ================= VERIFY BUILD ================= */
        stage('Verify Build') {
            steps {
                sh '''
                echo "Checking dist folder..."
                ls -R dist/
                '''
            }
        }

        /* ================= DEPLOY TO EC2 ================= */
        stage('Deploy to EC2 + Nginx') {
            steps {
                sh """
                echo "Cleaning old Nginx files..."

                ssh -o StrictHostKeyChecking=no -i ${KEY} ${EC2_USER}@${EC2_HOST} '
                    sudo rm -rf /usr/share/nginx/html/*
                '

                echo "Copying Angular build..."

                scp -o StrictHostKeyChecking=no -i ${KEY} -r dist/* ${EC2_USER}@${EC2_HOST}:/tmp/

                echo "Deploying to Nginx..."

                ssh -o StrictHostKeyChecking=no -i ${KEY} ${EC2_USER}@${EC2_HOST} '
                    sudo cp -r /tmp/* /usr/share/nginx/html/ &&
                    sudo chmod -R 755 /usr/share/nginx/html &&
                    sudo systemctl restart nginx
                '
                """
            }
        }

        /* ================= HEALTH CHECK ================= */
        stage('Health Check') {
            steps {
                sh '''
                echo "Testing frontend..."

                curl -I http://34.204.75.205 || true
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Angular Deployment SUCCESS (EC2 + Nginx)"
        }

        failure {
            echo "❌ Angular Deployment FAILED"
        }

        always {
            cleanWs()
        }
    }
}