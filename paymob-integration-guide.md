# Paymob Integration Configuration Guide

## Overview
This guide provides the complete configuration required for proper Paymob payment integration, including redirect URLs, webhook setup, and environment variables.

## Required URLs for Paymob Dashboard

### Production URLs
Replace `yourdomain.com` with your actual domain (e.g., `sportologyacademy.com`):

#### Online Card Payments Integration
- **Return URL (Success)**: `https://yourdomain.com/payments/return?success=true`
- **Return URL (Failed)**: `https://yourdomain.com/payments/return?success=false`
- **Webhook URL**: `https://yourdomain.com/api/payments/webhook`

#### Mobile Wallet Integration
- **Return URL (Success)**: `https://yourdomain.com/payments/return?success=true`
- **Return URL (Failed)**: `https://yourdomain.com/payments/return?success=false`
- **Webhook URL**: `https://yourdomain.com/api/payments/webhook`

## Environment Variables Configuration

Update your `.env` file with the correct domain:

```env
# Paymob Integration URLs
PAYMOB_WEBHOOK_URL="https://yourdomain.com/api/payments/webhook"
PAYMOB_RETURN_URL="https://yourdomain.com/payments/return"

# Paymob API Configuration
PAYMOB_API_KEY="your_paymob_api_key"
PAYMOB_BASE_URL="https://accept.paymob.com/api"
PAYMOB_HMAC_SECRET="your_hmac_secret"
PAYMOB_INTEGRATION_ID_ONLINE_CARD="your_online_card_integration_id"
PAYMOB_INTEGRATION_ID_MOBILE_WALLET="your_mobile_wallet_integration_id"
NEXT_PUBLIC_PAYMOB_IFRAME_ID="your_iframe_id"
```

## Paymob Dashboard Setup Steps

### 1. Access Integration Settings
1. Log into your Paymob dashboard
2. Navigate to **Payment Integrations** or **Accept** section
3. Select each integration type (Online Card, Mobile Wallet)

### 2. Configure Online Card Integration
- **Integration Name**: "Online Card Payments"
- **Success Redirect URL**: `https://yourdomain.com/payments/return?success=true`
- **Failed Redirect URL**: `https://yourdomain.com/payments/return?success=false`
- **Webhook URL**: `https://yourdomain.com/api/payments/webhook`
- **Enable Webhook**: ✅ Yes

### 3. Configure Mobile Wallet Integration
- **Integration Name**: "Mobile Wallet Payments"
- **Success Redirect URL**: `https://yourdomain.com/payments/return?success=true`
- **Failed Redirect URL**: `https://yourdomain.com/payments/return?success=false`
- **Webhook URL**: `https://yourdomain.com/api/payments/webhook`
- **Enable Webhook**: ✅ Yes

### 4. Mobile Wallet Specific Settings
For mobile wallets, ensure you have configured:
- **Vodafone Cash**: Integration ID and settings
- **Orange Money**: Integration ID and settings
- **Etisalat Cash**: Integration ID and settings

## Payment Flow Explanation

### Current Implementation Flow

1. **Payment Initiation**
   - User selects payment method (card/wallet)
   - System calls Paymob API to create order
   - User redirected to Paymob payment page

2. **Payment Processing**
   - Paymob processes the payment
   - Webhook called at `https://yourdomain.com/api/payments/webhook`
   - Payment status updated in database
   - Enrollment created for successful payments

3. **Return Handling**
   - Paymob redirects user to `https://yourdomain.com/payments/return`
   - Query parameters determine success/failure status
   - User sees appropriate success/failure page

### Webhook Data Structure
The webhook receives this data from Paymob:
```typescript
{
  amount_cents: number;
  created_at: string;
  currency: string;
  error_occured: boolean;
  has_parent_transaction: boolean;
  id: number;
  integration_id: number;
  is_3d_secure: boolean;
  is_auth: boolean;
  is_capture: boolean;
  is_refunded: boolean;
  is_standalone_payment: boolean;
  is_voided: boolean;
  order: { id: number; merchant_order_id: string };
  owner: number;
  pending: boolean;
  source_data: {
    pan: string;
    sub_type: string;
    type: string;
  };
  success: boolean;
  hmac: string;
}
```

## Troubleshooting Common Issues

### Issue: Users not redirected after payment
**Solution**: Verify return URLs in Paymob dashboard match exactly:
- Check for trailing slashes
- Ensure HTTPS is used (not HTTP)
- Confirm domain is correct

### Issue: Webhook not receiving data
**Solution**:
1. Verify webhook URL is publicly accessible
2. Check Paymob dashboard has webhook enabled
3. Review server logs for webhook errors
4. Ensure HMAC secret matches

### Issue: Payment status not updating
**Solution**:
1. Check webhook is being called
2. Verify HMAC signature validation
3. Confirm database connection
4. Check payment record exists

## Testing Checklist

- [ ] Update environment variables with correct domain
- [ ] Configure return URLs in Paymob dashboard
- [ ] Enable webhooks for all integrations
- [ ] Test card payment flow end-to-end
- [ ] Test mobile wallet payment flow
- [ ] Verify webhook receives payment notifications
- [ ] Confirm payment status updates correctly
- [ ] Check return page displays correct status

## Security Considerations

- ✅ Webhook HMAC verification implemented
- ✅ HTTPS required for all URLs
- ✅ Environment variables for sensitive data
- ✅ Input validation on webhook data
- ✅ Database transactions for payment processing

## Support

For Paymob-specific issues:
- Check Paymob dashboard logs
- Verify API credentials
- Test with Paymob's test environment first
- Contact Paymob support for integration issues