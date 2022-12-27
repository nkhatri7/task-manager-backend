const Task = require('../models/Task');
const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { getFormattedDateTime } = require('../utils/date.utils');
const { getRelevantUserDetails } = require('../middleware/auth');

/**
 * Creates a new task in the database.
 */
const createTask = asyncWrapper(async (req, res) => {
    const user = await User.findById(req.body.userId);
    if (!user) {
        res.status(404).json(`No user with ID: ${req.body.userId}`);
    } else {
        const task = await Task.create(req.body);
        const updatedUser = await addTaskToUser(task.id, task.userId);
        res.status(201).json({
            task: task,
            user: updatedUser
        });
    }
});

/**
 * Adds the given task ID to the User with the given user ID.
 * @param {String} taskId The ID of the task
 * @param {String} userId The ID of the User that created this task
 * @returns {Promise<object>} An updated version of the user object from the database.
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
 */
const getUserTasks = asyncWrapper(async (req, res) => {
    // First, check if user exists
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json(`No user with ID: ${req.body.userId}`);
    } else {
        // Get the tasks
        const tasks = await Task.find({ userId: userId });
        res.status(200).json(tasks);
    }
});

/**
 * Gets a task with a given ID from the database.
 */
const getTask = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
        res.status(404).json(`No task with ID: ${req.body.id}`);
    } else {
        res.status(200).json(task);
    }
});

/**
 * Deletes the task with a given ID from the database.
 */
const deleteTask = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
        res.status(404).json(`No task with ID: ${req.body.id}`);
    } else {
        const user = await removeTaskFromUser(id, task.userId);
        res.status(200).json(user);
    }
});

/**
 * Removes the task ID from the User's array of tasks in the database
 * @param {String} taskId The ID of the task
 * @param {String} userId The ID of the User that deleted this task
 * @returns {Promise<object>} An updated version of the user object from the database.
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
 */
const updateTask = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, {
        $set: req.body,
        updatedAt: getFormattedDateTime(new Date()),
    }, {
        new: true,
        runValidators: true,
    });

    if (!task) {
        res.status(404).json(`No task with ID: ${req.body.id}`);
    } else {
        res.status(200).json(task);
    }
});

module.exports = { createTask, getUserTasks, getTask, deleteTask, updateTask };