const express = require('express');
const router = express.Router();
const { 
    createUser, 
    signInUser, 
    updateUserEmail, 
    checkPasswordMatches, 
} = require('../controllers/auth');

router.route('/register').post(createUser);
router.route('/login').post(signInUser);
router.route('/change-email/:id').patch(updateUserEmail);
router.route('/change-password/:id').patch(checkPasswordMatches);

module.exports = router;