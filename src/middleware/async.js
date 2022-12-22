/**
 * Wraps the given function in an asynchronous function that handles errors.
 * @param {Function} fn The function that needs to be wrapped
 */
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = asyncWrapper;