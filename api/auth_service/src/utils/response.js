class Response {
  constructor(data = null, message = null) {
    this.data = data;
    this.message = message;
  }
  success(response) {
    return response.status(200).json({
      success: true,
      message: this.message ?? "Operation is successfully",
      data: this.data,
    });
  }

  created(response) {
    return response.status(201).json({
      success: true,
      message: this.message ?? "Create operation is successfully",
      data: this.data,
    });
  }

  internalServerError(response) {
    return response.status(500).json({
      success: false,
      message: this.message ?? "An internal server error occurred",
      data: this.data,
    });
  }

  badRequestError(response) {
    return response.status(400).json({
      success: false,
      message: this.message ?? "The request was invalid or cannot be served.",
      data: this.data,
    });
  }

  notFoundError(response) {
    return response.status(404).json({
      success: false,
      message: this.message ?? "The requested resource could not be found.",
      data: this.data,
    });
  }

  forbiddenError(response) {
    return response.status(403).json({
      success: false,
      message:
        this.message ?? "You do not have permission to access this resource.",
      data: this.data,
    });
  }
  unauthorizedError(response) {
    return response.status(401).json({
      success: false,
      message:
        this.message ??
        "Authentication is required and has failed or has not yet been provided.",
      data: this.data,
    });
  }

  tooManyRequestsError(response) {
    return response.status(429).json({
      success: false,
      message: this.message ?? "Too many requests. Please try again later.",
      data: this.data,
    });
  }
  updated(response) {
    return response.status(200).json({
      success: true,
      message: this.message ?? "Update operation is successfully",
      data: this.data,
    });
  }

  deleted(response) {
    return response.status(200).json({
      success: true,
      message: this.message ?? "Delete operation is successfully",
      data: this.data,
    });
  }
}

module.exports = Response;
