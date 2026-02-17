# Implementation Plan: SwipeSmart AI Financial Strategist Interface

## Overview

This implementation plan breaks down the SwipeSmart interface into incremental coding steps, building from foundational setup through complete feature implementation. The approach follows a bottom-up strategy: establish core infrastructure, implement individual components, add specialized financial UI elements, integrate state management, and finally wire everything together with API integration and testing.

## Tasks

- [x] 1. Project setup and foundational configuration
  - Initialize Next.js 14 project with App Router and TypeScript
  - Configure Tailwind CSS with custom theme (slate-950 backgrounds, emerald/indigo accents)
  - Install dependencies: Framer Motion, React Testing Library, fast-check
  - Set up custom fonts (Inter or Plus Jakarta Sans)
  - Configure dark mode as default
  - Create base directory structure (components, contexts, hooks, lib, types)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2. Core type definitions and data models
  - [x] 2.1 Create TypeScript interfaces for chat system
    - Define Message, MessageComponent, Chat interfaces in types/chat.ts
    - Define ChatContextValue interface
    - _Requirements: 1.1, 1.6_
  
  - [x] 2.2 Create TypeScript interfaces for financial components
    - Define CreditCardData and ComparisonData interfaces in types/card.ts
    - _Requirements: 4.1, 5.1_
  
  - [x] 2.3 Create TypeScript interfaces for memory system
    - Define MemoryContext and ChatStorage interfaces in types/memory.ts
    - _Requirements: 6.4_

- [x] 3. Implement ChatContext and state management
  - [x] 3.1 Create ChatContext with React Context API
    - Implement ChatContext with state: messages, currentChatId, isIncognito, sidebarOpen, isLoading, memoryLoaded
    - Implement actions: sendMessage, createNewChat, loadChat, toggleIncognito, toggleSidebar, uploadAttachment
    - Add localStorage integration for conversation persistence
    - _Requirements: 2.5, 2.6, 2.7, 6.4, 6.5_
  
  - [ ]* 3.2 Write property test for ChatContext state management
    - **Property 5: New Chat Creation**
    - **Property 6: Conversation Loading**
    - **Property 7: Incognito Mode Storage Prevention**
    - **Validates: Requirements 2.5, 2.6, 2.7, 6.5**
  
  - [x] 3.3 Create ChatProvider component
    - Wrap ChatContext.Provider with initialization logic
    - Load saved conversations from localStorage on mount
    - _Requirements: 6.4_
  
  - [ ]* 3.4 Write property test for data persistence
    - **Property 17: Data Persistence Round Trip**
    - **Validates: Requirements 6.4**

