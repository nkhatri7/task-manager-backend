const User = require('../models/User');
const Task = require('../models/Task');
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

    // Delete all tasks for user
    deleteUserTasks(user.tasks);
    // Delete user
    await User.findByIdAndDelete(id);
    res.status(200).send('User deleted');
});

/**
 * Deletes all the tasks in the database associated with a user.
 * @param {string[]} userTasks An array of the IDs for each task in the database for a user.
 */
const deleteUserTasks = (userTasks) => {
    userTasks.forEach(taskId => {
        Task.findByIdAndDelete(taskId);
    });
};

/**
 * Updates the user's name.
 */
const updateUserName = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
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
 * Updates the order of the user's tasks.
 */
const updateUserTasksOrder = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {
        $set: {
            tasks: req.body.tasks,
        }
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

module.exports = { 
    getUser, 
    deleteUser, 
    updateUserName, 
    updateUserTasksOrder,
};