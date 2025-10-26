# 🚀 VPS Deployment Guide for Complete Beginners

Complete step-by-step guide to deploy your Docker application on a VPS (Virtual Private Server).

## What is a VPS?

A VPS is like renting a computer in the cloud that runs 24/7. You'll install Ubuntu Linux on it and run your application there so anyone in the world can access it.

---

## Prerequisites

- ✅ Your code is on GitHub (see `GITHUB_EXPORT.md`)
- ✅ Your application works locally with Docker
- 💳 Credit card for VPS payment (~$5-20/month)
- 🖥️ Terminal on your Mac

---

## Step 1: Choose and Purchase a VPS

### Recommended VPS Providers

I'll use **DigitalOcean** for this guide (beginner-friendly, good documentation):

| Provider          | Price    | Specs          | Best For            |
| ----------------- | -------- | -------------- | ------------------- |
| **DigitalOcean**  | $6/month | 1GB RAM, 1 CPU | Beginners (easiest) |
| **Vultr**         | $6/month | 1GB RAM, 1 CPU | Good alternative    |
| **Linode**        | $5/month | 1GB RAM, 1 CPU | Great value         |
| **AWS Lightsail** | $5/month | 1GB RAM, 1 CPU | If you use AWS      |

**Recommendation**: Start with DigitalOcean's $12/month plan (2GB RAM) for better performance.

### 1.1 Create DigitalOcean Account

1. Go to https://www.digitalocean.com
2. Click **"Sign Up"**
3. Enter email, create password
4. Verify your email
5. Add payment method (credit card)

### 1.2 Create a Droplet (VPS)

1. Click **"Create"** → **"Droplets"**
2. **Choose Region**: Select closest to your users (e.g., "New York" for USA)
3. **Choose an Image**:
   - Select **Ubuntu 24.04 LTS x64**
   - (LTS = Long Term Support, most stable)
