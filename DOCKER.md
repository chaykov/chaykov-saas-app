# Docker Setup Guide

Complete Docker configuration for the Chaykov SaaS Application with PostgreSQL database.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Docker Network                 │
│          (chaykov-network)                  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │          │  │          │  │          │ │
│  │ Frontend │  │ Backend  │  │PostgreSQL│ │
│  │  (Nginx) │  │ (Express)│  │          │ │
│  │  Port 80 │  │Port 3001 │  │Port 5432 │ │
│  │          │  │          │  │          │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │             │        │
│       │      API    │      DB     │        │
│       └────────────>│<────────────┘        │
│                     │                      │
└─────────────────────┼──────────────────────┘
                      │
                   Internet
```

## 📦 Services

### 1. PostgreSQL Database
- **Image:** `postgres:16-alpine`
- **Container:** `chaykov-saas-postgres`
- **Port:** `5432`
- **Volume:** `postgres_data` (persistent storage)
- **Health Check:** Automated with `pg_isready`

### 2. Backend API (Express)
- **Build:** Custom Dockerfile
- **Container:** `chaykov-saas-backend`
- **Port:** `3001`
- **Dependencies:** PostgreSQL
- **Features:**
  - Automatic database migrations
  - Health check endpoint at `/health`
  - Multi-stage build for optimization

### 3. Frontend (React + Vite)
- **Build:** Custom Dockerfile with Nginx
- **Container:** `chaykov-saas-frontend`
- **Port:** `80`
- **Dependencies:** Backend
- **Features:**
  - Production-optimized build
  - Nginx for static file serving
  - SPA routing support

## 🚀 Quick Start

### Option 1: Using Deploy Script (Recommended)

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Deploy locally
./deploy.sh local

# Deploy to production
./deploy.sh production
```

### Option 2: Manual Docker Compose

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env file (important!)
nano .env

# 3. Build and start
docker-compose up --build -d

# 4. Check logs
docker-compose logs -f
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Required variables:

```bash
# Database
POSTGRES_DB=chaykov_saas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password  # CHANGE THIS!

# Backend
NODE_ENV=production
BACKEND_PORT=3001
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/chaykov_saas

# Frontend
FRONTEND_PORT=80
VITE_API_URL=http://YOUR_VPS_IP:3001/api  # Update for production!
```

### Port Configuration

Default ports can be changed in `.env`:

```bash
POSTGRES_PORT=5432    # PostgreSQL
BACKEND_PORT=3001     # Backend API
FRONTEND_PORT=80      # Frontend (Nginx)
```

## 🔨 Docker Commands

### Building

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build without cache
docker-compose build --no-cache
```

### Starting/Stopping

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop and remove volumes (deletes database!)
docker-compose down -v
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend

# Since 1 hour ago
docker-compose logs --since=1h
```

### Service Management

```bash
# Restart a service
docker-compose restart backend

# Stop a service
docker-compose stop frontend

# Start a service
docker-compose start frontend

# View running containers
docker-compose ps

# View container stats
docker stats
```

### Accessing Containers

```bash
# Execute command in backend
docker-compose exec backend sh

# Execute command in frontend
docker-compose exec frontend sh

# Execute command in postgres
docker-compose exec postgres psql -U postgres -d chaykov_saas

# Run one-off command
docker-compose run backend pnpm drizzle:migrate
```

## 🗄️ Database Management

### Running Migrations

```bash
# Migrations run automatically on backend startup
# To run manually:
docker-compose exec backend pnpm drizzle:migrate
```

### Database Access

```bash
# PostgreSQL shell
docker-compose exec postgres psql -U postgres -d chaykov_saas

# Run SQL query
docker-compose exec postgres psql -U postgres -d chaykov_saas -c "SELECT * FROM users;"
```

### Backup Database

```bash
# SQL dump
docker-compose exec postgres pg_dump -U postgres chaykov_saas > backup.sql

# Restore from dump
docker-compose exec -T postgres psql -U postgres chaykov_saas < backup.sql

# Volume backup
docker run --rm \
  --volumes-from chaykov-saas-postgres \
  -v $(pwd)/backup:/backup \
  ubuntu tar czf /backup/postgres_data.tar.gz /var/lib/postgresql/data
```

## 🔍 Health Checks

All services have health checks configured:

### Check Health Status

```bash
# Via docker-compose
docker-compose ps

# Via docker inspect
docker inspect --format='{{json .State.Health}}' chaykov-saas-backend | jq

# Manual health checks
curl http://localhost:3001/health  # Backend
curl http://localhost/health       # Frontend
```

### Health Check Endpoints

- **Backend:** `GET /health` - Returns `{"status": "ok"}`
- **Frontend:** `GET /health` - Returns `healthy` (nginx)
- **PostgreSQL:** Internal `pg_isready` check

## 📊 Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats

# Specific containers
docker stats chaykov-saas-backend chaykov-saas-frontend

# Disk usage
docker system df

# Detailed disk usage
docker system df -v
```

### Container Inspection

```bash
# View container details
docker inspect chaykov-saas-backend

# View container logs
docker logs chaykov-saas-backend

# View network details
docker network inspect chaykov-saas-app_chaykov-network
```

## 🧹 Cleanup

### Remove Containers

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove containers, volumes, and images
docker-compose down -v --rmi all
```

### Clean Docker System

```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Complete cleanup (careful!)
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs [service-name]

# Check if port is in use
sudo lsof -i :80
sudo lsof -i :3001

# Remove container and rebuild
docker-compose down
docker-compose up --build
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U postgres

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### Frontend Can't Reach Backend

```bash
# Check VITE_API_URL in .env
cat .env | grep VITE_API_URL

# Rebuild frontend with new env vars
docker-compose up --build -d frontend

# Check backend is accessible
curl http://localhost:3001/health
```

### Permission Issues

```bash
# Fix ownership of files
sudo chown -R $USER:$USER .

# Fix docker socket permissions
sudo chmod 666 /var/run/docker.sock
```

## 📝 File Structure

```
chaykov-saas-app/
├── docker-compose.yml              # Main compose file
├── .env                            # Environment variables (create from .env.example)
├── .env.example                    # Environment template
├── .dockerignore                   # Files to exclude from Docker build
├── deploy.sh                       # Deployment script
├── DEPLOYMENT.md                   # Full deployment guide
├── DOCKER.md                       # This file
│
├── apps/
│   ├── data-service/
│   │   └── express/
│   │       ├── Dockerfile          # Backend Dockerfile
│   │       ├── docker-entrypoint.sh # Backend startup script
│   │       └── init-db.sql         # Database initialization
│   │
│   └── user-application/
│       └── trv1/
│           ├── Dockerfile          # Frontend Dockerfile
│           └── nginx.conf          # Nginx configuration
│
└── volumes/
    └── postgres_data/              # Database volume (auto-created)
```

## 🔐 Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Change default passwords** - Especially `POSTGRES_PASSWORD`
3. **Use HTTPS in production** - Set up SSL certificates
4. **Limit exposed ports** - Close unnecessary ports in firewall
5. **Regular updates** - Keep Docker images updated

## 🚢 Production Deployment

For production deployment to a VPS, see [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions including:
- VPS setup
- SSL/TLS configuration
- Domain configuration
- Monitoring setup
- Backup strategies

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

## 💡 Tips

1. **Use named volumes** for data persistence (already configured)
2. **Check health status** before considering a service ready
3. **Review logs regularly** for errors or warnings
4. **Backup database** before major updates
5. **Test locally** before deploying to production
6. **Use .env file** for environment-specific configuration

---

Need help? Check the logs first:
```bash
docker-compose logs -f
```
