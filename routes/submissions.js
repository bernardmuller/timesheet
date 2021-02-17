const express = require('express');
const router = express.Router({mergeParams: true});
const { submissionSchema } = require('../schemas');

// Models // 
const Submission = require('../models/submission');
const Timesheet = require('../models/timesheet');

// utils
const months = require('../utils/months');
const date = require('../utils/date');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Joi = require('joi');

const newDate = new Date();
const defaultDate = newDate.toISOString().slice(0,10);


//Submission Validation
const validateSubmission = (req, res, next) => {    
    const { error } = submissionSchema.validate(req.body);    
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


// app.get('/', async (req, res) => {
//     const submissions = await Submission.findbyId(req.body.params);
//     res.render('submissions/index', { submissions });
// })

router.get('/new', catchAsync(async(req, res) => {    
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id);
    res.render('submissions/new', { timesheet, defaultDate })
}))

// app.get('/:subID', async (req, res) =>{
//     const { subID } = req.params;
//     const submission = await Submission.findById(subID);
//     res.render('submissions/show', { submission })
// })

router.post('/', validateSubmission, catchAsync(async(req, res, next) => { 
    const newSubmission = new Submission(req.body.submission);
    const timesheet = await Timesheet.findById(req.params.id);
    timesheet.submissions.push(newSubmission)
    newSubmission.timesheet.push(timesheet);
    const selectedDay = req.body.submission.date.slice(8,10)
    newSubmission.day = selectedDay;
    await timesheet.save();
    await newSubmission.save();
    res.redirect(`/timesheets/${timesheet._id}`)
}))

router.get('/:subID/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id);
    const { subID } = req.params;
    const submission = await Submission.findById(subID);
    res.render('submissions/edit', { timesheet, submission })
}))


router.put('/:subID', catchAsync(async(req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id);
    const { subID } = req.params;
    const updatedSubmission = await Submission.findByIdAndUpdate(subID, {...req.body.submission}, {runValidators: true, new: true, useFindAndModify:false});   
    await updatedSubmission.save(); 
    res.redirect(`/timesheets/${timesheet._id}`)
}))

router.delete('/:subID', catchAsync(async(req, res) =>{
    const { id } = req.params;
    await Submission.findByIdAndDelete(id);
    res.redirect('/submissions')
}))

module.exports = router;