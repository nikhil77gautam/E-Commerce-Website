// Admin can see and control all order status of customer
import {
  adminGetOrdersByStatus,
  adminUpdateOrderStatus,
} from "../../Admin/controllers/adminOrderController.js";

// Multer file upload routes
import upload from "../../middleware/multer/multerConfig.js";

// Admin Control Category
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../Admin/controllers/categoryController.js";

//  Admin Can Controls All Its Routes:
import express from "express";

import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../../Admin/controllers/adminController.js";
import { adminGetAllOrders } from "../../Admin/controllers/adminOrderController.js";
import { signup as adminSignup } from "../../Admin/controllers/adminController.js";
import { authenticateUser, isAdmin } from "../../middleware/authMiddleware.js";

import { getProductsByCategory } from "../../Admin/controllers/adminController.js";

import { userHomeCategory } from "../../Admin/controllers/adminController.js";
import {
  addSupportMessage,
  getAllSupportMessages,
  getSupportMessageById,
  updateMessageStatus,
  deleteSupportMessage,
} from "../../Admin/controllers/messageSupportController.js";

// Admin can see total customer who created
import { getTotalUsers } from "../../Admin/controllers/totalCustomerController.js";

// Admin access Income
import {
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from "../../Admin/controllers/incomeController.js";

// Admin access Expense details
import {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../../Admin/controllers/expenseController.js";

const router = express.Router();

// Admin routes for CRUD operations
router.post("/admin/signup", adminSignup);
router.post(
  "/createProduct",
  authenticateUser,
  isAdmin,
  upload.single("image"),
  createProduct
);
router.get("/getAllProducts", getAllProducts);
router.put(
  "/updateProduct/:id",
  authenticateUser,
  isAdmin,
  upload.single("image"),
  updateProduct
);
router.delete("/deleteProduct/:id", authenticateUser, isAdmin, deleteProduct);

// Admin Get All Orders details
router.get("/adminGetAllOrders", authenticateUser, adminGetAllOrders);

// Get orders by status
router.get("/orders/status/:status", adminGetOrdersByStatus);

// Update order status
router.put("/orders/:id/status", adminUpdateOrderStatus);

// Admin CRUD Category Routes
router.get("/categories", authenticateUser, getCategories);
router.post("/category", authenticateUser, isAdmin, addCategory);
router.put("/category/:id", authenticateUser, isAdmin, updateCategory);
router.delete("/category/:id", authenticateUser, isAdmin, deleteCategory);

// Admin Route for getting products by category
router.post("/products/category", authenticateUser, getProductsByCategory);

// User Read products by category
router.get("/category/:category", authenticateUser, userHomeCategory);

// Admin and User Support message routes
router.post("/contact-support", authenticateUser, addSupportMessage);
router.get(
  "/support-messages",
  authenticateUser,
  isAdmin,
  getAllSupportMessages
);
router.get(
  "/support-messages/:id",
  authenticateUser,
  isAdmin,
  getSupportMessageById
);
router.put(
  "/support-messages/:id",
  authenticateUser,
  isAdmin,
  updateMessageStatus
);
router.delete(
  "/support-messages/:id",
  authenticateUser,
  isAdmin,
  deleteSupportMessage
);

// Admin get Total Customers
router.get("/admin/users", authenticateUser, isAdmin, getTotalUsers);

// Admin get CRUD Income details
// router.post("/addIncome", authenticateUser, isAdmin, addIncome);
router.get("/getIncomes", authenticateUser, isAdmin, getIncomes);
router.get("/incomes/:id", authenticateUser, isAdmin, getIncomeById);
router.put("/incomes/:id", authenticateUser, isAdmin, updateIncome);
router.delete("/incomes/:id", authenticateUser, isAdmin, deleteIncome);

// Admin get CRUD Expense details
router.post("/addExpense", authenticateUser, isAdmin, addExpense);
router.get("/getExpenses", authenticateUser, isAdmin, getExpenses);
router.get("/getExpense/:id", authenticateUser, isAdmin, getExpenseById);
router.put("/updateExpense/:id", authenticateUser, isAdmin, updateExpense);
router.delete("/deleteExpense/:id", authenticateUser, isAdmin, deleteExpense);

export default router;
