// services/authService.js
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const ErrorResponse = require("../utils/error");
const Response = require("../utils/response");
const { createToken } = require("../middleware/authMiddleware");
const register = async (userData) => {
  const { userName, firstName, lastName, email, password, country, city, age } =
    userData;
  const isExist = await User.findOne({
    $or: [{ email: email }, { userName: userName }],
  });

  if (isExist) {
    throw new ErrorResponse(
      "This user is already registered in our system.",
      401
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    userName,
    email,
    firstName,
    lastName,
    country,
    city,
    age,
    password: hashedPassword,
  });

  await user.save();

  return new Response(user);
};

const login = async (loginData) => {
  const { email, password } = loginData;
  const checkUserInfo = await User.findOne({ email });
  if (!checkUserInfo)
    throw new ErrorResponse("This user not found in our system", 404);
  if (!(await comparePassword(password, checkUserInfo.password))) {
    throw new ErrorResponse("Invalid email or password", 401);
  }

  const token = await createToken(checkUserInfo);
  return new Response(token, "Login is successfully");
};

const me = async (req) => {
  return new Response(req.user, "Token is valid and user in system");
};

module.exports = { login, register, me };
