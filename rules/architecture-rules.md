# Architecture & Separation of Concerns Rules

## Project Architecture

### Feature-Based Architecture
- **Feature Folders**: Organize code by features rather than file types[24]
- **Domain-Driven Design**: Structure applications around business domains
- **Modular Architecture**: Keep modules independent and loosely coupled[3][24]

### Folder Structure Standards
```
src/
├── components/          # Reusable UI components
├── features/           # Feature-specific code
│   ├── auth/
│   ├── dashboard/
│   └── profile/
├── hooks/              # Custom React hooks
├── services/           # API calls and business logic
├── utils/              # Pure utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── styles/             # Global styles and themes
```

## Separation of Concerns

### Frontend-Backend Separation
- **No Backend Logic in TSX**: Keep server-side logic completely separate from React components[25][27]
- **API Layer**: Use dedicated service layers for API communication[24][25]
- **Client-Side Logic**: Handle only UI state and user interactions in components[25][30]

### Layer Responsibilities
- **Presentation Layer**: Components handle only UI rendering and user interactions
- **Business Logic Layer**: Services contain application logic and data processing
- **Data Layer**: APIs and data access logic remain on the backend[25][27]

### Clear API Boundaries
- **RESTful APIs**: Use well-defined API contracts between frontend and backend[27]
- **Type Safety**: Define TypeScript interfaces for all API responses
- **Error Handling**: Implement consistent error handling across API calls

## Component Separation

### Container vs Presentational Components
- **Smart Components**: Handle data fetching and state management
- **Dumb Components**: Focus purely on presentation and props
- **Clear Separation**: Keep data logic separate from presentation logic[29][36]

### Custom Hooks for Logic
- **Business Logic Hooks**: Extract complex logic into custom hooks[24]
- **Data Fetching Hooks**: Separate data fetching from component rendering
- **State Management Hooks**: Centralize state logic in reusable hooks

### Service Layer Pattern
- **API Services**: Create dedicated service classes for API interactions[24]
- **Data Transformation**: Handle data transformation in service layer
- **Error Handling**: Centralize error handling in service layer

## File Organization

### Absolute Path Imports
- **Path Aliases**: Use absolute imports with @ prefix for cleaner imports[29]
- **Import Consistency**: Maintain consistent import patterns across the application
- **Module Resolution**: Configure TypeScript and bundler for absolute paths

### Module Boundaries
- **Clear Dependencies**: Keep module dependencies explicit and minimal
- **No Circular Dependencies**: Avoid circular imports between modules
- **Interface Contracts**: Define clear interfaces between modules

### External Dependencies
- **Wrapper Components**: Wrap third-party components to avoid vendor lock-in[29]
- **Adapter Pattern**: Use adapters for external services and APIs
- **Dependency Injection**: Make external dependencies easily replaceable

## State Management Architecture

### Local vs Global State
- **Component State**: Keep state local when it doesn't need to be shared
- **Global State**: Use context or state management libraries for shared state[24]
- **State Normalization**: Normalize complex state structures

### Context API Usage
- **Scoped Contexts**: Create specific contexts for different concerns
- **Provider Optimization**: Optimize context providers to prevent unnecessary re-renders
- **Context Composition**: Compose multiple contexts rather than creating mega-contexts

### External State Libraries
- **State Selection**: Choose appropriate state management based on complexity

## Backend Communication

### API Design Patterns
- **Backend for Frontend (BFF)**: Use BFF pattern when serving multiple client types[27]
- **API Versioning**: Implement proper API versioning strategies

### Authentication Architecture
- **Middleware Pattern**: Use middleware for route protection[2]
- **Client-Side Session**: Fetch user sessions on client side for UI components[2]

### Data Flow Architecture
- **Unidirectional Data Flow**: Maintain predictable data flow patterns
- **Event-Driven Architecture**: Use events for decoupled communication
- **Cache Strategies**: Implement appropriate caching at different layers

## Security Separation

### Client-Side Security
- **No Sensitive Data**: Never store sensitive information in frontend code[30]
- **Environment Variables**: Use environment variables for configuration
- **Validation**: Implement client-side validation for UX, not security

### Server-Side Security
- **Authentication**: Handle authentication logic on the server[30]
- **Authorization**: Implement authorization checks on the backend
- **Data Sanitization**: Sanitize all inputs on the server side

## Testing Architecture

### Testing Separation
- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test component interactions and API integrations
- **E2E Tests**: Test complete user workflows

### Test Organization
- **Co-located Tests**: Keep test files close to the code they test
- **Test Utilities**: Create reusable test utilities and fixtures
- **Mock Strategies**: Use appropriate mocking strategies for different layers