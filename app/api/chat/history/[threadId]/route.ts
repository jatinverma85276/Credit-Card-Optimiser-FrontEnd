import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const { threadId } = params;

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      );
    }

    // Call backend chat history API using axios
    const backendResponse = await axios.get(
      `${BACKEND_URL}/chat/history/${threadId}`,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    return NextResponse.json(backendResponse.data, { status: 200 });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 408 }
        );
      }
      
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Thread not found' },
          { status: 404 }
        );
      }
    }

    console.error('Chat history API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
