const Wishlist = require('../../models/Wishlist');
const Product = require('../../models/Product');
const Cart = require('../../models/Cart');
const { validationResult } = require('express-validator');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name slug price images category isActive stockQuantity',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      })
      .lean();

    if (!wishlist) {
      wishlist = {
        user: userId,
        items: [],
        itemsCount: 0,
        totalEstimatedValue: 0
      };
    }

    // Check if any products are no longer available or out of stock
    const updatedItems = wishlist.items ? wishlist.items.filter(item => 
      item.product && item.product.isActive
    ) : [];

    // Add availability status to items
    const itemsWithAvailability = updatedItems.map(item => ({
      ...item,
      isAvailable: item.product.isActive && item.product.stockQuantity > 0,
      stockStatus: item.product.stockQuantity === 0 ? 'out_of_stock' : 
                   item.product.stockQuantity < 5 ? 'low_stock' : 'in_stock'
    }));

    res.json({
      success: true,
      data: {
        ...wishlist,
        items: itemsWithAvailability,
        itemsCount: itemsWithAvailability.length
      }
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
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
    const { 
      productId, 
      priority = 'medium', 
      notes = '',
      notifyOnPriceDrop = false,
      priceDropThreshold = null 
    } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ 
        user: userId, 
        items: [],
        name: 'My Wishlist'
      });
    }

    try {
      // Add item to wishlist
      const addedItem = wishlist.addItem(
        productId, 
        priority, 
        notes, 
        notifyOnPriceDrop, 
        priceDropThreshold
      );
      
      // Set price when added for price drop tracking
      addedItem.priceWhenAdded = product.price.current;
      
      await wishlist.save();

      // Populate for response
      const populatedWishlist = await Wishlist.findById(wishlist._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images category',
          populate: {
            path: 'category',
            select: 'name'
          }
        });

      res.json({
        success: true,
        message: 'Item added to wishlist successfully',
        data: {
          wishlist: populatedWishlist,
          addedItem: {
            product: product.name,
            priority: addedItem.priority,
            addedAt: addedItem.addedAt
          }
        }
      });
    } catch (wishlistError) {
      return res.status(400).json({
        success: false,
        message: wishlistError.message
      });
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to wishlist',
      error: error.message
    });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    try {
      const removedItem = wishlist.removeItem(productId);
      await wishlist.save();

      // Populate for response
      const populatedWishlist = await Wishlist.findById(wishlist._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images category',
          populate: {
            path: 'category',
            select: 'name'
          }
        });

      res.json({
        success: true,
        message: 'Item removed from wishlist successfully',
        data: {
          wishlist: populatedWishlist,
          removedItem
        }
      });
    } catch (wishlistError) {
      return res.status(400).json({
        success: false,
        message: wishlistError.message
      });
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from wishlist',
      error: error.message
    });
  }
};

// Update wishlist item
const updateWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const updates = req.body;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    try {
      const updatedItem = wishlist.updateItem(productId, updates);
      await wishlist.save();

      res.json({
        success: true,
        message: 'Wishlist item updated successfully',
        data: {
          updatedItem
        }
      });
    } catch (wishlistError) {
      return res.status(400).json({
        success: false,
        message: wishlistError.message
      });
    }
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating wishlist item',
      error: error.message
    });
  }
};

// Move item from wishlist to cart
const moveToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    try {
      const result = await wishlist.moveToCart(productId, quantity);
      await wishlist.save();

      // Populate cart for response
      const populatedCart = await Cart.findById(result.cart._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images'
        });

      // Populate wishlist for response
      const populatedWishlist = await Wishlist.findById(wishlist._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images category',
          populate: {
            path: 'category',
            select: 'name'
          }
        });

      res.json({
        success: true,
        message: 'Item moved to cart successfully',
        data: {
          cart: populatedCart,
          wishlist: populatedWishlist,
          movedItem: result.removedItem
        }
      });
    } catch (wishlistError) {
      return res.status(400).json({
        success: false,
        message: wishlistError.message
      });
    }
  } catch (error) {
    console.error('Error moving to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error moving item to cart',
      error: error.message
    });
  }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.clearWishlist();
    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: wishlist
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing wishlist',
      error: error.message
    });
  }
};

