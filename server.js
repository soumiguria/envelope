const express = require("express");
require("dotenv").config();
const connectToDb = require("./config/connectToDb");
const budgetController = require("./controllers/budget");
const incomeController = require("./controllers/income");
const cors = require("cors");

// Create an express app
const app = express();

app.use(express.json());

app.use(cors());

connectToDb();

// Routing
app.post("/budgets", budgetController.postBudget);

app.get("/budgets", budgetController.getBudget);

app.get("/budget/:id", budgetController.getBudgetById);

app.put("/budget/add/:id", budgetController.addBudgetById);

app.put("/budget/minus/:id", budgetController.minusBudgetById);

app.post("/income", incomeController.postIncome);

app.get("/income", incomeController.getIncome);

app.put("/income/:id", incomeController.updateIncomeById);

app.put("/income/add/:id", incomeController.addIncomeById);

// Start the app
app.listen(process.env.PORT);
