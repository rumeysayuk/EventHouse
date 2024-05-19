const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Kullanıcı girişi için POST isteği işleme
router.post("/login", authController.loginUser);

// Kullanıcı kaydı için POST isteği işleme
router.post("/register", authController.registerUser);

module.exports = router;
