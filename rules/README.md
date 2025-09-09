# Global Development Rules & Best Practices

## Overview

This repository contains comprehensive development guidelines designed to ensure the creation of modern, high-quality, performant, and maintainable software projects. These rules are specifically optimized for AI-assisted development with tools like Gemini, Claude, Cursor, and other AI-powered IDEs.

## Quick Start

### For AI Assistants
When working with these guidelines, please follow the **APCE Method** (Analyze, Plan, Confirm, Execute):

1. **Analyze**: Understand the requirements and context thoroughly
2. **Plan**: Create a detailed implementation plan with file modifications and reasoning
3. **Confirm**: Wait for explicit approval before proceeding
4. **Execute**: Implement the approved plan with clear, structured delivery

### Core Principles
- **No deprecated or outdated practices** - Always use the latest, modern approaches
- **No mock data creation** - Use real data sources and APIs only  
- **Performance-first mindset** - Every component must be optimized and follow best practices
- **Separation of concerns** - Keep backend logic out of frontend components
- **Feature-based architecture** - Organize code by features, not file types
- **Single source of truth** - No redundant data, meaningful names for everything
- **Minimal viable backend** - Write only necessary code that satisfies requirements

## Rule Categories

### 📱 [UI Development Rules](./ui-development-rules.md)
Comprehensive guidelines for React component development, performance optimization, styling, and user experience best practices.

**Key Areas:**
- Component architecture and design principles
- Performance optimization (memoization, lazy loading, code splitting)
- Styling and design system management
- Loading states and error handling
- Modern React practices and hooks usage

### 🏗️ [Architecture & Separation of Concerns](./architecture-rules.md)
Rules for project structure, separation of concerns, and maintaining clean boundaries between different layers of the application.

**Key Areas:**
- Feature-based architecture
- Frontend-backend separation
- Component separation patterns
- File organization and module boundaries
- State management architecture

### ⚙️ [Implementation & Development Workflow](./implementation-rules.md)
Guidelines for development methodology, code quality standards, naming conventions, and systematic error handling.

**Key Areas:**
- APCE development methodology
- Code quality and TypeScript standards
- File and naming conventions
- Data management rules
- Code review processes

### ⚡ [Next.js Performance & Optimization](./nextjs-optimization.md)
Specific rules for optimizing Next.js applications, including rendering strategies, caching, and performance monitoring.

**Key Areas:**
- Rendering strategies (PPR, SSG, SSR, ISR)
- Built-in optimizations and caching
- Bundle optimization and code splitting
- Performance monitoring and Core Web Vitals
- Advanced optimization techniques

### 🤖 [AI-Assisted Development Workflow](./ai-workflow-rules.md)
Comprehensive guidelines for working effectively with AI development tools and maintaining quality in AI-assisted projects.

**Key Areas:**
- AI partnership framework and role definitions
- The four-step APCE method implementation
- Context provision and communication standards
- Quality control and testing requirements
- Error handling and problem resolution

## Implementation Priority

### Phase 1: Foundation
1. Set up project architecture following [Architecture Rules](./architecture-rules.md)
2. Establish development workflow using [Implementation Rules](./implementation-rules.md)
3. Configure AI-assisted development following [AI Workflow Rules](./ai-workflow-rules.md)

### Phase 2: Core Development
1. Implement UI components following [UI Development Rules](./ui-development-rules.md)
2. Optimize for performance using [Next.js Optimization Rules](./nextjs-optimization.md)

### Phase 3: Quality & Optimization
1. Conduct comprehensive testing and quality assurance
2. Performance optimization and monitoring
3. Documentation and knowledge sharing

## AI Tool Configuration

### For Cursor, Gemini, Claude, and similar tools:

1. **Context Provision**: Always provide relevant project context and constraints
2. **Rule Reference**: Reference specific rule files when requesting assistance
3. **APCE Method**: Ensure AI follows the Analyze-Plan-Confirm-Execute methodology
4. **Quality Control**: Review all AI-generated code line by line
5. **Testing First**: Test all implementations immediately after generation

### Recommended AI Prompts:

```
Please follow the development rules from [specific-rules-file.md]. 
Use the APCE method: Analyze the requirement, create a detailed Plan 
with file modifications, wait for my Confirmation, then Execute.
```

## Quality Gates

Before any code integration, ensure:

- [ ] All rules from relevant categories are followed
- [ ] Code has been reviewed and understood completely
- [ ] Tests have been written and are passing
- [ ] Performance implications have been considered
- [ ] Security best practices are implemented
- [ ] Documentation has been updated

## Continuous Improvement

These rules are living documents that should be:
- Regularly reviewed and updated
- Enhanced based on project experience
- Aligned with latest best practices
- Shared across team members
- Used as training material

## Getting Help

When working with AI assistants:
1. Reference the specific rule file relevant to your task
2. Provide complete context about your project architecture
3. Follow the APCE method for all significant changes
4. Always review and test AI-generated code before integration

## Contributing

To improve these rules:
1. Identify gaps or outdated practices
2. Research current best practices
3. Propose updates with clear reasoning
4. Test proposed changes in real projects
5. Update documentation accordingly

---

**Remember**: These rules are designed to work together as a comprehensive system. Following individual rules while ignoring others may lead to inconsistencies. Always consider the holistic approach to software development quality.