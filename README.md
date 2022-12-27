# Taskr Backend

## Project Information

### Background
This project is a simple task management app that allows users to create, update, and delete tasks. This repository contains the code for the backend/API functionality for this app. The purpose of this project is for myself to learn more about backend/API development and to become more experienced with writing backend code and writing tests. This is my **first** attempt (the Twitter clone was not done properly and was too big of a project to start of with) at building out a full-stack application **properly**, hence why I've gone with a simple task management application with limited functionality.

### Build Status
The code for the first version of this API (`v1`) has been written. I do have plans to add more complex functionality once the frontend for this application has been built.

### Current Functionalities/API Routes
- Create User/Register (`/api/v1/auth/register`) - POST method
- Sign In User (`/api/v1/auth/login`) - POST method
- Update User Email (`api/v1/auth/change-email/:id`) - PATCH method
- Change User Password (`/api/v1/auth/change-password/:id`) - PATCH method
- Get User (`/api/v1/users/:id`) - GET method
- Delete User (`api/v1/users/:id`) - DELETE method
- Update User Name (`api/v1/users/change-name/:id`) - PATCH method
- Update User's Tasks Order (`api/v1/users/tasks/:id`) - PATCH method
- Create Task (`api/v1/tasks/`) - POST method
- Get User's Tasks (`api/v1/tasks/user/:userId`) - GET method
- Get Task (`api/v1/tasks/:id`) - GET method
- Update Task (`api/v1/tasks/:id`) - PATCH method
- Delete Task (`api/v1/tasks/:id`) - DELETE method

### Tech Stack
- Node.js and Express.js for backend server and API development
- MongoDB for NoSQL database
- Mongoose for JavaScript MongoDB driver (connecting server to database)
- Jest for testing

### Project Folder Structure
```
├───src
│   ├───controllers (contains code logic for API routes)
│   ├───db (contains code to connect to database)
│   ├───errors (contains helper code for errors)
│   ├───middleware (contains helper code)
│   ├───models (contains code for models relating to database)
│   ├───routes (links code logic to API routes)
│   └───utils (contains helper code)
├───tests
│   └───unit
│       ├───middleware (contains unit tests for middleware files)
│       └───utils (contains unit tests for utils files)
├───app.js (contains base level code for the server)
└───package.json (contains dependencies and npm calls)
```

## Setup Instructions (For Local Run)

### Step 1: Install Dependencies
`npm install`: Installs all NPM modules

### Step 2: Run NPM Calls
There are three NPM calls that have been set up:
- `npm start` – Starts the server
- `npm test` – Runs the test suite
- `npm testCoverage` – Runs the test suite and also shows the code coverage of the tests (uses the `--collect-coverage` flag)

### Step 3: Local `.env` Variables
I have used `.env` variables in this project which have not being pushed to GitHub for obvious security reasons. The main variable is the `MONGO_URI` variable which is used to connect to the database (used in [app.js](./app.js)), if you want to run this code locally, you would have to create your own MongoDB database get your own URI. The other `.env` variable is the `PORT` variable.

