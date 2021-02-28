const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');


const submissionSchema = new Schema({
    day: Number, // Needs automation - day
    month: String,
    description: {
        type: String,        
    },
    project: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    timesheet: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Timesheet'
        }
    ]     
})

module.exports = mongoose.model("Submission", submissionSchema);