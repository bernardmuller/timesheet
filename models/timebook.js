const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timesheet = require('./timesheet');

const timesheetSchema = new Schema({
    date: String, // Needs automation - year
    timesheets: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Timesheets'
        }
    ]
})

module.exports = mongoose.model("Timebook", timebookSchema);