const express = require('express');
const router = express.Router({mergeParams: true});


// utils
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner, validateSubmission } = require('../utils/middleware');


//controllers
const submissions = require('../controllers/submissions');


//Routes
router.get('/new', isLoggedIn, catchAsync(submissions.renderNewForm))


router.post('/', isLoggedIn, validateSubmission, catchAsync(submissions.createSubmission))


router.get('/:subID/edit', isLoggedIn, isOwner, catchAsync(submissions.renderEditForm))


router.put('/:subID', isLoggedIn, isOwner, catchAsync(submissions.editSubmission));


router.delete('/:subID', isLoggedIn, isOwner, catchAsync(submissions.deleteSubmission))


module.exports = router;