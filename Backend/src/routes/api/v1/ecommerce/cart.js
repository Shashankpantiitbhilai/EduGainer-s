const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controllers
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  moveToWishlist,
  getCartSummary
} = require('../../../../controllers/ecommerce/cartController');

// Import middleware
const auth = require('../../../../middleware/auth');

// Validation middleware
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100')
];

const updateCartValidation = [
  body('quantity')
    .isInt({ min: 0, max: 100 })
    .withMessage('Quantity must be between 0 and 100')
];

const applyCouponValidation = [
  body('couponCode')
    .isLength({ min: 1, max: 20 })
    .withMessage('Coupon code is required and must not exceed 20 characters')
];

// All cart routes require authentication
router.use(auth.isAuthenticated);

// Cart routes
router.get('/', getCart);
router.get('/summary', getCartSummary);
router.post('/add', addToCartValidation, addToCart);
router.put('/item/:productId', updateCartValidation, updateCartItem);
router.delete('/item/:productId', removeFromCart);
router.delete('/clear', clearCart);

// Coupon routes
router.post('/coupon', applyCouponValidation, applyCoupon);
router.delete('/coupon/:couponCode', removeCoupon);

// Wishlist integration
router.post('/move-to-wishlist/:productId', moveToWishlist);

module.exports = router;
