const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../services/orderService');

const placeOrder = async (req, res, next) => {
  try {
    const order = await createOrder(req);
    res.status(201).json(order);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await getUserOrders(req.user._id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const getAllOrdersForAdmin = async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatusForAdmin = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrdersForAdmin,
  updateOrderStatusForAdmin
};

