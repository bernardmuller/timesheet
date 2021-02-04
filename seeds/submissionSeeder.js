const mongoose = require('mongoose');
const Submission = require('../models/submission');

mongoose.connect('mongodb://localhost:27017/timesheetApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected...')
});

const seedDB = async () => {
    await Submission.deleteMany({})
    for (let i = 0; i < 10; i++) {
        const submission = new Submission ({
            date: '1 JAN 2021',
            description: 'work work work',
            project: 'CBS'
        })
        await submission.save()
    }
}

seedDB().then(() => {
    console.log('Database seeded...')
    mongoose.connection.close();
})