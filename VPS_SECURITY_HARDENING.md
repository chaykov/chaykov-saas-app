# VPS Security Hardening Guide

This guide will help you secure your VPS server against common attacks.

## ⚠️ CRITICAL - Do These First

### 1. Setup Firewall (UFW)

```bash
# Install UFW
sudo apt update
sudo apt install ufw -y

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow necessary ports
sudo ufw allow 22/tcp     # SSH (change if you modify SSH port)
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

Expected output:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

### 2. Install Fail2Ban (Protection against brute-force attacks)

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Copy default configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit configuration
sudo nano /etc/fail2ban/jail.local
```

Find and update the `[sshd]` section:
```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600
findtime = 600
```

Save and start Fail2Ban:
```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
sudo systemctl status fail2ban

# Check SSH jail status
sudo fail2ban-client status sshd
```

### 3. Enable Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades -y

# Enable automatic updates
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Edit configuration (optional)
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

Ensure these lines are uncommented:
```
"${distro_id}:${distro_codename}-security";
"${distro_id}ESMApps:${distro_codename}-apps-security";
```

### 4. Secure Docker Ports

Update your deployment to bind Docker ports to localhost only:

```bash
cd /var/www/chaykov-saas-app
git pull origin main

# Redeploy with secure port bindings
sudo ./deploy.sh production
```

This ensures ports 3001 and 8080 are only accessible via Nginx (not directly from the internet).

Verify ports are bound to localhost:
```bash
sudo netstat -tulpn | grep -E ':(3001|8080)'
```

Expected output should show `127.0.0.1:3001` and `127.0.0.1:8080`, NOT `0.0.0.0`.

## 🔒 Recommended - Additional Security

### 5. Change SSH Default Port (Optional but Recommended)

**⚠️ WARNING: Test thoroughly before closing your current SSH session!**

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config
```

Change:
```
Port 22
```
To (choose any port between 1024-65535):
```
Port 2222
```

Also ensure these settings are configured:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Apply changes:
```bash
# Add new port to firewall BEFORE restarting SSH
sudo ufw allow 2222/tcp

# Test SSH config
sudo sshd -t

# Restart SSH service
sudo systemctl restart sshd

# In a NEW terminal window, test connection (keep this session open!)
ssh -p 2222 deploy@YOUR_VPS_IP
```

If the new connection works:
```bash
# Remove old SSH port from firewall
sudo ufw delete allow 22/tcp
sudo ufw reload
```

### 6. Install and Configure Logwatch (Log Monitoring)

```bash
# Install Logwatch
sudo apt install logwatch -y

# View daily report
sudo logwatch --detail High --mailto root --range today --service all

# Optional: Configure automatic daily email reports
sudo nano /etc/cron.daily/00logwatch
```

Add:
```bash
#!/bin/bash
/usr/sbin/logwatch --output mail --mailto your-email@example.com --detail high
```

Make it executable:
```bash
sudo chmod +x /etc/cron.daily/00logwatch
```

### 7. Limit SSH Access by IP (If you have static IP)

If you have a static IP address, restrict SSH access:

```bash
# Remove general SSH rule
sudo ufw delete allow 22/tcp

# Add IP-specific rule
sudo ufw allow from YOUR_STATIC_IP to any port 22 proto tcp

# Check rules
sudo ufw status numbered
```

### 8. Install AIDE (File Integrity Monitoring)

```bash
# Install AIDE
sudo apt install aide -y

# Initialize database
sudo aideinit

# Move database to active location
sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Run check
sudo aide --check

# Schedule daily checks
echo "0 5 * * * root /usr/bin/aide --check" | sudo tee -a /etc/crontab
```

### 9. Configure SSH Key-Only Authentication (If not already done)

```bash
sudo nano /etc/ssh/sshd_config
```

Ensure:
```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
```

```bash
sudo systemctl restart sshd
```

### 10. Enable Process Accounting

```bash
# Install psacct
sudo apt install acct -y

