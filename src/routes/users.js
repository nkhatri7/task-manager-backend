const express = require('express');
const router = express.Router();
const { 
    getUser, 
    deleteUser, 
    updateUserName, 
    updateUserTasksOrder, 
} = require('../controllers/users');
const { authenticateRequest } = require('../middleware/auth');

router.route('/').get((req, res) => authenticateRequest(req, res, getUser));
router.route('/')
    .delete((req, res) => authenticateRequest(req, res, deleteUser));
router.route('/change-name/')
.patch((req, res) => authenticateRequest(req, res, updateUserName));
router.route('/tasks/')
    .patch((req, res) => authenticateRequest(req, res, updateUserTasksOrder));

module.exports = router;