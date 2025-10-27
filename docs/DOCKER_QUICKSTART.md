# 🚀 Docker Quick Start Guide

Get your Chaykov SaaS Application running with Docker in 5 minutes!

## ⚡ TL;DR - Fastest Setup

````bash
# 1. Copy and configure environment
cp .env.example .env
nano .env  # Update POSTGRES_PASSWORD and VITE_API_URL

# 2. Deploy
./deploy.sh local

# 3. Access
# Frontend: http://localhost
# Backend: http://localhost:3001
```l

---

## 📋 Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Get Docker Compose](https://docs.docker.com/compose/install/))
- 4GB+ RAM available
- Ports 80, 3001, and 5432 available

**Check if Docker is installed:**
```bash
docker --version
docker-compose --version
````

---

## 🎯 Step-by-Step Setup

### Step 1: Configure Environment

Create your environment file:

```bash
cp .env.example .env
```

Edit the `.env` file:

```bash
nano .env
# or use your favorite editor
```

**Minimum required changes:**

```bash
# Change this password!
POSTGRES_PASSWORD=your_very_secure_password

# For local testing, this can stay as is:
VITE_API_URL=http://localhost:3001/api

# For VPS deployment, change to:
# VITE_API_URL=http://YOUR_VPS_IP:3001/api
```

### Step 2: Deploy

**Option A: Using the deploy script (Recommended)**

```bash
chmod +x deploy.sh
./deploy.sh local
```

**Option B: Using docker-compose directly**

```bash
docker-compose up --build -d
```

### Step 3: Wait for Services

The deploy script automatically waits. If using docker-compose directly:

```bash
# Watch the logs
docker-compose logs -f

# Wait for these messages:
# ✅ PostgreSQL is ready!
# ✨ Starting Express server...
# Server running on http://localhost:3001
```

### Step 4: Access Your Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost:3001/health
- **Database:** localhost:5432 (from host machine)

---

## 🎬 What Just Happened?

Docker Compose started 3 services:

```
1. PostgreSQL Database (postgres:16-alpine)
   ├─ Port: 5432
   ├─ Database: chaykov_saas
   └─ Data: Persisted in Docker volume

2. Backend API (Express + Node.js)
   ├─ Port: 3001
   ├─ Features: REST API, Drizzle ORM
   └─ Connects to: PostgreSQL

3. Frontend (React + Vite + Nginx)
   ├─ Port: 80
   ├─ Features: SPA, TanStack Router
   └─ Connects to: Backend API
```

---

## 🔧 Common Commands

### View Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Everything

```bash
docker-compose down
```

### Stop and Delete Database

```bash
docker-compose down -v
```

### Rebuild After Code Changes

```bash
docker-compose up --build -d
```

---

## 🐛 Quick Troubleshooting

### Port Already in Use

**Problem:** `Error: port is already allocated`

**Solution:**

```bash
# Find what's using the port
sudo lsof -i :80
sudo lsof -i :3001

# Kill the process or change ports in .env
FRONTEND_PORT=8080
BACKEND_PORT=3002
```

### Frontend Can't Connect to Backend

**Problem:** Frontend shows network errors

**Solution:**

```bash
# 1. Check VITE_API_URL in .env
cat .env | grep VITE_API_URL

# 2. Rebuild frontend
docker-compose up --build -d frontend
```

### Database Connection Failed

**Problem:** Backend shows "database connection failed"

**Solution:**

```bash
# 1. Check if PostgreSQL is running
docker-compose ps postgres

# 2. Check PostgreSQL logs
docker-compose logs postgres

# 3. Verify DATABASE_URL matches POSTGRES_PASSWORD
cat .env
```

### Services Keep Restarting

**Problem:** Container status shows "Restarting"

**Solution:**

```bash
# Check logs for errors
docker-compose logs [service-name]

# Common fixes:
# - Ensure .env file exists
# - Check all required env vars are set
# - Verify ports aren't in use
```

---

## 🧪 Testing Your Setup

### 1. Test Backend Health

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok"}
```

### 2. Test Frontend

```bash
curl http://localhost/health
# Should return: healthy
```

### 3. Test Database Connection

```bash
docker-compose exec postgres psql -U postgres -d chaykov_saas -c "SELECT 1;"
# Should return: 1
```

### 4. View Database Tables

```bash
docker-compose exec postgres psql -U postgres -d chaykov_saas -c "\dt"
# Should list: users, posts, comments
```

---

## 📊 Next Steps

### Add Sample Data

If you have a seed script:

```bash
docker-compose exec backend pnpm seed
```

### Access Database

```bash
# Open PostgreSQL shell
docker-compose exec postgres psql -U postgres -d chaykov_saas

# Run queries
SELECT * FROM users;
```

### Monitor Resources

```bash
# Real-time stats
docker stats

# Check disk usage
docker system df
```

---

## 🌍 Deploy to Production VPS

Ready to deploy to a real server?

1. **Read the full deployment guide:**

   ```bash
   cat DEPLOYMENT.md
   ```

2. **Update `.env` for production:**

   ```bash
   VITE_API_URL=http://YOUR_VPS_IP:3001/api
   POSTGRES_PASSWORD=very_secure_password
   ```

3. **Deploy:**
   ```bash
   ./deploy.sh production
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete VPS setup instructions.

---

## 📚 More Information

- **Detailed Docker Guide:** [DOCKER.md](./DOCKER.md)
- **Full Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Frontend Docs:** [apps/user-application/trv1/CLAUDE.md](./apps/user-application/trv1/CLAUDE.md)

---

## 🆘 Getting Help

**Check logs first:**

```bash
docker-compose logs -f
```

**Verify environment:**

```bash
cat .env
```

**Check service status:**

```bash
docker-compose ps
```

**Full cleanup and restart:**

```bash
docker-compose down -v
docker-compose up --build -d
```

---

## ✅ Success Checklist

- [ ] Docker and Docker Compose installed
- [ ] `.env` file created from `.env.example`
- [ ] `POSTGRES_PASSWORD` updated
- [ ] `VITE_API_URL` configured correctly
- [ ] All containers running: `docker-compose ps`
- [ ] Frontend accessible: http://localhost
- [ ] Backend healthy: http://localhost:3001/health
- [ ] No errors in logs: `docker-compose logs`

---

**Ready to build something amazing? Your SaaS platform is ready! 🎉**
