const router = require("express").Router();

const auth = require("./authRoutes");

router.use("/auth", auth);

module.exports = router;
