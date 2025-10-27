# Complete VPS Deployment Guide
## From Fresh Ubuntu Server to Production Application

This guide walks you through deploying the Chaykov SaaS Application on a fresh Ubuntu VPS from scratch.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Initial VPS Setup](#step-1-initial-vps-setup)
3. [Step 2: Install Docker](#step-2-install-docker)
4. [Step 3: Install Docker Compose](#step-3-install-docker-compose)
5. [Step 4: Install Nginx (Reverse Proxy)](#step-4-install-nginx-reverse-proxy)
6. [Step 5: Setup Firewall](#step-5-setup-firewall)
7. [Step 6: Clone and Configure Application](#step-6-clone-and-configure-application)
8. [Step 7: Configure Environment Variables](#step-7-configure-environment-variables)
9. [Step 8: Deploy Application](#step-8-deploy-application)
10. [Step 9: Configure Nginx Reverse Proxy](#step-9-configure-nginx-reverse-proxy)
11. [Step 10: Setup SSL with Let's Encrypt](#step-10-setup-ssl-with-lets-encrypt)
12. [Step 11: Setup Automatic Backups](#step-11-setup-automatic-backups)
13. [Step 12: Monitoring and Logs](#step-12-monitoring-and-logs)
14. [Troubleshooting](#troubleshooting)
15. [Maintenance](#maintenance)

---

## Prerequisites

- Fresh Ubuntu 22.04 or 24.04 LTS VPS
- Root or sudo access
- Domain name pointed to your VPS IP (optional but recommended)
- Minimum 2GB RAM, 2 CPU cores, 20GB storage

---

## Step 1: Initial VPS Setup

### 1.1 Connect to Your VPS

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Or if using a non-root user
ssh your_username@YOUR_VPS_IP
```

### 1.2 Update System

```bash
# Update package lists
sudo apt update

# Upgrade all packages
sudo apt upgrade -y

# Reboot if kernel was updated
sudo reboot
```

### 1.3 Create Non-Root User (if using root)

```bash
# Create new user
sudo adduser deploy

# Add to sudo group
sudo usermod -aG sudo deploy

# Switch to new user
su - deploy
```

### 1.4 Setup SSH Key Authentication (Recommended)

```bash
# On your LOCAL machine, generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy SSH key to VPS
ssh-copy-id deploy@YOUR_VPS_IP

# Test login (should not ask for password)
ssh deploy@YOUR_VPS_IP
```

### 1.5 Secure SSH (Optional but Recommended)

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Make these changes:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes

# Restart SSH service
sudo systemctl restart sshd
```

### 1.6 Set Timezone

```bash
# Check current timezone
timedatectl

# Set timezone (example: UTC)
sudo timedatectl set-timezone UTC

# Or set to your local timezone
sudo timedatectl set-timezone America/New_York
```

### 1.7 Install Essential Tools

```bash
sudo apt install -y \
  curl \
  wget \
  git \
  nano \
  htop \
  net-tools \
  ufw \
  unzip \
  ca-certificates \
  gnupg \
  lsb-release
```

---

## Step 2: Install Docker

### 2.1 Remove Old Docker Versions

```bash
sudo apt remove docker docker-engine docker.io containerd runc
```

### 2.2 Add Docker's Official GPG Key

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### 2.3 Add Docker Repository

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 2.4 Install Docker Engine

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2.5 Verify Docker Installation

```bash
sudo docker --version
# Output: Docker version 24.x.x, build xxxxx

sudo docker run hello-world
# Should download and run successfully
```

### 2.6 Add User to Docker Group (Optional)

```bash
# Add your user to docker group to run docker without sudo
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Test without sudo
docker ps
```

---

## Step 3: Install Docker Compose

Docker Compose v2 is installed as a Docker plugin in Step 2. Verify:

```bash
docker compose version
# Output: Docker Compose version v2.x.x
```

---

## Step 4: Install Nginx (Reverse Proxy)

### 4.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 4.2 Start and Enable Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 4.3 Verify Nginx

Visit `http://YOUR_VPS_IP` in browser. You should see "Welcome to nginx!" page.

---

## Step 5: Setup Firewall

### 5.1 Enable UFW

```bash
# Allow SSH (IMPORTANT: Do this first!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### 5.2 Firewall Rules Summary

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

**IMPORTANT:** The backend (port 3001) and database (port 5432) are NOT exposed to the internet. They run inside Docker network and are accessed through Nginx reverse proxy.

---

## Step 6: Clone and Configure Application

### 6.1 Create Application Directory

```bash
# Create directory for application
sudo mkdir -p /var/www
cd /var/www
```

### 6.2 Clone Repository

```bash
# Clone your repository (use HTTPS or SSH)
sudo git clone https://github.com/YOUR_USERNAME/chaykov-saas-app.git

# Or if using SSH
sudo git clone git@github.com:YOUR_USERNAME/chaykov-saas-app.git

# Set ownership
sudo chown -R $USER:$USER /var/www/chaykov-saas-app

# Navigate to project
cd /var/www/chaykov-saas-app
```

---

## Step 7: Configure Environment Variables

### 7.1 Copy Production Environment Template

```bash
cp .env.production .env
```

### 7.2 Generate Secure Credentials

```bash
# Generate secure database password
POSTGRES_PASSWORD=$(openssl rand -base64 32)
echo "Generated POSTGRES_PASSWORD: $POSTGRES_PASSWORD"

# Generate secure API key
API_KEY=$(openssl rand -hex 32)
echo "Generated API_KEY: $API_KEY"
```

### 7.3 Edit Environment File

```bash
nano .env
```

Update the following values:

```bash
# Database
POSTGRES_DB=chaykov_saas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_GENERATED_PASSWORD_HERE

# Update in DATABASE_URL too
DATABASE_URL=postgresql://postgres:YOUR_GENERATED_PASSWORD_HERE@postgres:5432/chaykov_saas

# API Security
API_KEY=YOUR_GENERATED_API_KEY_HERE

# Frontend URL - Replace with your domain or VPS IP
FRONTEND_URL=http://yourdomain.com
# Or if no domain:
# FRONTEND_URL=http://123.45.67.89

# Frontend API URL
VITE_API_URL=http://yourdomain.com:3001/api
# Or if no domain:
# VITE_API_URL=http://123.45.67.89:3001/api

# Must match API_KEY
VITE_API_KEY=YOUR_GENERATED_API_KEY_HERE

# Docker Ports
POSTGRES_HOST_PORT=5432
BACKEND_HOST_PORT=3001
FRONTEND_HOST_PORT=80
```

### 7.4 Secure Environment File

```bash
# Set proper permissions (owner read/write only)
chmod 600 .env

# Verify
ls -la .env
# Should show: -rw------- 1 deploy deploy ...
```

---

## Step 8: Deploy Application

### 8.1 Run Deployment Script

```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy to production
./deploy.sh production
```

The script will:
1. Validate environment configuration
2. Pull latest changes from git
3. Stop existing containers
4. Build production images
5. Start all services
6. Wait for health checks
7. Display status and URLs

### 8.2 Verify Deployment

```bash
# Check running containers
docker ps

# Should show 3 containers:
# - polytalko-frontend-prod
# - polytalko-backend-prod
# - polytalko-postgres-prod

# Check logs
docker compose -f docker-compose.prod.yml logs -f

# Test health endpoints
curl http://localhost:3001/health
# Should return: {"status":"ok"}

curl http://localhost:80/health
# Should return: {"status":"ok"}
```

### 8.3 Access Application

- Frontend: `http://YOUR_VPS_IP`
- Backend API: `http://YOUR_VPS_IP:3001`
- Health Check: `http://YOUR_VPS_IP:3001/health`

---

## Step 9: Configure Nginx Reverse Proxy

This step is optional but **highly recommended** for production. Nginx will:
- Handle SSL/TLS termination
- Proxy requests to Docker containers
- Add security headers
- Enable caching
- Hide backend port from users

### 9.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/chaykov-saas
```

Add the following configuration:

```nginx
# Upstream for backend API
upstream backend_api {
    server localhost:3001;
}

# Upstream for frontend
upstream frontend_app {
    server localhost:80;
}

# HTTP server
server {
    listen 80;
    listen [::]:80;

    # Replace with your domain or VPS IP
    server_name yourdomain.com www.yourdomain.com;
    # Or if no domain: server_name 123.45.67.89;

    # Log files
    access_log /var/log/nginx/chaykov-saas-access.log;
    error_log /var/log/nginx/chaykov-saas-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Client body size limit
    client_max_body_size 10M;

    # API endpoints
    location /api {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://backend_api/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        access_log off;
    }

    # Frontend application
    location / {
        proxy_pass http://frontend_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9.2 Enable Site Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/chaykov-saas /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 9.3 Update Environment Variables

After setting up Nginx reverse proxy, update `.env`:

```bash
nano .env
```

Change:
```bash
# From:
VITE_API_URL=http://yourdomain.com:3001/api

# To:
VITE_API_URL=http://yourdomain.com/api
```

Rebuild frontend:
```bash
docker compose -f docker-compose.prod.yml up -d --build frontend
```

### 9.4 Update Firewall

```bash
# Block direct access to backend port (optional but recommended)
# The backend will only be accessible through Nginx

# If you want to block external access to port 3001:
# Don't add it to UFW - it's already not exposed externally
# Docker networks handle internal communication
```

---

## Step 10: Setup SSL with Let's Encrypt

### 10.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 10.2 Obtain SSL Certificate

```bash
# Replace with your actual domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email address
# - Agree to Terms of Service
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)
```

### 10.3 Verify SSL

Visit `https://yourdomain.com` - you should see a secure connection.

### 10.4 Test Auto-Renewal

```bash
# Dry run test
sudo certbot renew --dry-run

# Certbot automatically adds a cron job for renewal
# Check cron/systemd timer
sudo systemctl status certbot.timer
```

### 10.5 Updated Nginx Configuration (After SSL)

Certbot automatically updates your Nginx config. Verify:

```bash
sudo cat /etc/nginx/sites-available/chaykov-saas
```

Should now have SSL configuration:
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of configuration
}

# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 10.6 Update Environment for HTTPS

```bash
nano .env
```

Change:
```bash
FRONTEND_URL=https://yourdomain.com
VITE_API_URL=https://yourdomain.com/api
```

Rebuild:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Step 11: Setup Automatic Backups

### 11.1 Create Backup Script

```bash
sudo mkdir -p /var/backups/chaykov-saas
sudo nano /usr/local/bin/backup-chaykov-saas.sh
```

Add:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/chaykov-saas"
PROJECT_DIR="/var/www/chaykov-saas-app"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Backup database
echo "Backing up database..."
docker exec polytalko-postgres-prod pg_dump -U postgres chaykov_saas | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

# Backup environment file
echo "Backing up environment..."
cp "$PROJECT_DIR/.env" "$BACKUP_DIR/env_backup_$DATE"

# Backup docker volumes
echo "Backing up docker volumes..."
docker run --rm \
  -v polytalko-postgres-prod-data:/data \
  -v "$BACKUP_DIR":/backup \
  alpine tar czf /backup/volumes_backup_$DATE.tar.gz /data

# Remove old backups
echo "Cleaning old backups..."
find "$BACKUP_DIR" -name "db_backup_*" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "env_backup_*" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "volumes_backup_*" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-chaykov-saas.sh
```

### 11.2 Schedule Daily Backups

```bash
# Edit crontab
sudo crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/backup-chaykov-saas.sh >> /var/log/chaykov-saas-backup.log 2>&1
```

### 11.3 Test Backup

```bash
sudo /usr/local/bin/backup-chaykov-saas.sh

# Check backups
ls -lh /var/backups/chaykov-saas/
```

### 11.4 Restore from Backup (if needed)

```bash
# Stop application
cd /var/www/chaykov-saas-app
docker compose -f docker-compose.prod.yml down

# Restore database
gunzip < /var/backups/chaykov-saas/db_backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i polytalko-postgres-prod psql -U postgres chaykov_saas

# Restore environment
cp /var/backups/chaykov-saas/env_backup_YYYYMMDD_HHMMSS .env

# Start application
docker compose -f docker-compose.prod.yml up -d
```

---

## Step 12: Monitoring and Logs

### 12.1 Docker Logs

```bash
# View all logs
docker compose -f docker-compose.prod.yml logs -f

# View specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f postgres

# View last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100
```

### 12.2 Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/chaykov-saas-access.log

# Error logs
sudo tail -f /var/log/nginx/chaykov-saas-error.log
```

### 12.3 System Monitoring

```bash
# Check system resources
htop

# Check disk usage
df -h

# Check docker disk usage
docker system df

# Check container stats
docker stats
```

### 12.4 Health Checks

```bash
# Check service health
curl https://yourdomain.com/health

# Check all containers
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## Troubleshooting

### Container Not Starting

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs [service_name]

# Check service health
docker inspect polytalko-backend-prod | grep -A 10 Health

# Restart specific service
docker compose -f docker-compose.prod.yml restart backend
```

### Database Connection Issues

```bash
# Verify database is running
docker exec polytalko-postgres-prod pg_isready -U postgres

# Check database connection from backend
docker exec polytalko-backend-prod env | grep DATABASE_URL

# Connect to database
docker exec -it polytalko-postgres-prod psql -U postgres -d chaykov_saas
```

### Nginx Issues

```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check nginx status
sudo systemctl status nginx

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill process (if needed)
sudo kill -9 [PID]

# Or stop conflicting service
sudo systemctl stop apache2  # if Apache is running
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean Docker resources
docker system prune -a --volumes

# Remove old images
docker image prune -a

# Check largest directories
du -h --max-depth=1 /var | sort -hr
```

---

## Maintenance

### Update Application

```bash
cd /var/www/chaykov-saas-app

# Pull latest changes
git pull origin main

# Rebuild and restart
./deploy.sh production
```

### Update System Packages

```bash
# Update package lists
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Reboot if needed
sudo reboot
```

### Update Docker Images

```bash
cd /var/www/chaykov-saas-app

# Pull latest base images and rebuild
docker compose -f docker-compose.prod.yml build --pull --no-cache

# Restart services
docker compose -f docker-compose.prod.yml up -d
```

### Clean Up Docker Resources

```bash
# Remove unused containers, networks, images
docker system prune -a

# Remove unused volumes (be careful!)
docker volume prune
```

### Check Logs for Errors

```bash
# Application logs
docker compose -f docker-compose.prod.yml logs --tail=100 | grep -i error

# Nginx logs
sudo grep -i error /var/log/nginx/chaykov-saas-error.log | tail -20

# System logs
sudo journalctl -xe --no-pager | tail -50
```

---

## Security Best Practices

1. **Keep System Updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use Strong Passwords**
   - Generate with: `openssl rand -base64 32`
   - Store in password manager

3. **Limit SSH Access**
   - Use SSH keys only
   - Disable password authentication
   - Use non-standard SSH port (optional)

4. **Regular Backups**
   - Automate daily backups
   - Test restore process regularly
   - Store backups off-site

5. **Monitor Logs**
   - Check logs weekly for suspicious activity
   - Set up alerts for errors

6. **Keep Docker Images Updated**
   - Rebuild images monthly
   - Use specific version tags (avoid `latest`)

7. **Use HTTPS Only**
   - Redirect all HTTP to HTTPS
   - Keep SSL certificates updated

8. **Database Security**
   - Never expose database port externally
   - Use strong passwords
   - Regular backups

---

## Quick Reference Commands

```bash
# Start application
./deploy.sh production

# Stop application
docker compose -f docker-compose.prod.yml down

# Restart application
docker compose -f docker-compose.prod.yml restart

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check status
docker compose -f docker-compose.prod.yml ps

# Backup database
docker exec polytalko-postgres-prod pg_dump -U postgres chaykov_saas > backup.sql

# Restore database
cat backup.sql | docker exec -i polytalko-postgres-prod psql -U postgres chaykov_saas

# Update application
git pull && ./deploy.sh production

# Clean Docker
docker system prune -a
```

---

## Support

If you encounter issues:

1. Check logs: `docker compose -f docker-compose.prod.yml logs`
2. Verify environment: `cat .env`
3. Check health: `curl http://localhost:3001/health`
4. Review this guide's troubleshooting section

---

## Summary

You now have:
- ✅ Ubuntu VPS with security hardening
- ✅ Docker and Docker Compose installed
- ✅ Application deployed with docker-compose.prod.yml
- ✅ Nginx reverse proxy with SSL
- ✅ Automatic backups
- ✅ Firewall configured
- ✅ Monitoring and logging setup

Your application is production-ready and secure!

---

**Last Updated:** 2025-10-27
