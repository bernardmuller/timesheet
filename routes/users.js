const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');

// utils
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');

//controllers
const users = require('../controllers/users');


//Routes
router.get('/', users.renderRegister)


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser))


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)


router.get('/logout', users.logoutUser)


module.exports = router;