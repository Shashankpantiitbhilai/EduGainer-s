const Product = require('../../models/Product');

const Review = require('../../models/Review');
const Inventory = require('../../models/Inventory');
const cloudinary = require('../../config/cloudinary');
const { validationResult } = require('express-validator');

// Get all products with filtering, sorting, and pagination
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      rating,
      type,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock,
      featured,
      onSale
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (minPrice || maxPrice) {
      filter['price.selling'] = {};
      if (minPrice) filter['price.selling'].$gte = Number(minPrice);
      if (maxPrice) filter['price.selling'].$lte = Number(maxPrice);
    }

    if (type) {
      filter.productType = type;
    }

    // TODO: Implement ratings system
    // if (rating) {
    //   filter['ratings.average'] = { $gte: Number(rating) };
    // }

    if (inStock === 'true') {
      filter['inventory.quantity'] = { $gt: 0 };
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (onSale === 'true') {
      filter.$expr = { $lt: ['$price.selling', '$price.original'] };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    // Get inventory status for each product
    const productsWithInventory = await Promise.all(
      products.map(async (product) => {
        const inventory = await Inventory.findOne({ product: product._id });
        return {
          ...product,
          stockStatus: inventory ? inventory.stockStatus : 'unknown',
          availableStock: inventory ? inventory.availableStock : 0
        };
      })
    );

    res.json({
      success: true,
      data: {
        products: productsWithInventory,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product by ID or slug
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    const product = await Product.findOne({
      $or: [{ _id: id }, { slug: id }],
      status: 'active'
    })
      .populate('category', 'name slug description')
      .populate('relatedProducts', 'name slug price images')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get inventory information
    const inventory = await Inventory.findOne({ product: product._id });
    
    // Get reviews and ratings
    const reviewStats = await Review.getProductAverageRating(product._id);
    const recentReviews = await Review.find({
      product: product._id,
      isApproved: true,
      isVisible: true
    })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active'
    })
      .select('name slug price images ratings')
      .limit(6)
      .lean();

    // Increment view count
    await Product.findByIdAndUpdate(product._id, {
      $inc: { 'analytics.views': 1 }
    });

    res.json({
      success: true,
      data: {
        product: {
          ...product,
          stockStatus: inventory ? inventory.stockStatus : 'unknown',
          availableStock: inventory ? inventory.availableStock : 0,
          reviews: {
            ...reviewStats,
            recent: recentReviews
          }
        },
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const productData = req.body;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageUploads = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'edugainer/products',
            resource_type: 'auto'
          });
          return {
            url: result.secure_url,
            publicId: result.public_id,
            alt: productData.name
          };
        })
      );
      productData.images = imageUploads;
    }

    // Create the product
    const product = new Product(productData);
    await product.save();

    // Create inventory record
    const inventory = new Inventory({
      product: product._id,
      currentStock: productData.inventory?.quantity || 0,
      lowStockThreshold: productData.inventory?.lowStockThreshold || 10,
      reorderLevel: productData.reorderLevel || 5,
      reorderQuantity: productData.reorderQuantity || 50
    });
    await inventory.save();

    // Populate the response
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUploads = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'edugainer/products',
            resource_type: 'auto'
          });
          return {
            url: result.secure_url,
            publicId: result.public_id,
            alt: updateData.name || 'Product image'
          };
        })
      );
      
      // Add new images to existing ones or replace
      if (updateData.replaceImages === 'true') {
        updateData.images = imageUploads;
      } else {
        const existingProduct = await Product.findById(id);
        updateData.images = [...(existingProduct.images || []), ...imageUploads];
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update inventory if stock quantity changed
    if (updateData.inventory?.quantity !== undefined) {
      await Inventory.findOneAndUpdate(
        { product: id },
        { currentStock: updateData.inventory.quantity },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { hardDelete = false } = req.query;

    if (hardDelete === 'true') {
      // Hard delete - remove from database
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Delete images from cloudinary
      if (product.images && product.images.length > 0) {
        await Promise.all(
          product.images.map(image => 
            cloudinary.uploader.destroy(image.publicId)
          )
        );
      }

      // Delete product and related data
      await Promise.all([
        Product.findByIdAndDelete(id),
        Inventory.findOneAndDelete({ product: id }),
        Review.deleteMany({ product: id })
      ]);

      res.json({
        success: true,
        message: 'Product permanently deleted'
      });
    } else {
      // Soft delete - just mark as inactive
      const product = await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product deactivated successfully',
        data: product
      });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      featured: true,
      status: 'active'
    })
      .populate('category', 'name slug')
      .sort({ 'analytics.views': -1, createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};

// Get products on sale
const getSaleProducts = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      'price.salePrice': { $exists: true },
      status: 'active'
    })
      .populate('category', 'name slug')
      .sort({ 'price.salePercentage': -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments({
      'price.salePrice': { $exists: true },
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        products,
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
    console.error('Error fetching sale products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sale products',
      error: error.message
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q, category, type, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const filter = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      isActive: true
    };

    if (category) filter.category = category;
    if (type) filter.type = type;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .select('name slug price images ratings category type tags')
      .sort({ 'analytics.views': -1, 'ratings.average': -1 })
      .limit(Number(limit))
      .lean();

    // Log search for analytics
    // You could implement search analytics here

    res.json({
      success: true,
      data: {
        query: q,
        results: products,
        count: products.length
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, rating, sortBy = 'createdAt' } = req.query;

    const filter = {
      product: id,
      isApproved: true,
      isVisible: true
    };

    if (rating) {
      filter.rating = Number(rating);
    }

    const skip = (page - 1) * limit;
    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Review.countDocuments(filter);
    const reviewStats = await Review.getProductAverageRating(id);

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

// Upload product images
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const imageUploads = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'edugainer/products',
          resource_type: 'auto'
        });
        return {
          url: result.secure_url,
          publicId: result.public_id,
          alt: 'Product image'
        };
      })
    );

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: imageUploads
    });
  } catch (error) {
    console.error('Error uploading product images:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getSaleProducts,
  searchProducts,
  getProductReviews,
  uploadProductImages
};
