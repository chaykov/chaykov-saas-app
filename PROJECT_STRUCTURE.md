# 📂 Project Structure

Clean, organized project structure for Polytalko - Social Media Application

---

## 🗂️ Root Directory Structure

```
chaykov-saas-app/
│
├── apps/                          # Application services
│   ├── data-service/             # Backend API
│   │   └── express/              # Express.js API server
│   │       ├── src/              # Source code
│   │       │   ├── db/           # Database configuration
│   │       │   ├── middleware/   # API middleware (auth, validation)
│   │       │   ├── routes/       # API routes
│   │       │   └── server.ts     # Main server file
│   │       ├── .env.local        # Local backend environment
│   │       ├── Dockerfile        # Backend Docker configuration
│   │       └── package.json      # Backend dependencies
│   │
│   └── user-application/         # Frontend application
│       └── trv1/                 # React + Vite frontend
│           ├── src/              # Source code
│           │   ├── components/   # React components
│           │   ├── hooks/        # Custom React hooks
│           │   ├── lib/          # Utilities and API client
│           │   ├── routes/       # TanStack Router routes
│           │   ├── store/        # Zustand state management
│           │   └── types/        # TypeScript types
│           ├── .env.local        # Local frontend environment
│           ├── Dockerfile        # Frontend Docker configuration
│           └── package.json      # Frontend dependencies
│
├── config/                        # Configuration files
│   ├── env/                      # Environment configurations
│   │   ├── .env.development      # Development environment ✨
│   │   ├── .env.production       # Production environment ✨
│   │   └── .env.template         # Template for new environments
│   ├── .gitignore                # Ignore sensitive config files
│   └── README.md                 # Config directory documentation
│
├── .github/                       # GitHub configuration
│   └── workflows/                # CI/CD workflows
│
├── docker-compose.dev.yml         # Development Docker setup ✨
├── docker-compose.prod.yml        # Production Docker setup ✨
├── docker-compose.legacy.yml      # Old configuration (deprecated)
│
├── .env                          # Active environment (git-ignored)
├── .env.example                  # Environment example file
├── .gitignore                    # Git ignore rules
├── .dockerignore                 # Docker ignore rules
│
├── DEPLOYMENT_GUIDE.md           # Complete deployment guide ✨
├── PROJECT_STRUCTURE.md          # This file ✨
├── TESTING_RESULTS.md            # Security testing results
├── API_SECURITY.md               # API security documentation
├── CI_CD_QUICK_START.md          # CI/CD setup guide
├── WORKFLOWS_SUMMARY.md          # GitHub Actions summary
│
├── package.json                  # Root package.json (workspace)
├── pnpm-workspace.yaml           # PNPM workspace configuration
└── README.md                     # Main project README

✨ = New/Updated for clean structure
```

---

## 📋 File Categories

### Configuration Files

| File | Purpose | Environment |
|------|---------|-------------|
| `config/env/.env.development` | Development environment variables | Development |
| `config/env/.env.production` | Production environment variables | Production |
| `config/env/.env.template` | Template for creating new env files | All |
| `.env` | Active environment (copy from config) | Current |
| `.env.example` | Example showing structure | Documentation |

### Docker Compose Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `docker-compose.dev.yml` | Development with hot-reload | Local development |
| `docker-compose.prod.yml` | Production optimized build | Deployment |
| `docker-compose.legacy.yml` | Old configuration (backup) | Reference only |

### Documentation Files

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete deployment instructions |
| `PROJECT_STRUCTURE.md` | This file - project organization |
| `TESTING_RESULTS.md` | Security testing verification |
| `API_SECURITY.md` | API security implementation details |
| `config/README.md` | Configuration directory guide |

---

## 🚀 Quick Navigation

### For Developers

**Starting Local Development:**
1. Check `DEPLOYMENT_GUIDE.md` → Quick Start section
2. Copy `config/env/.env.development` to `.env`
3. Run `docker-compose -f docker-compose.dev.yml up`

**Backend Code:**
- Routes: `apps/data-service/express/src/routes/`
- Database: `apps/data-service/express/src/db/`
- Middleware: `apps/data-service/express/src/middleware/`

**Frontend Code:**
- Components: `apps/user-application/trv1/src/components/`
- Routes: `apps/user-application/trv1/src/routes/`
- API Client: `apps/user-application/trv1/src/lib/api.ts`
- State: `apps/user-application/trv1/src/store/`

