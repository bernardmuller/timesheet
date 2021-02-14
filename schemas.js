const Joi = require('joi');

module.exports.submissionSchema = Joi.object({
    submission: Joi.object({     
        date: Joi.date(),       
        description: Joi.string().required(),
        project: Joi.string().required().max(4)
    }).required()        
}) 