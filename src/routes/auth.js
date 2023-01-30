const express = require('express');
const router = express.Router();
const { 
    createUser, 
    signInUser, 
    updateUserEmail, 
    updateUserPassword, 
} = require('../controllers/auth');

router.route('/register').post(createUser);
router.route('/login').post(signInUser);
router.route('/change-email/:id').patch(updateUserEmail);
router.route('/change-password/:id').patch(updateUserPassword);

module.exports = router;