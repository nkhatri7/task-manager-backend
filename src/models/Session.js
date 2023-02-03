const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: [true, 'Must provide session ID.'],
        unique: true,
        trim: true,
    },
    sessionHash: {
        type: String,
        required: [true, 'Must provide session ID hash.'],
        unique: true,
        trim: true,
    },
    userId: {
        type: String,
        required: [true, 'Must provide user ID.'],
        trim: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;