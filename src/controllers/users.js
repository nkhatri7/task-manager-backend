const User = require('../models/User');
const Task = require('../models/Task');
const { closeUserSessions } = require('../utils/auth.utils');
const { getRelevantUserDetails } = require('../middleware/auth');

/**
 * Gets the user with the given session ID and session hash from the request.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const getUser = async (req, res, user) => {
    const relevantDetails = getRelevantUserDetails(user._doc);
    res.status(200).json(relevantDetails);
};

/**
 * Deletes a user in the database with a given session ID and session hash from
 * the request.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const deleteUser = async (req, res, user) => {
    // Delete all tasks for user
    deleteUserTasks(user.tasks);
    // Close all active user sessions
    await closeUserSessions(user.id);
    // Delete user
    await User.findByIdAndDelete(user.id);
    res.status(200).send('User deleted');
};

/**
 * Deletes all the tasks in the database associated with a user.
 * @param {string[]} userTasks 
 * An array of the IDs for each task in the database for a user.
 */
const deleteUserTasks = (userTasks) => {
    userTasks.forEach(taskId => {
        Task.findByIdAndDelete(taskId);
    });
};

/**
 * Updates the user's name.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const updateUserName = async (req, res, user) => {
    const updatedUser = await User.findByIdAndUpdate(user.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json(getRelevantUserDetails(updatedUser._doc));
};

/**
 * Updates the order of the user's tasks.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const updateUserTasksOrder = async (req, res, user) => {
    const updatedUser = await User.findByIdAndUpdate(user.id, {
        $set: {
            tasks: req.body.tasks,
        }
    }, {
        new: true,
        runValidators: true,
    });
    res.status(200).json(getRelevantUserDetails(updatedUser._doc));
};

module.exports = { 
    getUser, 
    deleteUser, 
    updateUserName, 
    updateUserTasksOrder,
};