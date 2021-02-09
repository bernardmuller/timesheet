const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// connection to routes //
app.use('/timesheets', timesheets);
app.use('/timesheets/:id/submissions', submissions);

// listener //
app.listen(3000, () => {
    console.log('listening on port 3000');
})

