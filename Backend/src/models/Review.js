const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  images: [{
    url: String,
    publicId: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  moderationNote: {
    type: String,
    trim: true
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  moderatedAt: {
    type: Date
  },
  helpfulVotes: {
    count: {
      type: Number,
      default: 0
    },
    voters: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
      },
      isHelpful: Boolean,
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  reply: {
    message: String,
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    repliedAt: Date
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reports: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'fake', 'spam', 'offensive', 'other']
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ product: 1, isApproved: 1, isVisible: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ createdAt: -1 });

// Virtual for net helpful votes
reviewSchema.virtual('netHelpfulVotes').get(function() {
  return this.helpfulVotes.voters.reduce((acc, vote) => {
    return acc + (vote.isHelpful ? 1 : -1);
  }, 0);
});

// Methods
reviewSchema.methods.markHelpful = function(userId, isHelpful) {
  const existingVote = this.helpfulVotes.voters.find(
    vote => vote.user.toString() === userId.toString()
  );

  if (existingVote) {
    // Update existing vote
    const oldValue = existingVote.isHelpful ? 1 : -1;
    const newValue = isHelpful ? 1 : -1;
    existingVote.isHelpful = isHelpful;
    existingVote.votedAt = new Date();
    this.helpfulVotes.count += (newValue - oldValue);
  } else {
    // Add new vote
    this.helpfulVotes.voters.push({
      user: userId,
      isHelpful: isHelpful
    });
    this.helpfulVotes.count += isHelpful ? 1 : -1;
  }
};

reviewSchema.methods.removeHelpfulVote = function(userId) {
  const voteIndex = this.helpfulVotes.voters.findIndex(
    vote => vote.user.toString() === userId.toString()
  );

  if (voteIndex !== -1) {
    const vote = this.helpfulVotes.voters[voteIndex];
    this.helpfulVotes.count -= vote.isHelpful ? 1 : -1;
    this.helpfulVotes.voters.splice(voteIndex, 1);
  }
};

reviewSchema.methods.addReport = function(userId, reason, description) {
  this.reports.push({
    reportedBy: userId,
    reason: reason,
    description: description
  });
  this.isReported = true;
};

// Static methods
reviewSchema.statics.getProductAverageRating = async function(productId) {
  const result = await this.aggregate([
    { 
      $match: { 
        product: mongoose.Types.ObjectId(productId),
        isApproved: true,
        isVisible: true 
      } 
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  result[0].ratingBreakdown.forEach(rating => {
    breakdown[rating]++;
  });

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews,
    ratingBreakdown: breakdown
  };
};

module.exports = mongoose.model('Review', reviewSchema);
