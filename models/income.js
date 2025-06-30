const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  amount: Number,
});

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
