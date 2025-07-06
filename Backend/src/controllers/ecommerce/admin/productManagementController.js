const Product = require('../../../models/Product');
const Category = require('../../../models/Category');
const Inventory = require('../../../models/Inventory');
const Review = require('../../../models/Review');
const cloudinary = require('../../../config/cloudinary');
const { validationResult } = require('express-validator');

// Get all products for admin
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeInactive = true
    } = req.query;

    // Build filter
    const filter = {};
    
    if (status) {
      filter.status = status;
    } else if (!includeInactive) {
      filter.status = 'active';
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (type) {
      filter.productType = type;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get inventory info for each product
    const productsWithInventory = await Promise.all(
      products.map(async (product) => {
        const inventory = await Inventory.findOne({ product: product._id });
        return {
          ...product,
          inventory: inventory ? {
            currentStock: inventory.currentStock,
            reservedStock: inventory.reservedStock,
            availableStock: inventory.availableStock,
            stockStatus: inventory.stockStatus,
            lowStockThreshold: inventory.lowStockThreshold
          } : null
        };
      })
    );

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products: productsWithInventory,
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
    console.error('Error fetching products for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Create product (Admin)
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

    // Add required fields
    productData.createdBy = req.user?.id || req.user?._id || '507f1f77bcf86cd799439011'; // Default admin user ID
    
    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Ensure slug is unique
      let baseSlug = productData.slug;
      let counter = 1;
      while (await Product.findOne({ slug: productData.slug })) {
        productData.slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

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
            altText: productData.name
          };
        })
      );
      productData.images = imageUploads;
    }

    // Parse JSON fields if they come as strings
    if (typeof productData.specifications === 'string') {
      productData.specifications = JSON.parse(productData.specifications);
    }
    if (typeof productData.variants === 'string') {
      productData.variants = JSON.parse(productData.variants);
    }
    if (typeof productData.digitalContent === 'string') {
      productData.digitalContent = JSON.parse(productData.digitalContent);
    }

    const product = new Product(productData);
    await product.save();

    // Create inventory record
    const inventoryData = {
      product: product._id,
      currentStock: productData.stockQuantity || 0,
      lowStockThreshold: productData.lowStockThreshold || 10,
      reorderLevel: productData.reorderLevel || 5,
      reorderQuantity: productData.reorderQuantity || 50,
      costPrice: productData.costPrice,
      maxStockLevel: productData.maxStockLevel || 1000
    };

    if (productData.supplier) {
      inventoryData.supplier = productData.supplier;
    }

    const inventory = new Inventory(inventoryData);
    await inventory.save();

    // Populate for response
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

