// services/authService.js
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const ErrorResponse = require("../utils/error");
const Response = require("../utils/response");
const {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
  verifyToken,
} = require("../middleware/authMiddleware");
const sendEmail = require("../middleware/libraries/sendMail");
const moment = require("moment");
// const logger = require("../utils/logger");

const register = async (userData) => {
  const { userName, firstName, lastName, email, password, country, city, age } =
    userData;
  const isExistUser = await User.findOne({
    $or: [{ email: email }, { userName: userName }],
  });

  if (isExistUser) {
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
    isVerified: false,
  });

  await user.save();
  const savedUser = await User.findOne({
    $or: [{ email: email }, { userName: userName }],
  });

  const token = await createToken(savedUser); // Call the method on the instance
  const verifyAccountUrl = `${process.env.WEB_URL}/auth/verify-account?token=${token}`;

  const emailTemplate = `
      <h3>Verfiy Account</h3>
      <p>This <a href='${verifyAccountUrl}' target='_blank'>Link is your account verifiy  link </a></p>
      `;
  await sendEmail({
    from: process.env.SMTP_HOST,
    to: email,
    subject: "Verfy Account",
    text: "Email content",
    html: emailTemplate,
  });

  return new Response(
    user,
    "Register is Successfully. Please check email address"
  );
};

const login = async (loginData) => {
  const { email, password } = loginData;
  const checkUserInfo = await User.findOne({ email });
  if (!checkUserInfo)
    throw new ErrorResponse("This user not found in our system", 404);
  if (!checkUserInfo.isVerified) {
    throw new ErrorResponse(
      "Your account is not verified. Please verify your email address.is ",
      401
    );
  }
  if (!(await comparePassword(password, checkUserInfo.password))) {
    throw new ErrorResponse("Invalid email or password", 401);
  }

  const token = await createToken(checkUserInfo);
  // logger.log("info", "bu bir log");

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

const resetPasswordCheck = async (resetPassInfos) => {
  const { email, code, password } = resetPassInfos;
  const checkUserInfo = await User.findOne({ email }).select(
    "_id email resetPassword userName"
  );
  if (!checkUserInfo)
    throw new ErrorResponse("This user not found in our system", 404);

  const currentUserResetPassTime = moment(checkUserInfo.resetPassword.time);
  const currentTime = moment(new Date());

  const timeDiff = currentUserResetPassTime.diff(currentTime, "minutes");
  if (timeDiff <= 0 && checkUserInfo.resetPassword.code === code)
    throw new ErrorResponse("The code is invalid. Please try again !");

  const temporaryToken = await createTemporaryToken(checkUserInfo);
  return new Response(
    { temporaryToken, password },
    "Reset token created successfully"
  );
};

const resetPassword = async (resetPassInfos) => {
  const { temporaryToken, password } = resetPassInfos;
  const decodedToken = await decodedTemporaryToken(temporaryToken);

  const hashedPassword = await hashPassword(password);

  await User.findByIdAndUpdate(
    {
      _id: decodedToken._id,
    },
    { password: hashedPassword, resetPassword: { time: null, code: null } }
  );
  return new Response({ decodedToken }, "Reset token is successful");
};

const verifyAccount = async (token) => {
  if (!token) throw new ErrorResponse("Token is invalhhhid!");
  const decodedToken = await verifyToken(token);
  const user = await User.findById(decodedToken._id);

  if (!user) throw new ErrorResponse("User not found!");

  user.isVerified = true;
  await user.save();

  return new Response(null, "Account is verified successful");
};

module.exports = {
  login,
  register,
  me,
  forgetPassword,
  resetPassword,
  resetPasswordCheck,
  verifyAccount,
};
