// Product Types
export const PRODUCT_TYPES = {
  DIGITAL: 'digital',
  PHYSICAL: 'physical',
  COURSE: 'course',
  EBOOK: 'ebook',
  SOFTWARE: 'software',
  CERTIFICATE: 'certificate'
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  OUT_OF_STOCK: 'out_of_stock'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
};

// Cart Item Status
export const CART_STATUS = {
  ACTIVE: 'active',
  SAVED_FOR_LATER: 'saved_for_later'
};

// Shipping Status
export const SHIPPING_STATUS = {
  NOT_SHIPPED: 'not_shipped',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  RETURNED: 'returned'
};

// Review Status
export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Coupon Types
export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_SHIPPING: 'free_shipping'
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  INSTITUTION: 'institution'
};

// Category Status
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

// Sort Options
export const SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  RATING_ASC: 'rating_asc',
  RATING_DESC: 'rating_desc',
  CREATED_ASC: 'created_asc',
  CREATED_DESC: 'created_desc',
  POPULARITY: 'popularity'
};

// View Types
export const VIEW_TYPES = {
  GRID: 'grid',
  LIST: 'list'
};

// Filter Types
export const FILTER_TYPES = {
  CATEGORY: 'category',
  PRICE: 'price',
  RATING: 'rating',
  BRAND: 'brand',
  AVAILABILITY: 'availability',
  TYPE: 'type'
};

// API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// File Types
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
};

// Currency
export const CURRENCY = {
  INR: 'INR',
  USD: 'USD',
  EUR: 'EUR'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'edugainer_cart',
  WISHLIST: 'edugainer_wishlist',
  RECENT_PRODUCTS: 'edugainer_recent_products',
  USER_PREFERENCES: 'edugainer_user_preferences',
  SEARCH_HISTORY: 'edugainer_search_history'
};
