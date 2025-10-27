# Monitoring and CI/CD Setup Guide

This guide will help you set up monitoring and continuous deployment for your application.

## 📊 Part 1: Monitoring with UptimeRobot (5 minutes)

### Step 1: Create UptimeRobot Account

1. Go to https://uptimerobot.com
2. Sign up for a **free account** (50 monitors included)
3. Verify your email

### Step 2: Add Monitors

#### Monitor 1: Homepage
```
Monitor Type: HTTP(s)
Friendly Name: Polytalko - Homepage
URL (or IP): https://polytalko.com
Monitoring Interval: 5 minutes
```

#### Monitor 2: API Health Check
```
Monitor Type: HTTP(s)
Friendly Name: Polytalko - API Health
URL (or IP): https://polytalko.com/health
Monitoring Interval: 5 minutes
Alert Contacts: (your email)
```

#### Monitor 3: WWW Subdomain
```
Monitor Type: HTTP(s)
Friendly Name: Polytalko - WWW
URL (or IP): https://www.polytalko.com
Monitoring Interval: 5 minutes
```

### Step 3: Configure Alert Contacts

1. Go to **My Settings → Alert Contacts**
2. Add your email (already added by default)
3. Optional: Add Slack, Discord, or Telegram webhook

**Slack Webhook Example:**
- Create incoming webhook in Slack
- Add webhook URL to UptimeRobot
- You'll get instant notifications when site goes down

### Step 4: View Status Page (Optional)

1. Go to **Public Status Pages**
2. Click **Create Status Page**
3. Select monitors to display
4. Get public URL: `https://stats.uptimerobot.com/YOUR_ID`
5. Share with users to show uptime status

---

## 🚀 Part 2: CI/CD with GitHub Actions

### What it does:
- Automatically deploys to VPS when you push to `main` branch
- Can also trigger manual deployments from GitHub UI
- Shows deployment status (success/failure)

### Step 1: Get your SSH Private Key

On your **local Mac**, find your SSH private key:

```bash
# View your private key
cat ~/.ssh/id_rsa

# Or if you use a different key:
cat ~/.ssh/YOUR_KEY_NAME
```

Copy the **entire output** including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/chaykov/chaykov-saas-app
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 4 secrets:

#### Secret 1: VPS_HOST
```
Name: VPS_HOST
Value: 91.99.73.102
```

#### Secret 2: VPS_USER
```
Name: VPS_USER
Value: deploy
```

#### Secret 3: VPS_PORT
```
Name: VPS_PORT
Value: 2222
```

#### Secret 4: VPS_SSH_KEY
```
Name: VPS_SSH_KEY
Value: (paste your entire private key from ~/.ssh/id_rsa)
```

**Important:** The SSH key must include the header and footer:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...all the key content...
-----END OPENSSH PRIVATE KEY-----
```

### Step 3: Enable GitHub Actions

GitHub Actions should be enabled by default, but verify:

1. Go to **Settings** → **Actions** → **General**
2. Under **Actions permissions**, ensure:
   - ✅ "Allow all actions and reusable workflows" is selected
3. Under **Workflow permissions**, ensure:
   - ✅ "Read and write permissions" is selected

### Step 4: Test the Workflow

#### Option A: Push to main branch
```bash
# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger CI/CD"
git push origin main
```

#### Option B: Manual trigger
1. Go to **Actions** tab in GitHub
2. Click on **Deploy to Production** workflow
3. Click **Run workflow** button
4. Select branch: `main`
5. Click **Run workflow**

### Step 5: Monitor Deployment

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Watch the deployment progress in real-time
4. Check logs for any errors

Expected output:
```
✅ Deployment successful!
Frontend: https://polytalko.com
API: https://polytalko.com/api
```

### Step 6: Verify Deployment on VPS

After GitHub Action completes, verify on your VPS:

```bash
# Connect to VPS
ssh -p 2222 deploy@91.99.73.102

# Check if latest code was pulled
cd /var/www/chaykov-saas-app
git log -1

# Check running containers
sudo docker ps

# Check application logs
sudo docker compose -f docker-compose.prod.yml logs --tail=50
```

---

## 🔧 Troubleshooting

### GitHub Actions: "Permission denied (publickey)"

**Problem:** SSH key is incorrect or not properly formatted.

**Solution:**
1. Verify your SSH key works manually:
   ```bash
   ssh -p 2222 -i ~/.ssh/id_rsa deploy@91.99.73.102
   ```
2. Ensure the key in GitHub Secrets includes header/footer
3. Check that the key has no extra spaces or line breaks

### GitHub Actions: "sudo: a terminal is required to read the password"

**Problem:** User `deploy` needs sudo without password for deployment script.

**Solution:**
```bash
# On VPS, edit sudoers file
sudo visudo

