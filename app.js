const express = require('express');
const app = express();
const connectDB = require('./src/db/connect');
require('dotenv').config();

// Middleware
app.use(express.json());

const port = process.env.PORT || 5000;

/**
 * Tries to connect to the database and starts the server.
 */
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(() => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
