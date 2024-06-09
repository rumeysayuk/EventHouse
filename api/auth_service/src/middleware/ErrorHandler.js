const ErrorResponse = require("../utils/error");

const ErrorHandlerMiddleware = (err, req, res, next) => {
  console.log(err, "Middleware Error");
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: "Server error please check api!",
  });
};

module.exports = ErrorHandlerMiddleware;
