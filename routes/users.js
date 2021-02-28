const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const passport = require('passport');

// utils
const months = require('../utils/months');
const sheetDate = require('../utils/date');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Joi = require('joi');
const path = require('path');
const { isLoggedIn } = require('../utils/isLoggedIn');


router.get('/', (req, res) => {
    res.render('users/register')
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=> {
            if (err) return next(err);
            req.flash('success', 'Welcome to Timesheet')
            res.redirect('/timesheets')
        })        
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }    
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/timesheets'
    res.redirect(redirectUrl)
    delete req.session.returnTo
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/login')
})

module.exports = router;