const CustomError = require("../../helpers/error/CustomError");
const customErrorHandler = (err, req, res, next) => {
  let customError = err;
  if (err.code === 11000) {
    //Duplicate Key
    customError = new CustomError(
      "Duplicate Key Found : Check Your İnput",
      400
    );
  }
  if (err.name === "SyntaxError") {
    customError = new CustomError("Unexpected Syntax", 400);
  }
  if (err.name === "ValidationError") {
    let splitted = err.message.split(":");
    if (splitted && splitted[3]) {
      customError = new CustomError(
        (err.message.split(":")[2] || "")
          .split(",")
          [(err.message.split(":")[2] || "").split(",").length - 2].trim(),
        400
      );
    } else {
      customError = new CustomError(
        (err.message.split(":")[2] || "")
          .split(",")
          [(err.message.split(":")[2] || "").split(",").length - 1].trim(),
        400
      );
    }
  }
  if (err.name === "CastError") {
    customError = new CustomError("Please Provide a Valid id", 400);
  }
  res.status(customError.status || 500).json({
    success: false,
    message: customError.message,
  });
};

module.exports = customErrorHandler;
