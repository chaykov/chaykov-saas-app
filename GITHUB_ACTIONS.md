# 🚀 GitHub Actions CI/CD Workflows

Automated testing and deployment workflows for your SaaS application.

## Overview

Your project includes 3 GitHub Actions workflows that automatically run when you push code to GitHub:

1. **Backend CI** - Tests backend, database migrations, and Docker build
2. **Frontend CI** - Tests frontend build and Docker image
3. **Docker Compose Full Stack** - Integration tests for the entire application

---

## Workflows Explained

### 1. Backend CI (`backend-ci.yml`)

**When it runs:**
- On push to `main` or `develop` branches
- On pull requests to `main` or `develop`
- Only when backend code changes

**What it does:**

#### Test Job:
1. Sets up PostgreSQL 16 database in GitHub Actions
2. Installs pnpm and Node.js 20
3. Installs all dependencies
4. Creates `.env` file with test credentials
5. Runs database migrations with Drizzle
6. Lints backend code (if configured)
7. Runs backend tests (if configured)
8. Checks TypeScript types

#### Build Job:
1. Builds backend Docker image
2. Tests that the Docker image works
3. Uses Docker BuildKit cache for faster builds

**View results:**
- Go to your GitHub repository
- Click "Actions" tab
- Select "Backend CI" workflow

---

### 2. Frontend CI (`frontend-ci.yml`)

**When it runs:**
- On push to `main` or `develop` branches
- On pull requests to `main` or `develop`
- Only when frontend code changes

**What it does:**

#### Test Job:
1. Installs pnpm and Node.js 20
2. Installs all dependencies
3. Creates `.env` file with API URL
4. Lints frontend code (if configured)
5. Checks TypeScript types
6. Generates TanStack Router routes
7. Runs frontend tests (if configured)
8. Builds production bundle
9. Uploads build artifacts (available for 7 days)

#### Build Job:
1. Builds frontend Docker image
2. Starts the Docker container
3. Tests that nginx is serving the React app
4. Verifies HTTP 200 response

**View results:**
- Go to your GitHub repository
- Click "Actions" tab
- Select "Frontend CI" workflow
- Download build artifacts from successful runs

---

### 3. Docker Compose Full Stack CI (`docker-compose-ci.yml`)

**When it runs:**
- On push to `main` branch
- On pull requests to `main` branch

**What it does:**

#### Integration Test Job:
1. Sets up pnpm
2. Creates production `.env` files for backend and frontend
3. Builds and starts all 3 services (frontend, backend, database)
4. Waits for PostgreSQL to be ready
5. Waits for backend API to respond
6. Waits for frontend to serve content
7. Runs database migrations
8. Tests all API endpoints (`/health`, `/api/posts`, `/api/users`)
9. Tests full user registration flow:
   - Registers new user
   - Logs in with new user
   - Creates a post
10. Shows container resource usage
11. Cleans up all containers

#### Security Scan Job:
1. Runs Trivy vulnerability scanner on backend
2. Runs Trivy vulnerability scanner on frontend
3. Reports CRITICAL and HIGH severity issues

**View results:**
- Go to your GitHub repository
- Click "Actions" tab
- Select "Docker Compose Full Stack CI" workflow
- Expand each step to see detailed logs

---

## Setting Up GitHub Actions

### Step 1: Push Workflows to GitHub

The workflow files are already in `.github/workflows/`. Just push them:

```bash
cd ~/chaykov-saas-app

# Add workflow files
git add .github/workflows/

# Commit
git commit -m "ci: Add GitHub Actions workflows for backend, frontend, and Docker"

# Push to GitHub
git push origin main
```

