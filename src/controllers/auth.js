const User = require('../models/User');
const { 
    createUserInDatabase,
    updatePasswordInDatabase,
    validateEmail, 
    comparePassword, 
} = require('../utils/auth.utils');
const asyncWrapper = require('../middleware/async');
const { getRelevantUserDetails } = require('../middleware/auth');

/**
 * Creates a new user in the database if all the details provided are OK.
 */
const createUser = asyncWrapper(async (req, res) => {
    // First, check if account with email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    // If there is an existing user, return an error stating that an account 
    // with the email already exists
    if (existingUser) {
        const errorMsg = 'Account with this email already exists. Please sign'
                + ' in using this email or create an account with another'
                + ' email.';
        res.status(401).json(errorMsg);
    } else {
        // Otherwise, check if email is valid and then create account if it is
        const validEmail = validateEmail(req.body.email);
        if (validEmail) {
            const user = await createUserInDatabase(req.body);
            res.status(201).json(user);
        } else {
            res.status(406).json('Email is invalid.');
        }
    }
});

/**
 * Checks whether the given email and password from the request are valid and 
 * returns the user data if the details are valid.
 */
const signInUser = asyncWrapper(async (req, res) => {
    // Check if account with email exists
    const user = await User.findOne({ email: req.body.email });
    // If account with given email doesn't exist, return an error stating that 
    // account doesn't exist
    if (!user) {
        const errorMsg = 'An account with this email does not exist. Please' 
                + ' create an account with this email or sign in with another'
                + ' email.';
        res.status(404).json(errorMsg);
    } else {
        // Check if password is correct
        const isPasswordCorrect = await comparePassword(
            req.body.password,
            user.password
        );
        if (isPasswordCorrect) {
            res.status(200).json(getRelevantUserDetails(user._doc));
        } else {
            res.status(401).json('Password is incorrect.');
        }
    }
});

/**
 * Updates the user's email address.
 */
const updateUserEmail = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const validEmail = validateEmail(req.body.email);
    if (!validEmail) {
        res.status(406).json('Invalid email.');
    } else {
        const user = await User.findByIdAndUpdate(id, {
            email: req.body.email,
        }, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            res.status(404).json(`No user with ID: ${id}`);
        } else {
            res.status(200).json(getRelevantUserDetails(user._doc));
        }
    }
});

/**
 * Updates the user's password.
 */
const updateUserPassword = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
        res.status(404).json(`No user with ID: ${id}`);
    } else {
        // Check if old password entered is correct
        const isOldPasswordCorrect = await comparePassword(
            req.body.oldPassword, 
            existingUser.password
        );
        if (isOldPasswordCorrect) {
            const newPassword = req.body.newPassword;
            const user = await updatePasswordInDatabase(id, newPassword);
            res.status(200).json(user);
        } else {
            res.status(406).json('Current password entered is incorrect.');
        }
    }
});

module.exports = { 
    createUser, 
    signInUser, 
    updateUserEmail, 
    updateUserPassword, 
};