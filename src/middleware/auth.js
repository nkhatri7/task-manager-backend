const User = require('../models/User');
const Session = require('../models/Session');

/**
 * Removes the `_id`, `password` and `__v` attributes from the MongoDB User 
 * document and returns an object with the other relevant details.
 * @param {object} doc 
 * An object containing all the user's data from the database
 * @returns {object} An object containing all the relevant user data.
 */
const getRelevantUserDetails = (doc) => {
    const { _id, password, __v, ...otherDetails } = doc;
    return otherDetails;
};

/**
 * Removes the `_id`, `userId`, and `__v` attributes from the MongoDB Session 
 * document and returns an object with the other relevant details.
 * @param {object} doc 
 * An object containing all the session data from the database
 * @returns {object} An object containing all the relevant session data.
 */
const getRelevantSessionDetails = (doc) => {
    const { _id, userId, __v, ...otherDetails } = doc;
    return otherDetails;
};

/**
 * Authenticates the user making the request before continuing with the
 * given function in response to the request.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {Function} fn The function responding to the request
 */
const authenticateRequest = async (req, res, fn) => {
    try {
        // Authenticate user request by verifying session ID and session hash
        const { sessionId, sessionHash } = getSessionDataFromRequest(req);
        const user = await getUserFromSession(sessionId, sessionHash);
        if (user) {
            await fn(req, res, user);
        } else {
            res.status(404).json('Invalid session or user not found.');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * Gets the session ID and session hash from the given request header.
 * @param {Express.Request} req The request
 * @returns {object} The session ID and session hash from the request header.
 */
const getSessionDataFromRequest = (req) => {
    return {
        sessionId: req.header('sessionId'),
        sessionHash: req.header('sessionHash'),
    };
};

/**
 * Finds the session in the database with the given `sessionId` and 
 * `sessionHash`.
 * @param {string} sessionId The session ID
 * @param {string} sessionHash The session hash
 * @returns {Promise<object> | null} 
 * The session object if it's found or `null` if it's not found.
 */
const findSession = async (sessionId, sessionHash) => {
    const session = await Session.findOne({
        sessionId: sessionId,
        sessionHash: sessionHash,
    });
    return session ? session : null;
};

/**
 * Gets the user data based on the given `sessionId` and `sessionHash`.
 * @param {string} sessionId The session ID
 * @param {string} sessionHash The session hash
 * @returns {Promise<object> | null}
 * The user object if it can be found or `null` if it cannot be found.
 */
const getUserFromSession = async (sessionId, sessionHash) => {
    const session = await findSession(sessionId, sessionHash);
    if (session) {
        const user = User.findById(session.userId);
        if (user) {
            return user;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = {
    getRelevantUserDetails,
    getRelevantSessionDetails,
    authenticateRequest,
    getSessionDataFromRequest,
};