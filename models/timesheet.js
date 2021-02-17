const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Submission = require('./submission');

const timesheetSchema = new Schema({
    name: String,
    month: String, 
    year: String,
    submissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Submission'
        }
    ]
})

timesheetSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Submission.deleteMany({
            _id: {
                $in: doc.submissions
            }
        })
    }
})

module.exports = mongoose.model("Timesheet", timesheetSchema);