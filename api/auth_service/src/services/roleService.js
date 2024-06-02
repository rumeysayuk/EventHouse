// services/roleService.js
const Role = require("../models/Role");

const createRole = async (roleData) => {
  const { name, permissions } = roleData;
  const role = new Role({ name, permissions });
  return await role.save();
};

module.exports = { createRole };
