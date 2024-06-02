// Rol ve izin ilişkisini saklayan model.
const mongoose = require("mongoose");

const RolePermissionSchema = new mongoose.Schema({
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  permission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permission",
    required: true,
  },
});

module.exports = mongoose.model("RolePermission", RolePermissionSchema);
