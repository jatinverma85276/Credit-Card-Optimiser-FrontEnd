import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SignupRequest;

    // Validate request
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Call backend signup API using axios
    const backendResponse = await axios.post(
      `${BACKEND_URL}/auth/signup`,
      {
        name: body.name,
        email: body.email,
        password: body.password
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    return NextResponse.json(backendResponse.data, { status: 201 });

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
          { error: error.response.data?.error || error.response.data?.detail || 'Signup failed' },
          { status: error.response.status }
        );
      }
    }

    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