// Get wishlist by priority
const getWishlistByPriority = async (req, res) => {
  try {
    const userId = req.user.id;
    const { priority } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name slug price images category isActive',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .lean();

    if (!wishlist) {
      return res.json({
        success: true,
        data: {
          items: [],
          count: 0
        }
      });
    }

    const priorityItems = wishlist.items.filter(item => 
      item.priority === priority && item.product && item.product.isActive
    );

    res.json({
      success: true,
      data: {
        priority,
        items: priorityItems,
        count: priorityItems.length
      }
    });
  } catch (error) {
    console.error('Error fetching wishlist by priority:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist by priority',
      error: error.message
    });
  }
};

// Share wishlist
const shareWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, permissions = 'view' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for sharing'
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    try {
      const shareToken = wishlist.shareWith(email, permissions);
      await wishlist.save();

      // Generate share URL
      const shareUrl = `${process.env.FRONTEND_URL}/wishlist/shared/${shareToken}`;

      res.json({
        success: true,
        message: 'Wishlist shared successfully',
        data: {
          shareToken,
          shareUrl,
          sharedWith: email,
          permissions
        }
      });
    } catch (shareError) {
      return res.status(400).json({
        success: false,
        message: shareError.message
      });
    }
  } catch (error) {
    console.error('Error sharing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing wishlist',
      error: error.message
    });
  }
};

// Get shared wishlist
const getSharedWishlist = async (req, res) => {
  try {
    const { shareToken } = req.params;

    const wishlist = await Wishlist.findByShareToken(shareToken);
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Shared wishlist not found or invalid token'
      });
    }

    // Filter out inactive products
    const activeItems = wishlist.items.filter(item => 
      item.product && item.product.isActive
    );

    res.json({
      success: true,
      data: {
        wishlist: {
          ...wishlist,
          items: activeItems,
          itemsCount: activeItems.length
        },
        owner: {
          name: `${wishlist.user.firstName} ${wishlist.user.lastName}`,
          email: wishlist.user.email
        }
      }
    });
  } catch (error) {
    console.error('Error fetching shared wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shared wishlist',
      error: error.message
    });
  }
};

// Revoke wishlist share
const revokeWishlistShare = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    try {
      const revokedShare = wishlist.revokeShare(email);
      await wishlist.save();

      res.json({
        success: true,
        message: 'Wishlist share revoked successfully',
        data: {
          revokedShare
        }
      });
    } catch (revokeError) {
      return res.status(400).json({
        success: false,
        message: revokeError.message
      });
    }
  } catch (error) {
    console.error('Error revoking wishlist share:', error);
    res.status(500).json({
      success: false,
      message: 'Error revoking wishlist share',
      error: error.message
    });
  }
};

// Get price drop alerts for user's wishlist
const getPriceDropAlerts = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId })
      .populate('items.product', 'name slug price images')
      .lean();

    if (!wishlist) {
      return res.json({
        success: true,
        data: {
          alerts: [],
          count: 0
        }
      });
    }

    // Find items with price drops
    const priceDropItems = wishlist.items.filter(item => {
      if (!item.product || !item.notifyOnPriceDrop || !item.priceWhenAdded) {
        return false;
      }

      const currentPrice = item.product.price.current;
      const originalPrice = item.priceWhenAdded;
      
      if (item.priceDropThreshold) {
        return currentPrice <= originalPrice - item.priceDropThreshold;
      } else {
        return currentPrice < originalPrice;
      }
    });

    const alerts = priceDropItems.map(item => ({
      product: item.product,
      originalPrice: item.priceWhenAdded,
      currentPrice: item.product.price.current,
      savings: item.priceWhenAdded - item.product.price.current,
      savingsPercentage: Math.round(((item.priceWhenAdded - item.product.price.current) / item.priceWhenAdded) * 100),
      addedAt: item.addedAt
    }));

    res.json({
      success: true,
      data: {
        alerts,
        count: alerts.length
      }
    });
  } catch (error) {
    console.error('Error fetching price drop alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching price drop alerts',
      error: error.message
    });
  }
};

module.exports = {
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
};
