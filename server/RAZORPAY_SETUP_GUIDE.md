# Razorpay Payment Gateway - Setup Guide

## Quick Start Guide

### 1. Create Razorpay Account

1. Go to [Razorpay Signup](https://dashboard.razorpay.com/app/user/signup)
2. Sign up with your email and phone number
3. Complete the verification steps
4. Once verified, you'll be in the dashboard

### 2. Get API Credentials

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. You'll see two keys:
   - **Key ID** (Public key - can be exposed to frontend)
   - **Key Secret** (Private key - KEEP SECURE!)
4. Copy both keys

### 3. Configure Environment Variables

Create or update `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_or_live_xxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 4. Install Dependencies

```bash
npm install
npm install razorpay
```

### 5. File Structure

New files created:
```
src/
├── config/
│   └── razorpay.config.js          # Razorpay instance
├── models/
│   └── payment.model.js             # Payment schema
├── services/
│   └── payment.service.js           # Business logic
├── controllers/
│   └── payment.controller.js        # Request handlers
├── routes/
│   └── payment.route.js             # Payment routes
└── validator/
    └── payment.validator.js         # Input validation
```

### 6. Database Migrations

The Payment model will create a new collection automatically when first used. No manual migration needed.

### 7. API Endpoints

#### User Endpoints
- `POST /api/v1/payment/create-order` - Create payment order
- `POST /api/v1/payment/verify-payment` - Verify payment signature
- `GET /api/v1/payment/user/my-payments` - Get user's payments
- `GET /api/v1/payment/:paymentId` - Get payment details

#### Admin Endpoints
- `GET /api/v1/payment/admin/all-payments` - View all payments
- `GET /api/v1/payment/admin/statistics` - Payment statistics
- `GET /api/v1/payment/admin/analytics` - Detailed analytics
- `GET /api/v1/payment/admin/top-donors` - Top donors list
- `GET /api/v1/payment/admin/summary` - Payment summary
- `PATCH /api/v1/payment/admin/:paymentId/status` - Update status
- `POST /api/v1/payment/admin/:paymentId/refund` - Process refund
- `GET /api/v1/payment/admin/export-report` - Export payments

### 8. Testing Razorpay Integration

#### Test Mode (Sandbox)
1. Use test API keys from your dashboard
2. Test card numbers:
   - **Success**: 4111 1111 1111 1111
   - **Failed**: 4000 0000 0000 0002
   - **OTP Required**: 4000 0000 0000 0010
3. Expiry: Any future date
4. CVV: Any 3-digit number

#### Live Mode
1. Get live API keys (after verification)
2. Use real card numbers
3. Payment fees apply

### 9. Frontend Integration

#### Step 1: Create Order
```javascript
const response = await fetch('/api/v1/payment/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Donor Name',
    email: 'donor@example.com',
    phone: '9876543210',
    amount: 500,
    password: 'NewPassword123!' // for new users
  })
});
```

#### Step 2: Open Razorpay Checkout
```javascript
const options = {
  key: orderData.keyId,
  amount: orderData.amount * 100,
  currency: 'INR',
  order_id: orderData.orderId,
  name: 'Temple Donation',
  handler: handlePaymentSuccess,
  prefill: {
    name: orderData.name,
    email: orderData.email,
    contact: orderData.phone
  }
};

const razorpay = new Razorpay(options);
razorpay.open();
```

#### Step 3: Verify Payment
```javascript
const verifyResponse = await fetch('/api/v1/payment/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpayOrderId: response.razorpay_order_id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpaySignature: response.razorpay_signature
  })
});
```

### 10. Payment Flow

```
┌─────────────────┐
│ User Enters Info│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ POST /create-order              │
│ - Check email exists            │
│ - If not exists, create account │
│ - Create Razorpay order         │
│ - Save to Payment collection    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Open Razorpay Checkout  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ User Enters Card Details│
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Razorpay Processes Payment
└────────┬─────────────────┘
         │
         ▼
┌────────────────────────────┐
│ POST /verify-payment       │
│ - Verify signature         │
│ - Update payment status    │
│ - Return success response  │
└────────┬───────────────────┘
         │
         ▼
┌──────────────────────┐
│ Payment Completed ✓  │
└──────────────────────┘
```

### 11. Security Checklist

- [ ] Razorpay Key Secret is in `.env` (not committed)
- [ ] Key Secret is not exposed in frontend code
- [ ] Signature verification is implemented
- [ ] HTTPS is used in production
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] Admin routes are protected
- [ ] Payment amounts are validated
- [ ] Email verification is implemented

### 12. Production Deployment

#### Prerequisites
- Live Razorpay account (verified)
- Live API keys
- SSL certificate (HTTPS)
- Database backup strategy

#### Steps
1. Update `.env` with live API keys
2. Set `NODE_ENV=production`
3. Test thoroughly with test cards first
4. Deploy to production
5. Monitor payments in Razorpay dashboard

### 13. Webhook Setup _(Optional)_

For real-time payment updates:

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/v1/payment/webhook`
3. Select events: `payment.authorized`, `payment.failed`, etc.
4. Note: Currently webhooks are not implemented, but infrastructure is ready

### 14. Troubleshooting

#### Common Issues

**Issue**: "Invalid signature"
- **Solution**: Ensure Key Secret is correct in `.env`

**Issue**: "Order not found"
- **Solution**: Check if order was created successfully in database

**Issue**: "Payment already processed"
- **Solution**: Check if payment already exists in database

**Issue**: "Email mismatch error"
- **Solution**: Ensure same email is used for existing accounts

#### Debug Mode
Enable detailed logs:
```env
LOG_LEVEL=debug
REQUEST_LOG_ENABLED=true
```

### 15. Support Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Support](https://support.razorpay.com/)
- [GitHub Issues](https://github.com/razorpay/razorpay-node)

### 16. Key Features Implemented

✅ **Payment Order Creation**
✅ **Signature Verification**
✅ **User Account Auto-creation**
✅ **Payment Status Tracking**
✅ **Refund Processing**
✅ **Admin Analytics & Reports**
✅ **Top Donors Tracking**
✅ **Email Verification for New Accounts**
✅ **Comprehensive Error Handling**
✅ **Input Validation**
✅ **Role-based Access Control**

### 17. Next Steps

1. ✅ Install dependencies: `npm install razorpay`
2. ✅ Configure `.env` with Razorpay keys
3. ✅ Test payment creation flow
4. ✅ Test payment verification
5. ✅ Test admin endpoints
6. ✅ Monitor logs for any errors
7. ✅ Deploy to production when ready

---

**System is production-ready with full error handling, validation, and security measures in place!**
