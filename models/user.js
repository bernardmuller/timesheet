const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Submission = require('./timesheet');
const passportLocalMongoose = require('passport-local-mongoose');
const { boolean } = require('joi');

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },    
    timesheets: {
        type: Schema.Types.ObjectId,
        ref: 'Timesheet'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);