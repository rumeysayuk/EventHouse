const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/error");
const User = require("../models/User");

const createToken = async (user) => {
  const payload = {
    sub: user._id,
    name: user.userName,
  };
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
  return token;
};

const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    const user = await User.findById(decoded.sub).select(
      "_id userName firstName lastName email"
    );
    console.log(user, decoded);
    if (!user || user.userName !== decoded.name) {
      throw new ErrorResponse("Token is invalid", 401);
    }
    return user;
  } catch (err) {
    throw new ErrorResponse("Token is invalid", 401);
  }
};

const checkToken = async (req, res, next) => {
  const isExistToken =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ");

  if (!isExistToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(error.statusCode || 401).json({ message: error.message });
  }
};

const createTemporaryToken = async (user) => {
  const payload = {
    sub: user._id,
    name: user.email,
  };
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN,
    algorithm: "HS256",
  });
  return token;
};

const decodedTemporaryToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    const user = await User.findById(decoded.sub).select(
      "_id userName firstName lastName email"
    );
    if (!user)
      throw new ErrorResponse("This user not found in our system", 400);

    if (!user || user.email !== decoded.name) {
      throw new ErrorResponse("Token is invalid", 401);
    }
    return user;
  } catch (err) {
    throw new ErrorResponse("Token is invalid", 401);
  }
};

module.exports = {
  createToken,
  checkToken,
  verifyToken,
  createTemporaryToken,
  decodedTemporaryToken,
};
