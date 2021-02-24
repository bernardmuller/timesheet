const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Submission = require('./timesheet');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },    
    timesheets: {
        type: Schema.Types.ObjectId,
        ref: 'Timesheet'
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);