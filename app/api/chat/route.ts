import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Helper to generate UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface ChatRequest {
  message: string;
  chatId: string | null;
  includeMemory: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  components?: MessageComponent[];
}

interface MessageComponent {
  type: 'credit-card' | 'comparison-grid';
  data: Record<string, unknown>;
}

interface ChatResponse {
  message: Message;
  memoryUsed: boolean;
  threadId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest;

    // Validate request
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Call backend chat API using axios
    const backendResponse = await axios.post(
      `${BACKEND_URL}/chat`,
      {
        message: body.message,
        thread_id: body.chatId || generateUUID()
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const backendData = backendResponse.data;

    // Extract thread_id from backend response if available
    const threadId = backendData.thread_id || body.chatId;

    // Transform backend response to frontend format
    const responseMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: backendData.response || backendData.message || 'No response',
      timestamp: new Date(),
    };

    const response: ChatResponse = {
      message: responseMessage,
      memoryUsed: body.includeMemory,
      threadId: threadId, // Include thread_id in response
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 408 }
        );
      }
      
      if (error.response) {
        return NextResponse.json(
          { error: error.response.data?.error || 'Backend error' },
          { status: error.response.status }
        );
      }
    }

    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
