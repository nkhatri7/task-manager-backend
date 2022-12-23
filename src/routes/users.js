const express = require('express');
const router = express.Router();
const { 
    getUser, 
    deleteUser, 
    updateUserName, 
    updateUserTasksOrder, 
} = require('../controllers/users');

router.route('/:id').get(getUser);
router.route('/:id').delete(deleteUser);
router.route('/change-name/:id').patch(updateUserName);
router.route('/tasks/:id').patch(updateUserTasksOrder);

module.exports = router;