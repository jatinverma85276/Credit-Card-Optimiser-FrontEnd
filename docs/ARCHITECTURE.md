# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│                      http://localhost:3000                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   UI Layer   │        │ Context API  │        │  API Routes  │
│              │        │              │        │   (Proxy)    │
│ - Components │◄──────►│ ChatContext  │◄──────►│              │
│ - Pages      │        │              │        │ /api/chat    │
│ - Hooks      │        │ State Mgmt   │        │ /api/threads │
└──────────────┘        └──────────────┘        └──────┬───────┘
                                                        │
                                                        │ HTTP
                                                        │
                                                        ▼
                                        ┌───────────────────────┐
                                        │   Backend API         │
                                        │   localhost:8000      │
                                        │                       │
                                        │ POST /chat            │
                                        │ GET  /chat/threads    │
                                        │ GET  /chat/history/:id│
                                        └───────────────────────┘
```

## Data Flow

### 1. Sending a Message

```
User Input
    │
    ▼
ChatInterface Component
    │
    ▼
ChatContext.sendMessage()
    │
    ▼
POST /api/chat (Next.js API Route)
    │
    ▼
POST http://localhost:8000/chat (Backend)
    │
    ▼
Response flows back up
    │
    ▼
UI Updates with new message
```

### 2. Loading Chat History

```
User clicks thread
    │
    ▼
Sidebar Component
    │
    ▼
ChatContext.loadChat(threadId)
    │
    ├─► Check in-memory cache
    │   └─► If found, use cached data
    │
    └─► If not cached:
        │
        ▼
    GET /api/chat/history/[threadId]
        │
        ▼
    GET http://localhost:8000/chat/history/{threadId}
        │
        ▼
    Transform response
        │
        ▼
    Update cache and UI
```

### 3. Loading Threads on Startup

```
App Initialization
    │
    ▼
ChatContext useEffect()
    │
    ├─► Load from localStorage (offline support)
    │
    └─► Fetch from backend:
        │
        ▼
    GET /api/chat/threads
        │
        ▼
    GET http://localhost:8000/chat/threads
        │
        ▼
    Transform and merge with local data
        │
        ▼
    Update sidebar with thread list
```

## Component Hierarchy

```
App
└── ChatProvider (Context)
    └── ChatInterface
        ├── Sidebar
        │   ├── NewChatButton
        │   ├── RecentStrategies (Thread List)
        │   └── IncognitoToggle
        │
        └── Main Chat Area
            ├── EmptyState (when no messages)
            │   └── PresetPrompts
            │
            ├── MessageStream (when messages exist)
            │   └── Message Components
            │       ├── User Messages
            │       └── AI Messages
            │           ├── Text Content
            │           └── Rich Components
            │               ├── CreditCardComponent
            │               └── ComparisonGrid
            │
            └── InputZone
                ├── AutoExpandingTextarea
                └── Action Buttons
```

## State Management

### ChatContext State

```typescript
{
  // Current conversation
  messages: Message[],
  currentChatId: string | null,
  
  // UI state
  isLoading: boolean,
  sidebarOpen: boolean,
  
  // Features
  isIncognito: boolean,
  memoryLoaded: boolean,
  
  // Error handling
  apiError: string | null,
  storageWarning: string | null,
  
  // All conversations
  chats: {
    [chatId: string]: {
      id: string,
      title: string,
      messages: Message[],
      createdAt: string,
      updatedAt: string
    }
  }
}
```

### Data Persistence

```
┌─────────────────┐
│  In-Memory      │  ← Fastest, cleared on refresh
│  Cache          │
│  (5 recent)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  localStorage   │  ← Persists across sessions
│  (All chats)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │  ← Source of truth
│  (Database)     │
└─────────────────┘
```

## API Route Architecture

### Next.js API Routes (Proxy Layer)

```
/api/chat/route.ts
├── Validates request
├── Transforms frontend → backend format
├── Calls backend API
├── Transforms backend → frontend format
└── Returns response

/api/chat/threads/route.ts
├── Calls backend /chat/threads
├── Handles errors
└── Returns thread list

/api/chat/history/[threadId]/route.ts
├── Extracts threadId from URL
├── Calls backend /chat/history/{threadId}
├── Handles 404 errors
└── Returns chat history
```

### Why Use API Routes as Proxy?

1. **CORS Handling**: Avoids cross-origin issues
2. **Error Handling**: Centralized error management
3. **Data Transformation**: Convert between formats
4. **Security**: Hide backend URL from client
5. **Caching**: Can add caching layer if needed
6. **Rate Limiting**: Can add rate limiting
7. **Logging**: Centralized request logging

## Error Handling Strategy

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Try API Call   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
Success    Failure
    │         │
    ▼         ▼
┌────────┐ ┌──────────────┐
│Update  │ │ Set apiError │
│UI      │ │ Show banner  │
└────────┘ │ Store failed │
           │ message      │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │ User can:    │
           │ - Retry      │
           │ - Dismiss    │
           └──────────────┘
```

## Performance Optimizations

1. **In-Memory Cache**: 5 most recent conversations cached
2. **Debounced Saves**: localStorage writes debounced by 500ms
3. **Lazy Loading**: Chat history loaded on-demand
4. **Request Deduplication**: Prevents duplicate API calls
5. **Optimistic Updates**: UI updates before API confirmation

## Security Considerations

1. **Environment Variables**: Backend URL not exposed to client
2. **API Proxy**: All backend calls go through Next.js API routes
3. **Input Validation**: Request validation in API routes
4. **Error Messages**: Generic errors shown to users
5. **Timeout Handling**: All requests have timeouts

## Testing Strategy

```
Unit Tests
├── Component Tests (Vitest + React Testing Library)
├── Hook Tests (useChatApi, useChat)
└── Utility Tests (apiClient)

Integration Tests
├── API Route Tests (Mock fetch)
└── Chat Flow Tests (End-to-end user flows)

Manual Testing
├── Backend Connection
├── Thread Loading
├── Message Sending
└── Error Scenarios
```

## Deployment Considerations

### Environment Variables

```bash
# Development
BACKEND_URL=http://localhost:8000

# Production
BACKEND_URL=https://api.yourdomain.com
```

### Build Process

```bash
npm run build  # Creates optimized production build
npm start      # Runs production server
```

### Monitoring

- Check API route logs for errors
- Monitor backend API response times
- Track localStorage usage
- Monitor error rates in production
