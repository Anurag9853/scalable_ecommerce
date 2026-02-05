const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies JWT and attaches user to request
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  res.status(401);
  return next(new Error('Not authorized, no token'));
};

// Ensures the authenticated user has ADMIN role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }

  res.status(403);
  return next(new Error('Admin access only'));
};

module.exports = { protect, admin };