// Update product (Admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Add updatedBy field
    updateData.updatedBy = req.user?.id || req.user?._id || '507f1f77bcf86cd799439011';

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
            altText: updateData.name || 'Product image'
          };
        })
      );
      
      if (updateData.replaceImages === 'true') {
        // Delete old images from cloudinary
        const existingProduct = await Product.findById(id);
        if (existingProduct && existingProduct.images) {
          await Promise.all(
            existingProduct.images.map(image => 
              cloudinary.uploader.destroy(image.publicId)
            )
          );
        }
        updateData.images = imageUploads;
      } else {
        const existingProduct = await Product.findById(id);
        updateData.images = [...(existingProduct.images || []), ...imageUploads];
      }
    }

    // Parse JSON fields if they come as strings
    if (typeof updateData.specifications === 'string') {
      updateData.specifications = JSON.parse(updateData.specifications);
    }
    if (typeof updateData.variants === 'string') {
      updateData.variants = JSON.parse(updateData.variants);
    }
    if (typeof updateData.digitalContent === 'string') {
      updateData.digitalContent = JSON.parse(updateData.digitalContent);
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

    // Update inventory if relevant fields changed
    const inventoryUpdateData = {};
    if (updateData.stockQuantity !== undefined) {
      inventoryUpdateData.currentStock = updateData.stockQuantity;
    }
    if (updateData.lowStockThreshold !== undefined) {
      inventoryUpdateData.lowStockThreshold = updateData.lowStockThreshold;
    }
    if (updateData.reorderLevel !== undefined) {
      inventoryUpdateData.reorderLevel = updateData.reorderLevel;
    }
    if (updateData.reorderQuantity !== undefined) {
      inventoryUpdateData.reorderQuantity = updateData.reorderQuantity;
    }
    if (updateData.costPrice !== undefined) {
      inventoryUpdateData.costPrice = updateData.costPrice;
    }
    if (updateData.maxStockLevel !== undefined) {
      inventoryUpdateData.maxStockLevel = updateData.maxStockLevel;
    }

    if (Object.keys(inventoryUpdateData).length > 0) {
      await Inventory.findOneAndUpdate(
        { product: id },
        inventoryUpdateData,
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

// Delete product (Admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { hardDelete = false } = req.query;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (hardDelete === 'true') {
      // Check for existing orders
      const Order = require('../../../models/Order');
      const orderCount = await Order.countDocuments({
        'items.product': id
      });

      if (orderCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot permanently delete product with ${orderCount} existing orders. Use soft delete instead.`,
          orderCount
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

      // Delete related data
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
      // Soft delete
      product.status = 'inactive';
      await product.save();

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

// Bulk update products (Admin)
const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, action, data } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs are required'
      });
    }

    const results = [];

    for (const productId of productIds) {
      try {
        const product = await Product.findById(productId);
        if (!product) {
          results.push({
            productId,
            success: false,
            message: 'Product not found'
          });
          continue;
        }

        switch (action) {
          case 'updateStatus':
            product.status = data.status || 'active';
            await product.save();
            break;
          
          case 'updateCategory':
            product.category = data.categoryId;
            await product.save();
            break;
          
          case 'updatePrice':
            if (data.priceChange) {
              if (data.priceChange.type === 'percentage') {
                const multiplier = 1 + (data.priceChange.value / 100);
                product.price.current = Math.round(product.price.current * multiplier * 100) / 100;
              } else if (data.priceChange.type === 'fixed') {
                product.price.current += data.priceChange.value;
              }
              await product.save();
            }
            break;
          
          case 'updateStock':
            const inventory = await Inventory.findOne({ product: productId });
            if (inventory) {
              if (data.stockUpdate.type === 'set') {
                inventory.adjustStock(data.stockUpdate.quantity, 'bulk_update', req.user.id);
              } else if (data.stockUpdate.type === 'add') {
                inventory.addStock(data.stockUpdate.quantity, 'bulk_update', '', req.user.id);
              } else if (data.stockUpdate.type === 'subtract') {
                inventory.removeStock(data.stockUpdate.quantity, 'bulk_update', '', req.user.id);
              }
              await inventory.save();
            }
            break;
          
          default:
            results.push({
              productId,
              success: false,
              message: 'Invalid action'
            });
            continue;
        }

        results.push({
          productId,
          success: true,
          message: 'Updated successfully'
        });
      } catch (error) {
        results.push({
          productId,
          success: false,
          message: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Bulk update completed. ${successCount} successful, ${failureCount} failed.`,
      data: {
        results,
        summary: {
          total: productIds.length,
          successful: successCount,
          failed: failureCount
        }
      }
    });
  } catch (error) {
    console.error('Error in bulk update products:', error);
    res.status(500).json({
      success: false,
      message: 'Error in bulk update',
      error: error.message
    });
  }
};

// Get product analytics (Admin)
const getProductAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    if (!startDate) {
      start.setDate(start.getDate() - 30);
    }

    // Product performance
    const Order = require('../../../models/Order');
    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ['completed', 'delivered'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orderCount: { $sum: 1 },
          averagePrice: { $avg: '$items.price' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productName: '$product.name',
          productSlug: '$product.slug',
          category: '$product.category',
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
          averagePrice: 1
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 20 }
    ]);

    // Category performance
    const categoryPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ['completed', 'delivered'] }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          productCount: { $addToSet: '$product._id' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryName: '$category.name',
          categorySlug: '$category.slug',
          totalQuantity: 1,
          totalRevenue: 1,
          uniqueProducts: { $size: '$productCount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Stock alerts
    const lowStockProducts = await Inventory.getLowStockProducts();
    const outOfStockProducts = await Inventory.getOutOfStockProducts();

    // Product ratings summary
    const ratingsStats = await Review.aggregate([
      {
        $match: {
          isApproved: true,
          isVisible: true
        }
      },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingBreakdown: {
            $push: '$rating'
          }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productName: '$product.name',
          productSlug: '$product.slug',
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1
        }
      },
      { $sort: { averageRating: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        topSellingProducts,
        categoryPerformance,
        stockAlerts: {
          lowStock: lowStockProducts.length,
          outOfStock: outOfStockProducts.length,
          lowStockProducts: lowStockProducts.slice(0, 10),
          outOfStockProducts: outOfStockProducts.slice(0, 10)
        },
        topRatedProducts: ratingsStats,
        period: { start, end }
      }
    });
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product analytics',
      error: error.message
    });
  }
};

