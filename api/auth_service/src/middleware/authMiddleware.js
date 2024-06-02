const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  const tokenWithoutBearer = token.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
