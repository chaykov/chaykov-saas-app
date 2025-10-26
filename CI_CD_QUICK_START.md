# 🚀 CI/CD Quick Start Guide

Quick reference for your GitHub Actions workflows.

---

## What You Have Now

✅ **3 Automated Workflows**
- Backend CI (tests backend + PostgreSQL)
- Frontend CI (tests frontend build)
- Full Stack CI (tests entire application)

✅ **Complete Documentation**
- GITHUB_ACTIONS.md (detailed guide)
- WORKFLOWS_SUMMARY.md (overview)
- CI_CD_QUICK_START.md (this file)

---

## Push to GitHub (First Time)

```bash
cd ~/chaykov-saas-app

# Add all workflow files
git add .github/workflows/

# Add documentation
git add GITHUB_ACTIONS.md WORKFLOWS_SUMMARY.md CI_CD_QUICK_START.md

# Commit
git commit -m "ci: Add CI/CD workflows with comprehensive testing

- Backend CI: PostgreSQL integration, migrations, Docker build
- Frontend CI: Build verification, Docker image testing
- Full Stack CI: End-to-end integration tests
- Security scanning with Trivy
- Complete documentation"

# Push to GitHub
git push origin main
```

---

## View Your Workflows

**On GitHub:**
```
https://github.com/YOUR_USERNAME/chaykov-saas-app/actions
```

**You'll see:**
- 🟢 Green checkmark = All tests passed ✅
- 🔴 Red X = Tests failed ❌
- 🟡 Yellow dot = Running ⏳
- ⚪ Gray dot = Queued 🕐

---

## What Each Workflow Does

### Backend CI
```
✓ Starts PostgreSQL database
✓ Runs database migrations
✓ Checks TypeScript types
✓ Builds Docker image
```

### Frontend CI
```
✓ Generates TanStack routes
✓ Checks TypeScript types
✓ Builds production bundle
✓ Builds Docker image
✓ Tests nginx serving
```

### Full Stack CI
```
✓ Starts all 3 containers (frontend, backend, db)
✓ Runs database migrations
✓ Tests API endpoints
✓ Tests user registration
✓ Tests user login
✓ Tests post creation
✓ Scans for security vulnerabilities
```

---

## When Workflows Run

| Workflow | When? |
|----------|-------|
| Backend CI | Backend files change |
| Frontend CI | Frontend files change |
| Full Stack CI | Any push to `main` |

**Smart:** Only relevant workflows run, saving time and GitHub Actions minutes!

---

## Daily Workflow

### 1. Make Changes Locally
```bash
# Edit code
code apps/user-application/trv1/src/routes/dashboard.tsx
```

### 2. Test Locally (Optional but Recommended)
```bash
# Test frontend build
cd apps/user-application/trv1
pnpm build

# Test backend types
cd apps/data-service/express
pnpm exec tsc --noEmit

# Test full stack
cd ~/chaykov-saas-app
docker compose up --build
```

### 3. Commit and Push
```bash
git add .
git commit -m "feat: Add user profile editing"
git push origin main
```

### 4. Check GitHub Actions
1. Go to GitHub Actions tab
2. Wait 2-8 minutes for tests
3. ✅ Green = merge safely
4. ❌ Red = check logs, fix issues

---

## Branch Protection (Recommended)

Force all tests to pass before merging:

1. Go to: **Settings** → **Branches**
2. Click **"Add rule"**
3. Branch name: `main`
4. Check: ☑️ **"Require status checks to pass"**
5. Select:
   - `Test Backend`
   - `Test Frontend`
   - `Full Stack Integration Test`
6. Click **"Create"**

Now pull requests **MUST** pass all tests!

---

## Troubleshooting

### ❌ Backend CI Failed
```bash
# Check logs in GitHub Actions
# Common issues:
# - Database migration error → Check schema files
# - TypeScript error → Run: pnpm exec tsc --noEmit
# - Docker build error → Test locally: docker build -f apps/data-service/express/Dockerfile .
```

