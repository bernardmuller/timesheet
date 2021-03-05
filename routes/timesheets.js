const express = require('express');
const router = express.Router({mergeParams: true});


// utils
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner, createTimesheet } = require('../utils/middleware');


//controllers
const timesheets = require('../controllers/timesheets');


//Routes
router.route('/', )
    .get(isLoggedIn, createTimesheet,  catchAsync(timesheets.index))
    // .post(isLoggedIn, catchAsync(timesheets.createTimesheet))


router.route('/:id')
    .get(isLoggedIn, isOwner ,catchAsync(timesheets.renderTimesheet))
    .delete(isLoggedIn, isOwner, catchAsync(timesheets.deleteTimesheet))


router.get('/:id/download', isLoggedIn, catchAsync(timesheets.renderDownload))


router.get('/:id/pdf', isLoggedIn, catchAsync(timesheets.downloadPDF))


module.exports = router;