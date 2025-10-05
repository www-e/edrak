# Paymob Callback Configuration Solution Guide

## 🚨 Problem Identified

**Issue**: Paymob payment callbacks timeout because local development server (`192.168.1.14:3000`) is not accessible from external services.

**Root Cause**: Network architecture limitation - local IP addresses cannot be reached from external services like Paymob.

## 🔍 Analysis Results

### Current Situation
- ✅ Payment processes successfully on Paymob
- ✅ Paymob sends correct callback data
- ✅ Local webhook endpoint is accessible
- ❌ **External services cannot reach `192.168.1.14:3000`**

### Evidence
```
URL: http://192.168.1.14:3000/payments/return?id=351890466&success=true&hmac=...
Status: ERR_CONNECTION_TIMED_OUT
Payment: SUCCESSFUL on Paymob side
Issue: Local server not responding to external requests
```

## 🛠️ Solutions (Ranked by Effectiveness)

### Solution 1: Ngrok (Recommended) ⭐

**Why Ngrok?**
- Creates public HTTPS tunnel to local server
- Industry standard for webhook testing
- Free tier available
- Reliable and well-documented

**Setup Steps:**

1. **Install Ngrok**
   ```bash
   # Install globally
   npm install -g ngrok

   # Or using chocolatey (Windows)
   choco install ngrok

   # Or download from: https://ngrok.com/download
   ```

2. **Start Ngrok Tunnel**
   ```bash
   # Terminal 1: Start your Next.js server
   npm run dev

   # Terminal 2: Create ngrok tunnel
   ngrok http 3000

   # Copy the ngrok URL (example: https://abc123.ngrok.io)
   ```

3. **Update Paymob Dashboard**
   ```
   Transaction processed callback: https://abc123.ngrok.io/payments/return
   Transaction response callback: https://abc123.ngrok.io/payments/return
   Webhook URL: https://abc123.ngrok.io/api/payments/webhook
   ```

### Solution 2: Local Tunnel (Free Alternative)

**Alternative to Ngrok:**
```bash
# Install localtunnel globally
npm install -g localtunnel

# Start tunnel
lt --port 3000

# Copy URL (example: https://xyz.localtunnel.me)
```

### Solution 3: Cloudflare Tunnel (Free)

**Most Reliable for Production:**
```bash
# Install cloudflared
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Start tunnel
cloudflared tunnel --url http://localhost:3000

# Copy the cloudflare URL
```

## 📋 Complete Implementation Guide

### Step 1: Choose Tunneling Service

| Service | Free Tier | Setup Difficulty | Reliability | Features |
|---------|-----------|-----------------|-------------|----------|
| **Ngrok** | ✅ 2 tunnels | ⭐ Easy | ⭐⭐⭐⭐⭐ | Webhooks, Custom domains |
| **LocalTunnel** | ✅ Unlimited | ⭐⭐ Easy | ⭐⭐⭐ | Basic tunneling |
| **Cloudflare** | ✅ Unlimited | ⭐⭐⭐ Medium | ⭐⭐⭐⭐⭐ | Teams, Analytics |

**Recommendation**: Start with **Ngrok** for simplicity, upgrade to **Cloudflare** for production.

### Step 2: Environment Configuration

```env
# For local development with tunneling
NEXT_PUBLIC_APP_URL="https://your-tunnel-url.ngrok.io"
PAYMOB_WEBHOOK_URL="https://your-tunnel-url.ngrok.io/api/payments/webhook"
PAYMOB_RETURN_URL="https://your-tunnel-url.ngrok.io/payments/return"

# For production (when deploying)
# NEXT_PUBLIC_APP_URL="https://yourdomain.com"
# PAYMOB_WEBHOOK_URL="https://yourdomain.com/api/payments/webhook"
# PAYMOB_RETURN_URL="https://yourdomain.com/payments/return"
```

### Step 3: Paymob Dashboard Setup

**Navigate to**: Paymob Dashboard → Payment Integrations → [Your Integration] → Settings

**Configure These Fields:**
- **Transaction processed callback**: `https://your-tunnel-url.ngrok.io/payments/return`
- **Transaction response callback**: `https://your-tunnel-url.ngrok.io/payments/return`
- **Webhook URL**: `https://your-tunnel-url.ngrok.io/api/payments/webhook`

### Step 4: Testing Checklist

- [ ] Tunneling service running and accessible
- [ ] Paymob dashboard updated with tunnel URLs
- [ ] Webhook endpoint responding (`GET /api/payments/webhook`)
- [ ] Payment return page accessible (`/payments/return`)
- [ ] Test card payment flow end-to-end
- [ ] Verify payment status updates correctly

## 🚀 Quick Start Commands

### Ngrok Setup (Recommended)
```bash
# 1. Install ngrok
npm install -g ngrok

# 2. Start Next.js server
npm run dev

# 3. In new terminal, start ngrok
ngrok http 3000

# 4. Copy the https URL from ngrok output
# 5. Update Paymob dashboard with ngrok URL
# 6. Test payment flow
```

### LocalTunnel Alternative
```bash
# 1. Install localtunnel
npm install -g localtunnel

# 2. Start tunnel
lt --port 3000 --subdomain your-chosen-name

# 3. Use: https://your-chosen-name.localtunnel.me
```

## 🔧 Troubleshooting

### Issue: Tunnel URL Changes
**Ngrok URLs change each time you restart ngrok**
**Solution**: Use ngrok's paid plan for fixed URLs, or restart Paymob config each session

### Issue: HTTPS Required
**Paymob requires HTTPS for production-like environments**
**Solution**: All tunneling services provide HTTPS URLs

### Issue: Webhook Timeout
**If callbacks still timeout:**
1. Check tunnel is running
2. Verify URLs in Paymob dashboard
3. Test webhook endpoint accessibility
4. Check firewall settings

## 📊 Expected Results

### Before Fix
```
Paymob → 192.168.1.14:3000 → Timeout ❌
Response Time: ∞ (timeout)
Success Rate: 0%
```

### After Fix (Ngrok)
```
Paymob → https://abc123.ngrok.io → Instant Response ✅
Response Time: < 500ms
Success Rate: 100%
```

## 🎯 Production Deployment

When ready for production:

1. **Deploy to Vercel/Netlify/Railway**
2. **Get your production domain** (e.g., `https://yourapp.vercel.app`)
3. **Update environment variables** with production URLs
4. **Update Paymob dashboard** with production URLs
5. **Add SSL certificate** (automatic on most platforms)
6. **Test payment flow** in production environment

## 🏆 Best Practices

1. **Use HTTPS**: Always use HTTPS URLs for security
2. **Test Webhooks**: Verify webhook endpoint before configuring in Paymob
3. **Monitor Logs**: Check server logs for webhook processing
4. **Handle Retries**: Paymob may retry failed webhooks
5. **Use Consistent URLs**: Keep the same tunnel URL for testing sessions

## 📞 Support Resources

- **Ngrok Documentation**: https://ngrok.com/docs
- **Paymob Integration Guide**: https://docs.paymob.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**This solution addresses the core network accessibility issue and provides multiple approaches for both development and production environments.**