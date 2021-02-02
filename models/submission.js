const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    date: String, // Needs automation - day
    description: {
        type: String,        
    },
    project: {
        enum: ['RHV', 'CBS', 'AMA'],
        }
})

module.exports = mongoose.model("Submission", submissionSchema);