const { default: mongoose } = require("mongoose");

const budgetSchema = new mongoose.Schema({
  title: String,
  amount: Number,
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
