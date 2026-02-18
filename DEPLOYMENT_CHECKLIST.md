# Deployment Checklist

## Pre-Deployment

### 1. Environment Setup
- [ ] Create `.env.local` file
- [ ] Set `BACKEND_URL` to your backend API URL
- [ ] Verify backend is accessible from frontend server

### 2. Dependencies
- [ ] Run `npm install` to install all dependencies
- [ ] Verify no security vulnerabilities: `npm audit`
- [ ] Update dependencies if needed: `npm update`

### 3. Testing
- [ ] Run all tests: `npm test`
- [ ] Verify API integration tests pass
- [ ] Test manually with backend running
- [ ] Test error scenarios (backend down, network issues)

### 4. Build
- [ ] Create production build: `npm run build`
- [ ] Verify build completes without errors
- [ ] Check build output size
- [ ] Test production build locally: `npm start`

## Backend Integration Verification

### 1. API Endpoints
- [ ] Test POST /api/chat
  ```bash
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "test", "chatId": null, "includeMemory": true}'
  ```

- [ ] Test GET /api/chat/threads
  ```bash
  curl http://localhost:3000/api/chat/threads
  ```

- [ ] Test GET /api/chat/history/[threadId]
  ```bash
  curl http://localhost:3000/api/chat/history/YOUR_THREAD_ID
  ```

### 2. Data Flow
- [ ] Send a message and verify it reaches backend
- [ ] Load threads and verify they display in sidebar
- [ ] Click a thread and verify history loads
- [ ] Create new chat and verify thread_id is generated
- [ ] Test incognito mode (no backend calls)

### 3. Error Handling
- [ ] Stop backend and verify error banner appears
- [ ] Test retry functionality
- [ ] Verify error messages are user-friendly
- [ ] Test timeout scenarios

## Production Deployment

### 1. Environment Variables
- [ ] Set production `BACKEND_URL` in hosting platform
- [ ] Verify environment variables are loaded correctly
- [ ] Test with production backend URL

### 2. Hosting Platform Setup
Choose your platform and follow their guide:

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add BACKEND_URL
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard
```

#### Custom Server
```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "swipesmart" -- start

# Or with systemd
sudo systemctl start swipesmart
```

### 3. Post-Deployment Verification
- [ ] Visit production URL
- [ ] Test sending messages
- [ ] Test loading threads
- [ ] Test loading chat history
- [ ] Check browser console for errors
- [ ] Verify API calls go to correct backend
- [ ] Test on mobile devices
- [ ] Test on different browsers

## Monitoring

### 1. Setup Monitoring
- [ ] Configure error tracking (Sentry, LogRocket, etc.)
- [ ] Setup uptime monitoring
- [ ] Configure performance monitoring
- [ ] Setup API response time tracking

### 2. Logging
- [ ] Verify API route logs are accessible
- [ ] Setup log aggregation if needed
- [ ] Configure log retention policy

### 3. Alerts
- [ ] Setup alerts for API errors
- [ ] Setup alerts for high error rates
- [ ] Setup alerts for slow response times

## Performance Optimization

### 1. Frontend
- [ ] Enable Next.js image optimization
- [ ] Configure caching headers
- [ ] Enable compression
- [ ] Optimize bundle size

### 2. API Routes
- [ ] Add response caching if appropriate
- [ ] Configure timeout values
- [ ] Add rate limiting if needed

### 3. Backend Communication
- [ ] Verify backend response times are acceptable
- [ ] Consider adding CDN for static assets
- [ ] Optimize API payload sizes

## Security

### 1. Environment Variables
- [ ] Never commit `.env.local` to git
- [ ] Use secure methods to set production env vars
- [ ] Rotate secrets regularly

### 2. API Security
- [ ] Verify CORS settings on backend
- [ ] Add rate limiting if needed
- [ ] Implement authentication if required
- [ ] Validate all user inputs

### 3. Dependencies
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Keep dependencies up to date
- [ ] Review dependency licenses

## Rollback Plan

### 1. Preparation
- [ ] Document current production version
- [ ] Keep previous build artifacts
- [ ] Have rollback procedure documented

### 2. Rollback Steps
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# Custom server
pm2 restart swipesmart@previous
```

## Documentation

### 1. User Documentation
- [ ] Create user guide if needed
- [ ] Document known issues
- [ ] Create FAQ

### 2. Developer Documentation
- [ ] Update README with production setup
- [ ] Document deployment process
- [ ] Document troubleshooting steps

## Post-Launch

### 1. Monitoring
- [ ] Monitor error rates for first 24 hours
- [ ] Check API response times
- [ ] Monitor user feedback

### 2. Optimization
- [ ] Review performance metrics
- [ ] Optimize based on real usage
- [ ] Address any issues found

### 3. Maintenance
- [ ] Schedule regular dependency updates
- [ ] Plan for feature additions
- [ ] Setup backup procedures

## Quick Reference

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm test            # Run tests
npm run lint        # Run linter
```

### Production
```bash
npm run build       # Build for production
npm start           # Start production server
```

### Environment Variables
```bash
# .env.local (development)
BACKEND_URL=http://localhost:8000

# Production
BACKEND_URL=https://api.yourdomain.com
```

### Testing Endpoints
```bash
# Chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "chatId": null, "includeMemory": true}'

# Threads
curl http://localhost:3000/api/chat/threads

# History
curl http://localhost:3000/api/chat/history/THREAD_ID
```

## Support Contacts

- Frontend Issues: [Your contact]
- Backend Issues: [Backend team contact]
- Infrastructure: [DevOps contact]
- Emergency: [On-call contact]

---

**Last Updated**: [Date]
**Version**: 1.0.0
**Status**: Ready for deployment
