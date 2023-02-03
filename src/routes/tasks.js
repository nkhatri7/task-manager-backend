const express = require('express');
const router = express.Router();
const { 
    createTask, 
    getUserTasks, 
    getTask, 
    updateTask, 
    deleteTask, 
} = require('../controllers/tasks');
const { authenticateRequest } = require('../middleware/auth');

router.route('/').post((req, res) => authenticateRequest(req, res, createTask));
router.route('/user/')
    .get((req, res) => authenticateRequest(req, res, getUserTasks));
router.route('/:taskId/')
    .get((req, res) => authenticateRequest(req, res, getTask));
router.route('/:taskId/')
    .patch((req, res) => authenticateRequest(req, res, updateTask));
router.route('/:taskId/')
    .delete((req, res) => authenticateRequest(req, res, deleteTask));

module.exports = router;