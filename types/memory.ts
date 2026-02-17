// Memory system type definitions

import { Message } from './chat';

export interface MemoryContext {
  userPreferences: {
    spendingCategories: string[];
    preferredCards: string[];
  };
  conversationSummary: string;
  relevantFacts: string[];
}

export interface ChatStorage {
  chats: {
    [chatId: string]: {
      id: string;
      title: string;
      messages: Message[];
      createdAt: string;
      updatedAt: string;
    }
  };
  currentChatId: string | null;
  userPreferences: {
    incognitoMode: boolean;
    spendingCategories: string[];
    preferredCards: string[];
  };
}
