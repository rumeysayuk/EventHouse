// controllers/authController.js
const authService = require("../services/authService");
const ErrorResponse = require("../utils/error");
const Response = require("../utils/response");

const register = async (req, res) => {
  try {
    const response = await authService.register(req.body);
    response.success(res, "Register is successfully");
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
    resultForgetPass.success(res, "Password reset link sended successful");
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

const resetPasswordCheck = async (req, res) => {
  try {
    const resetPassInfos = {
      email: req.body.email,
      password: req.body.password,
      code: req.query.code,
    };
    const resultForgetPass = await authService.resetPasswordCheck(
      resetPassInfos
    );
    const resetPasswordResult = await authService.resetPassword(
      resultForgetPass.data
    );

    resetPasswordResult.success(res, "Password reset is successfull");
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

const resetPassword = async (req, res) => {
  try {
    const resultForgetPass = await authService.resetPassword(req.body);
    resultForgetPass.success(res, "Password reset is successfull");
  } catch (error) {
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

const verifyAccount = async (req, res) => {
  try {
    const resultForgetPass = await authService.verifyAccount(req.query.token);
    resultForgetPass.success(res, "Verfiy Account is successful");
  } catch (error) {
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
  resetPasswordCheck,
  resetPassword,
  verifyAccount,
};
