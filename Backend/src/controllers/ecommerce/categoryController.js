const Category = require('../../models/Category');
const Product = require('../../models/Product');
const cloudinary = require('../../config/cloudinary');
const { validationResult } = require('express-validator');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const { includeInactive = false, parentOnly = false } = req.query;

    const filter = {};
    if (!includeInactive) {
      filter.isActive = true;
    }
    if (parentOnly === 'true') {
      filter.parent = { $exists: false };
    }

    const categories = await Category.find(filter)
      .populate('parent', 'name slug')
      .populate('children', 'name slug description image isActive')
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          status: 'active'
        });
        
        return {
          ...category,
          productCount
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get category hierarchy
const getCategoryHierarchy = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('children', 'name slug description image')
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Build hierarchy
    const rootCategories = categories.filter(cat => !cat.parent);
    const hierarchy = buildCategoryTree(rootCategories, categories);

    res.json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    console.error('Error fetching category hierarchy:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category hierarchy',
      error: error.message
    });
  }
};

// Get single category
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOne({
      $or: [{ _id: id }, { slug: id }],
      isActive: true
    })
      .populate('parent', 'name slug')
      .populate('children', 'name slug description image')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get products in this category
    const products = await Product.find({
      category: category._id,
      isActive: true
    })
      .select('name slug price images ratings')
      .sort({ 'analytics.views': -1 })
      .limit(12)
      .lean();

    // Get subcategory product counts
    const subcategoriesWithCounts = await Promise.all(
      category.children.map(async (child) => {
        const productCount = await Product.countDocuments({
          category: child._id,
          isActive: true
        });
        
        return {
          ...child,
          productCount
        };
      })
    );

    // Get breadcrumb path
    const breadcrumb = await buildCategoryBreadcrumb(category);

    res.json({
      success: true,
      data: {
        category: {
          ...category,
          children: subcategoriesWithCounts
        },
        products,
        breadcrumb
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// Create category (Admin only)
const createCategory = async (req, res) => {
  try {
    console.log('Creating category with data:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const categoryData = req.body;

    // Generate slug from name if not provided
    if (!categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
    }

    console.log('Category data with slug:', categoryData);

    // Handle image upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'edugainer/categories',
        resource_type: 'auto'
      });
      categoryData.image = {
        url: result.secure_url,
        publicId: result.public_id,
        alt: categoryData.name
      };
    }

    const category = new Category(categoryData);
    console.log('Category before save:', category);
    await category.save();

    // Update parent's children array if this is a subcategory
    if (category.parent) {
      await Category.findByIdAndUpdate(
        category.parent,
        { $addToSet: { children: category._id } }
      );
    }

    const populatedCategory = await Category.findById(category._id)
      .populate('parent', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: populatedCategory
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle image upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'edugainer/categories',
        resource_type: 'auto'
      });
      updateData.image = {
        url: result.secure_url,
        publicId: result.public_id,
        alt: updateData.name || 'Category image'
      };
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { hardDelete = false } = req.query;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0 && hardDelete !== 'true') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} products. Move products first or use hard delete.`,
        productCount
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parent: id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${subcategoryCount} subcategories. Delete subcategories first.`,
        subcategoryCount
      });
    }

    if (hardDelete === 'true') {
      // Hard delete - remove from database
      if (category.image && category.image.publicId) {
        await cloudinary.uploader.destroy(category.image.publicId);
      }

      // Remove from parent's children array
      if (category.parent) {
        await Category.findByIdAndUpdate(
          category.parent,
          { $pull: { children: category._id } }
        );
      }

      await Category.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Category permanently deleted'
      });
    } else {
      // Soft delete - just mark as inactive
      category.isActive = false;
      await category.save();

      res.json({
        success: true,
        message: 'Category deactivated successfully',
        data: category
      });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// Get category products
const getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      rating,
      inStock
    } = req.query;

    const category = await Category.findOne({
      $or: [{ _id: id }, { slug: id }],
      isActive: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get all descendant categories
    const descendantCategories = await getDescendantCategories(category._id);
    const categoryIds = [category._id, ...descendantCategories];

    // Build filter
    const filter = {
      category: { $in: categoryIds },
      isActive: true
    };

    if (minPrice || maxPrice) {
      filter['price.current'] = {};
      if (minPrice) filter['price.current'].$gte = Number(minPrice);
      if (maxPrice) filter['price.current'].$lte = Number(maxPrice);
    }

    if (rating) {
      filter['ratings.average'] = { $gte: Number(rating) };
    }

    if (inStock === 'true') {
      filter.stockQuantity = { $gt: 0 };
    }

    // Build sort
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        category: {
          id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description
        },
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
    console.error('Error fetching category products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category products',
      error: error.message
    });
  }
};

// Helper functions
const buildCategoryTree = (rootCategories, allCategories) => {
  return rootCategories.map(category => {
    const children = allCategories.filter(cat => 
      cat.parent && cat.parent.toString() === category._id.toString()
    );
    
    return {
      ...category,
      children: children.length > 0 ? buildCategoryTree(children, allCategories) : []
    };
  });
};

const buildCategoryBreadcrumb = async (category) => {
  const breadcrumb = [{ id: category._id, name: category.name, slug: category.slug }];
  
  let currentCategory = category;
  while (currentCategory.parent) {
    const parent = await Category.findById(currentCategory.parent).select('name slug parent');
    if (parent) {
      breadcrumb.unshift({ id: parent._id, name: parent.name, slug: parent.slug });
      currentCategory = parent;
    } else {
      break;
    }
  }
  
  return breadcrumb;
};

const getDescendantCategories = async (categoryId) => {
  const descendants = [];
  const children = await Category.find({ parent: categoryId }).select('_id');
  
  for (const child of children) {
    descendants.push(child._id);
    const grandchildren = await getDescendantCategories(child._id);
    descendants.push(...grandchildren);
  }
  
  return descendants;
};

module.exports = {
  getCategories,
  getCategoryHierarchy,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
};
