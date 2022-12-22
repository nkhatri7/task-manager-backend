const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { getRelevantUserDetails, validateEmail, encryptPassword } = require('../middleware/auth');
const { createCustomError } = require('../errors/custom-error');

/**
 * Gets the user with a given ID if the user exists.
 */
const getUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    // Get user with the ID from the request
    const user = await User.findById(id);
    // If the user doesn't exist/isn't found, return an error
    if (!user) {
        return next(createCustomError(`No user with the ID: ${id}`, 404));
    }

    const relevantDetails = getRelevantUserDetails(user._doc);
    res.status(200).json(relevantDetails);
});

/**
 * Deletes the user with a given ID from the database.
 */
const deleteUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    // If the user never existed, return an error
    if (!user) {
        return next(createCustomError(`No user with ID: ${id}`, 404));
    }

    await User.findByIdAndDelete(id);
    res.status(200).send('User deleted');
});

/**
 * Updates the user's name.
 */
const updateUserName = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(createCustomError(`No user with ID: ${id}`, 404));
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
        runValidators: true
    });
    if (!user) {
        return next(createCustomError(`No user with ID: ${id}`, 404));
    }

    const relevantDetails = getRelevantUserDetails(user._doc);
    res.status(200).json(relevantDetails);
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
        runValidators: true
    });
    if (!user) {
        return next(createCustomError(`No user with ID: ${id}`, 404));
    }

    const relevantDetails = getRelevantUserDetails(user._doc);
    res.status(200).json(relevantDetails);
});

module.exports = { getUser, deleteUser, updateUserName, updateUserEmail, updateUserPassword };