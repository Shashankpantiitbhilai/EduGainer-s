// Export all e-commerce services
export { default as categoryService } from './categoryService';
export { default as productService } from './productService';

// Export separated user and admin services
export { default as userProductService } from './userProductService';
export { default as adminProductService } from './adminProductService';
export { default as userCategoryService } from './userCategoryService';
export { default as adminCategoryService } from './adminCategoryService';

export { default as cartService } from './cartService';
export { default as orderService } from './orderService';
export { default as analyticsService } from './analyticsService';

// Service utilities
export const ECommerceServices = {
  categories: () => import('./categoryService'),
  products: () => import('./productService'),
  cart: () => import('./cartService'),
  orders: () => import('./orderService'),
  analytics: () => import('./analyticsService'),
};

// Common API response handler
export const handleApiResponse = (response) => {
  if (response.success) {
    return response.data;
  }
  throw new Error(response.message || 'API request failed');
};

// Common error handler
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      success: false,
      message: data.message || `Server error: ${status}`,
      status,
      data: data.data || null
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network error: No response from server',
      status: 0,
      data: null
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'Unknown error occurred',
      status: 0,
      data: null
    };
  }
};
