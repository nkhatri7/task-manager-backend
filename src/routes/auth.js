const express = require('express');
const router = express.Router();
const { createUser, signInUser, checkPasswordMatches } = require('../controllers/auth');

router.route('/create').post(createUser);
router.route('/login').post(signInUser);
router.route('/change-password/:id').patch(checkPasswordMatches);

module.exports = router;