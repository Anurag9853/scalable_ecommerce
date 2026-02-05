const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req);
    res.status(201).json(result);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req);
    res.json(result);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

module.exports = {
  register,
  login
};

