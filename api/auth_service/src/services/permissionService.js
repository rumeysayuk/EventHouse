// services/permissionService.js
const Permission = require("../models/Permission");

const createPermission = async (permissionData) => {
  const { name } = permissionData;
  const permission = new Permission({ name });
  return await permission.save();
};

module.exports = { createPermission };
