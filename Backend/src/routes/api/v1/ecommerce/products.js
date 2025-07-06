const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');

// Import controllers
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getSaleProducts,
  searchProducts,
  getProductReviews,
  uploadProductImages
} = require('../../../../controllers/ecommerce/productController');

// Import middleware
const auth = require('../../../../middleware/auth');

// Configure multer for image uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Validation middleware
const productValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price.selling')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('type')
    .isIn(['physical', 'digital', 'subscription'])
    .withMessage('Product type must be physical, digital, or subscription')
];

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/sale', getSaleProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);
router.get('/:id/reviews', getProductReviews);

// Protected routes (require authentication)
router.post('/upload-images', auth.isAuthenticated, upload.array('images', 10), uploadProductImages);

module.exports = router;
