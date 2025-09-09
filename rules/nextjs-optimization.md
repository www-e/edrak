# Next.js Performance & Optimization Rules

## Rendering Strategies

### Partial Prerendering (PPR)
- **Enable PPR**: Use Next.js experimental Partial Prerendering feature[2]
- **Static Shell with Dynamic Content**: Serve static parts immediately, stream dynamic content[2]
- **Suspense Boundaries**: Wrap dynamic parts with React Suspense boundaries[2]

### Smart Rendering Decisions
- **Static Generation (SSG)**: Use for pages with content that doesn't change frequently[5][8]
- **Server-Side Rendering (SSR)**: Use for pages that need real-time data[5][8]
- **Incremental Static Regeneration (ISR)**: Use for pages that need periodic updates[5][8]

### Authentication Optimization
- **Middleware for Route Protection**: Use middleware to protect routes without forcing dynamic rendering[2]
- **Client-Side Session Fetching**: Fetch user sessions on client side for UI components[2]
- **Separate Auth Logic**: Keep authentication separate from page rendering logic[2]

## Built-in Optimizations

### Automatic Features
- **Server Components**: Leverage Server Components by default for reduced client bundle size[2]
- **Automatic Code Splitting**: Utilize route-based code splitting automatically provided[2]
- **Prefetching**: Take advantage of automatic route prefetching[2]
- **Static Rendering**: Use static rendering for improved performance[2]

### Image and Asset Optimization
- **Next.js Image Component**: Always use Next.js Image component for automatic optimization[5][8]
- **Format Conversion**: Automatically serve WebP/AVIF when browser supports it[5][8]
- **Responsive Images**: Implement responsive images for different screen sizes[5][8]
- **Priority Loading**: Set priority={true} for above-the-fold images[8]

### Font Optimization
- **Next.js Font Optimization**: Use Next.js automatic font optimization features[5]
- **Font Loading Strategy**: Implement proper font loading to reduce layout shift[5]
- **Local Font Files**: Use local fonts when possible to reduce external requests[5]

## Caching Strategies

### Built-in Caching
- **Data Request Caching**: Leverage Next.js automatic data request caching[2]
- **Rendered Result Caching**: Use caching for Server and Client Component renders[2]
- **Static Asset Caching**: Implement proper caching headers for static assets[5]

### Custom Caching
- **API Route Optimization**: Implement efficient caching in API routes[5]
- **Database Query Optimization**: Cache frequently accessed database queries
- **CDN Integration**: Use CDN for global content delivery[5]

## Bundle Optimization

### Code Splitting
- **Dynamic Imports**: Use dynamic imports for components not needed immediately[2][5]
- **Route-Based Splitting**: Leverage automatic route-based code splitting[2]
- **Component-Level Splitting**: Implement component-level code splitting where appropriate[5]

### Bundle Analysis
- **Bundle Analyzer**: Regularly analyze bundle size and composition[5]
- **Unused Code Elimination**: Remove unused JavaScript and dependencies[5]
- **Tree Shaking**: Ensure proper tree shaking for imported libraries[5]

### Third-Party Optimization
- **Script Optimization**: Use Next.js Script component for third-party scripts[8]
- **External Component Wrapping**: Wrap external components to control loading[29]
- **Selective Imports**: Import only needed functions from large libraries[5]

## Performance Monitoring

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: Optimize for fast content loading[5]
- **First Input Delay (FID)**: Minimize JavaScript blocking time[5]
- **Cumulative Layout Shift (CLS)**: Prevent unexpected layout shifts[5]
- **Interaction to Next Paint (INP)**: Optimize for fast interactions[5]

### Performance Auditing
- **Lighthouse Audits**: Regular performance auditing with Lighthouse[5]
- **Real User Monitoring**: Implement RUM for production performance insights[5]
- **Performance Budgets**: Set and monitor performance budgets[5]

## Advanced Optimization Techniques

### Streaming and Suspense
- **React Suspense**: Use Suspense for progressive loading of components[2]
- **Streaming Responses**: Stream HTML responses for faster perceived performance[2]
- **Selective Hydration**: Optimize hydration for critical above-the-fold content[2]

### Edge Computing
- **Edge Functions**: Use Vercel Edge Functions for geographically distributed logic[5]
- **Edge Runtime**: Leverage Edge Runtime for faster response times[5]
- **Global Distribution**: Deploy to edge locations for reduced latency[5]

### Database Optimization
- **Connection Pooling**: Implement database connection pooling[5]
- **Query Optimization**: Optimize database queries and indexes
- **Caching Layer**: Add Redis or similar caching layer for frequently accessed data

## Development Performance

### Build Optimization
- **Fast Refresh**: Utilize Fast Refresh for rapid development feedback[2]
- **Incremental Builds**: Optimize build process for incremental compilation
- **Development Server**: Configure development server for optimal performance

### Hot Reload Optimization
- **Selective Reloading**: Minimize what gets reloaded during development
- **Memory Management**: Optimize memory usage during development
- **Build Cache**: Leverage build cache for faster subsequent builds

## Infrastructure Optimization

### Hosting Optimization
- **Vercel Integration**: Use Vercel for optimal Next.js hosting[5]
- **CDN Configuration**: Properly configure CDN for static assets[5]
- **Geographic Distribution**: Deploy to multiple regions for global performance[5]

### Server Configuration
- **Compression**: Enable gzip/brotli compression for responses
- **HTTP/2**: Use HTTP/2 for improved connection efficiency
- **Keep-Alive**: Configure connection keep-alive for persistent connections

### Security Performance
- **Security Headers**: Implement security headers without performance impact
- **HTTPS**: Use HTTPS with proper certificate configuration
- **CSP**: Configure Content Security Policy for security without blocking performance