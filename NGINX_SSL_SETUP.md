# Nginx Reverse Proxy + SSL/HTTPS Setup Guide

This guide walks you through setting up Nginx as a reverse proxy with SSL/HTTPS support using Let's Encrypt.

## Prerequisites

- Domain name pointing to your VPS IP (or you can use IP address without SSL)
- Docker containers running on ports 3001 (backend) and 8080 (frontend)
- Root or sudo access to the server

## Step 1: Update Environment Variables

On your VPS, update the `.env` file:

```bash
sudo nano /var/www/chaykov-saas-app/.env
```

Update these values:
```env
FRONTEND_HOST_PORT=8080
VITE_API_URL=https://YOUR_DOMAIN/api
FRONTEND_URL=https://YOUR_DOMAIN
```

## Step 2: Deploy Application with Updated Ports

```bash
cd /var/www/chaykov-saas-app
git pull origin main
sudo ./deploy.sh production
```

Verify containers are running:
```bash
sudo docker ps
```

You should see:
- `polytalko-frontend-prod` on port 8080
- `polytalko-backend-prod` on port 3001

## Step 3: Configure Nginx

### 3.1. Copy nginx configuration

```bash
sudo cp /var/www/chaykov-saas-app/config/nginx/polytalko.conf /etc/nginx/sites-available/polytalko
```

### 3.2. Update the configuration with your domain/IP

```bash
sudo nano /etc/nginx/sites-available/polytalko
```

Replace `YOUR_DOMAIN_OR_IP` with:
- Your domain name (e.g., `polytalko.com`)
- OR your VPS IP address (e.g., `123.45.67.89`)

### 3.3. Enable the site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/polytalko /etc/nginx/sites-enabled/

# Remove default site if exists
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

## Step 4: Set Up SSL with Let's Encrypt (Domain Only)

**Note:** Skip this step if you're using an IP address instead of a domain.

### 4.1. Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 4.2. Create directory for Let's Encrypt verification

```bash
sudo mkdir -p /var/www/certbot
sudo chown -R www-data:www-data /var/www/certbot
```

### 4.3. Obtain SSL certificate

Replace `YOUR_DOMAIN` and `YOUR_EMAIL` with your actual values:

```bash
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN --email YOUR_EMAIL --agree-tos --no-eff-email
```

Certbot will:
- Verify domain ownership
- Obtain SSL certificate
- Automatically update nginx configuration
- Set up auto-renewal

### 4.4. Test auto-renewal

```bash
sudo certbot renew --dry-run
```

### 4.5. Verify SSL is working

Visit your site:
```
https://YOUR_DOMAIN
```

You should see:
- A padlock icon in the browser
- Your application running over HTTPS

## Step 5: Verify Everything Works

### 5.1. Test frontend
```bash
curl -I https://YOUR_DOMAIN
```

Expected: `HTTP/2 200`

### 5.2. Test backend API
```bash
curl https://YOUR_DOMAIN/api/health
```

Expected: API health response

### 5.3. Check nginx logs
```bash
sudo tail -f /var/log/nginx/polytalko_access.log
sudo tail -f /var/log/nginx/polytalko_error.log
```

## Step 6: Firewall Configuration

Ensure ports 80 and 443 are open:

```bash
# If using ufw
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
sudo ufw status
```

## Troubleshooting

### Issue: "Connection refused" on port 8080

**Solution:** Check if frontend container is running:
```bash
sudo docker ps | grep frontend
curl http://localhost:8080
```

### Issue: "502 Bad Gateway"

**Solution:** Check backend/frontend logs:
```bash
sudo docker compose -f docker-compose.prod.yml logs backend
sudo docker compose -f docker-compose.prod.yml logs frontend
```

### Issue: SSL certificate verification failed

**Solution:** Ensure:
- Domain DNS points to your VPS IP
- Ports 80 and 443 are accessible from the internet
- No firewall blocking Let's Encrypt verification

Check DNS:
```bash
dig YOUR_DOMAIN
nslookup YOUR_DOMAIN
```

### Issue: Rate limiting errors

**Solution:** Adjust rate limits in `/etc/nginx/sites-available/polytalko`:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=100r/s;
```

Then reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Useful Commands

```bash
# Check nginx status
sudo systemctl status nginx

# Reload nginx configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Check SSL certificate expiry
sudo certbot certificates

# Renew SSL certificate manually
sudo certbot renew

# View nginx error log
sudo tail -f /var/log/nginx/error.log

# View application logs
sudo docker compose -f docker-compose.prod.yml logs -f

# Restart application
cd /var/www/chaykov-saas-app
sudo ./deploy.sh production
```

## Security Recommendations

1. **Keep SSL certificates updated** - Certbot auto-renewal should handle this
2. **Monitor logs regularly** - Check for suspicious activity
3. **Update Nginx regularly** - `sudo apt update && sudo apt upgrade nginx`
4. **Use strong passwords** - For database and API keys
5. **Enable firewall** - Only allow necessary ports (22, 80, 443)
6. **Regular backups** - Back up database and configuration files

## Next Steps

- Set up monitoring (e.g., Uptime Robot, Pingdom)
- Configure log rotation
- Set up automated backups
- Consider CDN for static assets (e.g., Cloudflare)
- Set up database backups
