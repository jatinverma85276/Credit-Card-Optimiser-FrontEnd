# SwipeSmart - AI Financial Strategist Interface

An AI-powered financial strategist interface designed to help users optimize their credit card expenses through intelligent recommendations.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Testing**: Vitest + React Testing Library + fast-check (Property-Based Testing)

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── chat/              # Chat interface components
│   ├── sidebar/           # Sidebar navigation components
│   ├── input/             # Input zone components
│   ├── financial/         # Credit card & comparison components
│   ├── ui/                # Shared UI components
│   └── providers/         # Context providers
├── contexts/              # React Context definitions
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── __tests__/             # Test files
    ├── components/        # Component unit tests
    ├── properties/        # Property-based tests
    ├── integration/       # Integration tests
    └── api/               # API route tests
```

## Design System

- **Theme**: "Fintech meets Cyberpunk"
- **Background**: Deep slate (slate-950)
- **Accents**: 
  - Emerald (#10b981) for success/financial indicators
  - Indigo (#6366f1) for AI elements
- **Typography**: Inter font family
- **Mode**: Dark mode by default

## Getting Started

### Install dependencies
```bash
npm install
```

### Configure Backend API

Create a `.env.local` file in the root directory:

```bash
BACKEND_URL=http://localhost:8000
```

See [API Integration Documentation](./docs/API_INTEGRATION.md) for detailed backend integration guide.

### Run development server
```bash
npm run dev
```

Make sure your backend server is running on `http://localhost:8000` before starting the frontend.

### Build for production
```bash
npm run build
```

### Run tests
```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
```

## Development

The project follows a component-based architecture with clear separation of concerns:

- **Components**: Reusable UI components
- **Contexts**: Global state management using React Context API
- **Hooks**: Custom hooks for shared logic
- **Types**: TypeScript interfaces and types
- **Tests**: Comprehensive testing with unit tests and property-based tests

## Testing Strategy

The project uses a dual testing approach:

1. **Unit Tests**: Test specific examples and edge cases
2. **Property-Based Tests**: Verify universal properties across all inputs using fast-check

All property tests run with a minimum of 100 iterations to ensure comprehensive coverage.
