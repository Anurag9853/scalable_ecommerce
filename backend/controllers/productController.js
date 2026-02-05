const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} = require('../services/productService');

const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;
    const products = await getProducts({ search, category, sort });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

const createNewProduct = async (req, res, next) => {
  try {
    const product = await createProduct(req);
    res.status(201).json(product);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

const updateExistingProduct = async (req, res, next) => {
  try {
    const product = await updateProduct(req);
    res.json(product);
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

const removeProduct = async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode);
    }
    next(err);
  }
};

const getLowStock = async (req, res, next) => {
  try {
    const threshold = req.query.threshold ? Number(req.query.threshold) : 5;
    const products = await getLowStockProducts(threshold);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
  getLowStock
};

