const Task = require('../models/Task');
const User = require('../models/User');
const { getFormattedDateTime } = require('../utils/date.utils');
const { getRelevantUserDetails } = require('../middleware/auth');

/**
 * Creates a new task in the database.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const createTask = async (req, res, user) => {
    const creationDate = getFormattedDateTime(new Date());
    req.body.createdAt = creationDate;
    req.body.updatedAt = creationDate;
    req.body.userId = user.id;
    const task = await Task.create(req.body);
    const updatedUser = await addTaskToUser(task.id, user.id);
    res.status(201).json({
        task: task,
        user: updatedUser
    });
};

/**
 * Adds the given task ID to the User with the given user ID.
 * @param {string} taskId The ID of the task
 * @param {string} userId The ID of the User that created this task
 * @returns {Promise<object>} 
 * An updated version of the user object from the database.
 */
const addTaskToUser = async (taskId, userId) => {
    const user = await User.findByIdAndUpdate(userId, {
        $push: {
            tasks: taskId,
        }
    }, {
        new: true,
        runValidators: true,
    });
    return getRelevantUserDetails(user._doc);
};

/**
 * Gets all the tasks for the user with a given user ID from the database.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const getUserTasks = async (req, res, user) => {
    const tasks = await Task.find({ userId: user.id });
    res.status(200).json(tasks);
};

/**
 * Gets a task with a given ID from the database.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const getTask = async (req, res, user) => {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json('Task with given ID cannot be found.');
    }
};

/**
 * Deletes the task with a given ID from the database.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const deleteTask = async (req, res, user) => {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (task) {
        const updatedUser = await removeTaskFromUser(taskId, user.id);
        res.status(200).json(updatedUser);
    } else {
        res.status(404).json('Task with given ID cannot be found.');
    }
};

/**
 * Removes the task ID from the User's array of tasks in the database
 * @param {string} taskId The ID of the task
 * @param {string} userId The ID of the User that deleted this task
 * @returns {Promise<object>} 
 * An updated version of the user object from the database.
 */
const removeTaskFromUser = async (taskId, userId) => {
    const user = await User.findByIdAndUpdate(userId, {
        $pull: {
            tasks: taskId,
        }
    }, {
        new: true,
        runValidators: true,
    });
    return getRelevantUserDetails(user._doc);
};


/**
 * Updates the task with a given ID in the database.
 * @param {Express.Request} req The request
 * @param {Express.Response} res The response
 * @param {object} user The authenticated user's data
 */
const updateTask = async (req, res, user) => {
    const { taskId } = req.params;
    const task = await Task.findByIdAndUpdate(taskId, {
        $set: req.body,
        updatedAt: getFormattedDateTime(new Date()),
    }, {
        new: true,
        runValidators: true,
    });
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json('Task with given ID cannot be found.');
    }
};

module.exports = { 
    createTask, 
    getUserTasks, 
    getTask, 
    deleteTask, 
    updateTask, 
};