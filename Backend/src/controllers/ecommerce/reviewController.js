const Review = require('../../models/Review');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const cloudinary = require('../../config/cloudinary');
const { validationResult } = require('express-validator');

// Create a review
const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { productId, orderId, rating, title, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findOne({ 
      _id: orderId, 
      user: userId,
      status: { $in: ['delivered', 'completed'] }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not eligible for review'
      });
    }

    // Check if user purchased this product in this order
    const orderItem = order.items.find(item => 
      item.product.toString() === productId.toString()
    );
    
    if (!orderItem) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in this order'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      product: productId, 
      user: userId 
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review data
    const reviewData = {
      product: productId,
      user: userId,
      order: orderId,
      rating: Number(rating),
      title: title?.trim(),
      comment: comment?.trim(),
      isVerifiedPurchase: true
    };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageUploads = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'edugainer/reviews',
            resource_type: 'auto'
          });
          return {
            url: result.secure_url,
            publicId: result.public_id
          };
        })
      );
      reviewData.images = imageUploads;
    }

    const review = new Review(reviewData);
    await review.save();

    // Update product ratings
    const reviewStats = await Review.getProductAverageRating(productId);
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': reviewStats.averageRating,
      'ratings.count': reviewStats.totalReviews,
      'ratings.breakdown': reviewStats.ratingBreakdown
    });

    // Populate review for response
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName')
      .populate('product', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: populatedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      rating, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      verified = null
    } = req.query;

    const filter = {
      product: productId,
      isApproved: true,
      isVisible: true
    };

    if (rating) {
      filter.rating = Number(rating);
    }

    if (verified !== null) {
      filter.isVerifiedPurchase = verified === 'true';
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Review.countDocuments(filter);
    const reviewStats = await Review.getProductAverageRating(productId);

    res.json({
      success: true,
      data: {
        reviews,
        stats: reviewStats,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product reviews',
      error: error.message
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: userId })
      .populate('product', 'name slug images')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews',
      error: error.message
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update review fields
    if (rating !== undefined) review.rating = Number(rating);
    if (title !== undefined) review.title = title.trim();
    if (comment !== undefined) review.comment = comment.trim();

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUploads = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'edugainer/reviews',
            resource_type: 'auto'
          });
          return {
            url: result.secure_url,
            publicId: result.public_id
          };
        })
      );
      
      // Add new images to existing ones
      review.images = [...(review.images || []), ...imageUploads];
    }

    // Reset approval status for moderation
    review.isApproved = false;
    review.moderatedBy = undefined;
    review.moderatedAt = undefined;

    await review.save();

    // Update product ratings
    const reviewStats = await Review.getProductAverageRating(review.product);
    await Product.findByIdAndUpdate(review.product, {
      'ratings.average': reviewStats.averageRating,
      'ratings.count': reviewStats.totalReviews,
      'ratings.breakdown': reviewStats.ratingBreakdown
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName')
      .populate('product', 'name slug');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: populatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.product;

    // Delete images from cloudinary
    if (review.images && review.images.length > 0) {
      await Promise.all(
        review.images.map(image => 
          cloudinary.uploader.destroy(image.publicId)
        )
      );
    }

    await Review.findByIdAndDelete(id);

    // Update product ratings
    const reviewStats = await Review.getProductAverageRating(productId);
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': reviewStats.averageRating,
      'ratings.count': reviewStats.totalReviews,
      'ratings.breakdown': reviewStats.ratingBreakdown
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Vote on review helpfulness
const voteReviewHelpfulness = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { isHelpful } = req.body;

    if (typeof isHelpful !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isHelpful must be a boolean value'
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is trying to vote on their own review
    if (review.user.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on your own review'
      });
    }

    review.markHelpful(userId, isHelpful);
    await review.save();

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        helpfulVotes: review.helpfulVotes.count,
        netHelpfulVotes: review.netHelpfulVotes
      }
    });
  } catch (error) {
    console.error('Error voting on review:', error);
    res.status(500).json({
      success: false,
      message: 'Error voting on review',
      error: error.message
    });
  }
};

// Remove vote on review helpfulness
const removeReviewVote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.removeHelpfulVote(userId);
    await review.save();

    res.json({
      success: true,
      message: 'Vote removed successfully',
      data: {
        helpfulVotes: review.helpfulVotes.count,
        netHelpfulVotes: review.netHelpfulVotes
      }
    });
  } catch (error) {
    console.error('Error removing review vote:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing review vote',
      error: error.message
    });
  }
};

// Report review
const reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason, description } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Report reason is required'
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already reported this review
    const existingReport = review.reports.find(report => 
      report.reportedBy.toString() === userId.toString()
    );

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    review.addReport(userId, reason, description);
    await review.save();

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error reporting review',
      error: error.message
    });
  }
};

// Get reviewable products for user
const getReviewableProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Find delivered orders for the user
    const orders = await Order.find({
      user: userId,
      status: { $in: ['delivered', 'completed'] }
    })
      .populate('items.product', 'name slug images')
      .lean();

    // Get all products from delivered orders
    const orderProducts = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          orderProducts.push({
            product: item.product,
            orderId: order._id,
            orderNumber: order.orderNumber,
            deliveredAt: order.deliveredAt || order.updatedAt
          });
        }
      });
    });

    // Get existing reviews for these products
    const productIds = orderProducts.map(op => op.product._id);
    const existingReviews = await Review.find({
      user: userId,
      product: { $in: productIds }
    }).select('product').lean();

    const reviewedProductIds = existingReviews.map(review => 
      review.product.toString()
    );

    // Filter out already reviewed products
    const reviewableProducts = orderProducts.filter(op => 
      !reviewedProductIds.includes(op.product._id.toString())
    );

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedProducts = reviewableProducts.slice(skip, skip + Number(limit));
    const total = reviewableProducts.length;

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: skip + Number(limit) < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reviewable products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviewable products',
      error: error.message
    });
  }
};

// Get review statistics for a product
const getReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingCounts: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (!stats.length) {
      return res.json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      });
    }

    const ratingCounts = stats[0].ratingCounts;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    ratingCounts.forEach(rating => {
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalReviews: stats[0].totalReviews,
        averageRating: Number(stats[0].averageRating.toFixed(1)),
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics'
    });
  }
};

// Like or unlike a review
const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const hasLiked = review.helpfulVotes.some(vote => vote.user.toString() === userId);
    
    if (hasLiked) {
      // Remove like
      review.helpfulVotes = review.helpfulVotes.filter(
        vote => vote.user.toString() !== userId
      );
    } else {
      // Add like
      review.helpfulVotes.push({ user: userId, helpful: true });
    }

    await review.save();

    res.json({
      success: true,
      data: {
        liked: !hasLiked,
        helpfulCount: review.helpfulVotes.filter(vote => vote.helpful).length
      }
    });
  } catch (error) {
    console.error('Like review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review like status'
    });
  }
};

// Get single review by ID
const getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId)
      .populate('user', 'name')
      .populate('product', 'name images');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review'
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  voteReviewHelpfulness,
  removeReviewVote,
  reportReview,
  getReviewableProducts,
  getReviewStats,
  likeReview,
  getReview
};