### For DevOps/Deployment

**Production Deployment:**
1. Read `DEPLOYMENT_GUIDE.md` → Production Deployment section
2. Copy `config/env/.env.production` to `.env`
3. Update all values with production credentials
4. Run `docker-compose -f docker-compose.prod.yml up -d --build`

**Key Configuration Files:**
- Environment: `config/env/.env.production`
- Docker: `docker-compose.prod.yml`
- CI/CD: `.github/workflows/`

---

## 🔐 Security Files

**Never Commit These:**
- ✅ Git-ignored by default
- `.env` (active environment)
- `config/env/.env.development` (has credentials)
- `config/env/.env.production` (has credentials)
- Any `*.key`, `*.pem`, `*.crt` files

**Safe to Commit:**
- ✅ Contains no secrets
- `.env.example` (template only)
- `config/env/.env.template` (template only)
- `config/.gitignore` (protects secrets)
- All documentation files

---

## 🏗️ Architecture

### Services

1. **PostgreSQL Database**
   - Port: 5432 (host) → 5432 (container)
   - Data: Persistent volume
   - Network: Internal Docker network

2. **Backend API (Express)**
   - Port: 3001 (host) → 3001 (container)
   - Tech: Node.js + Express + Drizzle ORM
   - Security: API key authentication, CORS
   - Network: Internal Docker network

3. **Frontend (React + Vite)**
   - Port: 3000 (dev) or 80 (prod)
   - Tech: React 19 + TanStack Router + Zustand
   - Network: Internal Docker network

### Data Flow

```
Browser (User)
    ↓
Frontend (React) - Port 3000/80
    ↓ [HTTP + API Key Header]
Backend (Express) - Port 3001
    ↓ [Validates API Key + CORS]
    ↓ [Queries without password field]
PostgreSQL - Port 5432
```

---

## 📊 Environment Management

### Environment Hierarchy

```
config/env/
├── .env.template       → Copy to create new environment
├── .env.development    → Development configuration
└── .env.production     → Production configuration
        ↓
    Copy to root as .env
        ↓
    Used by Docker Compose
```

### Current Active Environment

Check which environment is active:
```bash
head -5 .env
```

### Switching Environments

**To Development:**
```bash
cp config/env/.env.development .env
docker-compose -f docker-compose.dev.yml up
```

**To Production:**
```bash
cp config/env/.env.production .env
# Update values first!
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🧹 Clean Structure Benefits

### Before (Messy)
- ❌ `.env` files scattered everywhere
- ❌ Multiple `docker-compose.yml` versions
- ❌ Unclear which file to use
- ❌ No separation of environments

### After (Clean)
- ✅ All configs in `config/` directory
- ✅ Clear naming: `*.dev.yml` vs `*.prod.yml`
- ✅ Documented structure
- ✅ Easy to switch environments
- ✅ Production-ready organization

---

## 📚 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| `README.md` | Project overview | All |
| `DEPLOYMENT_GUIDE.md` | Complete deployment guide | Developers & DevOps |
| `PROJECT_STRUCTURE.md` | This file - structure overview | Developers |
| `config/README.md` | Configuration guide | Developers |
| `API_SECURITY.md` | Security implementation | Developers & Security |
| `TESTING_RESULTS.md` | Security test results | QA & Security |
| `CI_CD_QUICK_START.md` | CI/CD setup | DevOps |

---

## 🔄 Common Tasks

### View Project Files
```bash
# List root structure
ls -la

# List config files
ls -la config/env/

# Check active environment
cat .env | head -10
```

### Environment Management
```bash
# Copy development config
cp config/env/.env.development .env

# Edit environment
nano .env

# Validate environment
docker-compose -f docker-compose.dev.yml config
```

### Docker Management
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d --build

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

---

## 💡 Tips

1. **Always use the appropriate docker-compose file**
   - Development: `docker-compose.dev.yml`
   - Production: `docker-compose.prod.yml`

2. **Keep configs organized**
   - All environment files in `config/env/`
   - Copy to root only when needed

3. **Never commit secrets**
   - `.env` files are git-ignored
   - Use templates for examples

4. **Document changes**
   - Update relevant markdown files
   - Keep structure documentation current

---

**Last Updated:** October 27, 2025

**Structure Version:** 2.0 (Clean Organization)
