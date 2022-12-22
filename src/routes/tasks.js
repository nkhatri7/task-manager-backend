const express = require('express');
const router = express.Router();
const { 
    createTask, 
    getUserTasks, 
    getTask, 
    deleteTask, 
    updateTask, 
} = require('../controllers/tasks');

router.route('/').post(createTask);
router.route('/user/:userId').get(getUserTasks);
router.route('/:id').get(getTask);
router.route('/:id').patch(updateTask);
router.route('/:id').delete(deleteTask);

module.exports = router;