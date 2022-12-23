const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { getRelevantUserDetails, validateEmail, encryptPassword } = require('../middleware/auth');
const { createCustomError } = require('../errors/custom-error');
const bcrypt = require('bcrypt');

/**
 * Creates a new user in the database if all the details provided are OK.
 */
const createUser = asyncWrapper(async (req, res, next) => {
    // First, check if account with email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    // If there is an existing user, return an error stating that an account with the email already
    // exists
    if (existingUser) {
        const errorMsg = `Account with the email '${req.body.email}' already exists. Please sign in`
                + ` using this email or create an account with another email.`;
        return next(createCustomError(errorMsg, 403));
    }
    // Check if email is valid
    const validEmail = validateEmail(req.body.email);
    if (!validEmail) {
        return next(createCustomError('Invalid email.', 403));
    }
    const encryptedPassword = await encryptPassword(req.body.password);
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword,
    });
    const relevantDetails = getRelevantUserDetails(user._doc);
    res.status(201).json(relevantDetails);
});

/**
 * Signs in the user if the email and password are correct.
 */
const signInUser = asyncWrapper(async (req, res, next) => {
    // Check if account with email exists
    const user = await User.findOne({ email: req.body.email });
    // If account with given email doesn't exist, return an error stating that account doesn't exist
    if (!user) {
        return next(createCustomError('Account with this email does not exist.', 404));
    }
    // Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return next(createCustomError('Password is incorrect.', 403));
    }

    const relevantDetails = getRelevantUserDetails(user._doc);
    res.status(200).json(relevantDetails);
});

/**
 * Updates the user's email address.
 */
const updateUserEmail = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const validEmail = validateEmail(req.body.email);
    if (!validEmail) {
        return next(createCustomError('Invalid email format.', 406));
    }

    const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(createCustomError(`No user with ID: ${id}`, 404));
    }

    const relevantDetails = getRelevantUserDetails(user._doc);
    res.status(200).json(relevantDetails);
});

/**
 * Checks if the old password entered by the user matches the password in the database.
 */
const checkPasswordMatches = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(createCustomError('User not found'), 404);
    }

    // Check if old password entered matches password in database
    const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
    
    if (!validPassword) {
        return next(createCustomError('Current password entered is incorrect.', 403));
    }

    return updateUserPassword(req, res, next);
});

/**
 * Updates the user's password in the database.
 */
const updateUserPassword = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const encryptedPassword = await encryptPassword(req.body.newPassword);
    const user = await User.findByIdAndUpdate(id, {
        password: encryptedPassword
    }, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(createCustomError(`No user with ID: ${id}`, 404));
    }

    const relevantDetails = getRelevantUserDetails(user._doc);
    res.status(200).json(relevantDetails);
});

module.exports = { createUser, signInUser, updateUserEmail, checkPasswordMatches, };