// middlewares/roleMiddleware.js
const Role = require("../models/Role");

const checkRole = async (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userRoles = req.user.roles;
      const role = await Role.findOne({ name: requiredRole });
      if (!role) {
        return res.status(500).send({ error: "Role not found" });
      }
      if (!userRoles.includes(role._id)) {
        return res.status(403).send({ error: "Access denied" });
      }
      next();
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  };
};

module.exports = checkRole;