- [x] 4. Build core chat UI components
  - [x] 4.1 Implement Message component
    - Create Message component with role-based alignment (user right, AI left)
    - Add Framer Motion animations for message appearance
    - Integrate markdown rendering support
    - Add support for rendering MessageComponent (credit cards, comparison grids)
    - _Requirements: 1.1, 1.5_
  
  - [ ]* 4.2 Write property tests for Message component
    - **Property 1: Message Alignment Consistency**
    - **Property 2: Markdown Rendering Completeness**
    - **Validates: Requirements 1.1, 1.5**
  
  - [x] 4.3 Implement TypewriterText component
    - Create typewriter effect for AI responses using character-by-character rendering
    - Add configurable speed and completion callback
    - _Requirements: 1.6_
  
  - [x] 4.4 Implement MessageStream component
    - Create scrollable container for messages
    - Add auto-scroll to bottom on new messages
    - Render list of Message components
    - _Requirements: 1.1_
  
  - [x] 4.5 Implement EmptyState component
    - Display hero text "Where are you spending today?"
    - Create three PresetPrompt cards with specified prompts
    - _Requirements: 1.2, 1.3_
  
  - [ ]* 4.6 Write unit tests for EmptyState
    - Test hero text display
    - Test preset prompt cards display
    - _Requirements: 1.2, 1.3_
  
  - [x] 4.7 Implement PresetPrompt component
    - Create clickable prompt card with hover effects
    - Integrate with ChatContext to populate input on click
    - _Requirements: 1.4_
  
  - [ ]* 4.8 Write property test for preset prompt interaction
    - **Property 3: Preset Prompt Population**
    - **Validates: Requirements 1.4**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Build InputZone and interaction components
  - [x] 6.1 Implement AutoExpandingTextarea component
    - Create textarea that expands vertically with content
    - Add keyboard event handlers (Enter to submit, Shift+Enter for newline)
    - _Requirements: 3.2, 3.5, 3.6, 3.7_
  
  - [ ]* 6.2 Write property tests for textarea behavior
    - **Property 8: Textarea Auto-Expansion**
    - **Property 9: Enter Key Submission**
    - **Property 10: Shift+Enter Newline Insertion**
    - **Validates: Requirements 3.2, 3.5, 3.6, 3.7**
  
  - [x] 6.3 Implement InputZone component
    - Create floating sticky bottom bar with AutoExpandingTextarea
    - Add attachment button with file picker integration
    - Add voice microphone button (UI only)
    - Add send button with loading state
    - Integrate with ChatContext sendMessage action
    - _Requirements: 3.1, 3.3, 3.4, 3.8_
  
  - [ ]* 6.4 Write unit tests for InputZone
    - Test attachment button opens file picker
    - Test send button disabled when input is empty
    - _Requirements: 3.8_

- [x] 7. Build Sidebar navigation components
  - [x] 7.1 Implement NewChatButton component
    - Create button with gradient green CTA styling
    - Integrate with ChatContext createNewChat action
    - _Requirements: 2.1_
  
  - [x] 7.2 Implement RecentStrategies component
    - Display list of previous conversations from ChatContext
    - Add click handlers to load conversations
    - _Requirements: 2.2_
  
  - [ ]* 7.3 Write property test for conversation display
    - **Property 4: Recent Conversations Display**
    - **Validates: Requirements 2.2**
  
  - [x] 7.4 Implement IncognitoToggle component
    - Create toggle switch for incognito mode
    - Integrate with ChatContext toggleIncognito action
    - _Requirements: 2.4_
  
  - [x] 7.5 Implement Sidebar component
    - Create collapsible sidebar with NewChatButton, RecentStrategies, and settings
    - Add responsive behavior: hamburger menu on mobile (<768px)
    - Add mobile overlay for sidebar
    - Integrate with ChatContext for sidebar state
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.1, 7.2_
  
  - [ ]* 7.6 Write property test for mobile sidebar toggle
    - **Property 18: Mobile Sidebar Toggle**
    - **Validates: Requirements 7.2**
  
  - [ ]* 7.7 Write unit tests for Sidebar
    - Test hamburger menu appears on mobile
    - Test sidebar sections are present
    - _Requirements: 2.1, 2.3, 2.4, 7.1_

- [x] 8. Build specialized financial UI components
  - [x] 8.1 Implement RewardBadge component
    - Create glowing badge displaying reward rate
    - Add emerald accent styling
    - _Requirements: 4.3_
  
  - [x] 8.2 Implement CreditCardComponent
    - Create visual card with gradient background
    - Display card logo, chip icon, card name
    - Integrate RewardBadge for reward rate
    - Display feature list (first 3 features)
    - Add action button ("Apply Now" or "View Details")
    - Add hover scale animation with Framer Motion
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 8.3 Write property tests for CreditCardComponent
    - **Property 11: Credit Card Component Completeness**
    - **Property 12: Card Action Navigation**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**
  
  - [x] 8.4 Implement ComparisonGrid component
    - Create responsive table for side-by-side card comparison
    - Display card name, logo, reward rate, annual fee
    - Display additional attributes when available
    - Highlight winner row with emerald styling
    - Add horizontal scrolling on mobile
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 7.6_
  
  - [ ]* 8.5 Write property tests for ComparisonGrid
    - **Property 13: Comparison Grid Data Display**
    - **Property 14: Comparison Grid Table Structure**
    - **Property 15: Winner Highlighting**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.5**
  
  - [ ]* 8.6 Write unit test for ComparisonGrid edge case
    - Test grid supports at least three cards simultaneously
    - _Requirements: 5.4_

