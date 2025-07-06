import { CURRENCY } from './constants';

// Format currency
export const formatCurrency = (amount, currency = CURRENCY.INR) => {
  if (amount === null || amount === undefined) return '₹0';
  
  const formatters = {
    [CURRENCY.INR]: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    [CURRENCY.USD]: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }),
    [CURRENCY.EUR]: new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }),
  };

  return formatters[currency]?.format(amount) || `${currency} ${amount}`;
};

// Format date
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  const formats = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    }
  };

  return dateObj.toLocaleDateString('en-IN', formats[format]);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Calculate discount
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// Calculate total with tax
export const calculateTotalWithTax = (subtotal, taxRate = 0.18) => {
  return subtotal + (subtotal * taxRate);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if product is in stock
export const isInStock = (product) => {
  return product && product.stock > 0 && product.status === 'active';
};

// Get product image URL
export const getProductImageUrl = (product, size = 'medium') => {
  if (!product || !product.images || product.images.length === 0) {
    return '/images/placeholder-product.jpg';
  }
  
  const image = product.images[0];
  return image.url || image;
};

// Calculate cart total
export const calculateCartTotal = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return 0;
  
  return cartItems.reduce((total, item) => {
    const price = item.product?.discountedPrice || item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);
};

// Get order status color
export const getOrderStatusColor = (status) => {
  const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error',
    returned: 'warning',
    refunded: 'secondary'
  };
  
  return statusColors[status] || 'default';
};

// Generate breadcrumb from category
export const generateBreadcrumb = (category) => {
  const breadcrumb = [];
  let current = category;
  
  while (current) {
    breadcrumb.unshift({
      name: current.name,
      slug: current.slug,
      id: current._id
    });
    current = current.parent;
  }
  
  return breadcrumb;
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};