4. **Choose Size**:
   - **Basic Plan** (shared CPU)
   - **$12/month**: 2GB RAM / 1 CPU / 50GB SSD ← RECOMMENDED
   - (1GB RAM often isn't enough for Docker)
5. **Authentication**:
   - Select **"SSH Key"** (more secure)
   - We'll set this up next
6. **Hostname**: Give it a name like `chaykov-saas-prod`
7. Click **"Create Droplet"**

### 1.3 Wait for Creation

- Takes ~60 seconds
- You'll see your droplet with an **IP address** (e.g., `165.227.123.456`)
- **COPY THIS IP ADDRESS** - you'll need it!

---

## Step 2: Set Up SSH Access

SSH (Secure Shell) lets you control your VPS from your Mac terminal.

### 2.1 Create SSH Key on Your Mac

Open Terminal on your Mac:

```bash
# Check if you already have an SSH key
ls ~/.ssh/id_ed25519.pub

# If file doesn't exist, create new SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Press Enter to accept default location
# Enter passphrase (or press Enter for no passphrase)
```

### 2.2 Copy Your Public Key

```bash
# Display your public key
cat ~/.ssh/id_ed25519.pub
```

Copy the entire output (starts with `ssh-ed25519 ...`).

### 2.3 Add SSH Key to DigitalOcean

**If you already created the droplet:**

1. Go to DigitalOcean Dashboard
2. Click your droplet name
3. Click **"Console"** (opens browser terminal)
4. Login as `root` (no password needed in console)
5. Run these commands:

```bash
# Create .ssh directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key
nano ~/.ssh/authorized_keys
# Paste your public key, press Ctrl+X, Y, Enter

# Set permissions
chmod 600 ~/.ssh/authorized_keys
```

**If you haven't created droplet yet:**

1. Go to Settings → Security → SSH Keys
2. Click **"Add SSH Key"**
3. Paste your public key
4. Name it (e.g., "My Mac")
5. Then create droplet and select this key

### 2.4 Connect to Your VPS

Replace `YOUR_IP` with your actual VPS IP address:

```bash
# Connect to your VPS
ssh root@YOUR_IP

# Example:
# ssh root@165.227.123.456

# First time: type "yes" to accept fingerprint
```

🎉 **You're now connected to your VPS!**

---

## Step 3: Initial Server Setup

You're now running commands on your Ubuntu VPS (not your Mac).

### 3.1 Update System

```bash
# Update package list
apt update

# Upgrade all packages (takes 2-5 minutes)
apt upgrade -y
```

### 3.2 Create Non-Root User (Security Best Practice)

```bash
# Create new user (replace 'chaykov' with your preferred username)
adduser chaykov

# You'll be asked to set a password - REMEMBER THIS PASSWORD
# Press Enter through other questions (optional)

# Give user sudo privileges
usermod -aG sudo chaykov

# Copy SSH keys to new user
rsync --archive --chown=chaykov:chaykov ~/.ssh /home/chaykov
```

### 3.3 Switch to New User

```bash
# Switch to new user
su - chaykov

# Test sudo access
sudo ls
# Enter your password when prompted
```

### 3.4 Set Up Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (port 443)
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Type 'y' and press Enter

# Check status
sudo ufw status
```

You should see:

```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## Step 4: Install Docker

### 4.1 Install Docker Engine

```bash
# Update apt package index
sudo apt update

# Install dependencies
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update apt again
sudo apt update

# Install Docker Engine
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 4.2 Add Your User to Docker Group

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Log out and back in for changes to take effect
exit  # This logs out from 'chaykov' user back to 'root'
exit  # This disconnects from VPS

# Connect again as your user (replace YOUR_IP and chaykov)
ssh chaykov@YOUR_IP
```

### 4.3 Verify Docker Installation

```bash
# Check Docker version
docker --version

# Test Docker (should download and run hello-world)
docker run hello-world

# Check Docker Compose
docker compose version
```

If you see version numbers and "Hello from Docker!", you're all set! ✅

---

## Step 5: Clone Your Code from GitHub

### 5.1 Install Git

```bash
# Install git
sudo apt install -y git

# Verify
git --version
```

### 5.2 Clone Your Repository

**For Public Repository:**

```bash
# Navigate to home directory
cd ~

# Clone your repository (replace with your actual GitHub URL)
git clone https://github.com/YOUR_USERNAME/chaykov-saas-app.git

# Enter the directory
cd chaykov-saas-app

# Check files
ls -la
```

**For Private Repository:**

```bash
# You'll need to authenticate

# Option A: Use Personal Access Token
git clone https://github.com/YOUR_USERNAME/chaykov-saas-app.git
# Username: YOUR_USERNAME
# Password: YOUR_GITHUB_TOKEN (from GITHUB_EXPORT.md Step 4)

# Option B: Use SSH (if you added VPS SSH key to GitHub)
# First, generate SSH key on VPS and add to GitHub
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub: https://github.com/settings/keys
# Then clone:
git clone git@github.com:YOUR_USERNAME/chaykov-saas-app.git
```

---

## Step 6: Configure Production Environment

### 6.1 Create .env File

```bash
# Navigate to backend directory
cd ~/chaykov-saas-app/apps/data-service/express

# Create .env file
nano .env
```

### 6.2 Add Production Environment Variables

Paste this (modify values for production):

```env
# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=CHANGE_THIS_STRONG_PASSWORD_123!
DB_NAME=saas_db

# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_THIS_STRONG_PASSWORD_123!
POSTGRES_DB=saas_db

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration (replace with your actual domain)
CORS_ORIGIN=http://YOUR_IP_OR_DOMAIN
```

**Important**:

- Change `DB_PASSWORD` and `POSTGRES_PASSWORD` to a strong password
- Replace `YOUR_IP_OR_DOMAIN` with your VPS IP address (e.g., `http://165.227.123.456`)

**Save and exit**: Press `Ctrl+X`, then `Y`, then `Enter`

### 6.3 Update Frontend API URL

```bash
# Navigate to frontend directory
cd ~/chaykov-saas-app/apps/user-application/trv1

# Create .env file
nano .env
```

Add:

```env
VITE_API_URL=http://YOUR_IP_OR_DOMAIN:3001/api
```

Replace `YOUR_IP_OR_DOMAIN` with your actual VPS IP.

**Save and exit**: `Ctrl+X`, `Y`, `Enter`

---

## Step 7: Deploy with Docker

### 7.1 Navigate to Project Root

```bash
cd ~/chaykov-saas-app
```

### 7.2 Build and Start Containers

```bash
# Build and start all containers (takes 5-10 minutes first time)
docker compose up -d --build

# Explanation:
# -d = detached mode (runs in background)
# --build = rebuild images
```

### 7.3 Monitor Build Progress

```bash
# Watch logs
docker compose logs -f

# Press Ctrl+C to stop watching (containers keep running)
```

### 7.4 Run Database Migrations

```bash
# Run migrations to create tables
# docker compose exec backend pnpm --filter @saas/data-service drizzle:migrate
docker compose exec backend pnpm --filter express drizzle:migrate

# You should see: "Successfully migrated database"
```

### 7.5 Seed Database (Optional)

```bash
# Connect to database
# docker compose exec db psql -U postgres -d saas_db
docker compose exec postgres psql -U postgres -d chaykov_saas


# Create a test user (paste these SQL commands)
INSERT INTO users (username, email, password, bio)
VALUES ('admin', 'admin@example.com', 'hashed_password', 'Admin user');

INSERT INTO posts (content, "authorId")
VALUES ('Welcome to the platform!', 1);

# Exit psql
\q
```

### 7.6 Check Container Status

```bash
# See running containers
docker compose ps

# Should show 3 containers running:
# - frontend (port 80)
# - backend (port 3001)
# - db (port 5432)
```

---

## Step 8: Access Your Application

### 8.1 Test Backend API

```bash
# Test from VPS
curl http://localhost:3001/health

# Should return: {"status":"ok"}
```

### 8.2 Test Frontend

Open your browser and go to:

```
http://YOUR_VPS_IP
```

Example: `http://165.227.123.456`

🎉 **Your application should be live!**

---

## Step 9: Set Up Domain Name (Optional but Recommended)

### 9.1 Purchase Domain

Go to domain registrar:

- **Namecheap**: https://www.namecheap.com (~$10/year)
- **Google Domains**: https://domains.google
- **Cloudflare**: https://www.cloudflare.com/products/registrar/

Purchase a domain (e.g., `chaykov-saas.com`)

### 9.2 Configure DNS

In your domain registrar's DNS settings:

1. Add **A Record**:

   - **Type**: A
   - **Name**: @ (or leave empty)
   - **Value**: YOUR_VPS_IP
   - **TTL**: 3600

2. Add **A Record** for www:
   - **Type**: A
   - **Name**: www
   - **Value**: YOUR_VPS_IP
   - **TTL**: 3600

Wait 5-30 minutes for DNS propagation.

### 9.3 Test Domain

```bash
# Check if domain points to your VPS
ping your-domain.com

# Should show your VPS IP
```

### 9.4 Update Environment Variables

```bash
cd ~/chaykov-saas-app

# Update backend .env
nano apps/data-service/express/.env
# Change CORS_ORIGIN to: http://your-domain.com

# Update frontend .env
nano apps/user-application/trv1/.env
# Change VITE_API_URL to: http://your-domain.com:3001/api

# Rebuild and restart
docker compose down
docker compose up -d --build
```

---

## Step 10: Set Up SSL/HTTPS with Let's Encrypt

### 10.1 Install Nginx and Certbot

```bash
# Install Nginx
sudo apt install -y nginx

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop Docker frontend (we'll use Nginx instead)
docker compose stop frontend
```

### 10.2 Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/chaykov-saas
```

Paste this (replace `your-domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name polytalko.com www.polytalko.com;

    # Frontend (React)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Save**: `Ctrl+X`, `Y`, `Enter`

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/chaykov-saas /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Restart frontend on port 3000 instead of 80
# Edit docker-compose.yml
cd ~/chaykov-saas-app
nano docker-compose.yml
```

Find the frontend service and change port to:

```yaml
ports:
  - "3000:80" # Changed from "80:80"
```

**Save** and restart:

```bash
docker compose up -d frontend
```

### 10.3 Get SSL Certificate

```bash
# Get SSL certificate (replace with your email and domain)
sudo certbot --nginx -d polytalko.com -d www.polytalko.com

# Follow prompts:
# 1. Enter email
# 2. Agree to terms (type 'Y')
# 3. Share email (type 'Y' or 'N')
# 4. Select option 2: Redirect HTTP to HTTPS
```

🎉 **Your site is now secured with HTTPS!**

Test: `https://your-domain.com`

### 10.4 Auto-Renew SSL

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# If successful, certbot will auto-renew before expiration
```

---

## Step 11: Basic Server Management

### 11.1 View Application Logs

```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs frontend
docker compose logs backend
docker compose logs db

# Follow logs in real-time
docker compose logs -f backend
```

### 11.2 Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend

# Stop all services
docker compose down

# Start all services
docker compose up -d
```

### 11.3 Update Your Application

```bash
# SSH into VPS
ssh chaykov@YOUR_IP

# Navigate to project
cd ~/chaykov-saas-app

# Pull latest changes from GitHub
git pull origin main

# Rebuild and restart
docker compose down
docker compose up -d --build

# Run migrations if schema changed
docker compose exec backend pnpm --filter @saas/data-service drizzle:migrate
```

### 11.4 Monitor Server Resources

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU and memory by process
htop
# (Press 'q' to quit)

# Check Docker container resources
docker stats
```

### 11.5 Database Backup

```bash
# Create backup
docker compose exec db pg_dump -U postgres saas_db > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20241026.sql | docker compose exec -T db psql -U postgres saas_db
```

---

## Step 12: Security Best Practices

### 12.1 Enable Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Enable it
sudo dpkg-reconfigure -plow unattended-upgrades
# Select "Yes"
```

### 12.2 Change SSH Port (Optional)

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Find line: #Port 22
# Change to: Port 2222

# Save and restart SSH
sudo systemctl restart sshd

# Update firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow OpenSSH

# Now connect with: ssh -p 2222 chaykov@YOUR_IP
```

### 12.3 Fail2Ban (Blocks Brute Force Attacks)

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create local config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Start and enable
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status
```

### 12.4 Regular Updates

```bash
# Run weekly
sudo apt update && sudo apt upgrade -y
docker compose pull
docker compose up -d
```

---

## Troubleshooting

### Issue: Can't connect to VPS

```bash
# Check if VPS is running in DigitalOcean dashboard
# Try ping:
ping YOUR_IP

# Check SSH key:
ssh -v root@YOUR_IP
```

### Issue: Docker containers not starting

```bash
# Check logs
docker compose logs

# Check disk space
df -h

# Restart Docker
sudo systemctl restart docker
docker compose up -d
```

### Issue: Website shows "Bad Gateway"

```bash
# Check if backend is running
docker compose ps

# Check backend logs
docker compose logs backend

# Restart services
docker compose restart backend
```

### Issue: Database connection failed

```bash
# Check if database is running
docker compose ps db

# Check database logs
docker compose logs db

# Verify credentials in .env file
cat apps/data-service/express/.env
```

### Issue: Out of memory

```bash
# Check memory
free -h

# Restart containers
docker compose restart

# Consider upgrading to larger VPS plan
```

---

## Cost Breakdown

Monthly costs for running your SaaS:

| Service         | Cost           | Notes         |
| --------------- | -------------- | ------------- |
| VPS (2GB RAM)   | $12/month      | DigitalOcean  |
| Domain          | $1/month       | ~$10/year     |
| SSL Certificate | FREE           | Let's Encrypt |
| **Total**       | **~$13/month** |               |

Yearly: ~$156/year

---

## Next Steps

✅ Your application is now live on the internet!

**What to do next:**

1. 🔐 Set up proper authentication (JWT tokens, sessions)
2. 📊 Add monitoring (e.g., Sentry for error tracking)
3. 📈 Set up analytics (Google Analytics, Plausible)
4. 💾 Set up automated database backups
5. 📧 Configure email service (e.g., SendGrid)
6. 🚀 Implement CI/CD (auto-deploy on git push)

---

## Quick Reference Commands

```bash
# Connect to VPS
ssh chaykov@YOUR_IP

# Navigate to project
cd ~/chaykov-saas-app

# View logs
docker compose logs -f

# Restart all
docker compose restart

# Update code
git pull && docker compose up -d --build

# Database backup
docker compose exec db pg_dump -U postgres saas_db > backup.sql

# Check containers
docker compose ps

# System status
htop
```

---

🎉 **Congratulations!** You've successfully deployed your SaaS application to production!

**Need help?**

- DigitalOcean Community: https://www.digitalocean.com/community
- Docker Documentation: https://docs.docker.com
- Let's Encrypt Help: https://community.letsencrypt.org
