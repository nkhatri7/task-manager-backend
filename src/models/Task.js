const mongoose = require('mongoose');
const { getFormattedDateTime } = require('../utils/date.utils');

const TaskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required.'],
    },
    text: {
        type: String,
        required: [true, 'Task text is required'],
        trim: true,
        minLength: [1, 'Task text cannot be less than one character.'],
        maxLength: [150, 'Task text cannot be more than 150 characters.'],
    },
    dateDue: {
        type: String,
    },
    timeDue: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: String,
        default: getFormattedDateTime(new Date()),
    },
    updatedAt: {
        type: String,
        default: getFormattedDateTime(new Date()),
    }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;