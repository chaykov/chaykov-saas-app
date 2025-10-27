# 🚀 Deployment Guide

Complete guide for setting up and deploying the Polytalko application in development and production environments.

---

## 📁 Project Structure

```
chaykov-saas-app/
├── apps/
│   ├── data-service/express/      # Backend API
│   └── user-application/trv1/     # Frontend React app
├── config/
│   └── env/                       # Environment configurations
│       ├── .env.development       # Development environment
│       ├── .env.production        # Production environment
│       └── .env.template          # Template for new envs
├── docker-compose.dev.yml         # Development Docker setup
├── docker-compose.prod.yml        # Production Docker setup
└── docker-compose.yml             # Legacy (will be deprecated)
```

---

## 🛠️ Quick Start

### Option 1: Local Development (Without Docker)

**Prerequisites:**

- Node.js 18+ installed
- PostgreSQL running locally
- npm or yarn

**Steps:**

1. **Copy environment file:**

   ```bash
   cp config/env/.env.development .env
   ```

2. **Update database connection in `.env`:**

   ```env
   DATABASE_URL=postgresql://your_user@localhost:5432/your_db
   ```

3. **Start Backend:**

   ```bash
   cd apps/data-service/express
   npm install
   npm run dev
   ```

4. **Start Frontend (new terminal):**

   ```bash
   cd apps/user-application/trv1
   npm install
   npm run dev
   ```

5. **Access:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

---

### Option 2: Docker Development (Full Stack)

**Prerequisites:**

- Docker Desktop or Docker Engine installed
- Docker Compose V2

**Steps:**

1. **Copy environment file:**

   ```bash
   cp config/env/.env.development .env
   ```

2. **Start all services:**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **View logs:**

   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

4. **Stop services:**

   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

5. **Access:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432

---

## 🚢 Production Deployment

### Step 1: Prepare Environment

1. **Copy production environment template:**

   ```bash
   cp config/env/.env.production .env
   ```

2. **Generate secure API key:**

   ```bash
   openssl rand -hex 32
   ```

3. **Update `.env` with production values:**

   ```env
   # Strong database password
   POSTGRES_PASSWORD=YourStrongPasswordHere123!

   # Secure API key (from step 2)
   API_KEY=your_generated_secure_key_here
   VITE_API_KEY=your_generated_secure_key_here

   # Production domain
   FRONTEND_URL=https://yourdomain.com
   VITE_API_URL=https://api.yourdomain.com/api
   ```

### Step 2: Deploy with Docker

```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d --build

# Check service health
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f backend
```

### Step 3: Database Migration

```bash
# Enter backend container
docker exec -it polytalko-backend-prod sh

# Run migrations
npm run drizzle:migrate

# (Optional) Seed data
npm run seed
```

### Step 4: Verify Deployment

```bash
# Health check
curl http://your-server-ip:3001/health

# Test API (should require API key)
curl http://your-server-ip:3001/api/posts
# Expected: {"error":"Unauthorized","message":"API key is required"}

# Test with API key
curl -H "x-api-key: your_api_key" http://your-server-ip:3001/api/posts
# Expected: JSON array of posts
```

---

## 🔐 Security Checklist

### Before Production Deployment:

- [ ] Generated strong, unique API key
- [ ] Set strong database password
- [ ] Updated `FRONTEND_URL` to production domain
- [ ] Configured HTTPS/SSL certificates
- [ ] Reviewed all `.env` values
- [ ] **Never committed `.env` files to git**
- [ ] Set up database backups
- [ ] Configured firewall rules
- [ ] Enabled Docker logging
- [ ] Set up monitoring/alerts

### Recommended: Additional Security

- [ ] Set up Nginx reverse proxy with SSL
- [ ] Enable rate limiting
- [ ] Configure fail2ban for SSH
- [ ] Set up automatic security updates
- [ ] Use secrets management (e.g., Docker secrets, Vault)
- [ ] Enable audit logging

---

## 🔧 Common Commands

### Docker Development

```bash
# Start services
docker-compose -f docker-compose.dev.yml up -d

# Rebuild after code changes
docker-compose -f docker-compose.dev.yml up -d --build

# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (⚠️ deletes data)
docker-compose -f docker-compose.dev.yml down -v

# View logs
docker-compose -f docker-compose.dev.yml logs -f [service_name]

# Execute command in container
docker exec -it polytalko-backend-dev sh
```

### Docker Production

