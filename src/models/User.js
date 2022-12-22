const mongoose = require('mongoose');
const { getFormattedDate } = require('../utils/date.utils');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide name.'],
        trim: true,
        minLength: [1, 'Name must be at least one character long.'],
        maxLength: [30, 'Name cannot be more than 30 characters.'],
    },
    email: {
        type: String,
        required: [true, 'Must provide email.'],
        unique: [true, 'Account with email already exists. Use another account or sign in.'],
        trim: true,
        minLength: [10, 'Email must be at least 10 characters long.'],
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        trim: true,
        minLength: [8, 'Password must be at least 8 characters long.'],
    },
    createdAt: {
        type: String,
        default: getFormattedDate(new Date()),
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;