### ❌ Frontend CI Failed
```bash
# Check logs in GitHub Actions
# Common issues:
# - Build error → Run: pnpm build
# - TypeScript error → Run: pnpm exec tsc --noEmit
# - Route generation error → Run: pnpm generate-routes
```

### ❌ Full Stack CI Failed
```bash
# Check which step failed in GitHub Actions logs
# Common issues:
# - PostgreSQL timeout → Database slow to start (rare)
# - Backend not responding → Check backend logs in workflow
# - API test failed → Check endpoint code
# - Registration failed → Check /api/auth/register endpoint
```

---

## Re-run Failed Workflow

1. Click failed workflow run
2. Click **"Re-run all jobs"** button
3. Wait for results

---

## Workflow Status Badges (Optional)

Add to your `README.md`:

```markdown
## CI/CD Status

![Backend CI](https://github.com/YOUR_USERNAME/chaykov-saas-app/workflows/Backend%20CI/badge.svg)
![Frontend CI](https://github.com/YOUR_USERNAME/chaykov-saas-app/workflows/Frontend%20CI/badge.svg)
![Full Stack CI](https://github.com/YOUR_USERNAME/chaykov-saas-app/workflows/Docker%20Compose%20Full%20Stack%20CI/badge.svg)
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Performance

### Typical Run Times
- Backend CI: **~2 minutes** (with cache)
- Frontend CI: **~1 minute** (with cache)
- Full Stack CI: **~3 minutes** (with cache)

### GitHub Actions Limits
- **Free tier:** 2,000 minutes/month (private repos)
- **Public repos:** Unlimited minutes
- **Paid tier:** $4/month for 3,000 minutes

Your workflows use **~6-8 minutes per push**, so you can push **~250 times/month** on free tier.

---

## Best Practices

### ✅ DO:
- Test locally before pushing
- Write descriptive commit messages
- Check workflow logs when tests fail
- Fix issues promptly

### ❌ DON'T:
- Push untested code
- Ignore failing tests
- Commit secrets or passwords
- Skip TypeScript errors

---

## Commit Message Format

Use conventional commits:

```bash
# New feature
git commit -m "feat: Add dark mode toggle"

# Bug fix
git commit -m "fix: Resolve login redirect issue"

# Documentation
git commit -m "docs: Update API documentation"

# Code refactoring
git commit -m "refactor: Simplify auth logic"

# Tests
git commit -m "test: Add user registration tests"

# CI/CD
git commit -m "ci: Update workflow timeout"
```

---

## Next Steps

### Now:
1. ✅ Push workflows to GitHub
2. ✅ Verify workflows run successfully
3. ✅ Review workflow logs

### Soon:
1. 🔒 Set up branch protection
2. 📊 Add status badges to README
3. 📧 Configure notifications (optional)

### Later:
1. 🚀 Add auto-deploy workflow (see VPS_DEPLOYMENT_GUIDE.md)
2. 🧪 Add more unit/integration tests
3. 📈 Set up monitoring (Sentry, etc.)

---

## Quick Commands

```bash
# View workflow status
gh run list  # (requires GitHub CLI)

# View latest workflow run
gh run view  # (requires GitHub CLI)

# Cancel workflow
gh run cancel  # (requires GitHub CLI)

# Local testing
docker compose up --build    # Test full stack
pnpm build                   # Test frontend
pnpm exec tsc --noEmit       # Check TypeScript
```

---

## Documentation Index

| File | Purpose |
|------|---------|
| **CI_CD_QUICK_START.md** | Quick reference (this file) |
| **GITHUB_ACTIONS.md** | Detailed CI/CD documentation |
| **WORKFLOWS_SUMMARY.md** | Workflow overview |
| **GITHUB_EXPORT.md** | How to push to GitHub |
| **VPS_DEPLOYMENT_GUIDE.md** | How to deploy to VPS |

---

## Support

**Workflow issues:**
- Check GitHub Actions logs first
- Review GITHUB_ACTIONS.md for details
- Test locally to reproduce issue

**GitHub Actions help:**
- Docs: https://docs.github.com/en/actions
- Community: https://github.community

---

🎉 **Your CI/CD pipeline is ready to use!**

Just push to GitHub and watch the magic happen!
