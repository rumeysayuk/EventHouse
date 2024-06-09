const joi = require("joi");
const ErrorResponse = require("../../utils/error");

class AuthValidation {
  constructor() {}

  static register = async (req, res, next) => {
    const schema = joi
      .object({
        firstName: joi.string().trim().min(3).max(40).required().messages({
          "string.base": "First name should consist of letters.",
          "string.empty": "First name cannot be empty!",
          "string.max": "First name should contain a maximum of 40 characters.",
          "string.min": "First name should contain a minimum of 3 characters.",
          "any.required": "First name is required.",
        }),
        lastName: joi.string().trim().min(2).max(40).required().messages({
          "string.base": "Last name should consist of letters.",
          "string.empty": "Last name cannot be empty!",
          "string.max": "Last name should contain a maximum of 40 characters.",
          "string.min": "Last name should contain a minimum of 2 characters.",
          "any.required": "Last name is required.",
        }),
        userName: joi.string().trim().min(3).max(40).required().messages({
          "string.base": "Username  should consist of letters.",
          "string.empty": "Username cannot be empty!",
          "string.max": "Username  should contain a maximum of 40 characters.",
          "string.min": "Username  should contain a minimum of 3 characters.",
          "any.required": "Username  is required.",
        }),
        email: joi.string().email().trim().min(3).max(40).required().messages({
          "string.base": "Email should consist of letters.",
          "string.empty": "Email cannot be empty!",
          "string.max": "Email should contain a maximum of 40 characters.",
          "string.min": "Email should contain a minimum of 3 characters.",
          "any.required": "Email is required.",
          "string.email": "Please provide a valid email address.",
        }),
        password: joi
          .string()
          .trim()
          .min(6)
          .max(40)
          // .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
          .required()
          .messages({
            "string.base":
              "Password should consist of letters, numbers, and special characters.",
            "string.empty": "Password cannot be empty!",
            "string.max": "Password should contain a maximum of 40 characters.",
            "string.min": "Password should contain a minimum of 6 characters.",
            "any.required": "Password is required.",
            //   "string.pattern.base":
            //     "Password must contain at least one letter, one number, and one special character.",
          }),
        country: joi.string().trim(), // Exclude country from validation
        city: joi.string().trim(), // Exclude city from validation
      })
      .options({ allowUnknown: true })
      .unknown(false);
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      const validationError = new ErrorResponse(errorMessage, 400);
      return res.status(validationError.statusCode).json({
        success: false,
        message: errorMessage,
      });
    }
  };

  static login = async (req, res, next) => {
    const schema = joi
      .object({
        email: joi.string().email().trim().min(3).max(40).required().messages({
          "string.base": "Email should consist of letters.",
          "string.empty": "Email cannot be empty!",
          "string.max": "Email should contain a maximum of 40 characters.",
          "string.min": "Email should contain a minimum of 3 characters.",
          "any.required": "Email is required.",
          "string.email": "Please provide a valid email address.",
        }),
        password: joi
          .string()
          .trim()
          .min(6)
          .max(40)
          // .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
          .required()
          .messages({
            "string.base":
              "Password should consist of letters, numbers, and special characters.",
            "string.empty": "Password cannot be empty!",
            "string.max": "Password should contain a maximum of 40 characters.",
            "string.min": "Password should contain a minimum of 6 characters.",
            "any.required": "Password is required.",
            //   "string.pattern.base":
            //     "Password must contain at least one letter, one number, and one special character.",
          }),
      })
      .options({ allowUnknown: true })
      .unknown(false);
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      const validationError = new ErrorResponse(errorMessage, 400);
      return res.status(validationError.statusCode).json({
        success: false,
        message: errorMessage,
      });
    }
  };
}

module.exports = AuthValidation;
