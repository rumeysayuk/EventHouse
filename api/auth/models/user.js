const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const {
  EMAIL_UNIQUE_ERROR,
  PLEASE_PROVIDE_EMAIL,
  requiredError,
  minLengthError,
} = require("../constants/messages");
const crypto = require("crypto");
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, requiredError("FirstName")],
  },
  lastName: {
    type: String,
    required: [true, requiredError("LastName")],
  },
  email: {
    type: String,
    required: [true, requiredError("Email")],
    unique: [true, EMAIL_UNIQUE_ERROR],
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, PLEASE_PROVIDE_EMAIL],
  },
  username: {
    type: String,
    required: [true, requiredError("UserName")],
  },
  password: {
    type: String,
    minlength: [6, minLengthError("Şifre", 6)],
    required: [true, requiredError("Şifre")],
    select: false,
  },
  phone: String,
  address: String,
  postalcode: String,
  city: String,
  country: String,
  role: {
    type: String,
    default: "user",
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  lang: {
    type: String,
    default: "tr",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
  },
  verifyAccountToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.getResetPasswordTokenFromUser = function () {
  const randomHexString = crypto.randomBytes(15).toString("hex");
  const { RESET_PASSWORD_EXPIRE } = process.env;
  const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);
  return resetPasswordToken;
};

UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY } = process.env;
  const payload = {
    sub: this._id,
    name: this.name,
    iat: Math.floor(Math.random() * 1000),
  };
  return jwt.sign(payload, JWT_SECRET_KEY);
};

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("Users", UserSchema);
