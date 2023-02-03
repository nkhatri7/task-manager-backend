const User = require('../models/User');
const { 
    createUserInDatabase,
    updatePasswordInDatabase,
    createSession,
    closeSession,
    validateEmail, 
    comparePassword,
} = require('../utils/auth.utils');
const { 
    getRelevantUserDetails,
    getSessionDataFromRequest,
} = require('../middleware/auth');
const asyncWrapper = require('../middleware/async');

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
            // Create a session for the user
            const session = await createSession(user.id);
            res.status(201).json({
                user: user,
                session: session,
            });
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
    if (user) {
        // Check if password is correct
        const isPasswordCorrect = await comparePassword(
            req.body.password,
            user.password
        );
        if (isPasswordCorrect) {
            const session = await createSession(user.id);
            res.status(200).json({
                user: getRelevantUserDetails(user._doc),
                session: session,
            });
        } else {
            res.status(401).json('Password is incorrect.');
        }
    } else {
        const errorMsg = 'An account with this email does not exist. Please' 
                + ' create an account with this email or sign in with another'
                + ' email.';
        res.status(404).json(errorMsg);
    }
});

/**
 * Updates the user's email address.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const updateUserEmail = async (req, res, user) => {
    const validEmail = validateEmail(req.body.email);
    if (validEmail) {
        const updatedUser = await User.findByIdAndUpdate(user.id, {
            email: req.body.email,
        }, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(getRelevantUserDetails(updatedUser._doc));
    } else {
        res.status(406).json('Invalid email.');
    }
};

/**
 * Updates the user's password.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const updateUserPassword = async (req, res, user) => {
    // Check if old password entered is correct
    const isOldPasswordCorrect = await comparePassword(
        req.body.oldPassword, 
        existingUser.password
    );
    if (isOldPasswordCorrect) {
        const newPassword = req.body.newPassword;
        const updatedUser = await updatePasswordInDatabase(
            existingUser.id, 
            newPassword
        );
        res.status(200).json(getRelevantUserDetails(updatedUser._doc));
    } else {
        res.status(406).json('Current password entered is incorrect.');
    }
};

/**
 * Removes the user's session from the database.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const signOutUser = async (req, res, user) => {
    const { sessionId } = getSessionDataFromRequest(req);
    await closeSession(sessionId);
    res.status(200).json('Session closed.');
};

module.exports = { 
    createUser, 
    signInUser, 
    updateUserEmail, 
    updateUserPassword, 
    signOutUser,
};