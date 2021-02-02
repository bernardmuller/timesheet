const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

// models
const Submission = require('./models/submission');


mongoose.connect('mongodb://localhost:27017/timesheet', {
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/submissions', async (req, res) => {
    const submissions = Submission.find({});
    res.render('timesheet/index', { submissions });
})

app.get('/submissions/new', (req, res) => {
    res.render('/timesheet/new')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})