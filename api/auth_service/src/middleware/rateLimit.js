const rateLimit = require("express-rate-limit");

const allowList = ["::1"];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req, res) => {
    if (req.url === "/login" || req.url === "/register") return 5;
    else return 10;
  },
  message: {
    success: false,
    message: "You made too many requests !",
  },
  skip: (req, res) => allowList.includes(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
