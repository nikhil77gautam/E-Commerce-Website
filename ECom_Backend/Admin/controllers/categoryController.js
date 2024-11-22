import Category from "../models/categoryModel.js";
import Product from "../../User/models/productModel.js";
// Add a new category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = new Category({
      name,
    });

    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

// Update an existing category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;

    await category.save();

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};
const updateCategoryCount = async (categoryId) => {
  try {
    const count = await Product.countDocuments({ category: categoryId });
    await Category.findByIdAndUpdate(categoryId, { categoryCount: count });
  } catch (err) {
    console.error("Error updating category count:", err);
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

export {
  addCategory,
  updateCategoryCount,
  getCategories,
  updateCategory,
  deleteCategory,
};
