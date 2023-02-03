/**
 * Wraps the given function in an asynchronous function that handles errors.
 * @param {Function} fn The function that needs to be wrapped
 * @returns {Function} A wrapped asynchronous function with error handling.
 */
const asyncWrapper = (fn) => {
    return async (req, res) => {
        try {
            await fn(req, res);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

module.exports = asyncWrapper;