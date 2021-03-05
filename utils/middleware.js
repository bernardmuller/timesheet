const Timesheet = require('../models/timesheet');
const { submissionSchema } = require('../schemas');
const ExpressError = require('./expressError');
const sheetDate = require('./date');

const newDate = new Date();
const defaultDate = newDate.toISOString().slice(0,10);

module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const timesheet = await Timesheet.findById(id);
    if (!timesheet.owner === req.user._id) {
        console.log('unauthorized user!')
        req.flash('error', 'You do not have permission to do that!')
        res.redirect(`/timesheets${timesheet._id}`)
    }
    next()    
};


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first.')
        return res.redirect('/login')
    } 
    next();
};


module.exports.createTimesheet = async (req, res, next) => {      
    Timesheet.find({name: sheetDate.date.currentDate, owner:req.user._id}, function(err, docs){
        if (!docs.length){           
            const timesheet = new Timesheet({
                name: sheetDate.date.currentDate,
                month: sheetDate.date.currentMonth,
                year: sheetDate.date.currentYear,   
                owner: req.user._id             
            });
            timesheet.save();
            req.flash('success', `Timesheet for ${sheetDate.date.currentDate} created.`);
            res.redirect('/timesheets')
        }
    })  
    next(); 
};


module.exports.validateSubmission = (req, res, next) => {    
    const { error } = submissionSchema.validate(req.body);    
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};


