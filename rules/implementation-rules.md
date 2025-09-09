# Implementation & Development Workflow Rules

## Development Methodology

### Analyze, Plan, Confirm, Execute (APCE) Method
- **Step 1 - Analyze**: Thoroughly analyze requirements, context, and implications before coding
- **Step 2 - Plan**: Create detailed implementation plan with file modifications and reasoning
- **Step 3 - Confirm**: Wait for explicit approval before proceeding with implementation
- **Step 4 - Execute**: Implement the approved plan with clear, structured delivery[42][45]

### Iterative Development Approach
- **Core First**: Start with core functionality before adding features[3][9]
- **Feature by Feature**: Build and test each feature completely before moving to next[3]
- **Incremental Testing**: Test each component thoroughly before integration[9]

### Error-First Development
- **One Error at a Time**: Address build errors systematically, one by one
- **Root Cause Analysis**: Search for existing solutions before implementing fixes
- **Progress Tracking**: Document what has been resolved and what remains

## Code Quality Standards

### Modern Practices Only
- **No Deprecated APIs**: Never use deprecated methods, libraries, or patterns[40][43]
- **Latest Standards**: Follow current best practices for React, TypeScript, and Next.js[1][2]
- **Performance First**: Prioritize performance and modern optimization techniques[4][5]

### TypeScript Best Practices
- **Strict Mode**: Enable TypeScript strict mode for better type safety[40][43][49]
- **Avoid `any`**: Use `unknown` or specific types instead of `any`[40][43]
- **Type Inference**: Leverage TypeScript's type inference capabilities[40][43]
- **Explicit Return Types**: Define return types for all functions[43][49]

### Code Structure Standards
- **Single Responsibility**: Each function/component should have one clear purpose[21][24]
- **Pure Functions**: Create pure functions without side effects when possible
- **Immutable Data**: Use readonly types and immutable patterns[43][49]

## File and Naming Conventions

### File Naming Standards
- **Lowercase with Hyphens**: Use kebab-case for file names (my-component.tsx)[23][26][28]
- **Descriptive Names**: File names should clearly indicate their purpose[23][28]
- **Consistent Extensions**: Use proper extensions (.tsx, .ts, .css, .json)[26][28]
- **No Spaces or Special Characters**: Avoid spaces and special characters in file names[26][28]

### Variable and Function Naming
- **CamelCase**: Use camelCase for variables and functions[23][28]
- **PascalCase**: Use PascalCase for component names and types[23][28]
- **Descriptive Names**: Names should clearly represent their purpose and data[23][28]
- **Avoid Abbreviations**: Use full, meaningful names instead of cryptic abbreviations[23][28]

### Constants and Enums
- **UPPER_SNAKE_CASE**: Use uppercase with underscores for constants[23][28]
- **Meaningful Enums**: Use enums for sets of related constants[43][49]
- **Type-Safe Constants**: Define constants with proper TypeScript types[43][49]

## Data Management Rules

### No Mock Data Creation
- **Real Data Only**: Never create fake or representative data for development
- **API Integration**: Always integrate with real data sources
- **Data Validation**: Validate all data coming from external sources

### Data Integrity
- **Type Safety**: All data must have proper TypeScript definitions
- **Validation**: Implement runtime validation for critical data
- **Error Handling**: Handle data errors gracefully with user feedback

### No Redundant Data
- **Single Source of Truth**: Each piece of data should have one authoritative source
- **Normalized State**: Keep state normalized to avoid duplication
- **Efficient Queries**: Optimize data fetching to minimize redundant requests

## Backend Development Rules

### Minimal Backend Code
- **Lean Implementation**: Write only necessary backend code to satisfy requirements
- **No Over-Engineering**: Avoid adding unnecessary features or complexity
- **Performance Focus**: Optimize for speed and efficiency[41][47]

### Smart Feature Implementation
- **Requirements-Driven**: Implement only features that meet specific requirements
- **Working First**: Ensure basic functionality works before optimization
- **Security by Default**: Implement security considerations from the start[47][48]

## Code Review Process

### Review Standards
- **Functionality Check**: Verify code solves the intended problem correctly[42][45][48]
- **Standards Compliance**: Ensure code follows team coding standards[42][48]
- **Performance Review**: Check for performance implications[42][45]
- **Security Assessment**: Review for security vulnerabilities[45][51]

### Review Workflow
- **Clear Context**: Provide context about changes and their purpose[45][51]
- **Constructive Feedback**: Give actionable, specific feedback[45][51]
- **Collaborative Discussion**: Engage in constructive discussions about improvements[45][51]
- **Knowledge Sharing**: Use reviews as learning opportunities[42][45]

## Testing Strategy

### Test-Driven Development
- **Write Tests First**: Create tests before implementing features[9][44]
- **Red-Green-Refactor**: Follow TDD cycle for reliable code[9][44]
- **Automated Testing**: Implement automated test execution[9][44]

### Testing Pyramid
- **Unit Tests**: Focus on testing individual components and functions[41][47][50]
- **Integration Tests**: Test component interactions and API integrations[41][47][50]
- **E2E Tests**: Test complete user workflows sparingly[41][47][50]

### Testing Best Practices
- **Independent Tests**: Each test should be independent and repeatable[47][50]
- **Real-World Scenarios**: Test with realistic data and scenarios[47][50]
- **Fast Feedback**: Optimize tests for quick execution and feedback[47][50]

## AI-Assisted Development Rules

### Context Provision
- **Relevant Code Sharing**: Share relevant parts of codebase when requesting help[6][9]
- **Clear Requirements**: Specify exact requirements and constraints[6][9]
- **Architecture Context**: Explain project architecture and design decisions[6][9]

### Iterative Refinement
- **Start Simple**: Begin with rough implementation and iterate[6][9]
- **Request Alternatives**: Ask for different approaches to problems[6][9]
- **Continuous Improvement**: Refine code based on feedback and requirements[6][9]

### Quality Control
- **Code Understanding**: Must understand every line of AI-generated code[12]
- **Immediate Testing**: Test all AI-generated code immediately[12]
- **Manual Review**: Conduct thorough manual review of all AI contributions[12]