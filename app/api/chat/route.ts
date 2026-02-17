import { NextRequest, NextResponse } from 'next/server';

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
    // Parse request body with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000);
    });

    const bodyPromise = request.json();
    const body = await Promise.race([bodyPromise, timeoutPromise]) as ChatRequest;

    // Validate request
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // TODO: In a real implementation, this would call an AI service
    // For now, we'll return a mock response
    const responseMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `This is a mock response to: "${body.message}". In production, this would be replaced with actual AI-generated content.`,
      timestamp: new Date(),
    };

    const response: ChatResponse = {
      message: responseMessage,
      memoryUsed: body.includeMemory,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: unknown) {
    // Handle different error types
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : '';
    
    if (errorMessage === 'Request timeout') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 408 }
      );
    }

    if (errorName === 'SyntaxError') {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Network or server errors
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
