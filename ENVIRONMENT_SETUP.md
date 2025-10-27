# Environment Configuration Guide

## Overview

This project uses centralized environment configuration with separate files for development and production environments.

---

## File Structure

```
chaykov-saas-app/
├── .env                    # Active environment (git-ignored)
├── .env.development        # Development configuration (safe to commit)
├── .env.production        # Production configuration (git-ignored, contains secrets)
└── config/
    └── env/
        ├── .env.template   # Template reference
        └── .env.development # Alternative location (optional)
```

---

## Quick Start

### For Development

```bash
# Copy development environment
cp .env.development .env

# Start development stack
docker-compose -f docker-compose.dev.yml up
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432

### For Production

```bash
# Copy production template
cp .env.production .env

# Generate secure credentials
POSTGRES_PASSWORD=$(openssl rand -base64 32)
API_KEY=$(openssl rand -hex 32)

# Edit .env and replace:
# - POSTGRES_PASSWORD with generated value
# - API_KEY with generated value
# - YOUR_VPS_IP_OR_DOMAIN with your actual domain/IP
nano .env

# Secure the file
chmod 600 .env

# Deploy
./deploy.sh production
```

---

## Environment Variables Reference

### Database Configuration

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `POSTGRES_DB` | Database name | `polytalko_dev` | `chaykov_saas` |
| `POSTGRES_USER` | Database user | `postgres` | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres_dev_password` | **Generate secure password** |
| `DATABASE_URL` | Full connection string | Auto-configured | Auto-configured |

### Backend Configuration

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `BACKEND_PORT` | Internal backend port | `3001` | `3001` |
| `API_KEY` | API authentication key | Dev key | **Generate secure key** |
| `FRONTEND_URL` | Frontend URL (CORS) | `http://localhost:3000` | Your domain |

### Frontend Configuration

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3001/api` | Your domain + `/api` |
| `VITE_API_KEY` | Frontend API key | Dev key | **Must match API_KEY** |

### Docker Ports

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `POSTGRES_HOST_PORT` | Database exposed port | `5432` | `5432` (not exposed) |
| `BACKEND_HOST_PORT` | Backend exposed port | `3001` | `3001` |
| `FRONTEND_HOST_PORT` | Frontend exposed port | `3000` | `80` |

---

## Generating Secure Credentials

### Database Password

```bash
# Generate a secure 32-character password
openssl rand -base64 32

# Example output: Kj8dL2mP9xR4nZ7vT3qY5wE6aC1bD8fG==
```

### API Key

```bash
# Generate a secure 64-character hex key
openssl rand -hex 32

# Example output: 97148aa55280a91d504fc82863db979a4b2d6a326e855a881c890a1f79399ed1
```

---

## Environment Setup Examples

### Development Setup

```bash
# .env for development
POSTGRES_DB=polytalko_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_dev_password
DATABASE_URL=postgresql://postgres:postgres_dev_password@postgres:5432/polytalko_dev

NODE_ENV=development
BACKEND_PORT=3001
API_KEY=dev-api-key-12345-change-in-production
FRONTEND_URL=http://localhost:3000

VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=dev-api-key-12345-change-in-production

POSTGRES_HOST_PORT=5432
BACKEND_HOST_PORT=3001
FRONTEND_HOST_PORT=3000
```

### Production Setup (Without Nginx Proxy)

```bash
# .env for production (direct access)
POSTGRES_DB=chaykov_saas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Kj8dL2mP9xR4nZ7vT3qY5wE6aC1bD8fG==
DATABASE_URL=postgresql://postgres:Kj8dL2mP9xR4nZ7vT3qY5wE6aC1bD8fG==@postgres:5432/chaykov_saas

NODE_ENV=production
BACKEND_PORT=3001
API_KEY=97148aa55280a91d504fc82863db979a4b2d6a326e855a881c890a1f79399ed1
FRONTEND_URL=http://123.45.67.89

VITE_API_URL=http://123.45.67.89:3001/api
VITE_API_KEY=97148aa55280a91d504fc82863db979a4b2d6a326e855a881c890a1f79399ed1

POSTGRES_HOST_PORT=5432
BACKEND_HOST_PORT=3001
FRONTEND_HOST_PORT=80
```

### Production Setup (With Nginx Proxy - Recommended)

```bash
# .env for production (behind Nginx reverse proxy)
POSTGRES_DB=chaykov_saas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Kj8dL2mP9xR4nZ7vT3qY5wE6aC1bD8fG==
DATABASE_URL=postgresql://postgres:Kj8dL2mP9xR4nZ7vT3qY5wE6aC1bD8fG==@postgres:5432/chaykov_saas

NODE_ENV=production
BACKEND_PORT=3001
API_KEY=97148aa55280a91d504fc82863db979a4b2d6a326e855a881c890a1f79399ed1
FRONTEND_URL=https://yourdomain.com

