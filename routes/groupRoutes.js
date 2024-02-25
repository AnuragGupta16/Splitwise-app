const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticate = require('../middleware/authenticate');

// Create a new group
router.post('/', authenticate, groupController.createGroup);

// Get all groups
router.get('/', authenticate, groupController.getAllGroups);

router.get('/users',authenticate, groupController.getAllUsers);
// Get a group by ID
router.get('/:groupId', authenticate, groupController.getGroupById);

// Add a member to a group
router.post('/:groupId/members', authenticate, groupController.addMemberToGroup);

// Remove a member from a group
router.delete('/:groupId/members', authenticate, groupController.removeMemberFromGroup);

// Delete a group
router.delete('/:groupId', authenticate, groupController.deleteGroup);



// Calculate minimum transactions to settle debts within a group



module.exports = router;
