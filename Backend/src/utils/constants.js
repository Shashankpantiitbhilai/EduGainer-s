// Application constants

// User roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  SUPER_ADMIN: 'superAdmin'
};

// Authentication strategies
const AUTH_STRATEGIES = {
  LOCAL: 'local',
  GOOGLE: 'google'
};

// User status
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// Payment modes
const PAYMENT_MODES = {
  ONLINE: 'Online',
  OFFLINE: 'offline',
  CASH: 'cash'
};

// Shift timings
const SHIFTS = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
  NIGHT: 'Night'
};

// Booking status
const BOOKING_STATUS = {
  CONFIRMED: 'Confirmed',
  TEMPORARY: 'Temporary',
  DISCONTINUE: 'discontinue',
  PENDING: 'Pending'
};

// Gender options
const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
};

// Month names
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Error messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  ACCESS_DENIED: 'Access denied',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
  DUPLICATE_ENTRY: 'Entry already exists',
  PAYMENT_FAILED: 'Payment verification failed'
};

// Success messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PAYMENT_SUCCESS: 'Payment successful',
  BOOKING_SUCCESS: 'Booking confirmed',
  UPDATE_SUCCESS: 'Updated successfully',
  DELETE_SUCCESS: 'Deleted successfully'
};

module.exports = {
  USER_ROLES,
  AUTH_STRATEGIES,
  USER_STATUS,
  PAYMENT_MODES,
  SHIFTS,
  BOOKING_STATUS,
  GENDER,
  MONTH_NAMES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
