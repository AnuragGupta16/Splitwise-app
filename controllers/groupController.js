const Group = require('../models/Group');
const User=require('../models/User');





// Route handler to create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, category, currency, members} = req.body;



    // Create the group with additional fields and member IDs
    const group = new Group({
      name,
      description,
      category,
      currency,
      members
    });

    // Save the group
    await group.save();

    // Respond with the created group
    res.status(201).json(group);
  } catch (err) {
    // Handle errors
    res.status(400).json({ message: err.message });
  }
};




exports.getAllGroups= async (req, res) => {
  try {
    // Extract user ID from the request object (assuming it's set by the authentication middleware)
    const userId = req.user._id;

    // Fetch all groups where the user is a member
    const groups = await Group.find({ members: userId });

    // Send the groups as the response
    res.json(groups);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    // Find the group by ID and populate the members field with user details
    const group = await Group.findById(req.params.groupId).populate('members');

    // Check if the group exists
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Respond with the populated group
    res.json(group);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
};

exports.addMemberToGroup = async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.members.push(memberId);
    await group.save();
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeMemberFromGroup = async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.members = group.members.filter(member => member.toString() !== memberId);
    await group.save();
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users and project only the username and _id fields
    const users = await User.find({}, '_id username');

    // Return the array of users with usernames and _ids
    res.json(users);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
};
