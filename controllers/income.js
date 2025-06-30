const Income = require("../models/income");

const postIncome = async (req, res) => {
  const amount = req.body.amount;

  const income = await Income.create({
    amount: amount,
  });

  res.json({ income: income });
};

const getIncome = async (req, res) => {
  const income = await Income.find();

  res.json({ income: income });
};

const updateIncomeById = async (req, res) => {
  try {
    const amount = req.body.amount;
    const incomeId = req.params.id;

    const updatedIncome = await Income.findByIdAndUpdate(incomeId, { amount });

    if (!updatedIncome) {
      return res.status(404).json({ error: "Income not found" });
    }

    const findNewIncome = await Income.findById(incomeId);

    res.json({ income: findNewIncome });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const addIncomeById = async (req, res) => {
  try {
    const incomeId = req.params.id;
    const additionalAmount = req.body.amount;

    // Fetch the existing income document
    const income = await Income.findById(incomeId);
    if (!income) {
      return res.status(404).json({ error: "Income record not found" });
    }

    // Update the amount by adding the new amount
    income.amount += additionalAmount;
    const updatedIncome = await income.save();

    res.json({ success: true, income: updatedIncome });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  postIncome: postIncome,
  getIncome: getIncome,
  updateIncomeById: updateIncomeById,
  addIncomeById: addIncomeById,
};
