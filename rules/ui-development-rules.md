# UI Development Rules & Best Practices

## Component Architecture

### Component Design Principles
- **Single Responsibility Principle**: Each component should have one clear, specific purpose[21][24]
- **Reusable Components**: Build components that can be used across multiple parts of the application[21][29]
- **Composition Over Inheritance**: Favor component composition rather than extending components[46]

### Component Structure Standards
- **Functional Components Only**: Use functional components with hooks instead of class components[1][7]
- **Component Length**: Keep components under 250 lines for better maintainability and AI assistance[3]
- **Clear Component Names**: Use descriptive, self-documenting component names[24][29]

### Props and State Management
- **Destructure Props**: Always destructure props at the component level for better readability[10]
- **Limit Props Count**: Keep the number of props reasonable (typically under 7-8)[10]
- **Use Objects for Complex Data**: Pass objects instead of multiple primitive props when appropriate[10]

## Performance Optimization

### Rendering Optimization
- **React.memo**: Memoize components to prevent unnecessary re-renders[1][4][13]
- **React Compiler**: Utilize React compiler for automatic optimization when available[1]
- **useMemo and useCallback**: Memoize expensive calculations and functions[4][7]

### Image and Asset Optimization
- **Next.js Image Component**: Use Next.js Image component for automatic optimization, lazy loading, and modern formats[2][5][8]
- **Lazy Loading**: Implement lazy loading for images and components below the fold[4][8]
- **Image Performance**: Use WebP/AVIF formats when possible and optimize image sizes[5][8]

### Code Splitting and Loading
- **Dynamic Imports**: Use React.lazy() and Suspense for code splitting[1][4]
- **Bundle Optimization**: Minimize JavaScript bundle size through proper code splitting[2][5]
- **Streaming**: Use React Suspense for streaming and progressive loading[2]

## Styling and Design System

### Global Style Management
- **Single Source of Truth**: All colors, font sizes, and spacing must come from globals.css file
- **Design Tokens**: Establish consistent design tokens for theming and styling
- **CSS Variables**: Use CSS custom properties for maintainable styling

### Component Styling
- **Styled Components**: Use consistent styling approach across all components
- **Responsive Design**: Ensure components work across different screen sizes
- **Accessibility**: Follow WCAG guidelines for styling and color contrast

## Loading and User Experience

### Loading States
- **Skeleton Loading**: Implement skeleton screens for better perceived performance[2]
- **Progressive Loading**: Show static content immediately while dynamic data loads[2]
- **Loading Indicators**: Provide clear feedback during data fetching operations

### Error Handling
- **Error Boundaries**: Implement error boundaries to gracefully handle component errors[10]
- **User-Friendly Errors**: Display meaningful error messages to users
- **Fallback UI**: Provide fallback components when errors occur

## Modern React Practices

### Hooks Usage
- **Custom Hooks**: Extract reusable logic into custom hooks[1][24]
- **Hook Dependencies**: Properly manage useEffect dependencies to prevent infinite loops
- **useState Optimization**: Use functional updates when updating state based on previous state

### TypeScript Integration
- **Type Safety**: Use TypeScript for all component props and state definitions
- **Interface Definitions**: Define clear interfaces for component props
- **Generic Components**: Use TypeScript generics for reusable components

### Testing
- **Component Testing**: Write unit tests for all components using React Testing Library
- **User-Centric Testing**: Focus on testing component behavior from user perspective
- **Test Coverage**: Maintain high test coverage for critical UI components

## Component Organization

### File Structure
- Keep related components together in feature-based folders
- Separate presentational and container components
- Use index files for clean imports

### Naming Conventions
- Use PascalCase for component names
- Use descriptive file names that match component names
- Follow consistent naming patterns across the application

### Documentation
- Document component props and usage examples
- Include JSDoc comments for complex components
- Maintain a component library documentation

## Accessibility Requirements

### ARIA Standards
- Use proper ARIA labels and roles
- Ensure keyboard navigation works properly
- Implement screen reader compatibility

### Semantic HTML
- Use semantic HTML elements appropriately
- Maintain proper heading hierarchy
- Ensure form elements are properly labeled