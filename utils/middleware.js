const Timesheet = require('../models/timesheet');
const { submissionSchema } = require('../schemas');
const ExpressError = require('./expressError');


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


module.exports.validateSubmission = (req, res, next) => {    
    const { error } = submissionSchema.validate(req.body);    
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};