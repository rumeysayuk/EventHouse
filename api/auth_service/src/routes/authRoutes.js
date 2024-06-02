// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route example
router.get("/protected", authMiddleware, (req, res) => {
  res.send({ message: "This is a protected route" });
});

router.get("/", (req, res) => {
  res.json({ message: "this is a msg" });
});

module.exports = router;
