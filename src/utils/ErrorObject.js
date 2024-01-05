// utils/ErrorObject
class ErrorObject extends Error {
  constructor(statusCode, message, data = {}) {
    // Add custom "message" for the Error Object:
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    // Sets Error name:
    this.name = Error.name;

    // Adds a "code" property:
    this.statusCode = statusCode;
    this.code = statusCode;

    // Custom data field:
    this.data = data;

    Error.captureStackTrace(this);
  }
}

module.exports = ErrorObject;