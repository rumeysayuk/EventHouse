const CustomError = require("../error/CustomError");

const getMessageFromFile = (req, next, key) => {
  let file;
  try {
    file = require("../../constants/messages/" +
      req.headers["lang"] +
      "Messages");
    return file[key] || "";
  } catch (e) {
    console.log(e);
    return next(
      new CustomError(getMessageFromFile(req, next, "THERE_IS_A_PROBLEM"), 400)
    );
  }
};
module.exports = getMessageFromFile;
