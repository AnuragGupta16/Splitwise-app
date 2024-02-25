const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate');

// Get all expenses of a group
router.get('/:groupId/expenses', authenticate, expenseController.getAllExpenses);

// Create an expense within a group
router.post('/:groupId/expenses', authenticate, expenseController.createExpense);

// Calculate minimum transactions to settle debts within a group
router.get('/:groupId/transactions', authenticate, expenseController.calculateMinimumTransactions);

module.exports = router;
