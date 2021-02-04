const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
// const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

//utilities
// const months = require('./utils/months')

const months = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
}

// models
const Submission = require('./models/submission');
const Timesheet = require('./models/timesheet');

// Database connection
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


//App Settings 
// app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));


// Submission Routes
app.get('/submissions', async (req, res) => {
    const submissions = await Submission.find({});
    res.render('submissions/index', { submissions });
})

app.get('/submissions/new', (req, res) => {
    res.render('submissions/new')
})

app.get('/submissions/:id', async (req, res) =>{
    const { id } = req.params;
    const submission = await Submission.findById(id);
    res.render('submissions/show', { submission })
})

app.post('/submissions', async (req, res) => {
    const newSubmission = new Submission(req.body.submission);
    await newSubmission.save();
    res.redirect('/submissions')
})

app.get('/submissions/:id/edit', async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    res.render('submissions/edit', { submission })
})


app.put('/submissions/:id', async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findByIdAndUpdate(id, {...req.body.submission}, {runValidators: true, new: true, useFindAndModify:false});    
    res.redirect(`/submissions/${submission._id}`)
})

app.delete('/submissions/:id', async(req, res) =>{
    const { id } = req.params;
    await Submission.findByIdAndDelete(id);
    res.redirect('/submissions')
})

////////////////////////////////////////////////////////////////////////////
// Timesheet Routes
app.get('/timesheets', async (req, res) => {
    const timesheets = await Timesheet.find({});
    res.render('timesheets/index', { timesheets });
})

app.get('/timesheets/:id', async (req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id);
    res.render('timesheets/new', { timesheet }) 
})

app.post('/timesheets', async (req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id);
    const date = new Date();
    const currentYear = date.toISOString().slice(0,4);
    const currentMonth = months[date.toISOString().slice(6,7)];   
    const currentDate =  currentMonth + currentYear;
    if(!timesheet.month === currentDate) {
        const timesheet = new Timesheet({
            month: currentDate
        });
        timesheet.save();
    } else {
        console.log('date already exists')
    }
    res.redirect('/timesheets')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})

