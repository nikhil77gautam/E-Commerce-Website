import Expense from "../models/expenseModel.js";

// Add a new expense
const addExpense = async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    // Create a new expense
    const expense = new Expense({
      user: req.user.userId,
      description,
      category,
      amount,
    });

    await expense.save();
    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all expenses for a user
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific expense by ID
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    // Find the expense by ID and update it
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { description, amount, category },
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
