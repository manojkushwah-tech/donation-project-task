# Razorpay Payment Gateway Integration

A complete, production-ready payment system integrated with Razorpay for donation processing.

## Features

### User Features
- ✅ Create payment orders with automatic account creation for new users
- ✅ Secure payment verification with Razorpay signature validation
- ✅ View payment history and details
- ✅ Account auto-creation with email and encrypted password
- ✅ Support for multiple payment amounts

### Admin Features
- ✅ View all payments with advanced filtering
- ✅ Payment statistics and analytics
- ✅ Refund processing (full and partial)
- ✅ Payment status management
- ✅ Top donors tracking
- ✅ Export payment reports (JSON/CSV)
- ✅ Dashboard with payment summary
- ✅ Date-range based analytics (7d, 30d, 90d, 1y)

### System Features
- ✅ End-to-end encryption for sensitive data
- ✅ Input validation using Zod
- ✅ Role-based access control
- ✅ Comprehensive error handling
- ✅ Request logging and debugging
- ✅ Database indexing for performance
- ✅ Pagination support

## Payment Flow

```
                ┌──────────────────────────┐
                │   User enters payment    │
                │   details from frontend  │
                └────────────┬─────────────┘
                             │
                             ▼
               ┌─────────────────────────────┐
               │ POST /create-order endpoint │
               │ (Email validation & order)  │
               └────────────┬────────────────┘
                            │
                            ├─ Check if email exists
                            ├─ If not, create new account
                            ├─ Create Razorpay order
                            └─ Return order details
                            │
                            ▼
            ┌──────────────────────────────┐
            │   Frontend opens Razorpay    │
            │      checkout modal          │
            └────────────┬─────────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │  User enters card details  │
            └────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │  Razorpay processes payment│
            └────────────┬───────────────┘
                         │
                    ✓ Success
                         │
                         ▼
            ┌─────────────────────────────┐
            │ POST /verify-payment        │
            │ (Signature verification)    │
            └────────────┬────────────────┘
                         │
                    ├─ Verify signature
                    ├─ Mark as completed
                    └─ Return success
                         │
                         ▼
            ┌────────────────────────────┐
            │   Payment has completed ✓  │
            └────────────────────────────┘
```

## Project Structure

```
src/
├── config/
│   └── razorpay.config.js           # Razorpay initialization
├── models/
│   └── payment.model.js             # MongoDB Payment schema
├── services/
│   └── payment.service.js           # Business logic
├── controllers/
│   └── payment.controller.js        # Request handlers
├── routes/
│   └── payment.route.js             # API endpoints
├── validator/
│   └── payment.validator.js         # Zod validation schemas
└── helper/
    └── constants.js                 # Payment messages
```

## Installation

### 1. Install Dependency
```bash
npm install razorpay
```

### 2. Configure Environment
Create `.env` file:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 3. Get from Razorpay
1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Copy Key ID and Key Secret
4. Use test keys for development

## API Endpoints

### User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create-order` | Create payment order | Optional |
| POST | `/verify-payment` | Verify payment | No |
| GET | `/user/my-payments` | Get user payments | Yes |
| GET | `/:paymentId` | Get payment details | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/all-payments` | View all payments | Admin |
| GET | `/admin/statistics` | Payment stats | Admin |
| GET | `/admin/analytics` | Detailed analytics | Admin |
| GET | `/admin/top-donors` | Top donors list | Admin |
| GET | `/admin/summary` | Payment summary | Admin |
| GET | `/admin/export-report` | Export report | Admin |
| PATCH | `/admin/:paymentId/status` | Update status | Admin |
| POST | `/admin/:paymentId/refund` | Process refund | Admin |

## Usage Examples

### Create Payment Order

```bash
curl -X POST http://localhost:5000/api/v1/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "amount": 500,
    "password": "SecurePassword123",
    "description": "Donation for temple"
  }'
```

### Verify Payment

```bash
curl -X POST http://localhost:5000/api/v1/payment/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpayOrderId": "order_1234567890abcd",
    "razorpayPaymentId": "pay_1234567890abcd",
    "razorpaySignature": "signature_hash_here"
  }'
```

### Get All Payments (Admin)

```bash
curl -X GET "http://localhost:5000/api/v1/payment/admin/all-payments?status=completed&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Analytics (Admin)

