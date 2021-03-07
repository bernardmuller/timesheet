const User = require('../models/user');
const Timesheet = require('../models/timesheet');
const sheetDate = require('../utils/date');

const newDate = new Date();
const defaultDate = newDate.toISOString().slice(0,10);


module.exports.renderHome = (req, res) => {
    res.render('home')
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
};


module.exports.registerUser = async(req, res) => {
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
};


module.exports.renderLogin = (req, res) => {
    res.render('users/login')
};


module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/timesheets'
    res.redirect(redirectUrl)
    delete req.session.returnTo
};

module.exports.renderProfile = async (req, res) => {
    const user = await User.findById(req.user._id)
    res.render('users/profile', { user })
}


module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/')
};


module.exports.scheduledSubmission = async (req, res) => {
    const user = await User.findById(req.user._id)    
    const timesheet = await Timesheet.find({'owner': user._id, 'month': sheetDate.date.currentMonth });
    res.render('submissions/newScheduled', {timesheet, defaultDate})
}