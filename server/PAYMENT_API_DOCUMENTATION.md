# Payment Gateway API Documentation

## Overview
This documentation covers all payment-related endpoints for the Razorpay payment gateway integration.

---

## Base URL
```
http://localhost:5000/api/v1/payment
```

---

## Table of Contents
1. [User Endpoints](#user-endpoints)
2. [Admin Endpoints](#admin-endpoints)
3. [Error Handling](#error-handling)
4. [Examples](#examples)

---

## User Endpoints

### 1. Create Payment Order

**Endpoint:** `POST /create-order`

**Authentication:** Optional (provide JWT token if creating account during payment)

**Description:** Creates a Razorpay payment order. If the email is not found in the system, a new user account is created.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "amount": 500,
  "password": "StrongPassword123!", // Required only for new account creation
  "description": "Donation for temple" // Optional
}
```

**Response (201 Created):**
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
    "userId": "user_id_here",
    "userCreated": true // Indicates if new user was created
  }
}
```

**Error Responses:**
```json
// Invalid amount
{
  "success": false,
  "message": "Error: Amount is too large"
}

// Email already exists with different account
{
  "success": false,
  "message": "Error: Email does not match the account"
}

// Missing password for new account
{
  "success": false,
  "message": "Error: Password is required for new account creation"
}
```

---

### 2. Verify Payment Signature

**Endpoint:** `POST /verify-payment`

**Authentication:** Not required

**Description:** Verifies the payment signature from Razorpay and marks the payment as completed.

**Request Body:**
```json
{
  "razorpayOrderId": "order_1234567890abcd",
  "razorpayPaymentId": "pay_1234567890abcd",
  "razorpaySignature": "signature_hash_here"
}
```

**Response (200 OK):**
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

**Error Responses:**
```json
// Invalid signature
{
  "success": false,
  "message": "Error: Invalid payment signature"
}

// Payment already processed
{
  "success": false,
  "message": "Error: This payment has already been processed"
}
```

---

### 3. Get User's Payments

**Endpoint:** `GET /user/my-payments?page=1&limit=20&status=completed`

**Authentication:** Required (JWT token)

**Description:** Retrieves all payments made by the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)
- `status` (optional): Filter by status (pending, completed, failed, refunded)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User payments fetched successfully",
  "data": {
    "payments": [
      {
        "_id": "payment_id",
        "name": "John Doe",
        "email": "john@example.com",
        "amount": 500,
        "status": "completed",
        "razorpayPaymentId": "pay_1234567890abcd",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 1,
      "limit": 20
    }
  }
}
```

---

### 4. Get Payment Details

**Endpoint:** `GET /:paymentId`

**Authentication:** Required (JWT token)

**Description:** Get detailed information about a specific payment.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment fetched successfully",
  "data": {
    "_id": "payment_id",
    "user": {
      "_id": "user_id",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "amount": 500,
    "currency": "INR",
    "razorpayOrderId": "order_1234567890abcd",
    "razorpayPaymentId": "pay_1234567890abcd",
    "status": "completed",
    "description": "Donation for temple",
    "receipt": "receipt_1234567890_abc123",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Admin Endpoints

All admin endpoints require `verifyAdmin` middleware (user with admin role).

### 1. Get All Payments

**Endpoint:** `GET /admin/all-payments?status=completed&page=1&limit=20&sortBy=-createdAt`

**Authentication:** Required (Admin JWT token)

**Description:** Retrieve all payments with filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)
- `sortBy` (optional): Sorting field (default: -createdAt)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payments fetched successfully",
  "data": {
    "payments": [
      {
        "_id": "payment_id",
        "user": {...},
        "name": "John Doe",
        "email": "john@example.com",
        "amount": 500,
        "status": "completed",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 100,
      "limit": 20
    },
    "statistics": {
      "stats": {
        "completed": {
          "count": 80,
          "totalAmount": 40000
        },
        "failed": {
          "count": 10,
          "totalAmount": 5000
        },
        "refunded": {
          "count": 10,
          "totalAmount": 5000
        }
      },
      "totalAmount": 50000,
      "totalTransactions": 100
    }
  }
}
```

---

### 2. Get Payment Statistics

**Endpoint:** `GET /admin/statistics`

**Authentication:** Required (Admin JWT token)

**Description:** Get payment statistics with status breakdown.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Statistics fetched successfully",
  "data": {
    "stats": [
      {
        "_id": "completed",
        "count": 80,
        "totalAmount": 40000
      },
      {
        "_id": "failed",
        "count": 10,
        "totalAmount": 5000
      }
    ],
    "totalAmount": 50000,
    "totalTransactions": 100
  }
}
```

---

### 3. Get Payment Analytics

**Endpoint:** `GET /admin/analytics?dateRange=30d`

**Authentication:** Required (Admin JWT token)

**Description:** Get detailed payment analytics for a specified date range.

**Query Parameters:**
- `dateRange` (optional): 7d, 30d, 90d, 1y (default: 30d)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Analytics fetched successfully",
  "data": {
    "dateRange": "30d",
    "period": {
      "from": "2024-12-06T00:00:00.000Z",
      "to": "2025-01-05T00:00:00.000Z"
    },
    "dailyStats": [
      {
        "_id": "2025-01-05",
        "count": 15,
        "totalAmount": 7500,
        "completedAmount": 7200
      }
    ],
    "statusStats": [
      {
        "_id": "completed",
        "count": 420,
        "totalAmount": 210000
      }
    ],
    "overall": {
      "totalTransactions": 500,
      "totalAmount": 250000,
      "completedCount": 420,
      "failedCount": 50,
      "refundedCount": 30
    }
  }
}
```

---

### 4. Export Payment Report

**Endpoint:** `GET /admin/export-report?startDate=2024-01-01&endDate=2024-01-31&format=json`

**Authentication:** Required (Admin JWT token)

**Description:** Export payment records in JSON or CSV format.

**Query Parameters:**
- `startDate` (optional): ISO date format
- `endDate` (optional): ISO date format
- `format` (optional): json or csv (default: json)

**Response:** Payment records in specified format

---

### 5. Get Top Donors

**Endpoint:** `GET /admin/top-donors?limit=10`

**Authentication:** Required (Admin JWT token)

**Description:** Get list of top donors based on total amount donated.

**Query Parameters:**
- `limit` (optional): Number of top donors to return (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Top donors fetched successfully",
  "data": [
    {
      "_id": "user_id",
      "totalAmount": 5000,
      "totalCount": 10,
      "email": "donor@example.com",
      "name": "Top Donor",
      "userDetails": [
        {
          "_id": "user_id",
          "firstname": "Top",
          "lastname": "Donor",
          "email": "donor@example.com"
        }
      ]
    }
  ]
}
```

---

### 6. Get Payment Summary

**Endpoint:** `GET /admin/summary`

**Authentication:** Required (Admin JWT token)

**Description:** Get comprehensive payment summary including total stats, status breakdown, and recent payments.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment summary fetched successfully",
  "data": {
    "totalStats": [
      {
        "_id": null,
        "totalAmount": 250000,
        "totalTransactions": 500,
        "averageAmount": 500
      }
    ],
    "statusBreakdown": [
      {
        "_id": "completed",
        "count": 420,
        "amount": 210000
      },
      {
        "_id": "failed",
        "count": 50,
        "amount": 25000
      }
    ],
    "recentPayments": [...]
  }
}
```

---

### 7. Update Payment Status

**Endpoint:** `PATCH /admin/:paymentId/status`

**Authentication:** Required (Admin JWT token)

**Request Body:**
```json
{
  "status": "completed", // or "failed", "refunded"
  "failureReason": "Reason for failure" // Required if status is "failed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "_id": "payment_id",
    "status": "completed",
    "failureReason": null
  }
}
```

---

### 8. Refund Payment

**Endpoint:** `POST /admin/:paymentId/refund`

**Authentication:** Required (Admin JWT token)

**Request Body:**
```json
{
  "amount": 500, // Optional - full refund if not provided
  "reason": "Customer requested refund" // Optional
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refund initiated successfully",
  "data": {
    "refundId": "rfnd_1234567890abcd",
    "amount": 500,
    "status": "processed",
    "paymentId": "payment_id"
  }
}
```

**Error Response:**
```json
// Payment not completed
{
  "success": false,
  "message": "Error: Cannot refund a payment that is not completed"
}

// Already refunded
{
  "success": false,
  "message": "Error: This payment has already been fully refunded"
}
```

---

## Error Handling

### Common Error Codes

| Status Code | Error Type | Description |
|------------|-----------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input parameters |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions (not admin) |
| 404 | Not Found | Payment not found |
| 500 | Internal Server Error | Server error occurred |

### Error Response Format
```json
{
  "success": false,
  "message": "Error: Description of the error",
  "statusCode": 400
}
```

---

## Examples

### Frontend Implementation Example

#### 1. Create Payment Order
```javascript
const createOrder = async (paymentData) => {
  try {
    const response = await fetch('/api/v1/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // optional
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        amount: 500,
        password: 'StrongPassword123!', // required for new users
        description: 'Donation for temple'
      })
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating order:', error);
  }
};
```

#### 2. Razorpay Checkout Integration
```javascript
const initiatePayment = async (orderData) => {
  const options = {
    key: orderData.keyId,
    amount: orderData.amount * 100,
    currency: orderData.currency,
    name: 'Temple Donation',
    description: orderData.description,
    order_id: orderData.orderId,
    prefill: {
      name: orderData.name,
      email: orderData.email,
      contact: orderData.phone
    },
    handler: handlePaymentSuccess,
    modal: {
      ondismiss: () => {
        console.log('Payment cancelled');
      }
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

const handlePaymentSuccess = async (response) => {
  try {
    const verifyResponse = await fetch('/api/v1/payment/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      })
    });

    const data = await verifyResponse.json();
    if (data.success) {
      console.log('Payment successful');
      // Redirect to success page
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
  }
};
```

#### 3. Admin - Get All Payments
```javascript
const fetchAllPayments = async (status = 'completed', page = 1) => {
  try {
    const response = await fetch(
      `/api/v1/payment/admin/all-payments?status=${status}&page=${page}&limit=20`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
};
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
npm install razorpay
```

### 2. Configure Environment Variables
Create a `.env` file with:
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Get Razorpay Credentials
1. Go to https://dashboard.razorpay.com
2. Login to your account
3. Go to Settings → API Keys
4. Copy your Key ID and Key Secret
5. Use these in your `.env` file

### 4. Start Server
```bash
npm run dev
```

---

## Security Notes

1. **Always verify signatures** - Never trust payment status without Razorpay signature verification
2. **Use HTTPS** - In production, always use HTTPS
3. **Protect API Keys** - Never expose Razorpay Key Secret in frontend code
4. **Rate Limiting** - Implement rate limiting on payment endpoints
5. **Input Validation** - All inputs are validated using Zod
6. **Admin Only Routes** - Admin endpoints require admin role verification

---

## Testing

### Test Razorpay Credentials
- Key ID: `rzp_test_xxxxxxxxxxxxx`
- Key Secret: Available in your dashboard

### Test Card Numbers
- Success: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3-digit number

---

## Support

For issues or questions:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://support.razorpay.com/
