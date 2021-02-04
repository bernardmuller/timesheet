const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    day: String, // Needs automation - day
    month: String,
    description: {
        type: String,        
    },
    project: String        
})

module.exports = mongoose.model("Submission", submissionSchema);