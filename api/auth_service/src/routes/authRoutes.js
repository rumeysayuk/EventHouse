// routes/auth.js
const router = require("express").Router();
const authController = require("../controllers/authController");
const { checkToken } = require("../middleware/authMiddleware");
const AuthValidation = require("../middleware/validations/authValidation");

router.post("/register", AuthValidation.register, authController.register);
router.post("/login", AuthValidation.login, authController.login);

router.get("/me", checkToken, authController.me);
module.exports = router;