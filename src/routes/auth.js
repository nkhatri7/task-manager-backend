const express = require('express');
const router = express.Router();
const { 
    createUser, 
    signInUser, 
    updateUserEmail, 
    updateUserPassword, 
    signOutUser,
} = require('../controllers/auth');
const { authenticateRequest } = require('../middleware/auth');

router.route('/register').post(createUser);
router.route('/login').post(signInUser);
router.route('/change-email')
    .patch((req, res) => authenticateRequest(req, res, updateUserEmail));
router.route('/change-password')
    .patch((req, res) => authenticateRequest(req, res, updateUserPassword));
router.route('/sign-out')
    .delete((req, res) => authenticateRequest(req, res, signOutUser));

module.exports = router;