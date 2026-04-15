# Frontend Integration Guide - Razorpay Payment System

Complete guide for integrating the Razorpay payment system in your React/Vue/Angular frontend application.

## Table of Contents
1. [Setup](#setup)
2. [Payment Flow](#payment-flow)
3. [React Implementation](#react-implementation)
4. [Vue Implementation](#vue-implementation)
5. [Pure JavaScript](#pure-javascript)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## Setup

### 1. Install Razorpay Script
Add to `index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Environment Configuration
Create `.env.local`:

```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

---

## Payment Flow

```javascript
User Form (name, email, phone, amount)
    ↓
POST /create-order (Backend)
    ↓
Get Order ID from Backend
    ↓
Open Razorpay Checkout Modal
    ↓
User Enters Card Details
    ↓
Razorpay Processes Payment
    ↓
Success/Failure Response
    ↓
POST /verify-payment (Backend) - If Success
    ↓
Payment Verified
    ↓
Show Success Message
```

---

## React Implementation

### Complete Payment Component

```jsx
// src/components/PaymentModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    password: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear error when user types
  };

  // Create payment order
  const createOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Create order via backend
      const response = await axios.post(
        `${API_URL}/payment/create-order`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: parseFloat(formData.amount),
          password: formData.password || undefined,
          description: formData.description
        }
      );

      if (response.data.success) {
        const orderData = response.data.data;
        openRazorpayCheckout(orderData);
      } else {
        setError(response.data.message || 'Failed to create order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating order');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Razorpay checkout
  const openRazorpayCheckout = (orderData) => {
    const options = {
      key: orderData.keyId, // Your Razorpay Key ID
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency,
      name: 'Temple Donation',
      description: orderData.description || 'Donation for temple',
      order_id: orderData.orderId,
      prefill: {
        name: orderData.name,
        email: orderData.email,
        contact: orderData.phone
      },
      theme: {
        color: '#3399cc'
      },
      handler: (response) => {
        handlePaymentSuccess(response);
      },
      modal: {
        ondismiss: () => {
          setError('Payment cancelled by user');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Handle payment success
  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);

      // Verify payment with backend
      const verifyResponse = await axios.post(
        `${API_URL}/payment/verify-payment`,
        {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        }
      );

      if (verifyResponse.data.success) {
        // Payment verified successfully
        if (onPaymentSuccess) {
          onPaymentSuccess(verifyResponse.data.data);
        }

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          amount: '',
          password: '',
          description: ''
        });

        onClose();
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment verification error');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={createOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="9876543210"
              pattern="[6-9]\d{9}"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="500"
              min="1"
              max="100000"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter if new account"
              className="w-full border rounded px-3 py-2"
            />
            <small className="text-gray-500">Required for new accounts</small>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Purpose of donation"
              rows="2"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
```

### Usage in App

```jsx
// src/App.jsx
import { useState } from 'react';
import PaymentModal from './components/PaymentModal';

function App() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Handle successful payment
    // Redirect, show confirmation, etc.
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Donation Platform</h1>

      <button
        onClick={() => setShowPaymentModal(true)}
        className="bg-green-600 text-white px-6 py-3 rounded font-medium text-lg hover:bg-green-700"
      >
        Make a Donation
      </button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default App;
```

---

## Vue Implementation

### Payment Component

```vue
<!-- src/components/PaymentModal.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold mb-6">Make a Donation</h2>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <form @submit.prevent="createOrder" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Full Name *</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="John Doe"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email *</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="john@example.com"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Phone *</label>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="9876543210"
            pattern="[6-9]\d{9}"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Amount (₹) *</label>
          <input
            v-model.number="formData.amount"
            type="number"
            placeholder="500"
            min="1"
            max="100000"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Enter if new account"
            class="w-full border rounded px-3 py-2"
          />
          <small class="text-gray-500">Required for new accounts</small>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-medium"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
            :disabled="loading"
          >
            {{ loading ? 'Processing...' : 'Proceed to Payment' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        amount: '',
        password: ''
      },
      loading: false,
      error: null
    };
  },
  methods: {
    async createOrder(e) {
      e.preventDefault();
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.formData.name,
            email: this.formData.email,
            phone: this.formData.phone,
            amount: parseFloat(this.formData.amount),
            password: this.formData.password || undefined
          })
        });

        const data = await response.json();
        if (data.success) {
          this.openRazorpay(data.data);
        } else {
          this.error = data.message;
        }
      } catch (err) {
        this.error = 'Error creating order';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    openRazorpay(orderData) {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: 'INR',
        order_id: orderData.orderId,
        name: 'Temple Donation',
        description: orderData.description,
        prefill: {
          name: orderData.name,
          email: orderData.email,
          contact: orderData.phone
        },
        handler: this.handlePaymentSuccess
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },

    async handlePaymentSuccess(response) {
      try {
        this.loading = true;
        const verifyResponse = await fetch(`${process.env.VUE_APP_API_URL}/payment/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })
        });

        const data = await verifyResponse.json();
        if (data.success) {
          this.$emit('payment-success', data.data);
          this.resetForm();
          this.$emit('close');
        } else {
          this.error = 'Payment verification failed';
        }
      } catch (err) {
        this.error = 'Payment verification error';
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        amount: '',
        password: ''
      };
    }
  }
};
</script>
```

---

## Pure JavaScript

### HTML

```html
<!-- payment.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f5f5f5; }
    .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 50; }
    .modal.active { display: flex; align-items: center; justify-content: center; }
    .modal-content { background: white; width: 90%; max-width: 500px; padding: 30px; border-radius: 8px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    button { width: 100%; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
    .btn-submit { background: #3498db; color: white; margin-top: 20px; }
    .btn-submit:hover { background: #2980b9; }
    .error { color: red; padding: 10px; background: #fee; border-radius: 4px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <button onclick="openPaymentModal()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
    Make Donation
  </button>

  <div id="paymentModal" class="modal">
    <div class="modal-content">
      <h2>Make a Donation</h2>
      <div id="error" class="error" style="display: none;"></div>
      <form id="paymentForm">
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" id="name" required>
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input type="email" id="email" required>
        </div>
        <div class="form-group">
          <label>Phone *</label>
          <input type="tel" id="phone" pattern="[6-9]\d{9}" required>
        </div>
        <div class="form-group">
          <label>Amount (₹) *</label>
          <input type="number" id="amount" min="1" max="100000" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="password">
        </div>
        <button type="submit" class="btn-submit">Proceed to Payment</button>
      </form>
    </div>
  </div>

  <script src="payment.js"></script>
</body>
</html>
```

### JavaScript

```javascript
// payment.js
const API_URL = 'http://localhost:5000/api/v1';

function openPaymentModal() {
  document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
  document.getElementById('paymentModal').classList.remove('active');
  document.getElementById('paymentForm').reset();
}

document.getElementById('paymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const errorDiv = document.getElementById('error');
  errorDiv.style.display = 'none';

  try {
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      amount: parseFloat(document.getElementById('amount').value),
      password: document.getElementById('password').value || undefined
    };

    const response = await fetch(`${API_URL}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      openRazorpayCheckout(data.data);
    } else {
      showError(data.message);
    }
  } catch (error) {
    showError('Error creating order');
    console.error(error);
  }
});

function openRazorpayCheckout(orderData) {
  const options = {
    key: orderData.keyId,
    amount: orderData.amount * 100,
    currency: 'INR',
    order_id: orderData.orderId,
    name: 'Temple Donation',
    description: orderData.description,
    prefill: {
      name: orderData.name,
      email: orderData.email,
      contact: orderData.phone
    },
    handler: handlePaymentSuccess,
    modal: {
      ondismiss: () => showError('Payment cancelled')
    }
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
}

async function handlePaymentSuccess(response) {
  try {
    const verifyResponse = await fetch(`${API_URL}/payment/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      })
    });

    const data = await verifyResponse.json();
    if (data.success) {
      alert('Payment successful!');
      closePaymentModal();
    } else {
      showError('Payment verification failed');
    }
  } catch (error) {
    showError('Payment verification error');
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

// Close modal when clicking outside
document.getElementById('paymentModal').addEventListener('click', (e) => {
  if (e.target.id === 'paymentModal') {
    closePaymentModal();
  }
});
```

---

## Error Handling

Implement comprehensive error handling:

```javascript
const handlePaymentError = (error) => {
  const errorMessages = {
    'Invalid signature': 'Payment verification failed. Please contact support.',
    'Email does not match': 'Email mismatch. Please use the correct email.',
    'Amount is too large': 'Amount exceeds maximum limit of ₹100,000.',
    'Payment already processed': 'This payment has already been processed.',
    'Unauthorized': 'You are not authorized to access this resource.'
  };

  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.includes(key)) {
      return message;
    }
  }

  return error || 'An unexpected error occurred';
};
```

---

## Best Practices

### 1. Validate Before Sending
```javascript
const validateForm = (data) => {
  if (!data.name || !data.email || !data.phone || !data.amount) {
    throw new Error('All required fields must be filled');
  }
  if (!/^[6-9]\d{9}$/.test(data.phone)) {
    throw new Error('Invalid phone number');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Invalid email');
  }
  if (data.amount < 1 || data.amount > 100000) {
    throw new Error('Amount must be between 1 and 100000');
  }
};
```

### 2. Handle Network Errors
```javascript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
} catch (error) {
  if (error instanceof TypeError) {
    console.error('Network error:', error);
  }
}
```

### 3. Implement Retry Logic
```javascript
async function retryFetch(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}
```

### 4. Security
- Never expose Razorpay Key Secret in frontend code
- Always verify signatures on backend
- Sanitize user input
- Use HTTPS in production

---

## Troubleshooting

### Payment Gateway Not Loading
- Check Razorpay script tag in HTML
- Verify Key ID is correct
- Check browser console for errors

### Signature Verification Fails
- Ensure Order ID, Payment ID match
- Check Key Secret in backend
- Verify signature format

### Amount Not Updating
- Use numeric type for amount input
- Convert string to number before sending
- Validate amount on both frontend and backend

---

**Ready to integrate? Start with the framework that matches your project!**
