# 🚀 Development Workflow Guide

## 📋 Table of Contents
- [Local Development](#local-development)
- [External Testing Setup](#external-testing-setup)
- [Environment Variables Management](#environment-variables-management)
- [Debugging Tools](#debugging-tools)
- [Troubleshooting](#troubleshooting)

## 🏠 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
npm run env:setup

# 3. Start development server
npm run dev

# 4. Access your application
# Local: http://localhost:3000
# Network: http://192.168.1.3:3000
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:studio    # Open Prisma Studio
npm run admin:create # Create admin user
```

## 🌐 External Testing Setup

### 🎯 Problem Solved
**Environment variables not loading when accessed through external domains but working fine locally.**

### ✅ Complete Solution Implemented

#### 1. **Turbopack Configuration** ✅
- Disabled Turbopack in `next.config.ts` for external domain compatibility
- Updated build scripts to use standard bundler
- **Why this helps**: Turbopack has known issues with environment variable loading for external domains

#### 2. **Cloudflare Tunnel** ✅
- **Completely free** tunneling solution (no authentication required)
- **No password prompts** like ngrok
- **Persistent URLs** for testing

### Step-by-Step External Testing Setup

#### Step 1: Install Cloudflare Tunnel
```bash
# Install cloudflared globally (one-time setup)
npm install -g cloudflared

# Alternative: Download from official site
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

#### Step 2: Setup Tunnel Configuration
```bash
# Run the automated setup script (one-time setup)
npm run tunnel:setup
```

This script will:
- ✅ Create tunnel configuration (`.cloudflared/config.yml`)
- ✅ Update your `.env` file with the new tunnel URL
- ✅ Set up all necessary environment variables

#### Step 3: Start the Tunnel
```bash
# In terminal 1: Start the tunnel (keep this running)
npm run tunnel:run

# Manual alternative:
cloudflared tunnel run edrak-dev-tunnel
```

#### Step 4: Start Your Development Server
```bash
# In terminal 2: Start Next.js (with standard bundler)
npm run dev
```

#### Step 5: Test External Access
Your application will be available at:
```
https://edrak-dev-tunnel.trycloudflare.com
```

### Environment Variables Updated

The setup script automatically updates these variables in your `.env` file:

```env
NEXTAUTH_URL="https://edrak-dev-tunnel.trycloudflare.com"
NEXT_PUBLIC_APP_URL="https://edrak-dev-tunnel.trycloudflare.com"
PAYMOB_WEBHOOK_URL="https://edrak-dev-tunnel.trycloudflare.com/api/payments/webhook"
PAYMOB_RETURN_URL="https://edrak-dev-tunnel.trycloudflare.com/payments/return"
```

## 🔧 Environment Variables Management

### Environment Files
- `.env` - Main environment file (gitignored)
- `.env.example` - Template for required variables
- `.env.local` - Local overrides (gitignored)

### Required Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# PayMob Configuration
PAYMOB_API_KEY="your-api-key"
PAYMOB_PUBLIC_KEY="your-public-key"
PAYMOB_INTEGRATION_ID_ONLINE_CARD="your-integration-id"
PAYMOB_INTEGRATION_ID_MOBILE_WALLET="your-integration-id"
PAYMOB_IFRAME_ID="your-iframe-id"
PAYMOB_HMAC_SECRET="your-hmac-secret"
PAYMOB_BASE_URL="https://accept.paymob.com/api"

# PayMob URLs (updated automatically by tunnel setup)
PAYMOB_WEBHOOK_URL="https://your-domain.com/api/payments/webhook"
PAYMOB_RETURN_URL="https://your-domain.com/payments/return"

# Public URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_PAYMOB_IFRAME_ID="your-iframe-id"

# External Services
BUNNY_API_KEY="your-bunny-key"
BUNNY_LIBRARY_ID="your-library-id"
BUNNY_CDN_HOSTNAME="your-hostname"
BUNNY_CDN_API_KEY="your-cdn-key"
BUNNY_CDN_STORAGE_ZONE="your-zone"
BUNNY_CDN_PULL_ZONE_URL="your-pull-url"
```

## 🛠️ Debugging Tools

### Environment Debug Utility
```typescript
import EnvDebugger from '@/lib/env-debug';

// Log debug info to console
EnvDebugger.logDebugInfo();

// Get debug information
const debugInfo = EnvDebugger.getDebugInfo();

// Validate environment
const validation = EnvDebugger.validateEnvironment();
```

### Debug API Endpoint
Access debug information via API:
```
GET https://your-domain.com/api/debug/env
```

This endpoint provides:
- ✅ Environment variable status
- ✅ Bundler information
- ✅ Missing variables list
- ✅ Server information
- ✅ Request details

### Manual Environment Check
```bash
# Check if environment variables are loaded
curl https://your-domain.com/api/debug/env | jq .

# Expected response:
{
  "success": true,
  "data": {
    "criticalVarsLoaded": 19,
    "totalVarsExpected": 19,
    "missingVars": [],
    "bundlerInfo": "Webpack (Standard bundler)"
  }
}
```

## 🚨 Troubleshooting

### Issue: Environment Variables Still Undefined

**✅ Solution 1: Check Bundler**
```bash
# Make sure you're using the standard bundler
npm run dev  # Correct - uses standard bundler

# Avoid Turbopack
npx next dev --turbo  # Wrong - forces Turbopack
```

**✅ Solution 2: Restart Development Server**
```bash
# Stop server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart server
npm run dev
```

**✅ Solution 3: Check Environment File**
```bash
# Verify .env file exists and has correct values
cat .env | grep NEXTAUTH_URL
cat .env | grep PAYMOB_API_KEY
```

### Issue: Tunnel Connection Failed

**✅ Solution 1: Restart Tunnel**
```bash
# Stop existing tunnel (Ctrl+C)
# Then restart
npm run tunnel:run
```

**✅ Solution 2: Check Port Availability**
```bash
# Make sure port 3000 is not in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

**✅ Solution 3: Manual Tunnel Setup**
```bash
# Create config manually
mkdir -p .cloudflared
cat > .cloudflared/config.yml << EOF
tunnel: edrak-dev-tunnel
credentials-file: .cloudflared/credentials.json
ingress:
  - hostname: edrak-dev-tunnel.trycloudflare.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Run tunnel
cloudflared tunnel run edrak-dev-tunnel
```

### Issue: PayMob Integration Not Working

**✅ Solution 1: Update PayMob Dashboard**
1. Go to: Paymob Dashboard > Payment Integrations > [Your Integration] > Settings
2. Set "Transaction processed callback" to: `https://your-domain.com/payments/return`
3. Set "Transaction response callback" to: `https://your-domain.com/payments/return`

**✅ Solution 2: Check Webhook Endpoint**
```bash
# Test webhook endpoint
curl -X POST https://your-domain.com/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

### Issue: Authentication Not Working

**✅ Solution 1: Check NEXTAUTH_URL**
```bash
# Ensure NEXTAUTH_URL matches your external domain
echo $NEXTAUTH_URL  # Should show your tunnel URL
```

**✅ Solution 2: Clear Authentication Cache**
```bash
# Restart development server and clear browser cookies
npm run dev  # Restart server
# Clear browser cookies for your domain
```

## 📊 Development Workflow Summary

### Daily Development
```bash
# 1. Start development server
npm run dev

# 2. Test locally
# Visit: http://localhost:3000

# 3. Test externally (when needed)
npm run tunnel:run  # In another terminal
# Visit: https://edrak-dev-tunnel.trycloudflare.com
```

### Testing Checklist
- [ ] Local development working (http://localhost:3000)
- [ ] External access working (https://your-tunnel-domain.com)
- [ ] Environment variables loading correctly
- [ ] PayMob integration functional
- [ ] Authentication working
- [ ] Database connections stable

### Production Deployment
```bash
# 1. Build application
npm run build

# 2. Test production build
npm run start

# 3. Update environment variables for production domain
# 4. Deploy to production environment
```

## 🎯 Key Benefits of This Setup

1. **🔒 No Authentication Required**: Cloudflare Tunnel doesn't need passwords
2. **💯 Free**: No usage limits or costs for development
3. **⚡ Fast**: Quick setup with automated scripts
4. **🛠️ Debuggable**: Built-in debugging tools and endpoints
5. **🔧 Maintainable**: Clear documentation and troubleshooting guides
6. **🚀 Production Ready**: Proper environment variable handling

## 📞 Getting Help

### Debug Information
Always include this information when asking for help:
```bash
# Get comprehensive debug info
curl https://your-domain.com/api/debug/env | jq .
```

### Common Issues
1. **Environment variables undefined** → Check bundler configuration
2. **Tunnel not connecting** → Restart tunnel and check port 3000
3. **PayMob not working** → Update PayMob dashboard with tunnel URL
4. **Authentication failing** → Verify NEXTAUTH_URL matches tunnel domain

---

**🎉 This setup provides a complete, free, and reliable external testing environment for your Next.js application!**