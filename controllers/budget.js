const Budget = require("../models/budget");
const Income = require("../models/income");

const postBudget = async (req, res) => {
  const title = req.body.title;
  const amount = req.body.amount;

  const budget = await Budget.create({
    title: title,
    amount: amount,
  });

  res.json({ budget: budget });
};

const getBudget = async (req, res) => {
  const budgets = await Budget.find();

  res.json({ budgets: budgets });
};

const getBudgetById = async (req, res) => {
  const budgetId = req.params.id;

  const budget = await Budget.findById(budgetId);

  res.json({ budget: budget });
};

const addBudgetById = async (req, res) => {
  try {
    const budgetId = req.params.id;
    const { amount, incomeId } = req.body;

    // console.log("req.body:", req.body);

    // Validate input fields
    if (amount == null || incomeId == null) {
      return res.status(400).json({
        error: "Both amount and incomeId are required",
      });
    }

    // Validate amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        error: "Amount must be a positive number",
      });
    }

    // Check if budget exists first (fail fast)
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({
        error: "Budget envelope not found",
      });
    }

    // Check if income exists
    const income = await Income.findById(incomeId);
    if (!income) {
      return res.status(404).json({
        error: "Income record not found",
      });
    }

    // Check for sufficient income
    if (income.amount < amount) {
      return res.status(400).json({
        error: `Insufficient available income (available: ${income.amount}, requested: ${amount})`,
      });
    }

    // Perform the transaction
    income.amount -= amount;
    budget.amount += amount;

    // Save both documents
    await income.save();
    const updatedBudget = await budget.save();

    res.json({
      success: true,
      message: "Amount successfully allocated to budget",
      budget: updatedBudget,
      income: income,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

const minusBudgetById = async (req, res) => {
  try {
    const budgetId = req.params.id;
    const amount = Number(req.body.amount);

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: "Amount must be a positive number",
      });
    }

    // Fetch budget
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({
        error: "Budget not found",
      });
    }

    // Validate available funds
    if (budget.amount < amount) {
      return res.status(400).json({
        error: `Insufficient funds in budget. Available: ${budget.amount}, Requested: ${amount}`,
      });
    }

    // Subtract and save
    budget.amount = budget.amount - amount;
    await budget.save();

    res.status(200).json({
      success: true,
      message: `₹${amount} spent from budget "${budget.title}"`,
      updatedAmount: budget.amount,
      budget,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};

module.exports = {
  postBudget: postBudget,
  getBudget: getBudget,
  getBudgetById: getBudgetById,
  addBudgetById: addBudgetById,
  minusBudgetById: minusBudgetById,
};
