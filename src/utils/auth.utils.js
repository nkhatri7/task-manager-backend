const bcrypt = require('bcrypt');
const User = require('../models/User');
const { getUserAccountCreationDate } = require('./date.utils');
const { getRelevantUserDetails } = require('../middleware/auth');

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
 * Encrypts the given password.
 * @param {string} password The password that needs to be encrypted
 * @returns {Promise<string>} The encrypted password.
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
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
    validateEmail,
    hashPassword,
    comparePassword,
};