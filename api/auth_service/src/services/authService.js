// services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

exports.register = async (userData) => {
  const { userName, firstName, lastName, password, country, city } = userData;

  const hashedPassword = await hashPassword(password);
  const user = new User({
    userName,
    firstName,
    lastName,
    country,
    city,
    password: hashedPassword,
  });

  await user.save();

  // Assign default role to new user
  const defaultRole = await Role.findOne({ name: "user" });
  if (defaultRole) {
    user.roles.push(defaultRole._id);
    await user.save();
  }

  return user;
};

exports.login = async (loginData) => {
  const { userName, password } = loginData;
  const user = await User.findOne({ userName }).populate("roles");

  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    { id: user._id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};
