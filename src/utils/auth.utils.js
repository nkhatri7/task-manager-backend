const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const { getUserAccountCreationDate } = require('./date.utils');
const { 
    getRelevantUserDetails, 
    getRelevantSessionDetails, 
} = require('../middleware/auth');
require('dotenv').config();

/**
 * Creates a user object in the MongoDB database with the given `data`.
 * @param {object} data The user's name, email, and password
 * @returns {Promise<object>} The new user object from the database.
 */
const createUserInDatabase = async (data) => {
    const hashedPassword = await hashPassword(data.password);
    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        createdAt: getUserAccountCreationDate(new Date()),
    });
    return getRelevantUserDetails(user._doc);
};

/**
 * Updates the user object in the MongoDB database with a hashed version of the
 * new `password` provided.
 * @param {string} id The user ID
 * @param {string} newPassword The user's new password
 * @returns {Promise<object>} An updated user object from the database.
 */
const updatePasswordInDatabase = async (id, newPassword) => {
    const hashedPassword = await hashPassword(newPassword);
    const user = await User.findByIdAndUpdate(id, {
        password: hashedPassword,
    }, {
        new: true,
        runValidators: true,
    });
    return getRelevantUserDetails(user._doc);
};

/**
 * Creates a Session object in the MongoDB database for the user with the given
 * user ID.
 * @param {string} userId The ID of the user requiring a session
 * @returns {Promise<object>} The new session object from the database.
 */
const createSession = async (userId) => {
    const sessionId = await getUniqueSessionId();
    const sessionHash = hashSessionId(sessionId);
    const session = await Session.create({
        sessionId: sessionId,
        sessionHash: sessionHash,
        userId: userId,
    });
    return getRelevantSessionDetails(session._doc);
};

/**
 * Removes the session with the given session ID in the MongoDB database.
 * @param {string} sessionId The session ID 
 */
const closeSession = async (sessionId) => {
    await Session.findOneAndDelete({
        sessionId: sessionId,
    });
};

/**
 * Deletes all the sessions associated with the user with the given `userId`.
 * @param {string} userId The user ID for which all sessions need to be closed
 */
const closeUserSessions = async (userId) => {
    // Delete all sessions with given user ID
    await Session.deleteMany({
        userId: userId,
    });
};

/**
 * Gets a unique session ID.
 * @returns {Promise<string>} A unique session ID between 100000 and 999999.
 */
const getUniqueSessionId = async () => {
    // Get a session ID
    let sessionId = generateSessionId();
    // Check if there is an existing session in the database with this ID
    let sessionExists = await checkSessionExists(sessionId);
    // If the session ID is not unique, keep generating a new session ID until
    // a unique one is found
    while (sessionExists) {
        sessionId = generateSessionId();
        sessionExists = await checkSessionExists(sessionId);
    }
    return sessionId;
};

/**
 * Checks if a session with the given session ID exists.
 * @param {string} sessionId the session ID being checked
 * @returns {Promise<boolean>} 
 * `true` if a session with the given session ID exists and `false` if not.
 */
const checkSessionExists = async (sessionId) => {
    const existingSession = await Session.findOne({
        sessionId: sessionId,
    });
    return existingSession ? true : false;
};

/**
 * Generates a session ID between 100000 and 999999.
 * @returns {string} A number between 100000 and 999999.
 */
const generateSessionId = () => {
    const min = 100000;
    const max = 999999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

/**
 * Checks if the given email address is in a valid format.
 * @param {string} email the email address being validated
 * @returns {boolean} 
 * `true` or `false` based on the validity of the given email.
 */
const validateEmail = (email) => {
    const regex = new RegExp(/[a-z0-9\.]+@[a-z]+\.[a-z]{2,3}$/);
    return regex.test(email);
};

/**
 * Hashes the given `password`.
 * @param {string} password The password that needs to be hashed
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

/**
 * Hashes the given session ID.
 * @param {string} sessionId The session ID that needs to be hashed
 * @returns {string} The hashed session ID.
 */
const hashSessionId = (sessionId) => {
    const SECRET = process.env.HASH_SECRET;
    return crypto.createHash('sha256').update(SECRET + sessionId).digest('hex');
};

/**
 * Hashes the given password and compares it to the given hash to see if they
 * are equal.
 * @param {string} password The password in plain text
 * @param {string} hashedPassword The hashed password in the database/system
 * @returns {Promise<boolean>} 
 * `true` if the passwords match and `false` if they don't.
 */
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    createUserInDatabase,
    updatePasswordInDatabase,
    createSession,
    closeSession,
    closeUserSessions,
    validateEmail,
    hashPassword,
    hashSessionId,
    comparePassword,
};