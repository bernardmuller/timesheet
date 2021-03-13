const Submission = require('../models/submission');
const Timesheet = require('../models/timesheet');
const ExpressError = require('../utils/expressError');

const newDate = new Date();
const defaultDate = newDate.toISOString().slice(0,10);
const currentMonth = newDate.toISOString().slice(0,7);
console.log(currentMonth)

module.exports.createSubmission = async(req, res) => {     
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
};


module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id);
    const { subID } = req.params;
    const submission = await Submission.findById(subID);       
    if (!submission) {
        req.flash('error', 'Cannot find that submission');
        return res.redirect(`/timesheets/${timesheet._id}`);
    }
    res.render('submissions/edit', { timesheet, submission })
};


module.exports.renderNewForm = async(req, res) => {      
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id);
    res.render('submissions/new', { timesheet, defaultDate, currentMonth })
};


module.exports.editSubmission = async(req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id)
    .populate('owner');
    const { subID } = req.params;   
    const updatedSubmission = await Submission.findByIdAndUpdate(subID, {...req.body.submission}, {runValidators: true, new: true, useFindAndModify:false});  
    await updatedSubmission.save();
    req.flash('success', 'Submission Successfully Updated.');
    res.redirect(`/timesheets/${timesheet._id}`)      
};


module.exports.deleteSubmission = async(req, res) =>{
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id);
    const { subID } = req.params;
    await Submission.findByIdAndDelete(subID);
    req.flash('success', 'Submission Deleted');
    res.redirect(`/timesheets/${timesheet._id}`)
};


