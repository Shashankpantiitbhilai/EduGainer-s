// Authentication middleware
const jwt = require('jsonwebtoken');
const { User } = require("../models/student");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    await authenticateUser(req, res, () => {
      if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ error: 'Access denied.' });
  }
};

const authenticateSuperAdmin = async (req, res, next) => {
  try {
    await authenticateUser(req, res, () => {
      if (req.user.role !== 'superAdmin') {
        return res.status(403).json({ error: 'Access denied. Super Admin role required.' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ error: 'Access denied.' });
  }
};

// Session-based authentication middleware for e-commerce
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  // Also check for session user
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication required'
  });
};

// E-commerce specific authentication that ensures user object
const ensureEcommerceAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Please log in to access this feature'
  });
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  authenticateSuperAdmin,
  isAuthenticated,
  ensureEcommerceAuth
};
