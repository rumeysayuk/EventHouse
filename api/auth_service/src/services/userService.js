// services/userService.js
// const User = require('../models/User');
const Role = require("../models/Role");
const bcrypt = require("bcrypt");

const createUser = async (userData) => {
  const { username, password, roles } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, roles });
  return await user.save();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username }).populate("roles");
};

const addUserRole = async (userId, roleId) => {
  const user = await User.findById(userId);
  const role = await Role.findById(roleId);
  if (user && role) {
    user.roles.push(role);
    return await user.save();
  }
  throw new Error("User or Role not found");
};

module.exports = {
  createUser,
  findUserByUsername,
  addUserRole,
};