- [x] 9. Implement MemoryToast notification component
  - [x] 9.1 Create MemoryToast component
    - Implement toast with fade-in/fade-out animation using Framer Motion
    - Position at top center of interface
    - Display sparkles icon and memory text
    - Add indigo accent styling
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 9.2 Write property test for memory toast display
    - **Property 16: Memory Toast Display**
    - **Validates: Requirements 6.1**
  
  - [ ]* 9.3 Write unit test for memory toast
    - Test toast displays correct text
    - Test toast positioning
    - _Requirements: 6.2, 6.3_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Build main ChatInterface orchestration
  - [x] 11.1 Implement ChatInterface component
    - Create main layout with Sidebar and chat area
    - Conditionally render EmptyState or MessageStream based on message count
    - Include InputZone at bottom
    - Add MemoryToast with memoryLoaded state
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 11.2 Create root layout with ChatProvider
    - Wrap app with ChatProvider in app/layout.tsx
    - Configure fonts and global styles
    - _Requirements: 8.4_
  
  - [x] 11.3 Create home page with ChatInterface
    - Render ChatInterface in app/page.tsx
    - _Requirements: 1.1_

- [x] 12. Implement API routes
  - [x] 12.1 Create /api/chat route
    - Implement POST handler for chat messages
    - Accept ChatRequest (message, chatId, includeMemory)
    - Return ChatResponse (message, memoryUsed)
    - Add error handling for network, timeout, and server errors
    - _Requirements: 1.6_
  
  - [x] 12.2 Create /api/memory route
    - Implement GET handler for memory context retrieval
    - Accept chatId query parameter
    - Return MemoryResponse (context, relevantChats)
    - Add error handling with silent fallback
    - _Requirements: 6.1, 6.4_
  
  - [ ]* 12.3 Write unit tests for API routes
    - Test chat route with valid and invalid requests
    - Test memory route with valid chatId
    - Test error handling scenarios
    - _Requirements: 1.6, 6.1_

- [x] 13. Implement markdown rendering and utilities
  - [x] 13.1 Create markdown rendering utility
    - Implement MarkdownRenderer component using a markdown library
    - Support bold text, lists, and code blocks
    - Add syntax highlighting for code blocks
    - _Requirements: 1.5_
  
  - [x] 13.2 Create ComponentRenderer utility
    - Implement component renderer for MessageComponent types
    - Route to CreditCardComponent or ComparisonGrid based on type
    - _Requirements: 4.1, 5.1_

- [x] 14. Add responsive design and mobile optimizations
  - [x] 14.1 Implement responsive breakpoints
    - Add mobile-first responsive classes throughout components
    - Test sidebar hamburger menu at <768px
    - Test InputZone accessibility on mobile
    - _Requirements: 7.1, 7.3, 7.4, 7.5_
  
  - [ ]* 14.2 Write unit tests for responsive behavior
    - Test sidebar hidden on mobile
    - Test credit card stacking on mobile
    - Test comparison grid scrolling on mobile
    - _Requirements: 7.1, 7.5, 7.6_

