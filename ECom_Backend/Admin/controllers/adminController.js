import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcrypt";
import User from "../../User/models/userModel.js";
import Product from "../../User/models/productModel.js";
import Category from "../../Admin/models/categoryModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { response } from "express";

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Admin Signup Only:
const signup = async (req, res) => {
  try {
    const joiSchema = Joi.object({
      name: Joi.string().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}"))
        .required(),
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
      role: Joi.string().valid("admin"),
    });

    const { error } = joiSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
      name: newUser.name,
      role: newUser.role,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin CRUD functions that allow real-time viewing and management of product items on the website.
// Create a new product

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    // Multer will populate req.file
    const image = req.file ? req.file.filename : null;
    // Check if the user is an admin
    const isAdmin = req.user.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const newCategory = await Category.findOne({ name: category });
    if (!newCategory) {
      return res
        .status(401)
        .json({ success: false, message: "Category not found" });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      image,
      category,
    });

    const createdProduct = await product.save();

    await Category.updateOne(
      { _id: newCategory._id },
      { $inc: { categoryCount: 1 } }
    );
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Read all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Read products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.body;
    console.log(category);
    const products = await Product.find({ category: category });
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in this category",
      });
    }
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Update a product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    // Handle image upload if a new image is provided
    const image = req.file ? req.file.filename : null;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.stock = stock || product.stock;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Read products by category
const userHomeCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Validate if the category exists
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Find products by category
    const products = await Product.find({ category });

    // Check if any products are found in the category
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: `No products found in the category: ${category}` });
    }

    // Return the list of products
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  signup,
  createProduct,
  getProductsByCategory,
  userHomeCategory,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
