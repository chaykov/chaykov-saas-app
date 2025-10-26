# 📤 GitHub Export Guide

Complete step-by-step guide to export your project to GitHub.

## Prerequisites

- Git installed on your computer
- GitHub account (free at https://github.com)

---

## Step 1: Create a GitHub Repository

### 1.1 Go to GitHub
1. Open your browser and go to https://github.com
2. Click **"Sign in"** (or **"Sign up"** if you don't have an account)

### 1.2 Create New Repository
1. Click the **"+"** icon in the top-right corner
2. Select **"New repository"**

### 1.3 Configure Repository
1. **Repository name**: `chaykov-saas-app` (or your preferred name)
2. **Description** (optional): "Full-stack SaaS application with React, Express, and PostgreSQL"
3. **Visibility**: Choose **Public** or **Private**
4. **DO NOT** check "Initialize with README" (we already have code)
5. **DO NOT** add .gitignore or license (we already have them)
6. Click **"Create repository"**

### 1.4 Copy Repository URL
After creating, you'll see a page with setup instructions. Copy the HTTPS URL:
```
https://github.com/YOUR_USERNAME/chaykov-saas-app.git
```

---

## Step 2: Prepare Your Local Repository

### 2.1 Open Terminal
```bash
cd /Users/chaykov/Desktop/chaykov-saas-app
```

### 2.2 Check Git Status
```bash
git status
```

### 2.3 Review Files to Commit
```bash
# See what will be committed
git status
```

### 2.4 Add All Files
```bash
# Add all changes
git add .

# Verify what's staged
git status
```

### 2.5 Create a Commit
```bash
git commit -m "Initial commit: Full-stack SaaS application

- Frontend: React + TanStack Router + TanStack Query
- Backend: Express + Drizzle ORM + PostgreSQL
- Docker: Multi-container setup with docker-compose
- Features: User authentication, posts, comments
- Deployment: Ready for VPS deployment"
```

---

## Step 3: Push to GitHub

### 3.1 Add Remote Repository
Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/chaykov-saas-app.git
```

### 3.2 Verify Remote
```bash
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/chaykov-saas-app.git (fetch)
origin  https://github.com/YOUR_USERNAME/chaykov-saas-app.git (push)
```

### 3.3 Push to GitHub
```bash
# Push to main branch
git push -u origin main
```

**If you get an authentication error:**
- GitHub now requires a Personal Access Token (PAT) instead of password
- See "Step 4: GitHub Authentication" below

---

## Step 4: GitHub Authentication (if needed)

### Option A: Personal Access Token (Recommended)

#### 4.1 Create Token
1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "Chaykov SaaS Deploy"
4. Set expiration: 90 days (or longer)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

#### 4.2 Use Token to Push
```bash
# When prompted for password, paste your token instead
git push -u origin main

# Username: YOUR_GITHUB_USERNAME
# Password: PASTE_YOUR_TOKEN_HERE
```

### Option B: SSH Key (Alternative)

#### 4.1 Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Enter passphrase (or press Enter for no passphrase)
```

#### 4.2 Copy Public Key
```bash
cat ~/.ssh/id_ed25519.pub
```

#### 4.3 Add to GitHub
1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Title: "My Mac"
4. Paste the key
5. Click **"Add SSH key"**

#### 4.4 Change Remote to SSH
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/chaykov-saas-app.git
git push -u origin main
```

---

## Step 5: Verify Upload

### 5.1 Check GitHub
1. Go to your repository: `https://github.com/YOUR_USERNAME/chaykov-saas-app`
2. You should see all your files!

### 5.2 Verify Files Present
✅ Check that these are visible:
- `README.md`
- `docker-compose.yml`
- `apps/` folder
- `.env.example`
- All deployment documentation

---

## Step 6: Create a Good README

Your repository should have a professional README. You can update it:

```bash
# Edit README.md with information about your project
# Then commit and push
git add README.md
git commit -m "docs: Update README with project details"
git push
```

---

## Step 7: Add .gitignore (if not already present)

Create `.gitignore` to avoid committing sensitive files:

```bash
# Check if .gitignore exists
cat .gitignore
```

If it doesn't exist or is incomplete, it should include:
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
*.tsbuildinfo

# Docker
.dockerignore

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
```

---

## Common Issues & Solutions

### Issue: "Permission denied (publickey)"
**Solution**: Use Personal Access Token or set up SSH key (see Step 4)

### Issue: "fatal: remote origin already exists"
**Solution**: Remove and re-add the remote
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/chaykov-saas-app.git
```

### Issue: "Branch 'main' does not exist"
**Solution**: Check your branch name
```bash
git branch  # See current branch
# If it's 'master', use that instead:
git push -u origin master
```

### Issue: Large files rejected
**Solution**: Check file sizes
```bash
find . -size +100M
# Remove large files or use Git LFS
```

---

## Next Steps

✅ Your code is now on GitHub!

**What's next?**
1. 🚀 Deploy to VPS (see `VPS_DEPLOYMENT_GUIDE.md`)
2. 📝 Add repository description and topics on GitHub
3. 🔒 Review security settings (Actions, Secrets)
4. 👥 Invite collaborators if needed

---

## Keeping Your Repository Updated

### Daily Workflow
```bash
# 1. Make changes to your code
# 2. Check what changed
git status

# 3. Add changes
git add .

# 4. Commit with descriptive message
git commit -m "feat: Add user profile editing feature"

# 5. Push to GitHub
git push
```

### Commit Message Best Practices
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

🎉 **Congratulations!** Your project is now on GitHub!
