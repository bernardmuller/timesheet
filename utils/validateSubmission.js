const { submissionSchema } = require('../schemas');
const ExpressError = require('./expressError');

module.exports.validateSubmission = (req, res, next) => {    
    const { error } = submissionSchema.validate(req.body);    
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}