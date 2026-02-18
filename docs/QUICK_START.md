# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:8000`
- npm or yarn package manager

## Setup (Automated)

Run the setup script:

```bash
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

## Setup (Manual)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Update `.env.local` with your backend URL:**
   ```
   BACKEND_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Verify Backend Connection

Test the API endpoints:

```bash
# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "chatId": null, "includeMemory": true}'

# Test threads endpoint
curl http://localhost:3000/api/chat/threads

# Test history endpoint (replace with actual thread ID)
curl http://localhost:3000/api/chat/history/YOUR_THREAD_ID
```

## Common Issues

### Backend Connection Failed

**Error:** "Service temporarily unavailable"

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/chat/threads`
2. Check `BACKEND_URL` in `.env.local`
3. Ensure no firewall blocking localhost connections

### CORS Errors

**Solution:** The Next.js API routes act as a proxy, so CORS should not be an issue. If you see CORS errors, ensure you're calling `/api/chat` not `http://localhost:8000/chat` directly from the frontend.

### Thread Not Found

**Error:** 404 when loading chat history

**Solution:** Ensure the thread ID exists in your backend. Check available threads with:
```bash
curl http://localhost:8000/chat/threads
```

## Development Workflow

1. **Start backend server** (port 8000)
2. **Start frontend server** (port 3000)
3. **Make changes** to frontend code
4. **Hot reload** will automatically update the browser
5. **Run tests** with `npm test`

## API Integration Flow

```
User Action → ChatContext → Next.js API Route → Backend API → Response
                ↓                                                  ↓
           UI Update ← Transform Data ← Next.js API Route ← Backend
```

## Next Steps

- Read [API Integration Documentation](./API_INTEGRATION.md) for detailed API info
- Explore the codebase starting with `app/page.tsx`
- Check out `contexts/ChatContext.tsx` for state management
- Review `components/chat/ChatInterface.tsx` for UI structure

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

## Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

The production build will be optimized and ready for deployment.
