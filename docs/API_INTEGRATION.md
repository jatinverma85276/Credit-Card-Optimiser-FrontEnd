# Backend API Integration

This document describes how the frontend integrates with the backend chat API.

## Environment Setup

Create a `.env.local` file in the root directory:

```bash
BACKEND_URL=http://localhost:8000
```

## API Endpoints

### 1. Send Message (Chat)

**Backend Endpoint:** `POST http://localhost:8000/chat`

**Frontend Proxy:** `POST /api/chat`

**Request:**
```json
{
  "message": "Who is varun",
  "thread_id": "2bcb1417-4d7e-4540-b44f-933993266dca"
}
```

**Response:**
```json
{
  "response": "AI response here",
  "thread_id": "2bcb1417-4d7e-4540-b44f-933993266dca"
}
```

### 2. Get Chat History

**Backend Endpoint:** `GET http://localhost:8000/chat/history/{thread_id}`

**Frontend Proxy:** `GET /api/chat/history/[threadId]`

**Response:**
```json
{
  "thread_id": "2bcb1417-4d7e-4540-b44f-933993266dca",
  "title": "Chat Title",
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "content": "Who is varun",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "content": "Response here",
      "timestamp": "2024-01-01T00:00:01Z"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:01Z"
}
```

### 3. Get All Threads

**Backend Endpoint:** `GET http://localhost:8000/chat/threads`

**Frontend Proxy:** `GET /api/chat/threads`

**Response:**
```json
{
  "threads": [
    {
      "thread_id": "0eb0a7a3-9c15-4c9a-b6fd-c3db081eec6e",
      "thread_name": "Who are you",
      "created_at": "2026-02-18T13:37:49.447104+05:30",
      "updated_at": "2026-02-18T13:37:49.447104+05:30"
    }
  ],
  "count": 1
}
```

## Usage in Frontend

### Using the Chat Context

```typescript
import { useChat } from '@/contexts/ChatContext';

function MyComponent() {
  const { sendMessage, messages, loadChat } = useChat();
  
  // Send a message
  await sendMessage("Who is varun");
  
  // Load a specific chat thread
  await loadChat("2bcb1417-4d7e-4540-b44f-933993266dca");
}
```

### Using the Chat API Hook

```typescript
import { useChatApi } from '@/hooks/useChatApi';

function MyComponent() {
  const { fetchThreads, fetchChatHistory, sendMessage } = useChatApi();
  
  // Get all threads
  const threads = await fetchThreads();
  
  // Get chat history
  const history = await fetchChatHistory("thread-id");
  
  // Send message
  const response = await sendMessage("Hello", "thread-id");
}
```

## Implementation Details

### API Proxy Layer

The frontend uses Next.js API routes as a proxy layer to:
- Handle CORS issues
- Add error handling and retry logic
- Transform data between backend and frontend formats
- Manage timeouts and loading states

### Data Flow

1. User sends message via `ChatContext.sendMessage()`
2. Frontend calls `/api/chat` (Next.js API route)
3. Next.js API route proxies to `http://localhost:8000/chat`
4. Backend processes and returns response
5. Frontend transforms and displays the response

### Thread Management

- Threads are loaded from backend on app initialization
- Chat history is fetched on-demand when user selects a thread
- Messages are cached in memory for performance
- LocalStorage is used as fallback for offline support

## Error Handling

The integration includes comprehensive error handling:
- Network timeouts (30s for chat, 10s for history/threads)
- Backend unavailability
- Invalid responses
- Rate limiting

## Testing

Test the integration with curl:

```bash
# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Who is varun", "chatId": "2bcb1417-4d7e-4540-b44f-933993266dca", "includeMemory": true}'

# Test history endpoint
curl http://localhost:3000/api/chat/history/2bcb1417-4d7e-4540-b44f-933993266dca

# Test threads endpoint
curl http://localhost:3000/api/chat/threads
```