```bash
curl -X GET "http://localhost:5000/api/v1/payment/admin/analytics?dateRange=30d" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Process Refund (Admin)

```bash
curl -X POST http://localhost:5000/api/v1/payment/admin/:paymentId/refund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "amount": 500,
    "reason": "Customer requested refund"
  }'
```

## Database Schema

### Payment Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId,              // Reference to User
  name: String,                // Donor name
  email: String,               // Donor email
  phone: String,               // Donor phone
  amount: Number,              // Payment amount
  currency: String,            // Default: "INR"
  razorpayOrderId: String,     // Razorpay order ID
  razorpayPaymentId: String,   // Razorpay payment ID
  razorpaySignature: String,   // Payment signature
  status: String,              // pending, completed, failed, refunded
  description: String,         // Payment description
  failureReason: String,       // If payment failed
  refundId: String,            // Refund ID if refunded
  refundStatus: String,        // none, partial, full, processed
  refundAmount: Number,        // Amount refunded
  receipt: String,             // Receipt ID
  metadata: Map,               // Additional data
  ipAddress: String,           // Client IP
  userAgent: String,           // Browser info
  createdAt: Date,
  updatedAt: Date
}
```

## Payment Status Flow

```
Created → Pending → Completed ✓
                 ↓
              Failed ✗ (can refund)
                 ↓
            Refunded
```

## Security Features

- ✅ Razorpay signature verification (HMAC SHA256)
- ✅ Password encryption using bcryptjs
- ✅ JWT token validation for admin routes
- ✅ Input validation with Zod schemas
- ✅ Role-based access control
- ✅ Error handling with custom messages
- ✅ No sensitive data in logs
- ✅ HTTPS-ready for production

## Error Handling

All errors follow standard format:

```json
{
  "success": false,
  "message": "Error: Description of the error",
  "statusCode": 400
}
```

Common errors:

| Error | Status | Solution |
|-------|--------|----------|
| Invalid signature | 400 | Check Razorpay key secret |
| Amount too large | 400 | Reduce amount to max 100000 |
| Email mismatch | 400 | Use correct email for account |
| Payment already processed | 400 | Payment already verified |
| Unauthorized | 401 | Add JWT token to headers |
| Not found | 404 | Check payment ID |

## Testing

### Test Cards (Sandbox)
- **Success**: 4111 1111 1111 1111
- **Failed**: 4000 0000 0000 0002
- **OTP**: 4000 0000 0000 0010

Any future expiry date and any 3-digit CVV

### Test Flow
1. Create order with test amount
2. Use test card in Razorpay modal
3. Verify payment signature
4. Check payment status in database

## Performance

- Database indexing on frequently queried fields
- Pagination support for large datasets
- Aggregation pipelines for analytics
- Lean queries for read operations
- Connection pooling in MongoDB

## Monitoring

Enable logging in `.env`:
```env
LOG_LEVEL=debug
REQUEST_LOG_ENABLED=true
```

View logs:
```bash
npm run dev  # Development with nodemon
npm start   # Production
```

## Production Checklist

- [ ] Razorpay live API keys configured
- [ ] SSL/HTTPS certificate installed
- [ ] Environment variables secured
- [ ] Database backup strategy in place
- [ ] Rate limiting enabled
- [ ] Logs configured and monitored
- [ ] Admin panel tested
- [ ] Error handling verified
- [ ] Payment reconciliation process documented
- [ ] Support contact information available

## Troubleshooting

### Payment Creation Fails
- Check Razorpay key configuration
- Verify database connection
- Check input validation errors

### Verification Fails
- Ensure correct Order ID, Payment ID, Signature
- Verify webhook configuration
- Check Razorpay dashboard for payment status

### Admin Routes Not Working
- Verify JWT token is valid
- Check user has admin role
- Ensure Authorization header format: `Bearer TOKEN`

## Documentation

- [RAZORPAY_SETUP_GUIDE.md](./RAZORPAY_SETUP_GUIDE.md) - Detailed setup instructions
- [PAYMENT_API_DOCUMENTATION.md](./PAYMENT_API_DOCUMENTATION.md) - Complete API reference

## Support

- GitHub: [razorpay/razorpay-node](https://github.com/razorpay/razorpay-node)
- Razorpay Docs: [razorpay.com/docs/](https://razorpay.com/docs/)
- Support: [support.razorpay.com](https://support.razorpay.com/)

---

**Status**: ✅ Production Ready

**Last Updated**: January 2025

**Version**: 1.0.0