// Export products to CSV (Admin)
const exportProducts = async (req, res) => {
  try {
    const { category, status, type } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status !== undefined) filter.status = status;
    if (type) filter.productType = type;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .lean();

    // Get inventory for each product
    const productsWithInventory = await Promise.all(
      products.map(async (product) => {
        const inventory = await Inventory.findOne({ product: product._id });
        return {
          ...product,
          inventory
        };
      })
    );

    const csvHeaders = [
      'Name',
      'SKU',
      'Category',
      'Type',
      'Price',
      'Sale Price',
      'Stock',
      'Status',
      'Created Date'
    ];

    const csvRows = productsWithInventory.map(product => [
      product.name,
      product.sku,
      product.category?.name || '',
      product.productType,
      product.price.selling,
      product.price.original || '',
      product.inventory?.currentStock || 0,
      product.status,
      product.createdAt.toISOString().split('T')[0]
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products-export.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting products:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting products',
      error: error.message
    });
  }
};

// Get single product for admin
const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get inventory data
    const inventory = await Inventory.findOne({ product: productId });
    
    // Get reviews data
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate review statistics
    const reviewStats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const productWithDetails = {
      ...product,
      inventory: inventory || { currentStock: 0, reservedStock: 0, lowStockThreshold: 10 },
      reviews: reviews,
      reviewStats: reviewStats[0] || { averageRating: 0, totalReviews: 0, ratingDistribution: [] }
    };

    res.json({
      success: true,
      data: productWithDetails
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

// Toggle product status (active/inactive)
const toggleProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    product.status = newStatus;
    await product.save();

    res.json({
      success: true,
      message: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: {
        productId: product._id,
        status: product.status
      }
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling product status',
      error: error.message
    });
  }
};

// Import products from CSV
const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is required'
      });
    }

    const csvData = req.file.buffer.toString('utf8');
    const lines = csvData.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'CSV file must contain header and at least one data row'
      });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const results = {
      imported: 0,
      skipped: 0,
      errors: []
    };

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const productData = {};

        headers.forEach((header, index) => {
          if (values[index]) {
            switch (header.toLowerCase()) {
              case 'name':
                productData.name = values[index];
                break;
              case 'description':
                productData.description = values[index];
                break;
              case 'price':
                productData.price = { current: parseFloat(values[index]) };
                break;
              case 'category':
                // Find category by name
                productData.categoryName = values[index];
                break;
              case 'sku':
                productData.sku = values[index];
                break;
              case 'type':
                productData.type = values[index];
                break;
              case 'stock':
                productData.initialStock = parseInt(values[index]);
                break;
            }
          }
        });

        // Validate required fields
        if (!productData.name || !productData.price?.current) {
          results.errors.push(`Row ${i + 1}: Missing required fields (name, price)`);
          results.skipped++;
          continue;
        }

        // Find or create category
        if (productData.categoryName) {
          let category = await Category.findOne({ name: productData.categoryName });
          if (!category) {
            category = new Category({
              name: productData.categoryName,
              slug: productData.categoryName.toLowerCase().replace(/\s+/g, '-')
            });
            await category.save();
          }
          productData.category = category._id;
          delete productData.categoryName;
        }

        // Check if product with same SKU exists
        if (productData.sku) {
          const existingProduct = await Product.findOne({ sku: productData.sku });
          if (existingProduct) {
            results.errors.push(`Row ${i + 1}: Product with SKU ${productData.sku} already exists`);
            results.skipped++;
            continue;
          }
        }

        // Create product
        const product = new Product(productData);
        await product.save();

        // Create inventory record if stock provided
        if (productData.initialStock) {
          const inventory = new Inventory({
            product: product._id,
            currentStock: productData.initialStock,
            reservedStock: 0,
            lowStockThreshold: Math.max(5, Math.floor(productData.initialStock * 0.1))
          });
          await inventory.save();
        }

        results.imported++;
      } catch (error) {
        results.errors.push(`Row ${i + 1}: ${error.message}`);
        results.skipped++;
      }
    }

    res.json({
      success: true,
      message: 'Product import completed',
      data: results
    });
  } catch (error) {
    console.error('Error importing products:', error);
    res.status(500).json({
      success: false,
      message: 'Error importing products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  bulkUpdateProducts,
  importProducts,
  getProductAnalytics,
  exportProducts
};
