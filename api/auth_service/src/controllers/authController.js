// controllers/authController.js
const authService = require("../services/authService");
const ErrorResponse = require("../utils/error");
const Response = require("../utils/response");

const register = async (req, res) => {
  try {
    const response = await authService.register(req.body);
  } catch (error) {
    console.log("error", error);
    // Handle errors with proper response method
    if (error instanceof ErrorResponse) {
      return new Response(null, error.message).unauthorizedError(res);
    } else {
      return new Response(
        null,
        "An unexpected error occurred"
      ).internalServerError(res);
    }
  }
};

const login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    console.log(token);
    token.success(res, "Login is successfully");
  } catch (error) {
    console.log("error", error);
    // Handle errors with proper response method
    if (error instanceof ErrorResponse) {
      return new Response(null, error.message).unauthorizedError(res);
    } else {
      return new Response(
        null,
        "An unexpected error occurred"
      ).internalServerError(res);
    }
  }
};

const me = async (req, res) => {
  const response = await authService.me(req);
  response.success(res);
};

const forgetPassword = async (req, res) => {
  try {
    const resultForgetPass = await authService.forgetPassword(req.body);
    console.log(resultForgetPass);
    resultForgetPass.success(res, "Password is changed successful");
  } catch (error) {
    console.log("error", error);
    // Handle errors with proper response method
    if (error instanceof ErrorResponse) {
      return new Response(null, error.message).unauthorizedError(res);
    } else {
      return new Response(
        null,
        "An unexpected error occurred"
      ).internalServerError(res);
    }
  }
};

module.exports = {
  login,
  register,
  me,
  forgetPassword,
};
