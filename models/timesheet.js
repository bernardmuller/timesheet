const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const submission = require('./submission');

const timesheetSchema = new Schema({
    name: String,
    date: String,  // Needs automation - Month
    submissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Submission'
        }
    ]
})

module.exports = mongoose.model("Timesheet", timesheetSchema);