- [x] 15. Implement accessibility features
  - [x] 15.1 Add keyboard navigation support
    - Ensure all interactive elements are keyboard accessible
    - Implement logical tab order
    - Add Escape key handler to close sidebar
    - Add visible focus indicators
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 15.2 Write property tests for keyboard navigation
    - **Property 22: Keyboard Navigation Order**
    - **Property 23: Escape Key Sidebar Close**
    - **Property 24: Focus Indicator Visibility**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
  
  - [x] 15.3 Add ARIA attributes for screen readers
    - Add aria-live regions for dynamic content
    - Add aria-labels for icon buttons
    - Add role attributes where appropriate
    - Ensure MemoryToast is announced to screen readers
    - _Requirements: 10.5, 10.6_
  
  - [ ]* 15.4 Write property test for screen reader support
    - **Property 25: Screen Reader Announcements**
    - **Validates: Requirements 10.5**
  
  - [ ]* 15.5 Write unit test for memory toast accessibility
    - Test MemoryToast has proper ARIA attributes
    - _Requirements: 10.6_

- [x] 16. Add hover states and visual feedback
  - [x] 16.1 Implement hover effects across components
    - Add color/scale transitions to buttons
    - Add hover effects to preset prompts
    - Add hover effects to conversation list items
    - Add hover effects to credit card components
    - _Requirements: 8.7_
  
  - [ ]* 16.2 Write property test for hover feedback
    - **Property 19: Hover State Feedback**
    - **Validates: Requirements 8.7**

- [x] 17. Implement performance optimizations
  - [x] 17.1 Add code splitting and lazy loading
    - Lazy load CreditCardComponent and ComparisonGrid
    - Implement dynamic imports for heavy components
    - _Requirements: 9.3_
  
  - [x] 17.2 Implement conversation caching
    - Add in-memory cache for recent conversations
    - Optimize localStorage reads
    - _Requirements: 9.5_
  
  - [ ]* 17.3 Write property tests for performance
    - **Property 20: Conversation Load Performance**
    - **Property 21: Conversation Caching**
    - **Validates: Requirements 9.4, 9.5**

- [x] 18. Add error handling and edge cases
  - [x] 18.1 Implement input validation
    - Disable submit button for empty/whitespace input
    - Validate file uploads (type, size)
    - Display error toasts for invalid files
    - _Requirements: 3.6_
  
  - [x] 18.2 Add React Error Boundaries
    - Wrap main sections in error boundaries
    - Create fallback UI for errors
    - Add error logging
    - _Requirements: 1.1_
  
  - [x] 18.3 Implement API error handling UI
    - Add retry button for network errors
    - Display timeout messages
    - Display server error messages
    - Display rate limiting messages
    - _Requirements: 1.6_
  
  - [x] 18.4 Handle localStorage edge cases
    - Handle localStorage full scenario
    - Handle localStorage unavailable (private browsing)
    - Auto-enable incognito mode when localStorage unavailable
    - _Requirements: 6.4, 6.5_
  
  - [ ]* 18.5 Write unit tests for error handling
    - Test empty input validation
    - Test file upload validation
    - Test error boundary fallback
    - Test API error messages
    - Test localStorage fallbacks

- [x] 19. Add visual design polish
  - [x] 19.1 Implement theme colors and styling
    - Verify bg-slate-950 backgrounds throughout
    - Verify emerald accents on success indicators
    - Verify indigo accents on AI elements
    - Add smooth transitions with Framer Motion
    - _Requirements: 8.1, 8.2, 8.3, 8.6_
  
  - [ ]* 19.2 Write unit tests for theming
    - Test default dark mode
    - Test color scheme application
    - Test font configuration
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 20. Final integration and wiring
  - [x] 20.1 Wire all components together
    - Ensure ChatContext flows through all components
    - Verify API integration with chat and memory routes
    - Test end-to-end conversation flow
    - Test file upload integration
    - _Requirements: 1.1, 1.4, 1.5, 1.6, 2.5, 2.6, 2.7, 3.8, 6.1_
  
  - [ ]* 20.2 Write integration tests
    - Test complete chat flow from input to response
    - Test sidebar navigation and conversation loading
    - Test memory loading and toast display
    - Test incognito mode end-to-end
    - _Requirements: 1.1, 2.5, 2.6, 2.7, 6.1_

- [x] 21. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation throughout development
- The implementation follows a bottom-up approach: infrastructure → components → integration
