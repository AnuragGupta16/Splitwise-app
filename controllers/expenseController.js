const Expense = require('../models/Expense');
const Group = require('../models/Group');
const User = require('../models/User');
exports.getAllExpenses = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    console.log(groupId)
   const expenses = await Expense.find({ group: groupId })
  .populate('participants')
  .populate('paidBy');// Query expenses by group ID
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createExpense = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { description, amount, paidBy, participants } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    let expense = new Expense({ description, amount, paidBy, participants, group: groupId });
    await expense.save();

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.calculateMinimumTransactions = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Fetch all expenses associated with the group ID
    const expenses = await Expense.find({ group: groupId });

    // Calculate balances
    const balances = {};
    expenses.forEach(expense => {
      // Update balances for paidBy
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) - expense.amount;

      // Update balances for each participant
      expense.participants.forEach(participant => {
        balances[participant] = (balances[participant] || 0) + (expense.amount / expense.participants.length);
      });
    });

    // Generate transactions to settle debts
    const transactions = [];
    let creditors = Object.keys(balances).filter(memberId => balances[memberId] < 0);
    let debtors = Object.keys(balances).filter(memberId => balances[memberId] > 0);

    for (let creditor of creditors) {
      for (let debtor of debtors) {
        const amount = Math.min(Math.abs(balances[creditor]), Math.abs(balances[debtor]));
        if (amount > 0) {
          let to= await User.find({_id:creditor}).select('username');
          let from=await User.find({_id:debtor}).select('username');
          const obj={
             to: to[0],
            from: from[0],
            amount: amount,
            id:Math.random()
          }
          transactions.push(obj);
          balances[creditor] += amount;
          balances[debtor] -= amount;
          // Check if the creditor's balance is cleared
          if (balances[creditor] === 0) {
            break;
          }
        }
      }
    }

    res.json(transactions);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
};