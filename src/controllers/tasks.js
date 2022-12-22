const Task = require('../models/Task');
const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');
const { getFormattedDateTime } = require('../utils/date.utils');

/**
 * Creates a new task in the database.
 */
const createTask = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.body.userId);
    if (!user) {
        return next(createCustomError(`No user with ID: ${req.body.userId}`, 404));
    }
    const task = await Task.create(req.body);
    res.status(201).json(task);
});

/**
 * Gets all the tasks for the user with a given user ID from the database.
 */
const getUserTasks = asyncWrapper(async (req, res, next) => {
    // First, check if user exists
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        return next(createCustomError(`No user with ID: ${userId}`, 404));
    }

    // Get the tasks
    const tasks = await Task.find({ userId: userId });
    res.status(200).json(tasks);
});

/**
 * Gets a task with a given ID from the database.
 */
const getTask = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
        return next(createCustomError(`No task with ID: ${id}`, 404));
    }

    res.status(200).json(task);
});

/**
 * Deletes the task with a given ID from the database.
 */
const deleteTask = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
        return next(createCustomError(`No task with ID: ${id}`, 404));
    }

    res.status(200).json(task);
});

/**
 * Updates the task with a given ID in the database.
 */
const updateTask = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, {
        $set: req.body,
        updatedAt: getFormattedDateTime(new Date()),
    }, {
        new: true,
        runValidators: true
    });

    if (!task) {
        return next(createCustomError(`No Task with ID: ${id}`, 404));
    }

    res.status(200).json(task);
});

module.exports = { createTask, getUserTasks, getTask, deleteTask, updateTask };