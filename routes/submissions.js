const express = require('express');
const router = express.Router({mergeParams: true});

// Models // 
const Submission = require('../models/submission');
const Timesheet = require('../models/timesheet');

// utils
const months = require('../utils/months');
const date = require('../utils/date');

const newDate = new Date();
const defaultDate = newDate.toISOString().slice(0,10);

// app.get('/', async (req, res) => {
//     const submissions = await Submission.findbyId(req.body.params);
//     res.render('submissions/index', { submissions });
// })

router.get('/new', async (req, res) => {
    console.log(defaultDate)
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id);
    res.render('submissions/new', { timesheet, defaultDate })
})

// app.get('/timesheets/:id/submissions/:subID', async (req, res) =>{
//     const { id } = req.params;
//     const submission = await Submission.findById(id);
//     res.render('submissions/show', { submission })
// })

router.post('/', async (req, res) => {    
    const newSubmission = new Submission(req.body.submission);
    const timesheet = await Timesheet.findById(req.params.id);
    timesheet.submissions.push(newSubmission)
    const selectedDay = req.body.submission.date.slice(8,10)
    newSubmission.day = selectedDay;
    await timesheet.save();
    await newSubmission.save();
    res.redirect(`/timesheets/${timesheet._id}`)
})

router.get('/edit', async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    res.render('submissions/edit', { submission })
})


router.put('/:subID', async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findByIdAndUpdate(id, {...req.body.submission}, {runValidators: true, new: true, useFindAndModify:false});    
    res.redirect(`/submissions/${submission._id}`)
})

router.delete('/:subID', async(req, res) =>{
    const { id } = req.params;
    await Submission.findByIdAndDelete(id);
    res.redirect('/submissions')
})

module.exports = router;