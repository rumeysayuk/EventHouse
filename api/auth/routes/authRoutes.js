const {
  login,
  register,
  getHomePage,
  forgotPassword,
  resetPassword,
  verifyAccount,
} = require("../controllers/authController");
const express = require("express");
// const { getAccessToRoute } = require("../middlewares/authorization/auth");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify-account", verifyAccount);
router.get("/getHomePage", getHomePage);
router.post("/forgotpassword", forgotPassword);
router.put("/reset-password", resetPassword);

module.exports = router;
