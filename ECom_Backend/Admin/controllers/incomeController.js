import Income from "../models/incomeModel.js";

// Get all incomes
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().populate({
      path: "userId",
      select: "name",
    });
    console.log(incomes);
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error getting incomes", error });
  }
};

// Get income by ID
const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id).populate({
      path: "userId",
      select: "name email",
    });

    if (!income) return res.status(404).json({ message: "Income not found" });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving income", error });
  }
};

// Update income
const updateIncome = async (req, res) => {
  try {
    const { amount } = req.body;
    const income = await Income.findById(req.params.id);

    if (!income) return res.status(404).json({ message: "Income not found" });

    income.amount = amount || income.amount;

    const updatedIncome = await income.save();
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: "Error updating income", error });
  }
};

// Delete income
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: "Income not found" });

    await income.remove();
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error });
  }
};

export { getIncomes, getIncomeById, updateIncome, deleteIncome };
