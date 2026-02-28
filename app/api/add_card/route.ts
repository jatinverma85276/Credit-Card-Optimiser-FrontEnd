import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface AddCardRequest {
  bank_name: string;
  card_name: string;
  user_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AddCardRequest;

    // Validate request
    if (!body.bank_name || !body.card_name || !body.user_id) {
      return NextResponse.json(
        { error: 'Bank name, card name, and user ID are required' },
        { status: 400 }
      );
    }

    // Call backend add_card API using axios
    const backendResponse = await axios.post(
      `${BACKEND_URL}/add_card`,
      {
        bank_name: body.bank_name,
        card_name: body.card_name,
        user_id: body.user_id
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 240000 // 4 minutes
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
      
      if (error.response) {
        return NextResponse.json(
          { error: error.response.data?.error || error.response.data?.detail || 'Failed to add card' },
          { status: error.response.status }
        );
      }
    }

    console.error('Add card API error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
