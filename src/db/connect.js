const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database with the given URI.
 * @param {String} uri The URI string for the MongoDB database
 */
const connectDB = async (uri) => {
    mongoose.set('strictQuery', false);
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = connectDB;