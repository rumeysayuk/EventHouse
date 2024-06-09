//Kullanıcı bilgilerini saklayan model.
const mongoose = require("mongoose");

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
  },
  { collection: "users", timestamps: true, versionKey: false }
);

module.exports = mongoose.model("users", userSchema);
// trim verinin başındaki ve sonundaki boşlukları siler.