### Step 2: View Workflow Runs

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/chaykov-saas-app`
2. Click the **"Actions"** tab
3. You'll see all workflow runs

### Step 3: Check Workflow Status

**On the Actions page:**
- ✅ Green checkmark = All tests passed
- ❌ Red X = Tests failed
- 🟡 Yellow dot = Running
- ⚪ Gray dot = Queued

Click any workflow run to see detailed logs.

---

## Workflow Triggers

### What Triggers Each Workflow?

| Workflow | Trigger |
|----------|---------|
| Backend CI | Changes to `apps/data-service/express/**` |
| Frontend CI | Changes to `apps/user-application/trv1/**` |
| Full Stack CI | Any push/PR to `main` branch |

**Smart Triggers:**
- Workflows only run when relevant files change
- Saves GitHub Actions minutes
- Faster feedback for developers

### Branch Protection

To enforce that all tests pass before merging:

1. Go to: `Settings` → `Branches` → `Add rule`
2. Branch name pattern: `main`
3. Check: ✅ **"Require status checks to pass before merging"**
4. Select workflows:
   - `Test Frontend`
   - `Test Backend`
   - `Full Stack Integration Test`
5. Check: ✅ **"Require branches to be up to date before merging"**
6. Click **"Create"**

Now pull requests must pass all tests before they can be merged!

---

## Understanding the Test Results

### Backend CI Results

**Test job checks:**
- ✅ Database migrations run successfully
- ✅ No TypeScript errors
- ✅ All dependencies install correctly

**Build job checks:**
- ✅ Docker image builds successfully
- ✅ Image contains Node.js runtime

### Frontend CI Results

**Test job checks:**
- ✅ TypeScript compilation works
- ✅ TanStack Router generates routes
- ✅ Production build creates `dist/` folder
- ✅ Build artifacts uploaded

**Build job checks:**
- ✅ Docker image builds successfully
- ✅ Nginx serves the React app
- ✅ HTTP server responds on port 80

### Full Stack Integration Results

**Integration test checks:**
- ✅ All 3 containers start successfully
- ✅ PostgreSQL accepts connections
- ✅ Backend API responds to requests
- ✅ Frontend serves content
- ✅ Database migrations create tables
- ✅ User registration works
- ✅ User login works
- ✅ Post creation works

**Security scan checks:**
- ✅ No critical vulnerabilities in dependencies
- ⚠️ Warnings for high-severity issues

---

## Troubleshooting Failed Workflows

### Backend CI Fails

**Error: "Failed to run migrations"**
```bash
# Solution: Check your schema files
# View logs in GitHub Actions for details
# Fix locally first:
cd apps/data-service/express
pnpm drizzle:migrate
```

**Error: "TypeScript errors"**
```bash
# Solution: Fix type errors locally
pnpm exec tsc --noEmit
```

### Frontend CI Fails

**Error: "Build failed"**
```bash
# Solution: Test build locally
cd apps/user-application/trv1
pnpm build

# Check for errors and fix them
```

**Error: "Routes generation failed"**
```bash
# Solution: Check route files
pnpm generate-routes
```

### Full Stack CI Fails

**Error: "Backend not responding"**
- Check backend logs in workflow output
- Verify `.env` configuration
- Test locally with `docker compose up`

**Error: "Database connection failed"**
- Check PostgreSQL logs in workflow output
- Verify database credentials

**Error: "Registration test failed"**
- Backend might not be ready (increase wait time)
- Check `/api/auth/register` endpoint

---

## Adding More Tests

### Add Backend Unit Tests

1. Create test file:
```bash
# Example: apps/data-service/express/src/routes/__tests__/posts.test.ts
```

2. Add test script to `package.json`:
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

3. Tests will run automatically in CI

### Add Frontend Unit Tests

1. Create test files:
```bash
# Example: apps/user-application/trv1/src/components/__tests__/Button.test.tsx
```

2. Add test script to `package.json`:
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

3. Tests will run automatically in CI

### Add E2E Tests (Playwright)

1. Install Playwright:
```bash
cd apps/user-application/trv1
pnpm add -D @playwright/test
pnpm exec playwright install
```

2. Create test:
```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

3. Add to workflow:
```yaml
- name: Run E2E tests
  run: pnpm exec playwright test
```

---

## GitHub Actions Secrets

For production deployments, add secrets:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Click **"New repository secret"**
3. Add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VPS_HOST` | Your VPS IP address | `165.227.123.456` |
| `VPS_USER` | SSH user on VPS | `chaykov` |
| `VPS_SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `DB_PASSWORD` | Production database password | `super_secure_password_123!` |
| `DOCKER_USERNAME` | Docker Hub username (optional) | `your_dockerhub_username` |
| `DOCKER_TOKEN` | Docker Hub token (optional) | `dckr_pat_...` |

---

## Auto-Deploy to VPS (Optional)

Create a new workflow for automatic deployment:

```yaml
# .github/workflows/deploy-vps.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ~/chaykov-saas-app
            git pull origin main
            docker compose down
            docker compose up -d --build
            docker compose exec -T backend pnpm --filter @saas/data-service drizzle:migrate
```

**Setup:**
1. Add secrets (see above)
2. Push this workflow to GitHub
3. Every push to `main` will auto-deploy!

---

## Monitoring Workflows

### Email Notifications

GitHub sends emails when workflows fail (default).

### Slack Notifications (Optional)

Add Slack notifications:

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  if: always()
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Status Badges

Add status badges to your README:

```markdown
![Backend CI](https://github.com/YOUR_USERNAME/chaykov-saas-app/workflows/Backend%20CI/badge.svg)
![Frontend CI](https://github.com/YOUR_USERNAME/chaykov-saas-app/workflows/Frontend%20CI/badge.svg)
![Full Stack CI](https://github.com/YOUR_USERNAME/chaykov-saas-app/workflows/Docker%20Compose%20Full%20Stack%20CI/badge.svg)
```

---

## Workflow Performance

### Caching

All workflows use caching:
- **pnpm cache**: Node.js dependencies
- **Docker cache**: Docker layers
- **Build cache**: Compiled assets

This makes subsequent runs much faster!

### Typical Run Times

| Workflow | First Run | Cached Run |
|----------|-----------|------------|
| Backend CI | ~5 minutes | ~2 minutes |
| Frontend CI | ~4 minutes | ~1 minute |
| Full Stack CI | ~8 minutes | ~3 minutes |

### GitHub Actions Limits

**Free tier:**
- 2,000 minutes/month for private repos
- Unlimited for public repos

**Paid tier:**
- 3,000+ minutes/month
- Faster runners available

---

## Best Practices

### 1. Run Tests Locally First

Before pushing:
```bash
# Test backend
cd apps/data-service/express
pnpm exec tsc --noEmit

# Test frontend
cd apps/user-application/trv1
pnpm build

# Test full stack
docker compose up --build
```

### 2. Use Meaningful Commit Messages

```bash
# Good
git commit -m "fix: Resolve database connection timeout"
git commit -m "feat: Add user profile editing"

# Bad
git commit -m "fix"
git commit -m "updates"
```

### 3. Create Pull Requests

Instead of pushing directly to `main`:
```bash
# Create feature branch
git checkout -b feature/user-profiles

# Make changes and commit
git add .
git commit -m "feat: Add user profile page"

# Push to GitHub
git push origin feature/user-profiles

# Create PR on GitHub
```

### 4. Review Workflow Logs

Always check logs when workflows fail:
1. Click failed workflow
2. Expand failed step
3. Read error message
4. Fix locally
5. Push again

---

## Workflow Files Location

```
.github/
└── workflows/
    ├── backend-ci.yml           # Backend testing
    ├── frontend-ci.yml          # Frontend testing
    └── docker-compose-ci.yml    # Full stack integration
```

---

## Quick Reference

### View All Workflows
```
https://github.com/YOUR_USERNAME/chaykov-saas-app/actions
```

### Re-run Failed Workflow
1. Click workflow run
2. Click "Re-run all jobs"

### Cancel Running Workflow
1. Click workflow run
2. Click "Cancel workflow"

### Disable Workflow
1. Go to Actions tab
2. Select workflow
3. Click "..." → "Disable workflow"

---

## Next Steps

1. ✅ Push workflows to GitHub
2. ✅ Verify workflows run successfully
3. ✅ Set up branch protection rules
4. ✅ Add status badges to README
5. ✅ Configure auto-deploy (optional)
6. ✅ Add more tests as your app grows

---

🎉 **Your CI/CD pipeline is ready!**

Every push to GitHub will now automatically test your application, ensuring code quality and catching bugs early!
