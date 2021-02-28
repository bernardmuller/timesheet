const Timesheet = require('../models/timesheet');

module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const timesheet = await Timesheet.findById(id);
    if (!timesheet.owner === req.user._id) {
        console.log('unauthorized user!')
        req.flash('error', 'You do not have permission to do that!')
        res.redirect(`/timesheets${timesheet._id}`)
    }
    next()    
}