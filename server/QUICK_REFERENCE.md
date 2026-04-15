# Payment API - Quick Reference Guide

## 🚀 Quick Commands

### Create Payment Order
```bash
curl -X POST http://localhost:5000/api/v1/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "amount": 500,
    "password": "Password123!",
    "description": "Donation"
  }'
```

### Verify Payment
```bash
curl -X POST http://localhost:5000/api/v1/payment/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpayOrderId": "order_xxxxx",
    "razorpayPaymentId": "pay_xxxxx",
    "razorpaySignature": "signature"
  }'
```

### Get User Payments
```bash
curl -X GET "http://localhost:5000/api/v1/payment/user/my-payments?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Payment Details
```bash
curl -X GET "http://localhost:5000/api/v1/payment/PAYMENT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Payments (Admin)
```bash
curl -X GET "http://localhost:5000/api/v1/payment/admin/all-payments?status=completed&page=1&limit=20" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Analytics (Admin)
```bash
curl -X GET "http://localhost:5000/api/v1/payment/admin/analytics?dateRange=30d" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Statistics (Admin)
```bash
curl -X GET "http://localhost:5000/api/v1/payment/admin/statistics" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Top Donors (Admin)
```bash
curl -X GET "http://localhost:5000/api/v1/payment/admin/top-donors?limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Payment Summary (Admin)
```bash
curl -X GET "http://localhost:5000/api/v1/payment/admin/summary" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Update Payment Status (Admin)
```bash
curl -X PATCH "http://localhost:5000/api/v1/payment/admin/PAYMENT_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "completed",
    "failureReason": null
  }'
```

### Refund Payment (Admin)
```bash
curl -X POST "http://localhost:5000/api/v1/payment/admin/PAYMENT_ID/refund" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "amount": 500,
    "reason": "Customer requested refund"
  }'
```

### Export Payment Report (Admin)
```bash
# JSON Format
curl -X GET "http://localhost:5000/api/v1/payment/admin/export-report?format=json" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# CSV Format
curl -X GET "http://localhost:5000/api/v1/payment/admin/export-report?format=csv" \
  -H "Authorization: Bearer ADMIN_TOKEN" > payments.csv
```

---

## 📊 Response Examples

### Create Order - Success
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "orderId": "order_1234567890abcd",
    "amount": 500,
    "currency": "INR",
    "receipt": "receipt_1234567890_abc123",
    "keyId": "rzp_test_xxxxxxxxxxxxx",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "userId": "user_id",
    "userCreated": true
  }
}
```

### Verify Payment - Success
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "_id": "payment_id",
      "amount": 500,
      "currency": "INR",
      "status": "completed",
      "razorpayPaymentId": "pay_1234567890abcd"
    },
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error: Invalid signature",
  "statusCode": 400
}
```

---

## 🔑 Environment Variables

```env
# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here
PORT=5000
MONGODB_URI=mongodb://localhost:27017/donationDB
JWT_SECRET=your_jwt_secret_min_32_chars
```

---

## 📱 Frontend Quick Setup (React)

```jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Create order
const response = await axios.post(`${API_URL}/payment/create-order`, {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  amount: 500,
  password: 'Password123!'
});

// Open Razorpay
const options = {
  key: response.data.data.keyId,
  amount: response.data.data.amount * 100,
  currency: 'INR',
  order_id: response.data.data.orderId,
  name: 'Temple Donation',
  prefill: {
    name: response.data.data.name,
    email: response.data.data.email,
    contact: response.data.data.phone
  },
  handler: async (paymentResponse) => {
    // Verify payment
    await axios.post(`${API_URL}/payment/verify-payment`, {
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature
    });
  }
};

const razorpay = new window.Razorpay(options);
razorpay.open();
```

---

## 🧪 Test Data

### For New User Payment
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "amount": 100,
  "password": "TestPassword123!",
  "description": "Test donation"
}
```

### For Existing User Payment
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "amount": 100
}
```

### Test Cards
- **Success**: 4111 1111 1111 1111
- **Failed**: 4000 0000 0000 0002
- **OTP**: 4000 0000 0000 0010
- **Expiry**: Any future date
- **CVV**: Any 3 digit number

---

## ⚡ Common Operations

### Get User's Last 5 Payments
```bash
curl -X GET "http://localhost:5000/api/v1/payment/user/my-payments?limit=5" \
  -H "Authorization: Bearer TOKEN"
```

### Get Failed Payments
```bash
curl -X GET "http://localhost:5000/api/v1/payment/admin/all-payments?status=failed" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Today's Revenue
```bash
# Use analytics endpoint and filter by date
curl -X GET "http://localhost:5000/api/v1/payment/admin/analytics?dateRange=1d" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Full Refund
```bash
curl -X POST "http://localhost:5000/api/v1/payment/admin/PAYMENT_ID/refund" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{}'
```

### Partial Refund (50%)
```bash
curl -X POST "http://localhost:5000/api/v1/payment/admin/PAYMENT_ID/refund" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "amount": 250
  }'
```

---

## 🔍 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 🛡️ Important Rules

1. **Always Verify Signature** - Check signature before trusting payment
2. **Use HTTPS** - In production, always use HTTPS
3. **Never Expose Key Secret** - Keep it in `.env` file only
4. **Validate Amounts** - Check amount is valid on both sides
5. **Create Account** - Provide password for new users
6. **Check Email** - Email must match for existing accounts
7. **Handle Errors** - Always catch and handle errors

---

## 📞 Troubleshooting

### "Invalid signature"
```
❌ Check: Razorpay key secret is correct
❌ Check: Order ID and Payment ID match what you sent
```

### "Payment already processed"
```
❌ Check: Payment was already verified once
✓ Solution: Get payment status instead
```

### "Email mismatch"
```
❌ Check: Email exists with different account
✓ Solution: Use same email or new email with password
```

### "Order not found"
```
❌ Check: Order ID is correct
❌ Check: Database is connected
```

---

## 📋 Endpoint Checklist

### User Endpoints
- [ ] `POST /create-order` - Create payment order
- [ ] `POST /verify-payment` - Verify payment
- [ ] `GET /user/my-payments` - Get my payments
- [ ] `GET /:paymentId` - Get payment details

### Admin Endpoints  
- [ ] `GET /admin/all-payments` - View all payments
- [ ] `GET /admin/statistics` - Get stats
- [ ] `GET /admin/analytics` - Get analytics
- [ ] `GET /admin/top-donors` - Get top donors
- [ ] `GET /admin/summary` - Get summary
- [ ] `GET /admin/export-report` - Export report
- [ ] `PATCH /admin/:paymentId/status` - Update status
- [ ] `POST /admin/:paymentId/refund` - Refund payment

---

## 🚀 Configuration Steps

1. **Get Razorpay Keys**
   - Sign up at razorpay.com
   - Go to Settings → API Keys
   - Copy Key ID and Key Secret

2. **Update .env**
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

3. **Install Package**
   ```bash
   npm install razorpay
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

5. **Test Payment**
   - Create order
   - Use test card
   - Verify payment

---

**For complete documentation, see:**
- `PAYMENT_API_DOCUMENTATION.md` - Full API reference
- `RAZORPAY_SETUP_GUIDE.md` - Setup instructions
- `FRONTEND_INTEGRATION_GUIDE.md` - Frontend examples

---

**Last Updated**: January 2025  
**Version**: 1.0.0
