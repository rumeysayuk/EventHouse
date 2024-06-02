//Kullanıcı bilgilerini saklayan model.
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, unique: true },
  lastName: { type: String, required: true, unique: true },
  age: { type: Number, required: false },
  password: { type: String, required: true },
  country: { type: String, required: false },
  city: { type: String, required: false },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
});

module.exports = mongoose.model("User", UserSchema);