# Enable accounting
sudo systemctl enable acct
sudo systemctl start acct

# View commands run by users
sudo lastcomm
```

## 🛡️ Docker Security

### 11. Docker Security Best Practices

Already implemented in your setup:
- ✅ Non-root users in containers
- ✅ Read-only containers where possible
- ✅ Resource limits (CPU, memory)
- ✅ Health checks
- ✅ Minimal base images (Alpine)
- ✅ Security options (`no-new-privileges`)

Additional steps:

```bash
# Audit Docker security
docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image polytalko-backend:latest

docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image polytalko-frontend:latest
```

## 🔍 Monitoring & Logging

### 12. Check System Logs Regularly

```bash
# Check authentication logs
sudo tail -f /var/log/auth.log

# Check Nginx logs
sudo tail -f /var/log/nginx/polytalko_error.log
sudo tail -f /var/log/nginx/polytalko_access.log

# Check application logs
sudo docker compose -f docker-compose.prod.yml logs -f

# Check Fail2Ban status
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

### 13. Monitor Banned IPs

```bash
# View currently banned IPs
sudo fail2ban-client status sshd

# Unban an IP (if needed)
sudo fail2ban-client set sshd unbanip IP_ADDRESS

# View ban logs
sudo tail -f /var/log/fail2ban.log
```

## 📊 Security Checklist

After completing this guide, verify:

- [ ] UFW firewall is active and configured
- [ ] Fail2Ban is running and monitoring SSH
- [ ] Automatic security updates are enabled
- [ ] Docker ports bound to localhost only (127.0.0.1)
- [ ] SSH configured with keys only (no password auth)
- [ ] Root login disabled via SSH
- [ ] SSL/HTTPS is working (Let's Encrypt)
- [ ] Nginx security headers are present
- [ ] Database is NOT exposed to internet
- [ ] Backups are running daily
- [ ] Logs are being monitored

## 🚨 Emergency Response

### If you detect suspicious activity:

```bash
# 1. Check active connections
sudo netstat -tulpn
ss -tuln

# 2. Check logged-in users
who
w

# 3. Check recent authentication attempts
sudo tail -100 /var/log/auth.log

# 4. Check Docker containers
sudo docker ps
sudo docker compose -f docker-compose.prod.yml logs --tail=100

# 5. Ban an IP immediately (if needed)
sudo fail2ban-client set sshd banip SUSPICIOUS_IP

# 6. Block an IP with UFW
sudo ufw deny from SUSPICIOUS_IP

# 7. Restart services if compromised
sudo docker compose -f docker-compose.prod.yml down
sudo docker compose -f docker-compose.prod.yml up -d

# 8. Check for rootkits (install rkhunter first)
sudo apt install rkhunter -y
sudo rkhunter --check
```

## 🔄 Regular Maintenance

### Weekly:
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Check firewall status
sudo ufw status verbose

# Check Fail2Ban bans
sudo fail2ban-client status sshd

# Review logs
sudo logwatch --detail High --range 'between -7 days and today'
```

### Monthly:
```bash
# Clean old Docker images
sudo docker system prune -a

# Check disk space
df -h

# Review backup logs
ls -lh /var/backups/polytalko/

# Test backup restoration (on staging server)
```

## 📚 Additional Resources

- [Ubuntu Security Guide](https://ubuntu.com/security)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)

## ⚠️ Important Notes

1. **Always test SSH changes in a new terminal** before closing your current session
2. **Keep your local SSH keys secure** - never share them
3. **Document any custom changes** you make to configurations
4. **Set up monitoring/alerts** for production applications
5. **Regularly update all software** - Docker, Nginx, Node.js, etc.
6. **Have a disaster recovery plan** - test your backups!

---

**Last Updated:** 2025-10-27
**Application:** Polytalko SaaS
**Server:** Ubuntu 24.04 LTS
