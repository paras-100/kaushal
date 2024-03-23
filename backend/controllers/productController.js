import asyncHandler from "express-async-handler";

import Product from "../models/productModel.js";
import User from "../models/userModel.js";

/**
 *  @desc		Get all products
 *  @route	GET /api/products
 * 	@access	public
 */
const getProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.query.userId);
  const userProduct = await Product.find({ user: req.query.userId });
  const allProduct = await Product.find({});

  if (user.isAdmin) {
    res.json(allProduct);
  } else {
    res.json(userProduct);
  }
});

/**
 *  @desc		Get single products
 *  @route	GET /api/products/:id
 * 	@access	public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    console.log(req.params.id);
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }

  // user.products.map((prod) => {
  //   if (prod._id.equals(req.body.id)) {
  //     res.json(prod);
  //   }
  // });
});

/**
 *  @desc		Delete a product
 *  @route	DELETE /api/products/:id
 * 	@access	private/admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

/**
 *  @desc		Create a product
 *  @route	POST /api/products/
 * 	@access	private/admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { userId, productData } = req.body;

  console.log(userId);

  const allProduct = new Product({
    user: userId,
    name: productData.name,
    price: productData.price,
    image: productData.image,
    brand: productData.brand,
    category: productData.category,
    countInStock: productData.countInStock,
    description: productData.countInStock,
  });

  await allProduct.save();

  res.status(201).json({ productCreated: true });
});

/**
 *  @desc		Update a product
 *  @route	PUT /api/products/:id
 * 	@access	private/admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    productId,
  } = req.body;

  const product = await Product.findById(productId);

  console.log(product);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    await product.save();

    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
export {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
};
