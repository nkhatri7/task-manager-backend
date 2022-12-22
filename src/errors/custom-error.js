/**
 * CustomAPIError is a class created to customise error messages dealing with API errors.
 */
class CustomAPIError extends Error {
    /**
     * Constructor for CustomAPIError.
     * @param {String} message The custom message that needs to be displayed when then error arises
     * @param {Number} statusCode The error status code
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Creates a CustomAPIError object with the given message and status code.
 * @param {String} message The custom message that needs to be displayed when then error arises
 * @param {Number} statusCode The error status code
 * @returns {CustomAPIError} A CustomAPIError object with the given message and status code.
 */
const createCustomError = (message, statusCode) => {
    return new CustomAPIError(message, statusCode);
};

module.exports = { createCustomError, CustomAPIError };