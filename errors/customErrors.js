class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Bad Request Error (400)
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message || "Bad Request", 400);
  }
}

// Unauthorized Error (401)
class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message || "Unauthorized Access", 401);
  }
}

// Forbidden Error (403)
class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message || "Access Denied", 403);
  }
}

// Not Found Error (404)
class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message || "Resource Not Found", 404);
  }
}

// Internal Server Error (500)
class InternalServerError extends CustomAPIError {
  constructor(message) {
    super(message || "Internal Server Error", 500);
  }
}

const createCustomError = (message, statusCode) => {
  return new CustomAPIError(message, statusCode);
};

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  createCustomError
};
