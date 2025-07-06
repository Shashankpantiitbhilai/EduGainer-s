const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controllers
const {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrder,
  cancelOrder,
  requestReturn,
  trackOrder,
  downloadDigitalContent
} = require('../../../../controllers/ecommerce/orderController');

// Import middleware
const auth = require('../../../../middleware/auth');

// Validation middleware
const createOrderValidation = [
  body('shippingAddress.firstName')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must not exceed 50 characters'),
  body('shippingAddress.lastName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must not exceed 50 characters'),
  body('shippingAddress.addressLine1')
    .isLength({ min: 5, max: 100 })
    .withMessage('Address line 1 is required and must be between 5 and 100 characters'),
  body('shippingAddress.city')
    .isLength({ min: 2, max: 50 })
    .withMessage('City is required and must be between 2 and 50 characters'),
  body('shippingAddress.state')
    .isLength({ min: 2, max: 50 })
    .withMessage('State is required and must be between 2 and 50 characters'),
  body('shippingAddress.postalCode')
    .isLength({ min: 5, max: 10 })
    .withMessage('Postal code is required and must be between 5 and 10 characters'),
  body('shippingAddress.phone')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('paymentMethod')
    .optional()
    .isIn(['razorpay', 'cod', 'upi', 'wallet'])
    .withMessage('Invalid payment method')
];

const verifyPaymentValidation = [
  body('razorpay_order_id')
    .isLength({ min: 1 })
    .withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id')
    .isLength({ min: 1 })
    .withMessage('Razorpay payment ID is required'),
  body('razorpay_signature')
    .isLength({ min: 1 })
    .withMessage('Razorpay signature is required'),
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
];

const cancelOrderValidation = [
  body('reason')
    .isIn(['changed_mind', 'found_better_price', 'delivery_delay', 'product_issue', 'other'])
    .withMessage('Valid cancellation reason is required'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
];

const returnRequestValidation = [
  body('reason')
    .isIn(['defective', 'not_as_described', 'wrong_item', 'damaged', 'not_needed', 'other'])
    .withMessage('Valid return reason is required'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item must be specified for return')
];

// All order routes require authentication
router.use(auth.isAuthenticated);

// Order routes
router.post('/create', createOrderValidation, createOrder);
router.post('/verify-payment', verifyPaymentValidation, verifyPayment);
router.get('/', getUserOrders);
router.get('/:id', getOrder);
router.get('/:id/track', trackOrder);

// Order actions
router.post('/:id/cancel', cancelOrderValidation, cancelOrder);
router.post('/:id/return', returnRequestValidation, requestReturn);

// Digital content
router.get('/:id/download/:productId', downloadDigitalContent);

module.exports = router;
