const express = require('express');
const router = express.Router({mergeParams: true});
const { submissionSchema } = require('../schemas');
const passport = require('passport');

// Models // 
const Submission = require('../models/submission');
const Timesheet = require('../models/timesheet');

// utils
const months = require('../utils/months');
const date = require('../utils/date');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Joi = require('joi');
const { isLoggedIn } = require('../utils/isLoggedIn');
const { isOwner } = require('../utils/isOwner');
const { validateSubmission } = require('../utils/validateSubmission');

const newDate = new Date();
const defaultDate = newDate.toISOString().slice(0,10);


router.get('/new', isLoggedIn, catchAsync(async(req, res) => {  
    
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id);
    res.render('submissions/new', { timesheet, defaultDate })
}))


router.post('/', isLoggedIn, validateSubmission, catchAsync(async(req, res) => {     
    const newSubmission = new Submission(req.body.submission);
    const timesheet = await Timesheet.findById(req.params.id);
    timesheet.submissions.push(newSubmission)
    newSubmission.timesheet.push(timesheet);
    const selectedDay = req.body.submission.date.slice(8,10);
    newSubmission.day = selectedDay;
    newSubmission.owner = req.user._id;
    await timesheet.save();
    await newSubmission.save();
    req.flash('success', 'Daily submission submitted.');
    res.redirect(`/timesheets/${timesheet._id}`)
}))


router.get('/:subID/edit', isLoggedIn, isOwner, catchAsync(async(req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id);
    const { subID } = req.params;
    const submission = await Submission.findById(subID);       
    if (!submission) {
        req.flash('error', 'Cannot find that submission');
        return res.redirect(`/timesheets/${timesheet._id}`);
    }
    res.render('submissions/edit', { timesheet, submission })
}))


router.put('/:subID', isLoggedIn, isOwner, catchAsync(async(req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id)
    .populate('owner');
    const { subID } = req.params;   
    const updatedSubmission = await Submission.findByIdAndUpdate(subID, {...req.body.submission}, {runValidators: true, new: true, useFindAndModify:false});  
    await updatedSubmission.save();
    req.flash('success', 'Submission Successfully Updated.');
    res.redirect(`/timesheets/${timesheet._id}`)      
}));


router.delete('/:subID', isLoggedIn, isOwner, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id);
    const { subID } = req.params;
    await Submission.findByIdAndDelete(subID);
    req.flash('success', 'Submission Deleted');
    res.redirect(`/timesheets/${timesheet._id}`)
}))

module.exports = router;