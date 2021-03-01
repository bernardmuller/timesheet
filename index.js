const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localPassport = require('passport-local');
const User = require('./models/user')


//utilities
const ExpressError = require('./utils/expressError');


// Routes //
const timesheetRoutes = require('./routes/timesheets')
const submissionRoutes = require('./routes/submissions')
const userRoutes = require('./routes/users')


// Database connection //
mongoose.connect('mongodb://localhost:27017/timesheetApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected...')
});


// App Settings //
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(__dirname, 'docs')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));


// Session & Flash // 
const sessionConfig = {
    secret : 'password1234',
    resave : false,
    saveUninitialized: true,
    cookie : {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 *7
    }
}
app.use(session(sessionConfig));
app.use(flash());


// passport - auth //
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// globals //
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// connection to routes //
app.use('/timesheets', timesheetRoutes);
app.use('/timesheets/:id/submissions', submissionRoutes);
app.use('/', userRoutes);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong' 
    res.status(statusCode).render('error', { err });

})


// listener //
app.listen(8080, () => {
    console.log('listening on port 3000');
})

