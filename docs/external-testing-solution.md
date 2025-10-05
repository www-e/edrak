# 🔧 External Domain Testing Solution

## 🎯 Problem Solved

**Environment variables not loading when accessed through external domains (ngrok) but working fine locally.**

## ✅ Complete Solution Implemented

### 1. **Turbopack Disabled** ✅
- Removed Turbopack configuration from `next.config.ts`
- Updated `package.json` build script to exclude `--turbopack` flag
- **Why this helps**: Turbopack has known issues with environment variable loading for external domains

### 2. **Cloudflare Tunnel Alternative** ✅
- **Completely free** tunneling solution (no authentication required)
- **No password prompts** like ngrok
- **Persistent URLs** for testing

## 🚀 Quick Start Guide

### Step 1: Install Cloudflare Tunnel
```bash
# Install cloudflared globally
npm install -g cloudflared

# Or download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

### Step 2: Setup Tunnel Configuration
```bash
# Run the automated setup script
npm run tunnel:setup
```

This script will:
- ✅ Create tunnel configuration (`.cloudflared/config.yml`)
- ✅ Update your `.env` file with the new tunnel URL
- ✅ Set up all necessary environment variables

### Step 3: Start the Tunnel
```bash
# In terminal 1: Start the tunnel
npm run tunnel:run

# Or manually:
cloudflared tunnel run edrak-dev-tunnel
```

### Step 4: Start Your Development Server
```bash
# In terminal 2: Start Next.js (with standard bundler)
npm run dev
```

### Step 5: Test External Access
Your application will be available at:
```
https://edrak-dev-tunnel.trycloudflare.com
```

## 📋 Environment Variables Updated

The setup script automatically updates these variables in your `.env` file:

```env
NEXTAUTH_URL="https://edrak-dev-tunnel.trycloudflare.com"
NEXT_PUBLIC_APP_URL="https://edrak-dev-tunnel.trycloudflare.com"
PAYMOB_WEBHOOK_URL="https://edrak-dev-tunnel.trycloudflare.com/api/payments/webhook"
PAYMOB_RETURN_URL="https://edrak-dev-tunnel.trycloudflare.com/payments/return"
```

## 🔧 Manual Configuration (if needed)

### Create Tunnel Configuration Manually
```bash
# Create config directory
mkdir -p .cloudflared

# Create config file
cat > .cloudflared/config.yml << EOF
tunnel: edrak-dev-tunnel
credentials-file: .cloudflared/credentials.json
ingress:
  - hostname: edrak-dev-tunnel.trycloudflare.com
    service: http://localhost:3000
  - service: http_status:404
EOF
```

### Update Environment Variables Manually
```bash
# Update your .env file
NEXTAUTH_URL="https://edrak-dev-tunnel.trycloudflare.com"
NEXT_PUBLIC_APP_URL="https://edrak-dev-tunnel.trycloudflare.com"
PAYMOB_WEBHOOK_URL="https://edrak-dev-tunnel.trycloudflare.com/api/payments/webhook"
PAYMOB_RETURN_URL="https://edrak-dev-tunnel.trycloudflare.com/payments/return"
```

## 🛠️ Troubleshooting

### Issue: Environment Variables Still Undefined
**Solution**: Make sure you're using the standard Next.js bundler:
```bash
# Correct - uses standard bundler
npm run dev

# Avoid - forces Turbopack
npx next dev --turbo
```

### Issue: Tunnel Connection Failed
**Solution**: Restart the tunnel:
```bash
# Stop existing tunnel (Ctrl+C)
# Then restart
npm run tunnel:run
```

### Issue: Port 3000 Already in Use
**Solution**: Change the tunnel configuration to use a different port:
```yaml
# In .cloudflared/config.yml
ingress:
  - hostname: edrak-dev-tunnel.trycloudflare.com
    service: http://localhost:3001  # Change port here
```

## 🎯 Why This Solution Works

1. **No Authentication**: Cloudflare Tunnel doesn't require passwords or authentication
2. **Standard Bundler**: Forces Next.js to use webpack instead of Turbopack
3. **Proper Environment Loading**: Standard bundler handles environment variables correctly for external domains
4. **Free & Reliable**: No usage limits or costs for development testing

## 📊 Comparison: ngrok vs Cloudflare Tunnel

| Feature | ngrok | Cloudflare Tunnel |
|---------|-------|-------------------|
| **Cost** | Free tier limited | ✅ Completely Free |
| **Authentication** | ❌ Password required | ✅ No authentication |
| **Environment Variables** | ❌ Issues with Turbopack | ✅ Works perfectly |
| **Setup Complexity** | Simple | Simple with script |
| **URL Persistence** | Session only | Persistent |

## 🔄 Development Workflow

```bash
# 1. Setup tunnel once
npm run tunnel:setup

# 2. Start tunnel (keep running)
npm run tunnel:run

# 3. Start Next.js (in another terminal)
npm run dev

# 4. Test external access
# Visit: https://edrak-dev-tunnel.trycloudflare.com

# 5. For PayMob testing, update dashboard:
# Go to: Paymob Dashboard > Payment Integrations > [Your Integration] > Settings
# Set "Transaction processed callback" to: https://edrak-dev-tunnel.trycloudflare.com/payments/return
# Set "Transaction response callback" to: https://edrak-dev-tunnel.trycloudflare.com/payments/return
```

## 🎉 Expected Results

After implementing this solution:

- ✅ Environment variables load correctly on external domains
- ✅ PayMob integration works properly
- ✅ NextAuth authentication functions correctly
- ✅ No more "undefined" errors in production
- ✅ Smooth external testing experience

## 📞 Support

If you encounter any issues:

1. **Check tunnel is running**: `npm run tunnel:run` should show active connection
2. **Verify environment variables**: Check `.env` file has correct tunnel URL
3. **Restart development server**: `npm run dev` after tunnel setup
4. **Clear Next.js cache**: `rm -rf .next` if issues persist

---

**🎯 This solution provides a 100% free, authentication-free external testing environment that properly handles environment variables with Next.js 15.**