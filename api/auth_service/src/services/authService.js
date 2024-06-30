// services/authService.js
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const ErrorResponse = require("../utils/error");
const Response = require("../utils/response");
const { createToken } = require("../middleware/authMiddleware");
const sendEmail = require("../middleware/libraries/sendMail");
const moment = require("moment");

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

const forgetPassword = async (userInfo) => {
  const { email } = userInfo;
  const checkUserInfo = await User.findOne({ email });
  if (!checkUserInfo)
    throw new ErrorResponse("This user not found in our system", 400);

  const resetPasswordToken = checkUserInfo.getResetPasswordTokenFromUser(); // Call the method on the instance
  const resetPasswordUrl = `${process.env.WEB_URL}/auth/reset-password?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = `
      <h3>Reset your password</h3>
      <p>This <a href='${resetPasswordUrl}' target='_blank'>Link</a> will be expire in 1 hour</p>
      `;
  await sendEmail({
    from: process.env.SMTP_HOST,
    to: email,
    subject: "Password Reset",
    text: "Email content",
    html: emailTemplate,
    // attachments: [
    //   {
    //     filename: "dosya.pdf",
    //     content: fs.createReadStream("ek-dosya-adi.pdf"),
    //   },
    // ],
  });

  await User.updateOne(
    { email },
    {
      resetPassword: {
        code: resetPasswordToken,
        time: moment(new Date())
          .add(15, "minute")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
    }
  );
  return new Response(
    true,
    "Mail is sent successfully. Please check your mailbox."
  );
};

module.exports = { login, register, me, forgetPassword };