```bash
# Deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Update single service
docker-compose -f docker-compose.prod.yml up -d --build backend

# Restart service
docker-compose -f docker-compose.prod.yml restart backend

# View resource usage
docker stats

# Backup database
docker exec polytalko-postgres-prod pg_dump -U postgres chaykov_saas > backup.sql

# Restore database
docker exec -i polytalko-postgres-prod psql -U postgres chaykov_saas < backup.sql
```

### Database Management

```bash
# Connect to PostgreSQL
docker exec -it polytalko-postgres-prod psql -U postgres -d chaykov_saas

# Run Drizzle Studio (database GUI)
cd apps/data-service/express
npm run drizzle:studio

# Generate migration
npm run drizzle:generate

# Run migrations
npm run drizzle:migrate
```

---

## 🌍 Environment Variables Reference

### Database

| Variable            | Development             | Production        | Description            |
| ------------------- | ----------------------- | ----------------- | ---------------------- |
| `POSTGRES_DB`       | `polytalko_dev`         | `chaykov_saas`    | Database name          |
| `POSTGRES_USER`     | `postgres`              | `postgres`        | Database user          |
| `POSTGRES_PASSWORD` | `postgres_dev_password` | _Strong password_ | Database password      |
| `DATABASE_URL`      | Local connection        | Docker connection | Full connection string |

### Backend API

| Variable       | Development             | Production               | Description         |
| -------------- | ----------------------- | ------------------------ | ------------------- |
| `NODE_ENV`     | `development`           | `production`             | Node environment    |
| `BACKEND_PORT` | `3001`                  | `3001`                   | Backend port        |
| `API_KEY`      | `dev-api-key-12345`     | _Secure random key_      | API authentication  |
| `FRONTEND_URL` | `http://localhost:3000` | `https://yourdomain.com` | CORS allowed origin |

### Frontend

| Variable       | Development                 | Production                       | Description               |
| -------------- | --------------------------- | -------------------------------- | ------------------------- |
| `VITE_API_URL` | `http://localhost:3001/api` | `https://api.yourdomain.com/api` | Backend API URL           |
| `VITE_API_KEY` | `dev-api-key-12345`         | _Secure random key_              | API key (matches backend) |

---

## 🐛 Troubleshooting

### Issue: Container won't start

```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs backend

# Check if port is in use
lsof -i :3001

# Force recreate containers
docker compose -f docker-compose.dev.yml up -d --force-recreate
```

### Issue: Database connection failed

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database connection
docker exec polytalko-postgres-dev psql -U postgres -d polytalko_dev -c "SELECT 1"

# Verify DATABASE_URL in .env matches Docker network
```

### Issue: API returns 401 Unauthorized

```bash
# Verify API keys match in .env
grep API_KEY .env

# Check backend logs
docker logs polytalko-backend-dev

# Test with curl
curl -H "x-api-key: dev-api-key-12345" http://localhost:3001/api/posts
```

### Issue: CORS errors in browser

- Verify `FRONTEND_URL` in backend `.env`
- Check browser console for origin
- Ensure frontend and backend API keys match

---

## 📊 Monitoring

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose -f docker-compose.prod.yml ps

# Manual health check
curl http://localhost:3001/health
```

### Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# View last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

### Resource Usage

```bash
# Monitor container resources
docker stats

# View disk usage
docker system df
```

---

## 🔄 Updating

### Development

```bash
# Pull latest code
git pull

# Rebuild containers
docker-compose -f docker-compose.dev.yml up -d --build

# Run new migrations
docker exec -it polytalko-backend-dev npm run drizzle:migrate
```

### Production

```bash
# 1. Backup database first!
docker exec polytalko-postgres-prod pg_dump -U postgres chaykov_saas > backup_$(date +%Y%m%d).sql

# 2. Pull latest code
git pull

# 3. Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Run migrations
docker exec -it polytalko-backend-prod npm run drizzle:migrate

# 5. Verify services
docker-compose -f docker-compose.prod.yml ps
```

---

## 📝 Notes

- **Never commit `.env` files** - They contain sensitive credentials
- Development uses hot-reload; production uses optimized builds
- Production images are tagged for version control
- Resource limits are set in production for stability
- All services have restart policies configured
- Logs are rotated automatically (10MB max, 3 files)

---

## 🆘 Support

For issues or questions:

1. Check the [API Security Documentation](./apps/data-service/express/API_SECURITY.md)
2. Review logs: `docker-compose logs -f`
3. Verify environment variables in `.env`
4. Check service health: `docker-compose ps`

---

**Last Updated:** October 27, 2025
