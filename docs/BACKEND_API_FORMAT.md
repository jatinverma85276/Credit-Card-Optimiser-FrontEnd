# Backend API Response Format

This document describes the actual response format from your backend API.

## Endpoints

### 1. GET /chat/threads

Returns all conversation threads.

**Request:**
```bash
curl http://localhost:8000/chat/threads
```

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

**Field Mapping:**
- `threads` - Array of thread objects
- `count` - Total number of threads
- `thread_id` - Unique identifier for the thread
- `thread_name` - Display name for the thread (shown in sidebar)
- `created_at` - ISO timestamp when thread was created
- `updated_at` - ISO timestamp when thread was last updated

### 2. POST /chat

Send a message to the chat API.

**Request:**
```bash
curl --location 'http://localhost:8000/chat' \
  --header 'Content-Type: application/json' \
  --data '{
    "message": "Who is varun",
    "thread_id": "2bcb1417-4d7e-4540-b44f-933993266dca"
  }'
```

**Request Body:**
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

**Field Mapping:**
- `message` - User's message text
- `thread_id` - Thread ID (can be null for new conversations)
- `response` - AI's response text
- `thread_id` (response) - Thread ID (may be newly created)

### 3. GET /chat/history/{thread_id}

Get message history for a specific thread.

**Request:**
```bash
curl http://localhost:8000/chat/history/2bcb1417-4d7e-4540-b44f-933993266dca
```

**Response:**
```json
{
  "thread_id": "2bcb1417-4d7e-4540-b44f-933993266dca",
  "thread_name": "Chat about Varun",
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "Who is varun",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "id": "msg-2",
      "role": "assistant",
      "content": "Response here",
      "timestamp": "2024-01-01T00:00:01Z"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:01Z"
}
```

**Field Mapping:**
- `thread_id` - Thread identifier
- `thread_name` - Thread display name
- `messages` - Array of message objects
  - `id` - Message identifier
  - `role` - Either "user" or "assistant"
  - `content` - Message text
  - `timestamp` - ISO timestamp
- `created_at` - Thread creation timestamp
- `updated_at` - Thread last update timestamp

## Frontend Transformation

The frontend transforms backend responses to match internal data structures:

### Threads Transformation

**Backend → Frontend:**
```javascript
// Backend
{
  "threads": [{
    "thread_id": "abc-123",
    "thread_name": "My Chat",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:01Z"
  }],
  "count": 1
}

// Frontend (ChatContext)
{
  "abc-123": {
    id: "abc-123",
    title: "My Chat",
    messages: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:01Z"
  }
}
```

### Message Transformation

**Backend → Frontend:**
```javascript
// Backend
{
  message: "Hello",
  thread_id: "abc-123"
}

// Frontend
{
  chatId: "abc-123",
  message: "Hello",
  includeMemory: true
}
```

## Data Types

### TypeScript Interfaces

```typescript
// Backend Thread Response
interface ThreadsResponse {
  threads: Thread[];
  count: number;
}

interface Thread {
  thread_id: string;
  thread_name?: string;
  created_at?: string;
  updated_at?: string;
}

// Backend Chat Response
interface ChatResponse {
  response: string;
  thread_id: string;
}

// Backend History Response
interface HistoryResponse {
  thread_id: string;
  thread_name?: string;
  messages: Message[];
  created_at?: string;
  updated_at?: string;
}

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}
```

## Testing

Test the actual backend responses:

```bash
# Get threads
curl http://localhost:8000/chat/threads

# Send message
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "thread_id": null}'

# Get history
curl http://localhost:8000/chat/history/YOUR_THREAD_ID
```

## Notes

1. **thread_name vs title**: Backend uses `thread_name`, frontend uses `title` internally
2. **Wrapper object**: Threads endpoint returns `{threads: [...], count: n}` not just an array
3. **Timestamps**: Backend uses ISO 8601 format with timezone info
4. **Thread ID**: Can be null when creating a new conversation
5. **Message roles**: Backend may use "human"/"ai" or "user"/"assistant" - frontend normalizes to "user"/"assistant"

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message here",
  "detail": "Additional error details"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
