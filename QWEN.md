# Edrak - Educational Platform Landing Page

READ THE RULES DIRECTORY FIRST!

## Project Overview

This is a Next.js 15.5.2 application that implements a landing page for an educational platform inspired by "Edrak" (Arabic for "understanding" or "comprehension"). The platform focuses on providing high-quality educational content in Arabic, with features for course discovery, learning paths, and professional development.

### Key Technologies

- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom theme configuration
- **UI Components**: shadcn/ui components with Radix UI primitives
- **State Management**: React Context API and useState hooks
- **Icons**: Lucide React icons
- **Build Tools**: ESLint, TypeScript compiler

### Architecture

The project follows a feature-based architecture with the following structure:

```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── (marketing)/     # Marketing pages (landing page)
│   ├── globals.css      # Global styles and Tailwind configuration
│   └── layout.tsx       # Root layout with theme provider
├── components/          # Shared UI components
│   ├── ui/              # shadcn/ui components (button, card, etc.)
│   ├── aceternity/      # Custom animated components
│   └── theme-provider.tsx # Theme management
├── features/            # Feature modules
│   └── landing/         # Landing page components
├── lib/                 # Utility functions
└── public/              # Static assets
```

## Development Setup

### Prerequisites

- Node.js (version specified in package.json)
- npm, yarn, pnpm, or bun package manager

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development Commands

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

# Build for production
npm run build
# or
yarn build
# or
pnpm build
# or
bun build

# Start production server
npm run start
# or
yarn start
# or
pnpm start
# or
bun start

# Run linting
npm run lint
# or
yarn lint
# or
pnpm lint
# or
bun lint
```

### Development Conventions

1. **Component Structure**:

   - Components are organized by feature or shared use
   - Each component is a self-contained .tsx file
   - Components use Tailwind CSS for styling with cn() utility for class merging

2. **Styling**:

   - Uses Tailwind CSS v4 with custom color palette
   - Custom utilities defined in globals.css (@utility directives)
   - RTL (right-to-left) layout for Arabic content

3. **State Management**:

   - React Context API for global state (theme management)
   - useState and useEffect hooks for local component state
   - Custom hooks where appropriate

4. **Routing**:

   - App Router structure with route groups
   - Marketing pages in `(marketing)` directory

5. **Type Safety**:

   - Strict TypeScript configuration
   - Type definitions for all props and state
   - Zod for schema validation where needed

6. **Code Quality**:
   - ESLint with Next.js recommended rules
   - Strict TypeScript settings
   - Component composition over inheritance

### Key Features

1. **Dark/Light Theme Support**:

   - Toggle between themes using the theme button
   - System-aware default theme
   - Persists user preference

2. **Responsive Design**:

   - Mobile-first approach
   - Responsive navigation and layout
   - Adaptive components for different screen sizes

3. **Educational Platform Components**:

   - Hero section with call-to-action
   - Featured courses display
   - Company partnerships showcase
   - Learning categories navigation
   - Professional footer with app downloads

4. **Performance Optimizations**:
   - Next.js Image component for optimized images
   - Code splitting and lazy loading
   - Font optimization with next/font

### Important Configuration Files

1. **next.config.ts**:

   - Image optimization settings
   - Remote pattern configuration for external images

2. **tsconfig.json**:

   - Strict TypeScript settings
   - Path aliases configuration (@/\*)

3. **tailwind.config.js** (implied):

   - Custom color palette in globals.css using @theme
   - Plugin configuration in globals.css

4. **components.json**:
   - shadcn/ui configuration
   - Path aliases and style preferences

### Directory Structure

```
.
├── .vscode/             # VS Code configuration
├── prisma/              # Database schema (Prisma)
├── public/              # Static assets
│   ├── images/          # Placeholder images
│   └── [static files]   # Favicons, etc.
├── rules/               # Development rules and best practices
├── src/
│   ├── app/             # App Router structure
│   │   ├── (marketing)/ # Marketing pages
│   │   ├── globals.css  # Global styles
│   │   └── layout.tsx   # Root layout
│   ├── components/      # Shared components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── aceternity/  # Animated components
│   │   └── theme-provider.tsx
│   ├── features/        # Feature modules
│   │   └── landing/     # Landing page components
│   ├── lib/             # Utility functions
│   └── [other dirs]     # Additional directories
├── [config files]       # next.config.ts, tsconfig.json, etc.
└── README.md
```

### Development Rules & Best Practices

The project includes a comprehensive set of development rules in the `rules/` directory that guide all aspects of development:

1. **AI-Assisted Development Workflow** (`ai-workflow-rules.md`):

   - APCE methodology (Analyze, Plan, Confirm, Execute)
   - AI partnership framework and quality control
   - Error handling and problem resolution protocols

2. **Architecture & Separation of Concerns** (`architecture-rules.md`):

   - Feature-based architecture principles
   - Frontend-backend separation guidelines
   - Component separation patterns
   - State management architecture

3. **Implementation & Development Workflow** (`implementation-rules.md`):

   - Code quality standards and TypeScript best practices
   - File naming conventions and data management rules
   - Testing strategies and code review processes

4. **Next.js Performance & Optimization** (`nextjs-optimization.md`):

   - Rendering strategies (PPR, SSG, SSR, ISR)
   - Built-in optimizations and caching strategies
   - Bundle optimization and performance monitoring

5. **UI Development Rules** (`ui-development-rules.md`):
   - Component architecture and design principles
   - Performance optimization techniques
   - Styling and design system management
   - Accessibility requirements

These rules ensure consistent, high-quality development practices across the project and should be followed for all new implementations.

### Recent Improvements

1. **Fixed Image Configuration**:

   - Configured remotePatterns in next.config.ts for external images
   - Replaced external image URLs with local placeholder images
   - Added image quality configuration

2. **Resolved Tailwind CSS Issues**:

   - Fixed CSS variable references for Tailwind v4
   - Removed problematic global border styles
   - Properly defined custom utilities

3. **Eliminated Build Warnings**:

   - Fixed unused variable warnings in components
   - Resolved React Hook dependency issues
   - Improved useEffect and useCallback usage

4. **Enhanced Developer Experience**:
   - Added VS Code configuration for error detection
   - Configured recommended extensions
   - Set up debugging configurations
