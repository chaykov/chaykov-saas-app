# Deployment Guide - Chaykov SaaS Application

This guide will help you deploy your full-stack application (Frontend + Backend + PostgreSQL) to a VPS.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Testing](#local-testing)
- [VPS Deployment](#vps-deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### On Your Local Machine:
- Docker and Docker Compose installed
- Git installed
- SSH access to your VPS

### On Your VPS:
- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Ports 80, 443, 3001, and 5432 available
- Domain name (optional, but recommended for production)

---

## 🧪 Local Testing

Before deploying to VPS, test the Docker setup locally:

### 1. Copy Environment File

```bash
cp .env.example .env
```

Edit `.env` and update the values:
```bash
# Change the default password
POSTGRES_PASSWORD=your_secure_password_here
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 3. Verify Services

- **Frontend:** http://localhost
- **Backend API:** http://localhost:3001/health
- **PostgreSQL:** localhost:5432

### 4. Check Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 5. Stop Services

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes database data)
docker-compose down -v
```

---

## 🚀 VPS Deployment

### Step 1: Prepare Your VPS

#### 1.1 Install Docker

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### 1.2 Configure Firewall

```bash
# Allow SSH (important - don't lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow backend API (optional, can be removed if using nginx proxy)
sudo ufw allow 3001/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

### Step 2: Deploy Application

#### 2.1 Clone Your Repository

```bash
# Create application directory
mkdir -p ~/apps
cd ~/apps

# Clone your repository
git clone https://github.com/yourusername/chaykov-saas-app.git
cd chaykov-saas-app
```

#### 2.2 Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit environment file
nano .env
```

**Production `.env` configuration:**

```bash
# PostgreSQL Database Configuration
POSTGRES_DB=chaykov_saas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_VERY_SECURE_PASSWORD_HERE
POSTGRES_PORT=5432

# Backend API Configuration
NODE_ENV=production
BACKEND_PORT=3001

# Frontend Configuration
FRONTEND_PORT=80

# IMPORTANT: Update this to your VPS IP or domain
# If using domain: https://api.yourdomain.com/api
# If using IP: http://YOUR_VPS_IP:3001/api
VITE_API_URL=http://YOUR_VPS_IP:3001/api

# Database Connection String
DATABASE_URL=postgresql://postgres:YOUR_VERY_SECURE_PASSWORD_HERE@postgres:5432/chaykov_saas
```

**⚠️ Important Notes:**
- Replace `YOUR_VPS_IP` with your actual VPS IP address
- Use a strong password for `POSTGRES_PASSWORD`
- If using a domain, update `VITE_API_URL` accordingly

#### 2.3 Build and Deploy

```bash
# Build and start all services
docker-compose up --build -d

# Monitor the startup process
docker-compose logs -f
```

Wait until you see messages like:
```
backend    | ✨ Starting Express server...
backend    | Server running on http://localhost:3001
frontend   | nginx is ready
postgres   | database system is ready to accept connections
```

#### 2.4 Verify Deployment

```bash
# Check running containers
docker-compose ps

# All containers should show "Up" status
```

Test the endpoints:
- Frontend: `http://YOUR_VPS_IP`
- Backend Health: `http://YOUR_VPS_IP:3001/health`

### Step 3: Database Setup

#### 3.1 Run Migrations (if using Drizzle)

The backend automatically runs migrations on startup via the entrypoint script. If you need to run them manually:

```bash
docker-compose exec backend pnpm drizzle:migrate
```

#### 3.2 Seed Database (Optional)

If you have a seed script:

```bash
docker-compose exec backend pnpm seed
```

### Step 4: Domain Configuration (Optional)

If you have a domain name:

#### 4.1 DNS Configuration

Point your domain to your VPS:
- `yourdomain.com` → Your VPS IP (A record)
- `api.yourdomain.com` → Your VPS IP (A record)

#### 4.2 Install SSL Certificate (Let's Encrypt)

Create `docker-compose.prod.yml`:

```yaml
version: '3.9'

services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - chaykov-network

  # Extend existing services...
```

Use Certbot for SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## ⚙️ Environment Configuration

### Development vs Production

**Development (Local):**
```bash
NODE_ENV=development
VITE_API_URL=http://localhost:3001/api
FRONTEND_PORT=80
BACKEND_PORT=3001
```

**Production (VPS):**
```bash
NODE_ENV=production
VITE_API_URL=http://YOUR_VPS_IP:3001/api  # or https://api.yourdomain.com/api
FRONTEND_PORT=80
BACKEND_PORT=3001
```

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `POSTGRES_DB` | Database name | `chaykov_saas` | No |
| `POSTGRES_USER` | Database user | `postgres` | No |
| `POSTGRES_PASSWORD` | Database password | `postgres` | **Yes** |
| `POSTGRES_PORT` | Database port | `5432` | No |
| `NODE_ENV` | Node environment | `production` | No |
| `BACKEND_PORT` | Backend API port | `3001` | No |
| `FRONTEND_PORT` | Frontend port | `80` | No |
| `VITE_API_URL` | API URL for frontend | `http://localhost:3001/api` | **Yes** |
| `DATABASE_URL` | Full database connection string | Auto-generated | **Yes** |

---

## 🔄 Maintenance Commands

### Update Application

```bash
cd ~/apps/chaykov-saas-app

# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose up --build -d

# Check logs for errors
docker-compose logs -f
```

### Backup Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
docker-compose exec postgres pg_dump -U postgres chaykov_saas > ~/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Or use docker volume backup
docker run --rm \
  --volumes-from chaykov-saas-postgres \
  -v ~/backups:/backup \
  ubuntu tar czf /backup/postgres_data_$(date +%Y%m%d_%H%M%S).tar.gz /var/lib/postgresql/data
```

### Restore Database

```bash
# Restore from SQL dump
docker-compose exec -T postgres psql -U postgres chaykov_saas < ~/backups/backup_YYYYMMDD_HHMMSS.sql
```

### View Container Stats

```bash
# Real-time resource usage
docker stats

# Disk usage
docker system df
```

### Clean Up

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete cleanup (careful!)
docker system prune -a --volumes
```

---

## 🐛 Troubleshooting

### Frontend Cannot Connect to Backend

**Symptom:** Frontend shows network errors

**Solutions:**
1. Check `VITE_API_URL` in `.env` is correct
2. Verify backend is running: `docker-compose ps`
3. Test backend health: `curl http://localhost:3001/health`
4. Check CORS settings in backend `src/server.ts`
5. Rebuild frontend with correct API URL:
   ```bash
   docker-compose up --build frontend
   ```

### Database Connection Failed

**Symptom:** Backend shows "database connection failed"

**Solutions:**
1. Check `DATABASE_URL` is correct in `.env`
2. Verify PostgreSQL is running: `docker-compose ps postgres`
3. Check PostgreSQL logs: `docker-compose logs postgres`
4. Ensure password matches in all places
5. Wait for PostgreSQL health check to pass

### Port Already in Use

**Symptom:** "port is already allocated"

**Solutions:**
1. Check what's using the port:
   ```bash
   sudo lsof -i :80
   sudo lsof -i :3001
   ```
2. Stop conflicting service or change ports in `.env`
3. Use different ports:
   ```bash
   FRONTEND_PORT=8080
   BACKEND_PORT=3002
   ```

### Container Keeps Restarting

**Symptoms:** Container status shows "Restarting"

**Solutions:**
1. Check logs: `docker-compose logs [service-name]`
2. Common issues:
   - Missing environment variables
   - Database not ready (increase `start_period` in health check)
   - Build errors
   - Port conflicts

### Out of Disk Space

**Solutions:**
```bash
# Check disk usage
df -h

# Clean Docker resources
docker system prune -a --volumes

# Check large images
docker images --format "{{.Size}}\t{{.Repository}}" | sort -h
```

### Frontend Shows 404 for Routes

**Symptom:** Page refresh shows 404 on routes like `/dashboard`

**Solution:** This should already be handled by nginx.conf with `try_files $uri $uri/ /index.html;`

If still having issues:
1. Verify nginx.conf is correctly copied to container
2. Rebuild frontend: `docker-compose up --build frontend`

### Database Data Lost After Restart

**Solution:** Ensure Docker volume is persistent:
```bash
# Check volumes
docker volume ls

# The postgres_data volume should exist
# If missing, check docker-compose.yml volumes section
```

---

## 📊 Monitoring

### Check Health Status

```bash
# All services health
docker-compose ps

# Specific service health
docker inspect --format='{{json .State.Health}}' chaykov-saas-backend | jq
```

### Monitor Logs

```bash
# Follow all logs
docker-compose logs -f

# Filter by service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Since specific time
docker-compose logs --since=1h backend
```

### Performance Monitoring

```bash
# Container stats
docker stats

# Detailed container info
docker inspect chaykov-saas-backend
```

---

## 🔒 Security Best Practices

1. **Change Default Passwords**
   - Always use strong, unique passwords for `POSTGRES_PASSWORD`

2. **Use SSL/TLS**
   - Set up HTTPS with Let's Encrypt for production
   - Update `VITE_API_URL` to use `https://`

3. **Firewall Configuration**
   - Only expose necessary ports
   - Consider closing port 3001 and proxy through nginx

4. **Regular Updates**
   - Keep Docker images updated
   - Regularly update your application code

5. **Environment Variables**
   - Never commit `.env` to git
   - Use different credentials for production

6. **Backup Strategy**
   - Regular automated database backups
   - Store backups off-server

---

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure all services are healthy: `docker-compose ps`
4. Review this troubleshooting section

---

## 🎉 Success!

Your application should now be running at:
- **Frontend:** `http://YOUR_VPS_IP` or `https://yourdomain.com`
- **Backend:** `http://YOUR_VPS_IP:3001` or `https://api.yourdomain.com`
- **Database:** Internal network only (port 5432)

Test the application by creating an account and posting content!
