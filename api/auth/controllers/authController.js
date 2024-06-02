const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const { EMAIL_UNIQUE_ERROR } = require("../constants/messages");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../helpers/authorization/tokenHelpers");
// const sendEmail = require("../helpers/libraries/sendEmail");
const getMessageFromFile = require("../helpers/message/getMessageFromFile");

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password))
    return next(
      new CustomError(
        getMessageFromFile(req, next, "EMAIL_AND_PASSWORD_REQUIRED"),
        400
      )
    );
  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  }).select("+password");
  if (!user)
    return next(
      new CustomError(getMessageFromFile(req, next, "USER_NOT_FOUND"), 400)
    );
  if (user.isBlocked === true)
    return next(
      new CustomError(getMessageFromFile(req, next, "ACCOUNT_BLOCKED"), 400)
    );
  if (user.isActive !== true)
    return next(
      new CustomError(getMessageFromFile(req, next, "CHECK_YOUR_EMAIL"), 400)
    );
  if (!bcrypt.compareSync(password, user.password))
    return next(
      new CustomError(getMessageFromFile(req, next, "INVALID_CREDENTIALS"), 400)
    );
  sendJwtToClient(user, res, user.role === "admin" ? true : false);
});

const register = asyncErrorWrapper(async (req, res, next) => {
  console.log("burdaaa");
  let oldUser = await User.findOne({ email: req.body.email });
  if (oldUser) return next(new CustomError("EMAIL_UNIQUE_ERROR", 400));
  const user = await User.create({ ...req.body });
  let verifyEmail = user.email;
  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save();
  const verifyAccountUrl = `${process.env.WEB_URL}/auth/verify-account?verifyAccountToken=${resetPasswordToken}`;
  const emailTemplate = `
      <h3>${getMessageFromFile(req, next, "VERIFY_YOUR_ACCOUNT")}</h3>
       <p>${getMessageFromFile(
         req,
         next,
         "THIS_LINK"
       )} <a href='${verifyAccountUrl}' target='_blank'>${getMessageFromFile(
    req,
    next,
    "LINK"
  )}</a></p>
      `;
  try {
    // await sendEmail({
    //   from: process.env.STMP_USER,
    //   to: verifyEmail,
    //   subject: getMessageFromFile(req, next, "MAKE_ACTIVE_ACCOUNT"),
    //   html: emailTemplate,
    // });
    return res.status(200).json({
      success: true,
      message: getMessageFromFile(req, next, "TOKEN_SENT_YOUR_EMAIL"),
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    return next(
      new CustomError(
        getMessageFromFile(req, next, "EMAIL_COULD_NOT_BE_SEND"),
        500
      )
    );
  }
});

const verifyAccount = asyncErrorWrapper(async (req, res, next) => {
  const { verifyAccountToken } = req.query;
  if (!verifyAccountToken) {
    return next(
      new CustomError(
        getMessageFromFile(req, next, "PLEASE_PROVIDE_VALID_TOKEN"),
        400
      )
    );
  }
  let user = await User.findOne({
    resetPasswordToken: verifyAccountToken,
  });
  if (!user) {
    return next(
      new CustomError(getMessageFromFile(req, next, "LINK_EXPIRED"), 404)
    );
  }
  user.isActive = true;
  user.resetPasswordToken = undefined;
  await user.save();
  return res.status(200).json({
    success: true,
    message: getMessageFromFile(req, next, "MAKE_ACTIVE_ACCOUNT_SUCCESSFULLY"),
  });
});

const getHomePage = asyncErrorWrapper(async (req, res, next) => {
  let returnObj = {};
  if (isTokenIncluded(req)) {
    let token = getAccessTokenFromHeader(req);
    await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async (err, decoded) => {
        if (err)
          return next(
            new CustomError(getMessageFromFile(req, next, "INVALID_TOKEN"), 401)
          );
        let user = await User.findById(decoded.sub);
        if (!user)
          return next(
            new CustomError(getMessageFromFile(req, next, "INVALID_TOKEN"), 401)
          );
        returnObj["user"] = user;
      }
    );
  }
  return res.status(200).json(returnObj);
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({ email: resetEmail }).select("+password");
  if (!user) {
    return res.status(200).json({
      success: true,
      message: getMessageFromFile(req, next, "EMAIL_SEND_SUCCESS"),
    }); //next(new CustomError("There is no user with that email",400))
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save();
  const resetPasswordUrl = `${process.env.WEB_URL}/auth/reset-password?resetPasswordToken=${resetPasswordToken}`;
  const emailTemplate = `
      <h3>Reset your password</h3>
      <p>This <a href='${resetPasswordUrl}' target='_blank'>Link</a> will be expire in 1 hour</p>
      `;
  try {
    await sendEmail({
      from: process.env.STMP_USER,
      to: resetEmail,
      subject: getMessageFromFile(req, next, "RESET_YOUR_PASSWORD"),
      html: emailTemplate,
    });
    return res.status(200).json({
      success: true,
      message: getMessageFromFile(req, next, "TOKEN_SENT_YOUR_EMAIL"),
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(
      new CustomError(
        getMessageFromFile(req, next, "EMAIL_COULD_NOT_BE_SEND"),
        500
      )
    );
  }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;
  if (!resetPasswordToken) {
    return next(
      new CustomError(
        getMessageFromFile(req, next, "PLEASE_PROVIDE_VALID_TOKEN"),
        400
      )
    );
  }
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new CustomError(
        getMessageFromFile(req, next, "INVALID_TOKEN_OR_SESSION_EXPIRED"),
        404
      )
    );
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: getMessageFromFile(
      req,
      next,
      "RESET_PASSWORD_PROCESS_SUCCESSFULLY"
    ),
  });
});

module.exports = {
  login,
  register,
  getHomePage,
  forgotPassword,
  resetPassword,
  verifyAccount,
};
