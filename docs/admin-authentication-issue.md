# Admin Authentication Issue Resolution

## Problem Description

Users were experiencing 403 Forbidden errors when accessing admin panel features despite being authenticated as admin users. TRPC API calls to endpoints like `/api/trpc/admin.*` were returning 403 errors while the login process worked correctly.

## Root Causes

### 1. TRPC Client Authentication
The TRPC client in `src/components/admin/trpc-provider.tsx` was not configured to include authentication cookies with requests, causing the server-side authentication middleware to fail.

### 2. App Router Session Handling
The TRPC API route in `src/app/api/trpc/[trpc]/route.ts` was not properly handling session validation in the Next.js App Router context, where the traditional `getServerSession` function expects different parameters.

## Solution

### 1. Fixed TRPC Client Configuration
Updated `src/components/admin/trpc-provider.tsx` to include credentials in requests:

```typescript
httpBatchLink({
  url: "/api/trpc",
  transformer: superjson,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: 'include', // This ensures cookies are sent with requests
    });
  },
}),
```

### 2. Proper App Router Session Handling
Replaced the mock request/response approach with direct JWT token extraction in `src/app/api/trpc/[trpc]/route.ts`:

```typescript
const createContext = async (req: NextRequest) => {
  // For App Router API routes, we get the JWT token directly from cookies
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Map the token to the expected session format
  const session = token ? {
    user: {
      id: token.id as string,
      name: token.name as string,
      email: token.email as string,
      image: token.picture as string,
      role: token.role as string
    } as SessionUser
  } : null;

  return {
    session,
    db,
  };
};
```

## Why This Solution is Better

1. **No Mock Objects**: Uses actual NextAuth JWT utilities instead of mocked request/response objects
2. **Production Ready**: Directly extracts and validates tokens using NextAuth's built-in functionality
3. **Type Safe**: Properly typed session handling that matches the expected interface
4. **App Router Compatible**: Follows Next.js App Router patterns and best practices

## Prevention for Future

1. When using NextAuth.js with Next.js App Router API routes, always use `getToken()` instead of `getServerSession()` with mocks
2. Ensure TRPC clients are configured to include credentials when authentication is required
3. Test admin functionality after any authentication-related changes
4. Verify that session tokens are properly passed from client to server in all API communication paths

## Environment Requirements

Ensure the `NEXTAUTH_SECRET` environment variable is properly set for JWT token validation.