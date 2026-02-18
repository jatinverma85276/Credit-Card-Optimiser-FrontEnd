import { NextRequest, NextResponse } from 'next/server';

interface MemoryContext {
  userPreferences: {
    spendingCategories: string[];
    preferredCards: string[];
  };
  conversationSummary: string;
  relevantFacts: string[];
}

interface MemoryResponse {
  context: MemoryContext;
  relevantChats: string[];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Extract chatId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const chatId = searchParams.get('chatId');

    // If no chatId provided, return empty context (silent fallback)
    if (!chatId) {
      const emptyResponse: MemoryResponse = {
        context: {
          userPreferences: {
            spendingCategories: [],
            preferredCards: [],
          },
          conversationSummary: '',
          relevantFacts: [],
        },
        relevantChats: [],
      };
      return NextResponse.json(emptyResponse, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    // TODO: In a real implementation, this would retrieve memory from a database
    // For now, we'll return a mock response
    const mockResponse: MemoryResponse = {
      context: {
        userPreferences: {
          spendingCategories: ['travel', 'dining'],
          preferredCards: ['Amex Platinum'],
        },
        conversationSummary: 'User is interested in travel rewards and premium dining experiences.',
        relevantFacts: [
          'Previously asked about travel credit cards',
          'Prefers cards with lounge access',
        ],
      },
      relevantChats: [chatId],
    };

    return NextResponse.json(mockResponse, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error: unknown) {
    // Silent fallback - return empty context instead of error
    console.error('Memory API error (silent fallback):', error);
    
    const fallbackResponse: MemoryResponse = {
      context: {
        userPreferences: {
          spendingCategories: [],
          preferredCards: [],
        },
        conversationSummary: '',
        relevantFacts: [],
      },
      relevantChats: [],
    };

    return NextResponse.json(fallbackResponse, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
}
