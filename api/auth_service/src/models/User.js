//Kullanıcı bilgilerini saklayan model.
const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: false },
    password: { type: String, required: true },
    country: { type: String, required: false },
    city: { type: String, required: false },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    resetPassword: {
      code: { type: String, default: null },
      time: { type: String, default: null },
    },
    isVerified: { type: Boolean, default: false },
  },
  { collection: "users", timestamps: true, versionKey: false }
);

userSchema.methods.getResetPasswordTokenFromUser = function () {
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

module.exports = mongoose.model("users", userSchema);
// trim verinin başındaki ve sonundaki boşlukları siler.
