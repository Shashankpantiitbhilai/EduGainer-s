const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');

// Import controllers
const {
  getCategories,
  getCategoryHierarchy,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
} = require('../../../../controllers/ecommerce/categoryController');

// Import middleware
const auth = require('../../../../middleware/auth');

// Configure multer for image uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Maximum 1 file
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
const categoryValidation = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
];

// Public routes
router.get('/', getCategories);
router.get('/hierarchy', getCategoryHierarchy);
router.get('/:id', getCategory);
router.get('/:id/products', getCategoryProducts);

// Admin routes (require authentication)
router.post('/', categoryValidation, createCategory);
router.put('/:id', categoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
