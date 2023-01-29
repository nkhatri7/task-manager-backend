const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { 
    getRelevantUserDetails, 
    validateEmail, 
    encryptPassword,
} = require('../middleware/auth');
const { getUserAccountCreationDate } = require('../utils/date.utils');
const bcrypt = require('bcrypt');

/**
 * Creates a new user in the database if all the details provided are OK.
 */
const createUser = asyncWrapper(async (req, res) => {
    // First, check if account with email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    // If there is an existing user, return an error stating that an account 
    // with the email already exists
    if (existingUser) {
        const errorMsg = `Account with the email '${req.body.email}' already`
                + ` exists. Please sign in using this email or create an`
                + ` account with another email.`;
        res.status(403).json(errorMsg);
    } else {
        // Check if email is valid
        const validEmail = validateEmail(req.body.email);
        if (!validEmail) {
            res.status(406).json('Invalid email.');
        } else {
            const encryptedPassword = await encryptPassword(req.body.password);
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: encryptedPassword,
                createdAt: getUserAccountCreationDate(new Date()),
            });
            const relevantDetails = getRelevantUserDetails(user._doc);
            res.status(201).json(relevantDetails);
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
        res.status(404).json('Account with this email does not exist.');
    } else {
        // Check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, 
                user.password);
        if (!validPassword) {
            res.status(401).json('Password is incorrect.');
        } else {
            const relevantDetails = getRelevantUserDetails(user._doc);
            res.status(200).json(relevantDetails);
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
        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            res.status(404).json(`No user with ID: ${id}`);
        } else {
            const relevantDetails = getRelevantUserDetails(user._doc);
            res.status(200).json(relevantDetails);
        }
    }
});

/**
 * Checks if the old password entered by the user matches the password in the 
 * database.
 */
const checkPasswordMatches = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        res.status(404).json(`No user with ID: ${id}`);
    } else {
        // Check if old password entered matches password in database
        const validPassword = await bcrypt.compare(req.body.oldPassword, 
                user.password);
        if (!validPassword) {
            res.status(406).json('Current password entered is incorrect.');
        } else {
            return updateUserPassword(req, res);
        }
    }
});

/**
 * Updates the user's password in the database.
 */
const updateUserPassword = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const encryptedPassword = await encryptPassword(req.body.newPassword);
    const user = await User.findByIdAndUpdate(id, {
        password: encryptedPassword
    }, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        res.status(404).json(`No user with ID: ${id}`);
    } else {
        const relevantDetails = getRelevantUserDetails(user._doc);
        res.status(200).json(relevantDetails);
    }
});

module.exports = { 
    createUser, 
    signInUser, 
    updateUserEmail, 
    checkPasswordMatches, 
};