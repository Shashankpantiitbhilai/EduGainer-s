const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const Inventory = require('../../models/Inventory');
const { validationResult } = require('express-validator');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name slug price images type isActive stockQuantity',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('appliedCoupons.coupon', 'code type value minimumOrderValue')
      .lean();

    if (!cart) {
      cart = {
        user: userId,
        items: [],
        totals: {
          subtotal: 0,
          discount: 0,
          tax: 0,
          shipping: 0,
          total: 0
        },
        appliedCoupons: [],
        itemCount: 0
      };
    }

    // Check product availability and update cart if needed
    const updatedCart = await checkAndUpdateCartAvailability(cart);

    res.json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
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
    const { productId, quantity = 1, variant = null } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check inventory
    const inventory = await Inventory.findOne({ product: productId });
    if (inventory && quantity > inventory.availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${inventory.availableStock} items available in stock`,
        availableStock: inventory.availableStock
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    try {
      // Add item to cart
      const addedItem = cart.addItem(productId, quantity, variant);
      
      // Calculate totals
      await cart.calculateTotals();
      
      // Save cart
      await cart.save();

      // Populate the cart for response
      const populatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images type',
          populate: {
            path: 'category',
            select: 'name'
          }
        })
        .populate('appliedCoupons.coupon', 'code type value');

      res.json({
        success: true,
        message: 'Item added to cart successfully',
        data: {
          cart: populatedCart,
          addedItem
        }
      });
    } catch (cartError) {
      return res.status(400).json({
        success: false,
        message: cartError.message
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check inventory for new quantity
    if (quantity > 0) {
      const inventory = await Inventory.findOne({ product: productId });
      if (inventory && quantity > inventory.availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${inventory.availableStock} items available in stock`,
          availableStock: inventory.availableStock
        });
      }
    }

    try {
      if (quantity === 0) {
        // Remove item if quantity is 0
        cart.removeItem(productId);
      } else {
        // Update quantity
        cart.updateItemQuantity(productId, quantity);
      }

      // Calculate totals
      await cart.calculateTotals();
      
      // Save cart
      await cart.save();

      // Populate for response
      const populatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images type',
          populate: {
            path: 'category',
            select: 'name'
          }
        })
        .populate('appliedCoupons.coupon', 'code type value');

      res.json({
        success: true,
        message: quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',
        data: populatedCart
      });
    } catch (cartError) {
      return res.status(400).json({
        success: false,
        message: cartError.message
      });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    try {
      const removedItem = cart.removeItem(productId);
      
      // Calculate totals
      await cart.calculateTotals();
      
      // Save cart
      await cart.save();

      // Populate for response
      const populatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images type',
          populate: {
            path: 'category',
            select: 'name'
          }
        })
        .populate('appliedCoupons.coupon', 'code type value');

      res.json({
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          cart: populatedCart,
          removedItem
        }
      });
    } catch (cartError) {
      return res.status(400).json({
        success: false,
        message: cartError.message
      });
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.clearCart();
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Apply coupon to cart
const applyCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { couponCode } = req.body;

    if (!couponCode || couponCode.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    try {
      await cart.applyCoupon(couponCode.trim().toUpperCase(), userId);
      await cart.save();

      // Populate for response
      const populatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images type',
          populate: {
            path: 'category',
            select: 'name'
          }
        })
        .populate('appliedCoupons.coupon', 'code type value minimumOrderValue');

      res.json({
        success: true,
        message: 'Coupon applied successfully',
        data: populatedCart
      });
    } catch (couponError) {
      return res.status(400).json({
        success: false,
        message: couponError.message
      });
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying coupon',
      error: error.message
    });
  }
};

// Remove coupon from cart
const removeCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { couponCode } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    try {
      cart.removeCoupon(couponCode);
      await cart.save();

      // Populate for response
      const populatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images type',
          populate: {
            path: 'category',
            select: 'name'
          }
        })
        .populate('appliedCoupons.coupon', 'code type value');

      res.json({
        success: true,
        message: 'Coupon removed successfully',
        data: populatedCart
      });
    } catch (couponError) {
      return res.status(400).json({
        success: false,
        message: couponError.message
      });
    }
  } catch (error) {
    console.error('Error removing coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing coupon',
      error: error.message
    });
  }
};

// Move item to wishlist
const moveToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    try {
      const result = await cart.moveToWishlist(productId);
      await cart.save();

      // Populate for response
      const populatedCart = await Cart.findById(cart._id)
        .populate({
          path: 'items.product',
          select: 'name slug price images type',
          populate: {
            path: 'category',
            select: 'name'
          }
        })
        .populate('appliedCoupons.coupon', 'code type value');

      res.json({
        success: true,
        message: 'Item moved to wishlist successfully',
        data: {
          cart: populatedCart,
          movedItem: result.movedItem
        }
      });
    } catch (moveError) {
      return res.status(400).json({
        success: false,
        message: moveError.message
      });
    }
  } catch (error) {
    console.error('Error moving to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error moving item to wishlist',
      error: error.message
    });
  }
};

// Get cart summary (lightweight version)
const getCartSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
      .select('itemCount totals updatedAt')
      .lean();

    if (!cart) {
      return res.json({
        success: true,
        data: {
          itemCount: 0,
          totals: {
            subtotal: 0,
            discount: 0,
            tax: 0,
            shipping: 0,
            total: 0
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        itemCount: cart.itemCount,
        totals: cart.totals,
        lastUpdated: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching cart summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart summary',
      error: error.message
    });
  }
};

// Helper function to check and update cart availability
const checkAndUpdateCartAvailability = async (cart) => {
  if (!cart.items || cart.items.length === 0) {
    return cart;
  }

  let hasChanges = false;
  const updatedItems = [];

  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      // Product is no longer available
      hasChanges = true;
      continue;
    }

    // Check inventory
    const inventory = await Inventory.findOne({ product: item.product._id });
    if (inventory && item.quantity > inventory.availableStock) {
      // Adjust quantity to available stock
      item.quantity = inventory.availableStock;
      item.unavailableReason = inventory.availableStock === 0 ? 'out_of_stock' : 'insufficient_stock';
      hasChanges = true;
    }

    updatedItems.push(item);
  }

  if (hasChanges) {
    // Update the cart in database
    await Cart.findByIdAndUpdate(cart._id, {
      items: updatedItems,
      itemCount: updatedItems.reduce((count, item) => count + item.quantity, 0)
    });
    
    // Recalculate totals
    const cartDoc = await Cart.findById(cart._id);
    await cartDoc.calculateTotals();
    await cartDoc.save();
  }

  return {
    ...cart,
    items: updatedItems,
    hasUnavailableItems: hasChanges
  };
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  moveToWishlist,
  getCartSummary
};
