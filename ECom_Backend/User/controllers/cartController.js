import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// User Add a product to the cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid user" });
    }

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product" });
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ user: userId });

    // If cart does not exist, create a new one
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
        totalAmount: product.price * quantity,
      });
    } else {
      //  update the quantity and total amount
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if (productIndex > -1) {
        // Product exists, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Product does not exist in the cart, add it
        cart.products.push({ product: productId, quantity });
      }
      cart.totalAmount += product.price * quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove a product from the cart
const deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    console.log("product id", productId);
    console.log("user id", userId);

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          products: { _id: new mongoose.Types.ObjectId(productId) },
        },
      },
      { new: true }
    );
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Filter out the product to be removed
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save;

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update product quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product" });
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (productIndex > -1) {
      cart.totalAmount -= product.price * cart.products[productIndex].quantity;
      cart.products[productIndex].quantity = quantity;
      cart.totalAmount += product.price * quantity;

      await cart.save();

      res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get the cart for a user
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    console.log(cart);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove all products from the cart
const removeAllProducts = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Clear the cart
    cart.products = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "All products removed from the cart successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  addToCart,
  deleteFromCart,
  removeAllProducts,
  updateCartQuantity,
  getCart,
};
