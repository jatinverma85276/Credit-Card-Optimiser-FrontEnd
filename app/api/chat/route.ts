import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

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
        thread_id: body.chatId
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const backendData = backendResponse.data;

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
