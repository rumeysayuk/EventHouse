// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkRole = require("../middlewares/roleMiddleware");

router.post("/assign-role", checkRole("admin"), async (req, res) => {
  const { userId, roleId } = req.body;
  try {
    const user = await userController.assignRole(userId, roleId);
    res.send({ message: "Role assigned successfully", user });
  } catch (error) {
    res.status(500).send({ error: "Error assigning role" });
  }
});

module.exports = router;