# Add this line at the end:
deploy ALL=(ALL) NOPASSWD: /var/www/chaykov-saas-app/deploy.sh
```

### UptimeRobot: Monitor shows "Down"

**Possible causes:**
1. Server is actually down - check VPS
2. SSL certificate expired - check certificate
3. Firewall blocking UptimeRobot IPs - check UFW

**Check:**
```bash
# On VPS
sudo systemctl status nginx
sudo systemctl status docker
sudo docker ps
curl -I https://polytalko.com
```

### GitHub Actions: Deployment hangs

**Problem:** Script is waiting for user input.

**Solution:**
Ensure `deploy.sh` doesn't require interactive input. All prompts should be automated.

---

## 📈 Monitoring Dashboard

After setup, you'll have:

### UptimeRobot Dashboard:
- **Uptime percentage** (e.g., 99.9%)
- **Response time** graphs
- **Incident history**
- **SSL certificate expiry date**

### GitHub Actions Dashboard:
- **Deployment history**
- **Success/failure rate**
- **Deployment duration**
- **Logs for each deployment**

---

## 🎯 Advanced Features (Optional)

### 1. Add Deployment Notifications to Slack

Install GitHub Slack app:
1. Go to https://slack.github.com
2. Connect to your Slack workspace
3. Subscribe to repository: `/github subscribe chaykov/chaykov-saas-app deployments`

### 2. Add Health Check to Backend

Already exists at `/health`, but you can enhance it:

```typescript
// apps/data-service/express/src/server.ts
app.get("/health", async (_req, res) => {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected"
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "Database connection failed"
    });
  }
});
```

### 3. Add Performance Monitoring with Netdata

```bash
# On VPS - install Netdata
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Access at: http://YOUR_VPS_IP:19999
# Or configure Nginx proxy for https://monitoring.polytalko.com
```

### 4. Add Error Tracking with Sentry

1. Sign up at https://sentry.io (free tier available)
2. Create new project
3. Install Sentry SDK:
   ```bash
   npm install @sentry/node @sentry/express
   ```
4. Add to backend:
   ```typescript
   import * as Sentry from "@sentry/node";

   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     environment: process.env.NODE_ENV,
   });
   ```

### 5. Automated Rollback on Failure

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Health check after deployment
  run: |
    sleep 10
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://polytalko.com/health)
    if [ "$STATUS" != "200" ]; then
      echo "Health check failed! Rolling back..."
      exit 1
    fi
```

---

## 📊 What You'll See

### UptimeRobot Email Alerts:
```
⚠️ Polytalko - Homepage is DOWN
Reason: Connection timeout
Down since: 2025-10-27 14:30:00 UTC
```

```
✅ Polytalko - Homepage is UP
Was down for: 2 minutes
Up since: 2025-10-27 14:32:00 UTC
```

### GitHub Actions Notifications:
```
✅ Deployment to production succeeded
Branch: main
Commit: abc1234 - "feat: add new feature"
Duration: 2m 15s
```

---

## 🔍 Regular Monitoring Tasks

### Daily:
- Check UptimeRobot dashboard for uptime %
- Review any downtime incidents

### Weekly:
- Check GitHub Actions deployment success rate
- Review application logs for errors
- Monitor server resources (CPU, RAM, disk)

### Monthly:
- Review SSL certificate expiry (auto-renewed but good to check)
- Check backup integrity
- Update dependencies

---

## 📝 Summary

After completing this guide:

✅ **Monitoring:**
- Uptime monitoring every 5 minutes
- Email alerts on downtime
- Public status page (optional)

✅ **CI/CD:**
- Automatic deployment on git push
- Manual deployment trigger available
- Deployment logs and history
- Success/failure notifications

✅ **Benefits:**
- Know immediately when site goes down
- Deploy new features in seconds
- No manual SSH needed for deployments
- Complete deployment history

---

## 🚀 Next Steps

1. **Set up UptimeRobot** (5 minutes)
2. **Configure GitHub Secrets** (3 minutes)
3. **Test deployment** (2 minutes)
4. **Optional:** Add Slack notifications, Netdata, Sentry

---

**Total Setup Time: ~10 minutes**

**Questions?** Check troubleshooting section or review logs.
