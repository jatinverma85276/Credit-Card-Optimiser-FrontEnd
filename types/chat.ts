// Chat system type definitions

export interface MessageComponent {
  type: 'credit-card' | 'comparison-grid';
  data: any; // Will be CreditCardData | ComparisonData
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  components?: MessageComponent[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextValue {
  // State
  messages: Message[];
  currentChatId: string | null;
  isIncognito: boolean;
  sidebarOpen: boolean;
  isLoading: boolean;
  memoryLoaded: boolean;
  apiError: string | null;
  storageWarning: string | null;
  chats: {
    [chatId: string]: {
      id: string;
      title: string;
      messages: Message[];
      createdAt: string;
      updatedAt: string;
    }
  };
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  createNewChat: () => void;
  loadChat: (chatId: string) => void;
  toggleIncognito: () => void;
  toggleSidebar: () => void;
  uploadAttachment: (file: File) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  clearError: () => void;
  deleteChat: (chatId: string) => Promise<boolean>;
}
