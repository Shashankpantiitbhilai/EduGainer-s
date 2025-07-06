const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controllers
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateWishlistItem,
  moveToCart,
  clearWishlist,
  getWishlistByPriority,
  shareWishlist,
  getSharedWishlist,
  revokeWishlistShare,
  getPriceDropAlerts
} = require('../../../../controllers/ecommerce/wishlistController');

// Import middleware
const auth = require('../../../../middleware/auth');

// Validation middleware
const addToWishlistValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  body('notifyOnPriceDrop')
    .optional()
    .isBoolean()
    .withMessage('Notify on price drop must be a boolean'),
  body('priceDropThreshold')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price drop threshold must be a positive number')
];

const updateWishlistItemValidation = [
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  body('notifyOnPriceDrop')
    .optional()
    .isBoolean()
    .withMessage('Notify on price drop must be a boolean'),
  body('priceDropThreshold')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price drop threshold must be a positive number')
];

const moveToCartValidation = [
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100')
];

const shareWishlistValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('permissions')
    .optional()
    .isIn(['view', 'edit'])
    .withMessage('Permissions must be view or edit')
];

// Public routes
router.get('/shared/:shareToken', getSharedWishlist);

// Protected routes (require authentication)
router.use(auth.isAuthenticated);

// Wishlist routes
router.get('/', getWishlist);
router.post('/add', addToWishlistValidation, addToWishlist);
router.delete('/item/:productId', removeFromWishlist);
router.put('/item/:productId', updateWishlistItemValidation, updateWishlistItem);
router.delete('/clear', clearWishlist);

// Wishlist actions
router.post('/move-to-cart/:productId', moveToCartValidation, moveToCart);
router.get('/priority/:priority', getWishlistByPriority);
router.get('/price-drops', getPriceDropAlerts);

// Sharing
router.post('/share', shareWishlistValidation, shareWishlist);
router.delete('/share/:email', revokeWishlistShare);

module.exports = router;
