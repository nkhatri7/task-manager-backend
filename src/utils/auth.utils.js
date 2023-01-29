const bcrypt = require('bcrypt');
const User = require('../models/User');
const { getUserAccountCreationDate } = require('./date.utils');
const { getRelevantUserDetails } = require('../middleware/auth');

/**
 * Creates a user object in the MongoDB database with the given `data` and
 * hashed password.
 * @param {object} data The user's name and email
 * @param {string} hashedPassword The hashed password
 * @returns {object} An object of the relevant user details from the database.
 */
const createUserInDatabase = async (data, hashedPassword) => {
    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        createdAt: getUserAccountCreationDate(new Date()),
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
    validateEmail,
    hashPassword,
    comparePassword,
};