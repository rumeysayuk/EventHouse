// Kullanıcı ve rol ilişkisini saklayan model.
const mongoose = require("mongoose");

const UserRoleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
});

module.exports = mongoose.model("UserRole", UserRoleSchema);
