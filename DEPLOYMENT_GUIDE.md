# SwipeSmart Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended for Next.js)

#### Step 1: Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy to Vercel

**Method A: Using Vercel Dashboard (Easiest)**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub/GitLab/Bitbucket
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add Environment Variable:
   - Key: `BACKEND_URL`
   - Value: Your backend API URL (e.g., `https://api.yourdomain.com`)
7. Click "Deploy"

**Method B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? swipesmart (or your choice)
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add BACKEND_URL production
# Enter your backend URL when prompted

# Deploy to production
vercel --prod
```

#### Step 3: Verify Deployment
1. Visit the deployment URL provided by Vercel
2. Test the application:
   - Send a chat message
   - Add a card
   - View manage cards modal
3. Check browser console for errors
4. Verify API calls are working

---

### Option 2: Netlify

#### Step 1: Create netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

#### Step 2: Deploy

**Using Netlify Dashboard:**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider
4. Select your repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add Environment Variable:
   - Key: `BACKEND_URL`
   - Value: Your backend API URL
7. Click "Deploy site"

**Using Netlify CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod

# Set environment variable
netlify env:set BACKEND_URL "https://api.yourdomain.com"
```

---

### Option 3: Docker + Cloud Platform

#### Step 1: Create Dockerfile
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Step 2: Update next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

#### Step 3: Build and Deploy
```bash
# Build Docker image
docker build -t swipesmart .

# Run locally to test
docker run -p 3000:3000 -e BACKEND_URL=http://localhost:8000 swipesmart

# Push to container registry (example: Docker Hub)
docker tag swipesmart yourusername/swipesmart:latest
docker push yourusername/swipesmart:latest

# Deploy to your cloud platform (AWS ECS, Google Cloud Run, etc.)
```

---

### Option 4: VPS/Custom Server

#### Step 1: Setup Server
```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt-get install nginx
```

#### Step 2: Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/swipesmart.git
cd swipesmart

# Install dependencies
npm install

# Create .env.local
echo "BACKEND_URL=http://localhost:8000" > .env.local

# Build
npm run build

# Start with PM2
pm2 start npm --name "swipesmart" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Step 3: Configure Nginx
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/swipesmart
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/swipesmart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Environment Variables

### Required Variables
- `BACKEND_URL`: Your backend API URL

### Setting Environment Variables

**Vercel:**
```bash
vercel env add BACKEND_URL production
```

**Netlify:**
```bash
netlify env:set BACKEND_URL "https://api.yourdomain.com"
```

**Docker:**
```bash
docker run -e BACKEND_URL=https://api.yourdomain.com swipesmart
```

**PM2:**
```bash
# Create ecosystem.config.js
module.exports = {
  apps: [{
    name: 'swipesmart',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      BACKEND_URL: 'https://api.yourdomain.com'
    }
  }]
}

# Start with config
pm2 start ecosystem.config.js
```

---

## Pre-Deployment Checklist

### 1. Code Quality
- [ ] All tests passing: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

### 2. Environment Setup
- [ ] Backend URL configured
- [ ] Backend is accessible from deployment server
- [ ] CORS configured on backend to allow frontend domain

### 3. Testing
- [ ] Test locally with production build: `npm start`
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test add card functionality
- [ ] Test manage cards modal
- [ ] Test chat functionality

### 4. Security
- [ ] `.env.local` not committed to git
- [ ] Sensitive data not in code
- [ ] Dependencies updated: `npm audit fix`

---

## Post-Deployment Verification

### 1. Functional Testing
```bash
# Test chat endpoint
curl -X POST https://yourdomain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "chatId": null, "includeMemory": true, "incognito": false}'

# Test add card endpoint
curl -X POST https://yourdomain.com/api/add_card \
  -H "Content-Type: application/json" \
  -d '{"bank_name": "HDFC Bank", "card_name": "Regalia Gold", "user_id": "test_user"}'

# Test user cards endpoint
curl https://yourdomain.com/api/user/test_user/cards
```

### 2. Browser Testing
- [ ] Open application in browser
- [ ] Check browser console for errors
- [ ] Test login/signup
- [ ] Send chat messages
- [ ] Add a card
- [ ] View cards in manage modal
- [ ] Test on mobile device
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### 3. Performance
- [ ] Check page load time
- [ ] Verify API response times
- [ ] Check Lighthouse score
- [ ] Monitor memory usage

---

## Monitoring & Maintenance

### Setup Monitoring (Optional but Recommended)

**Vercel Analytics:**
- Automatically enabled on Vercel
- View in Vercel dashboard

**Sentry for Error Tracking:**
```bash
npm install @sentry/nextjs

# Follow Sentry setup wizard
npx @sentry/wizard@latest -i nextjs
```

**Uptime Monitoring:**
- Use services like UptimeRobot, Pingdom, or StatusCake
- Monitor: https://yourdomain.com

### Regular Maintenance
```bash
# Update dependencies monthly
npm update
npm audit fix

# Rebuild and redeploy
npm run build
vercel --prod  # or your deployment method
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### API Calls Failing
1. Check `BACKEND_URL` environment variable
2. Verify backend is accessible from deployment server
3. Check CORS settings on backend
4. Check browser console for error details

### 404 Errors
1. Verify all API routes exist in `app/api/` directory
2. Check Next.js routing configuration
3. Clear deployment cache and redeploy

### Slow Performance
1. Enable Next.js caching
2. Optimize images
3. Check backend response times
4. Consider CDN for static assets

---

## Rollback Procedure

**Vercel:**
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

**Netlify:**
```bash
# Rollback via dashboard or CLI
netlify rollback
```

**PM2:**
```bash
# Checkout previous version
git checkout [previous-commit]
npm install
npm run build
pm2 restart swipesmart
```

---

## Support

For deployment issues:
1. Check deployment logs
2. Review error messages
3. Verify environment variables
4. Test backend connectivity
5. Check CORS configuration

---

**Last Updated**: 2024
**Deployment Status**: Ready for Production
