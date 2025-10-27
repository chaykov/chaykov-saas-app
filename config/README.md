# Configuration Directory

This directory contains environment configuration files for different deployment scenarios.

## 📁 Structure

```
config/
├── env/
│   ├── .env.development      # Development environment variables
│   ├── .env.production       # Production environment variables
│   └── .env.template         # Template for creating new env files
├── .gitignore                # Prevents committing sensitive files
└── README.md                 # This file
```

## 🚀 Usage

### For Development

1. Copy the development environment file to project root:
   ```bash
   cp config/env/.env.development .env
   ```

2. Update the `.env` file with your local settings (if needed)

3. Start your application:
   ```bash
   # Option A: Local development (without Docker)
   npm run dev

   # Option B: Docker development
   docker-compose -f docker-compose.dev.yml up
   ```

### For Production

1. Copy the production environment template:
   ```bash
   cp config/env/.env.production .env
   ```

2. **IMPORTANT**: Update all placeholder values in `.env`:
   - Generate secure API key: `openssl rand -hex 32`
   - Set strong database password
   - Update domain URLs
   - Configure all production-specific values

3. Deploy using production docker-compose:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## 🔐 Security Best Practices

### ⚠️ Never Commit Credentials

- `.env` files with real credentials should **NEVER** be committed to git
- The `.gitignore` in this directory prevents this
- Only commit `.env.template` files

### 🔑 API Key Generation

Generate secure API keys for production:

```bash
# Option 1: Using OpenSSL
openssl rand -hex 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 🔒 Password Requirements

For production databases, use passwords that:
- Are at least 16 characters long
- Include uppercase, lowercase, numbers, and symbols
- Are randomly generated (don't use common words)
- Are unique (don't reuse from other services)

Example strong password generator:
```bash
openssl rand -base64 24
```

## 📝 Environment Variables Explanation

### Database Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `polytalko_dev` |
| `POSTGRES_USER` | Database username | `postgres` |
| `POSTGRES_PASSWORD` | Database password | *Strong password* |
| `DATABASE_URL` | Full connection string | `postgresql://user:pass@host:5432/db` |

### Backend API Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `development` or `production` |
| `BACKEND_PORT` | Port for backend API | `3001` |
| `API_KEY` | Secret key for API auth | *Generated secure key* |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |

### Frontend Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3001/api` |
| `VITE_API_KEY` | API key for requests | *Same as backend API_KEY* |

### Docker Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_HOST_PORT` | PostgreSQL port on host | `5432` |
| `BACKEND_HOST_PORT` | Backend port on host | `3001` |
| `FRONTEND_HOST_PORT` | Frontend port on host | `3000` |

## 🔄 Different Environments

### Development Environment

**Purpose**: Local development with hot-reload

**Characteristics:**
- Uses development database
- Exposes all ports for debugging
- Simple passwords are okay
- API keys can be simple
- Verbose logging enabled

**When to use:**
- Working on features locally
- Testing changes before deployment
- Running automated tests

### Production Environment

**Purpose**: Live deployment serving real users

**Characteristics:**
- Uses production database
- Minimal port exposure
- Strong passwords required
- Secure API keys required
- Optimized for performance
- Security hardened

**When to use:**
- Deploying to VPS/cloud server
- Serving real traffic
- Production data storage

## 🛠️ Creating Custom Environments

Need a staging or testing environment? Create a new config:

1. Copy the template:
   ```bash
   cp config/env/.env.template config/env/.env.staging
   ```

2. Update values for your staging environment

3. Use it:
   ```bash
   cp config/env/.env.staging .env
   docker-compose -f docker-compose.dev.yml up
   ```

## 📋 Checklist Before Production Deployment

- [ ] Copied `.env.production` to `.env`
- [ ] Generated and set secure `API_KEY`
- [ ] Set strong `POSTGRES_PASSWORD`
- [ ] Updated `FRONTEND_URL` to production domain
- [ ] Updated `VITE_API_URL` to production API URL
- [ ] Verified `API_KEY` matches in both frontend and backend
- [ ] Reviewed all environment variables
- [ ] **Did NOT commit `.env` to git**
- [ ] Tested configuration locally first
- [ ] Set up database backups
- [ ] Configured monitoring/alerts

## 🔍 Troubleshooting

### Problem: Environment variables not loading

**Solution:**
1. Verify `.env` file is in project root
2. Check file has correct syntax (no spaces around `=`)
3. Restart application after changing `.env`
4. For Docker: rebuild containers

### Problem: API key mismatch

**Solution:**
1. Verify `API_KEY` and `VITE_API_KEY` are identical
2. Check for extra spaces or quotes
3. Restart both frontend and backend
4. Clear browser cache

### Problem: Database connection failed

**Solution:**
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` format is correct
3. Ensure credentials match
4. For Docker: check container network

## 📚 Additional Resources

- [Main Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [API Security Documentation](../apps/data-service/express/API_SECURITY.md)
- [Testing Results](../TESTING_RESULTS.md)

---

**Important**: This directory contains sensitive configuration templates. Always ensure proper security practices when deploying to production.
