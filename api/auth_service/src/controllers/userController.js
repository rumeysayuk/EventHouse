// controllers/userController.js
const User = require("../models/User");
const Role = require("../models/Role");

const assignRole = async (userId, roleId) => {
  try {
    const user = await User.findById(userId);
    const role = await Role.findById(roleId);
    if (!user || !role) {
      throw new Error("User or Role not found");
    }
    user.roles.push(role._id);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { assignRole };
