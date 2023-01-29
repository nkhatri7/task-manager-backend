const bcrypt = require('bcrypt');

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
 * Returns the user's data without the password and updatedAt attributes.
 * @param {object} doc 
 * An object containing all the user's data from the database
 * @returns {object} 
 * An object containing all the user's data minus the password and updatedAt.
 */
const getRelevantUserDetails = (doc) => {
    const { password, __v, ...otherDetails } = doc;
    return otherDetails;
}

/**
 * Encrypts the given password.
 * @param {string} password The password that needs to be encrypted
 * @returns {Promise<string>} The encrypted password.
 */
const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

module.exports = {
    getRelevantUserDetails,
    validateEmail,
    encryptPassword,
};