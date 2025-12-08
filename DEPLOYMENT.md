# 🚀 Hostinger VPS Deployment Guide (Next.js)

This guide will walk you through deploying your Next.js application to a Hostinger VPS (Ubuntu).

## Prerequisites
1.  **Hostinger VPS** (Ubuntu 20.04 or 22.04 recommended).
2.  **Domain Name** pointed to your VPS IP address (A Record).
3.  **SSH Access** to your VPS.

---

## Step 1: Initial Server Setup
Connect to your VPS via SSH:
```bash
ssh root@your_vps_ip
```

Update your system:
```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install Node.js
Install Node.js (Version 18 or 20 LTS):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
Verify installation:
```bash
node -v
npm -v
```

## Step 3: Install PM2 (Process Manager)
PM2 keeps your app running in the background and restarts it if it crashes.
```bash
sudo npm install -g pm2
```

## Step 4: Upload Your Project
You can upload your files using **SFTP** (FileZilla) or **Git**.

### Option A: Using Git (Recommended)
1.  Push your local code to GitHub.
2.  Clone it on your VPS:
    ```bash
    cd /var/www
    git clone https://github.com/your-username/your-repo.git project-showcase
    cd project-showcase
    ```

### Option B: Using SFTP
1.  Upload your project folder to `/var/www/project-showcase`.
2.  **Exclude** `node_modules` and `.next` folders (we will build them on the server).

## Step 5: Install Dependencies & Build
Navigate to your project folder:
```bash
cd /var/www/project-showcase
```

Install dependencies:
```bash
npm install
```

Create your `.env.local` file:
```bash
nano .env.local
```
Paste your environment variables (from your local `.env.local`):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
# ... other variables
```
Press `Ctrl+X`, then `Y`, then `Enter` to save.

Build the application:
```bash
npm run build
```

## Step 6: Start the App with PM2
Start the application using the configuration file we created:
```bash
pm2 start ecosystem.config.js
```

Save the PM2 list so it restarts on reboot:
```bash
pm2 save
pm2 startup
```
(Run the command displayed by `pm2 startup` if asked).

## Step 7: Setup Nginx (Reverse Proxy)
Install Nginx:
```bash
sudo apt install -y nginx
```

Create a configuration file for your site:
```bash
sudo nano /etc/nginx/sites-available/project-showcase
```

Paste the following (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/project-showcase /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Setup SSL (HTTPS)
Install Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain an SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the prompts (enter email, agree to terms).

## 🎉 Done!
Your app should now be live at `https://yourdomain.com`.

---

## Troubleshooting
*   **Check App Logs**: `pm2 logs project-showcase`
*   **Check Nginx Logs**: `sudo tail -f /var/log/nginx/error.log`
*   **Restart App**: `pm2 restart project-showcase`
