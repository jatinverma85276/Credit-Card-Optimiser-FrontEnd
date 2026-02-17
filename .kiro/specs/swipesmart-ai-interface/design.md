# Design Document: SwipeSmart AI Financial Strategist Interface

## Overview

SwipeSmart is a Next.js 14 application built with the App Router architecture, providing an AI-powered chat interface for credit card optimization and financial strategy. The system follows a component-based architecture with clear separation between UI presentation, state management, and business logic.

The application uses a "Fintech meets Cyberpunk" aesthetic with deep slate backgrounds (bg-slate-950), neon emerald accents (#10b981) for success states, and indigo hues (#6366f1) for AI elements. Typography uses Inter or Plus Jakarta Sans fonts for modern readability.

Key architectural decisions:
- **Mobile-first responsive design**: All components designed for mobile screens first, then enhanced for larger viewports
- **React Context API for state**: Lightweight state management suitable for the application's scope
- **Framer Motion for animations**: Declarative animation library for smooth transitions
- **TypeScript throughout**: Type safety for maintainability and developer experience
- **Component composition**: Reusable, atomic components that compose into complex features

## Architecture

### Application Structure

```
app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Home page (chat interface)
├── api/
│   ├── chat/route.ts         # Chat API endpoint
│   └── memory/route.ts       # Memory management endpoint
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageStream.tsx
│   │   ├── Message.tsx
│   │   ├── EmptyState.tsx
│   │   └── PresetPrompt.tsx
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── NewChatButton.tsx
│   │   ├── RecentStrategies.tsx
│   │   └── IncognitoToggle.tsx
│   ├── input/
│   │   ├── InputZone.tsx
│   │   ├── AutoExpandingTextarea.tsx
│   │   └── AttachmentButton.tsx
│   ├── financial/
│   │   ├── CreditCardComponent.tsx
│   │   ├── ComparisonGrid.tsx
│   │   └── RewardBadge.tsx
│   ├── ui/
│   │   ├── MemoryToast.tsx
│   │   └── Button.tsx
│   └── providers/
│       └── ChatProvider.tsx
├── contexts/
│   └── ChatContext.tsx
├── hooks/
│   ├── useChat.ts
│   ├── useSidebar.ts
│   └── useMemory.ts
├── lib/
│   ├── markdown.ts
│   └── typewriter.ts
└── types/
    ├── chat.ts
    ├── card.ts
    └── memory.ts
```

### Data Flow

1. **User Input Flow**:
   - User types in InputZone → ChatContext updates → API call to /api/chat
   - Response streams back → MessageStream updates with typewriter effect
   - Context saved to memory (if not incognito)

2. **Memory Flow**:
   - Previous conversations stored in browser localStorage
   - On new message, relevant context retrieved from /api/memory
   - MemoryToast displayed when context is loaded
   - Context injected into AI prompt

3. **State Management Flow**:
   - ChatContext holds: messages, currentChatId, isIncognito, sidebarOpen
   - Context provides actions: sendMessage, createNewChat, loadChat, toggleIncognito
   - Components consume context via useChat hook

## Components and Interfaces

### Core Types

```typescript
// types/chat.ts
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  components?: MessageComponent[];
}

interface MessageComponent {
  type: 'credit-card' | 'comparison-grid';
  data: CreditCardData | ComparisonData;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// types/card.ts
interface CreditCardData {
  name: string;
  logo: string;
  gradient: string;
  rewardRate: number;
  annualFee: number;
  features: string[];
  applyUrl?: string;
}

interface ComparisonData {
  cards: CreditCardData[];
  winner?: string; // card name
  criteria: 'rewards' | 'fees' | 'overall';
}

// types/memory.ts
interface MemoryContext {
  userPreferences: {
    spendingCategories: string[];
    preferredCards: string[];
  };
  conversationSummary: string;
  relevantFacts: string[];
}
```

### ChatContext

```typescript
interface ChatContextValue {
  // State
  messages: Message[];
  currentChatId: string | null;
  isIncognito: boolean;
  sidebarOpen: boolean;
  isLoading: boolean;
  memoryLoaded: boolean;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  createNewChat: () => void;
  loadChat: (chatId: string) => void;
  toggleIncognito: () => void;
  toggleSidebar: () => void;
  uploadAttachment: (file: File) => Promise<void>;
}
```

### ChatInterface Component

The main container component that orchestrates the chat experience.

```typescript
// components/chat/ChatInterface.tsx
export function ChatInterface() {
  const { messages, isLoading } = useChat();
  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <MessageStream messages={messages} />
        )}
        <InputZone />
      </main>
    </div>
  );
}
```

### MessageStream Component

Displays the conversation history with auto-scrolling and message rendering.

```typescript
// components/chat/MessageStream.tsx
export function MessageStream({ messages }: { messages: Message[] }) {
  const streamRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom on new messages
    streamRef.current?.scrollTo({
      top: streamRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  return (
    <div ref={streamRef} className="flex-1 overflow-y-auto px-4 py-6">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
```

### Message Component

Renders individual messages with markdown support and special components.

```typescript
// components/chat/Message.tsx
export function Message({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const showTypewriter = message.role === 'assistant' && isLatestMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mb-4 flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3",
        isUser 
          ? "bg-indigo-600 text-white" 
          : "bg-slate-800 text-slate-100"
      )}>
        {showTypewriter ? (
          <TypewriterText content={message.content} />
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
        
        {message.components?.map((component, idx) => (
          <ComponentRenderer key={idx} component={component} />
        ))}
      </div>
    </motion.div>
  );
}
```

### InputZone Component

Floating bottom bar with auto-expanding textarea and action buttons.

```typescript
// components/input/InputZone.tsx
export function InputZone() {
  const { sendMessage, isLoading, uploadAttachment } = useChat();
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!value.trim() || isLoading) return;
    await sendMessage(value);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-end gap-2 bg-slate-900 rounded-lg p-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-emerald-400"
          >
            <PaperclipIcon />
          </button>
          
          <AutoExpandingTextarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about credit cards..."
            className="flex-1"
          />
          
          <button className="p-2 text-slate-400 hover:text-indigo-400">
            <MicrophoneIcon />
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading}
            className="p-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Sidebar Component

Collapsible navigation with chat history and settings.

```typescript
// components/sidebar/Sidebar.tsx
export function Sidebar() {
  const { sidebarOpen, toggleSidebar, createNewChat } = useChat();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg"
        >
          <MenuIcon />
        </button>
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen || !isMobile ? 0 : -320,
        }}
        className={cn(
          "w-80 bg-slate-900 border-r border-slate-800 flex flex-col",
          isMobile && "fixed inset-y-0 left-0 z-40"
        )}
      >
        <div className="p-4">
          <NewChatButton onClick={createNewChat} />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <RecentStrategies />
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <IncognitoToggle />
          <UserSettings />
        </div>
      </motion.aside>
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}
```

### CreditCardComponent

Visual representation of credit card recommendations.

```typescript
// components/financial/CreditCardComponent.tsx
export function CreditCardComponent({ card }: { card: CreditCardData }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative rounded-xl p-6 overflow-hidden"
      style={{
        background: card.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Card chip */}
      <div className="absolute top-6 left-6">
        <ChipIcon className="w-12 h-8 text-yellow-400" />
      </div>
      
      {/* Card logo */}
      <div className="absolute top-6 right-6">
        <img src={card.logo} alt={card.name} className="h-8" />
      </div>
      
      {/* Card name */}
      <div className="mt-16 mb-4">
        <h3 className="text-2xl font-bold text-white">{card.name}</h3>
      </div>
      
      {/* Reward badge */}
      <RewardBadge rate={card.rewardRate} />
      
      {/* Features */}
      <ul className="mt-4 space-y-1 text-sm text-white/80">
        {card.features.slice(0, 3).map((feature, idx) => (
          <li key={idx}>• {feature}</li>
        ))}
      </ul>
      
      {/* Action button */}
      <button className="mt-6 w-full py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition">
        {card.applyUrl ? 'Apply Now' : 'View Details'}
      </button>
    </motion.div>
  );
}
```

### ComparisonGrid Component

Side-by-side comparison table for multiple cards.

```typescript
// components/financial/ComparisonGrid.tsx
export function ComparisonGrid({ data }: { data: ComparisonData }) {
  const { cards, winner } = data;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="p-3 text-left text-slate-400">Feature</th>
            {cards.map((card) => (
              <th key={card.name} className="p-3 text-left">
                <div className="flex items-center gap-2">
                  <img src={card.logo} alt={card.name} className="h-6" />
                  <span className="text-white">{card.name}</span>
                  {winner === card.name && (
                    <span className="text-emerald-400">👑</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-800">
            <td className="p-3 text-slate-400">Reward Rate</td>
            {cards.map((card) => (
              <td key={card.name} className={cn(
                "p-3",
                winner === card.name && "text-emerald-400 font-bold"
              )}>
                {card.rewardRate}%
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-800">
            <td className="p-3 text-slate-400">Annual Fee</td>
            {cards.map((card) => (
              <td key={card.name} className="p-3 text-white">
                ₹{card.annualFee.toLocaleString()}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

### MemoryToast Component

Notification for long-term memory usage.

```typescript
// components/ui/MemoryToast.tsx
export function MemoryToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-indigo-600/90 backdrop-blur text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm">Context loaded from previous conversations</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Data Models

### Chat Storage Schema

Conversations are stored in browser localStorage with the following structure:

```typescript
// LocalStorage key: 'swipesmart_chats'
interface ChatStorage {
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
```

### Memory Context Schema

Memory context is built from previous conversations and stored temporarily:

```typescript
interface MemoryContext {
  userPreferences: {
    spendingCategories: string[]; // e.g., ["travel", "dining", "shopping"]
    preferredCards: string[];      // e.g., ["Amex Platinum", "SBI Cashback"]
  };
  conversationSummary: string;     // Brief summary of recent conversations
  relevantFacts: string[];         // Key facts extracted from history
}
```

### API Request/Response Models

```typescript
// POST /api/chat
interface ChatRequest {
  message: string;
  chatId: string | null;
  includeMemory: boolean;
}

interface ChatResponse {
  message: Message;
  memoryUsed: boolean;
}

// GET /api/memory?chatId=xxx
interface MemoryResponse {
  context: MemoryContext;
  relevantChats: string[]; // IDs of relevant previous chats
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Message Alignment Consistency

*For any* message in the message stream, user messages should be right-aligned and AI messages should be left-aligned in the rendered output.

**Validates: Requirements 1.1**

### Property 2: Markdown Rendering Completeness

*For any* valid markdown string containing bold text, lists, or code blocks, the rendered output should contain the corresponding HTML elements (strong, ul/ol, pre/code).

**Validates: Requirements 1.5**

### Property 3: Preset Prompt Population

*For any* preset prompt card, clicking it should populate the input zone with the exact prompt text.

**Validates: Requirements 1.4**

### Property 4: Recent Conversations Display

*For any* list of previous conversations, the sidebar should display all conversations in the "Recent Strategies" section.

**Validates: Requirements 2.2**

### Property 5: New Chat Creation

*For any* application state, clicking "New Chat" should create a new empty conversation with a unique ID and clear the message stream.

**Validates: Requirements 2.5**

### Property 6: Conversation Loading

*For any* saved conversation, selecting it from "Recent Strategies" should load all its messages into the message stream in the correct order.

**Validates: Requirements 2.6**

### Property 7: Incognito Mode Storage Prevention

*For any* message sent while incognito mode is enabled, that message should not be persisted to localStorage or appear in conversation history after reload.

**Validates: Requirements 2.7, 6.5**

### Property 8: Textarea Auto-Expansion

*For any* text input of varying length, the textarea height should increase to accommodate the content without requiring scrolling within the textarea itself.

**Validates: Requirements 3.2, 3.5**

### Property 9: Enter Key Submission

*For any* non-empty text in the input zone, pressing Enter without Shift should submit the query and clear the input.

**Validates: Requirements 3.6**

### Property 10: Shift+Enter Newline Insertion

*For any* text in the input zone, pressing Shift+Enter should insert a newline character without submitting the query.

**Validates: Requirements 3.7**

### Property 11: Credit Card Component Completeness

*For any* credit card data object, the rendered Credit Card Component should display the gradient background, card logo, chip icon, reward rate badge, and action button.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 12: Card Action Navigation

*For any* credit card with an applyUrl, clicking "Apply Now" should trigger navigation to that URL; for cards without applyUrl, clicking "Details" should display detailed information.

**Validates: Requirements 4.5, 4.6**

### Property 13: Comparison Grid Data Display

*For any* comparison data with multiple cards, the rendered grid should display card name, reward rate, annual fee, and any additional attributes present in the data for each card.

**Validates: Requirements 5.2, 5.5**

### Property 14: Comparison Grid Table Structure

*For any* comparison data, the rendered output should be a table with cards displayed side-by-side in columns.

**Validates: Requirements 5.1**

### Property 15: Winner Highlighting

*For any* comparison data with a designated winner, that card's row should be highlighted with emerald/green styling.

**Validates: Requirements 5.3**

### Property 16: Memory Toast Display

*For any* conversation where long-term memory context is loaded, the Memory Toast notification should appear at the top of the interface.

**Validates: Requirements 6.1**

### Property 17: Data Persistence Round Trip

*For any* user preferences and conversation data saved while not in incognito mode, reloading the application should restore the same preferences and conversations.

**Validates: Requirements 6.4**

### Property 18: Mobile Sidebar Toggle

*For any* mobile viewport state, tapping the hamburger menu should toggle the sidebar visibility (hidden to visible or visible to hidden).

**Validates: Requirements 7.2**

### Property 19: Hover State Feedback

*For any* interactive element, hovering over it should trigger a visual change in color or scale.

**Validates: Requirements 8.7**

### Property 20: Conversation Load Performance

*For any* conversation in the recent history, loading it should complete within 200ms.

**Validates: Requirements 9.4**

### Property 21: Conversation Caching

*For any* recently accessed conversation, accessing it a second time should not require reloading from storage (should be served from cache).

**Validates: Requirements 9.5**

### Property 22: Keyboard Navigation Order

*For any* interactive element, pressing Tab should move focus to the next interactive element in a logical order (top to bottom, left to right).

**Validates: Requirements 10.1, 10.2**

### Property 23: Escape Key Sidebar Close

*For any* state where the sidebar is open, pressing the Escape key should close the sidebar.

**Validates: Requirements 10.3**

### Property 24: Focus Indicator Visibility

*For any* interactive element that receives keyboard focus, a visible focus indicator should be present in the rendered output.

**Validates: Requirements 10.4**

### Property 25: Screen Reader Announcements

*For any* dynamic content update (new message, toast notification), the element should have appropriate ARIA attributes (aria-live, role) for screen reader announcements.

**Validates: Requirements 10.5**

## Error Handling

### Input Validation

**Empty Message Submission**:
- Input zone submit button should be disabled when textarea is empty or contains only whitespace
- Attempting to submit via Enter key with empty input should be ignored
- Visual feedback: disabled button state with reduced opacity

**File Upload Validation**:
- Only accept image files (JPEG, PNG, PDF) for bill uploads
- Maximum file size: 10MB
- Display error toast for invalid files: "Please upload a valid image or PDF file under 10MB"
- Clear file input after successful upload

**Markdown Parsing Errors**:
- If markdown parsing fails, display the raw text instead of crashing
- Log parsing errors to console for debugging
- Gracefully degrade to plain text rendering

### API Error Handling

**Chat API Failures**:
- Network errors: Display retry button with message "Connection failed. Retry?"
- Timeout (>30s): Display message "Request timed out. Please try again."
- Server errors (5xx): Display message "Service temporarily unavailable. Please try again later."
- Rate limiting (429): Display message "Too many requests. Please wait a moment."

**Memory API Failures**:
- If memory context fails to load, proceed without memory (don't block chat)
- Log memory errors silently without user notification
- Fallback to conversation without historical context

### State Management Errors

**LocalStorage Failures**:
- If localStorage is full, display warning: "Storage limit reached. Old conversations may be removed."
- If localStorage is unavailable (private browsing), enable incognito mode automatically
- Display toast: "Private browsing detected. Incognito mode enabled."

**Chat Loading Errors**:
- If a conversation fails to load, display error in sidebar: "Failed to load conversation"
- Provide "Delete" option to remove corrupted conversation data
- Fallback to creating a new chat

### Component Rendering Errors

**React Error Boundaries**:
- Wrap main sections (Sidebar, ChatInterface, InputZone) in error boundaries
- Display fallback UI: "Something went wrong. Refresh to continue."
- Provide "Refresh" button that reloads the page
- Log errors to error tracking service (if configured)

**Credit Card Component Errors**:
- If card data is malformed, display placeholder card with "Information unavailable"
- If card logo fails to load, display card name as text
- If gradient is invalid, fallback to default gradient

**Comparison Grid Errors**:
- If comparison data is incomplete, display available data only
- If no cards provided, display message: "No cards to compare"
- If winner calculation fails, display grid without winner highlighting

## Testing Strategy

### Dual Testing Approach

SwipeSmart will use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points between components. Unit tests verify concrete scenarios and error conditions.

**Property Tests**: Verify universal properties across all inputs through randomization. Property tests ensure correctness holds for the general case, not just specific examples.

Together, these approaches provide comprehensive coverage: unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library**: We'll use **fast-check** for TypeScript/JavaScript property-based testing.

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: swipesmart-ai-interface, Property {number}: {property_text}`

**Example Property Test Structure**:

```typescript
import fc from 'fast-check';

// Feature: swipesmart-ai-interface, Property 1: Message Alignment Consistency
test('user messages are right-aligned and AI messages are left-aligned', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        role: fc.constantFrom('user', 'assistant'),
        content: fc.string(),
      })),
      (messages) => {
        const rendered = renderMessageStream(messages);
        
        messages.forEach((msg, idx) => {
          const element = rendered.getByTestId(`message-${idx}`);
          if (msg.role === 'user') {
            expect(element).toHaveClass('justify-end');
          } else {
            expect(element).toHaveClass('justify-start');
          }
        });
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Strategy

**Component Testing**:
- Test each component in isolation using React Testing Library
- Mock external dependencies (API calls, localStorage, Context)
- Focus on user interactions and accessibility

**Integration Testing**:
- Test component composition (ChatInterface with Sidebar and InputZone)
- Test Context providers with consuming components
- Test API route handlers with mock requests

**Edge Cases to Cover**:
- Empty states (no messages, no conversations)
- Maximum limits (very long messages, many conversations)
- Boundary conditions (exactly 768px viewport, exactly 200ms load time)
- Error states (network failures, invalid data)

**Accessibility Testing**:
- Verify ARIA attributes are present
- Test keyboard navigation flows
- Verify focus management
- Test with screen reader simulation tools

### Test Organization

```
__tests__/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.test.tsx
│   │   ├── MessageStream.test.tsx
│   │   └── Message.test.tsx
│   ├── sidebar/
│   │   ├── Sidebar.test.tsx
│   │   └── IncognitoToggle.test.tsx
│   ├── input/
│   │   └── InputZone.test.tsx
│   └── financial/
│       ├── CreditCardComponent.test.tsx
│       └── ComparisonGrid.test.tsx
├── properties/
│   ├── message-alignment.property.test.ts
│   ├── markdown-rendering.property.test.ts
│   ├── conversation-management.property.test.ts
│   ├── incognito-mode.property.test.ts
│   ├── credit-card-display.property.test.ts
│   ├── comparison-grid.property.test.ts
│   ├── persistence.property.test.ts
│   ├── keyboard-navigation.property.test.ts
│   └── accessibility.property.test.ts
├── integration/
│   ├── chat-flow.test.tsx
│   ├── sidebar-navigation.test.tsx
│   └── memory-loading.test.tsx
└── api/
    ├── chat.test.ts
    └── memory.test.ts
```

### Testing Priorities

**High Priority** (Must test before launch):
1. Message sending and receiving (Property 1, 2, 3)
2. Conversation management (Property 5, 6, 7)
3. Incognito mode (Property 7)
4. Data persistence (Property 17)
5. Keyboard navigation (Property 22, 23, 24)
6. Error handling for API failures

**Medium Priority** (Important for quality):
1. Credit card component rendering (Property 11, 12)
2. Comparison grid (Property 13, 14, 15)
3. Memory toast (Property 16)
4. Mobile responsiveness (Property 18)
5. Performance (Property 20, 21)

**Lower Priority** (Nice to have):
1. Hover states (Property 19)
2. Screen reader announcements (Property 25)
3. Animation smoothness
4. Visual regression testing
