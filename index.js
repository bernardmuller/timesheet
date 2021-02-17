const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

//utilities
const ExpressError = require('./utils/expressError');
const Joi = require('joi');

// Routes //
const timesheets = require('./routes/timesheets')
const submissions = require('./routes/submissions')

// models //
const Submission = require('./models/submission');
const Timesheet = require('./models/timesheet');

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

// connection to routes //
app.use('/timesheets', timesheets);
app.use('/timesheets/:id/submissions', submissions);

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

