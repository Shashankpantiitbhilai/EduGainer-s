const express = require('express');
const router = express.Router();
const reviewController = require('../../../../controllers/ecommerce/reviewController');
const { isAuthenticated } = require('../../../../middleware/auth');

// Get reviews for a product
router.get('/product/:productId', reviewController.getProductReviews);

// Get review statistics for a product
router.get('/product/:productId/stats', reviewController.getReviewStats);

// Create a new review (authenticated users only)
router.post('/', isAuthenticated, reviewController.createReview);

// Get user's reviews
router.get('/my-reviews', isAuthenticated, reviewController.getUserReviews);

// Update a review
router.put('/:reviewId', isAuthenticated, reviewController.updateReview);

// Delete a review
router.delete('/:reviewId', isAuthenticated, reviewController.deleteReview);

// Like/unlike a review
router.post('/:reviewId/like', isAuthenticated, reviewController.likeReview);

// Report a review
router.post('/:reviewId/report', isAuthenticated, reviewController.reportReview);

// Get review by ID
router.get('/:reviewId', reviewController.getReview);

module.exports = router;
