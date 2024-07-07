// routes/auth.js
const router = require("express").Router();
const authController = require("../controllers/authController");
const { checkToken } = require("../middleware/authMiddleware");
const AuthValidation = require("../middleware/validations/authValidation");

router.post("/register", AuthValidation.register, authController.register);
router.post("/login", AuthValidation.login, authController.login);

router.get("/me", checkToken, authController.me);

router.post("/forget-password", authController.forgetPassword);

router.post("/reset-password", authController.resetPasswordCheck);

router.post("/verify-account", authController.verifyAccount);
module.exports = router;
