const { validationResult } = require('express-validator');
const Product = require('../models/Product');

// GST is 18% for all items for simplicity
const GST_RATE = 0.18;

// Computes pricing metadata for a single product document
const buildPricingMeta = (productDoc) => {
  const product = productDoc.toObject ? productDoc.toObject() : productDoc;
  const gstAmount = Math.round(product.price * GST_RATE);
  const finalPayableAmount = product.price + gstAmount;
  const discountPercentage =
    product.mrp && product.mrp > 0
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return {
    ...product,
    pricing: {
      mrp: product.mrp,
      price: product.price,
      gstRate: GST_RATE,
      gstAmount,
      finalPayableAmount,
      discountPercentage
    }
  };
};

const getProducts = async (filters = {}) => {
  const { search, category, sort } = filters;

  const query = {};

  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [{ name: regex }, { category: regex }, { targetUser: regex }];
  }

  if (category) {
    query.category = category;
  }

  let sortSpec = { createdAt: -1 };
  if (sort === 'price_asc') {
    sortSpec = { price: 1 };
  } else if (sort === 'price_desc') {
    sortSpec = { price: -1 };
  }

  const products = await Product.find(query).sort(sortSpec);
  return products.map(buildPricingMeta);
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return buildPricingMeta(product);
};

const createProduct = async (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid input');
    error.details = errors.array();
    error.statusCode = 400;
    throw error;
  }

  const { name, description, mrp, price, stock, category, rating, targetUser } = req.body;

  const product = await Product.create({
    name,
    description,
    mrp,
    price,
    stock,
    category,
    rating,
    targetUser
  });

  return buildPricingMeta(product);
};

const updateProduct = async (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid input');
    error.details = errors.array();
    error.statusCode = 400;
    throw error;
  }

  const { id } = req.params;
  const { name, description, mrp, price, stock, category, rating, targetUser } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.mrp = mrp ?? product.mrp;
  product.price = price ?? product.price;
  product.stock = stock ?? product.stock;
  product.category = category ?? product.category;
  product.rating = rating ?? product.rating;
  product.targetUser = targetUser ?? product.targetUser;

  const updated = await product.save();
  return buildPricingMeta(updated);
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  await product.deleteOne();
};

const getLowStockProducts = async (threshold = 5) => {
  const products = await Product.find({ stock: { $lte: threshold } }).sort({ stock: 1 });
  return products;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};