# Note: No port in API URL when using Nginx proxy
VITE_API_URL=https://yourdomain.com/api
VITE_API_KEY=97148aa55280a91d504fc82863db979a4b2d6a326e855a881c890a1f79399ed1

POSTGRES_HOST_PORT=5432
BACKEND_HOST_PORT=3001
FRONTEND_HOST_PORT=80
```

---

## Security Best Practices

### 1. Never Commit Secrets

The `.gitignore` file already protects:
- `.env`
- `.env.*` (except `.env.example`)

Always verify before committing:
```bash
git status
# .env should NOT appear in staging area
```

### 2. Use Strong Credentials in Production

```bash
# BAD - Don't use these!
POSTGRES_PASSWORD=password123
API_KEY=my-secret-key

# GOOD - Use generated values
POSTGRES_PASSWORD=$(openssl rand -base64 32)
API_KEY=$(openssl rand -hex 32)
```

### 3. Secure File Permissions

```bash
# Make .env readable only by owner
chmod 600 .env

# Verify
ls -la .env
# Should show: -rw------- 1 user user ...
```

### 4. Separate Development and Production

- **Development**: Use safe, memorable values
- **Production**: Use generated, unpredictable values
- **Never**: Use the same credentials for both

### 5. Store Backups Securely

```bash
# Backup environment file
cp .env .env.backup

# Store in secure location (not in repo)
mv .env.backup ~/secure-backup/

# Or use password manager
```

---

## Troubleshooting

### Issue: "Environment variable not found"

**Solution**: Ensure `.env` file exists and contains all required variables.

```bash
# Check if .env exists
ls -la .env

# Compare with template
diff .env .env.production
```

### Issue: "Database connection failed"

**Solution**: Verify `DATABASE_URL` matches other database variables.

```bash
# Check variables
grep -E '(POSTGRES_|DATABASE_)' .env

# Ensure password is the same in all database variables
```

### Issue: "API key mismatch"

**Solution**: Ensure `API_KEY` and `VITE_API_KEY` are identical.

```bash
# Check keys
grep -E 'API_KEY' .env

# Both should have same value
```

### Issue: "Port already in use"

**Solution**: Change host port in `.env` file.

```bash
# Edit .env
nano .env

# Change port (example: 3001 → 3002)
BACKEND_HOST_PORT=3002

# Restart containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

## Migration from Old Setup

If you have existing `.env` files in subfolders:

### Step 1: Backup Existing Configuration

```bash
# Backup old files
cp apps/user-application/trv1/.env.local ~/backup/trv1-env.backup
cp apps/data-service/express/.env.local ~/backup/express-env.backup
```

### Step 2: Migrate to Centralized Configuration

The new setup uses a single `.env` file in the project root. Docker Compose will automatically pass the necessary variables to each service.

```bash
# Copy production template
cp .env.production .env

# Edit with your values
nano .env
```

### Step 3: Remove Old Files (Optional)

```bash
# Old .env.local files are git-ignored and won't affect production
# You can keep them for local development or remove them
rm apps/user-application/trv1/.env.local
rm apps/data-service/express/.env.local
```

---

## Environment Loading Order

1. **Docker Compose** reads `.env` from project root
2. **Environment variables** are passed to containers
3. **Frontend build** embeds `VITE_*` variables at build time
4. **Backend runtime** reads environment variables at runtime

**Important**: Frontend requires rebuild after changing `VITE_*` variables:

```bash
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

---

## Checklist for Production Deployment

- [ ] Copy `.env.production` to `.env`
- [ ] Generate secure `POSTGRES_PASSWORD`
- [ ] Generate secure `API_KEY`
- [ ] Update `POSTGRES_PASSWORD` in `DATABASE_URL`
- [ ] Set `FRONTEND_URL` to your domain
- [ ] Set `VITE_API_URL` to your API endpoint
- [ ] Set `VITE_API_KEY` to match `API_KEY`
- [ ] Set file permissions: `chmod 600 .env`
- [ ] Test configuration: `./deploy.sh production`
- [ ] Verify health: `curl http://localhost:3001/health`
- [ ] Backup `.env` to secure location
- [ ] Document credentials in password manager

---

## Quick Commands

```bash
# View current environment (safely)
grep -v PASSWORD .env | grep -v API_KEY

# Validate environment file
./deploy.sh production

# Check loaded environment in container
docker exec polytalko-backend-prod env | grep -E '(NODE_ENV|DATABASE_URL)'

# Reload environment after changes
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Summary

- **One File**: Single `.env` in project root manages all services
- **Two Modes**: `.env.development` for dev, `.env.production` for prod
- **Security**: Production secrets never committed to git
- **Simplicity**: No need to manage multiple .env files in subfolders

---

**Last Updated:** 2025-10-27
