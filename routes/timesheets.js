const express = require('express');
const router = express.Router({mergeParams: true});

// Models // 
const Timesheet = require('../models/timesheet');

// utils
const months = require('../utils/months');
const sheetDate = require('../utils/date');

router.get('/', async (req, res) => {
    const timesheets = await Timesheet.find({});
    res.render('timesheets/index', { timesheets });
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id).populate('submissions').sort({day:-1});
    res.render('timesheets/show', { timesheet }) 
})

router.get('/:id/submissions', async (req, res) => {
    const { id } = req.params;
    const timesheet = await Timesheet.findById(id).populate('submissions');
    res.render('timesheets/show', { timesheet }) 
})


router.post('/', async (req, res) => {      
    Timesheet.find({month: sheetDate.date.currentDate}, function(err, docs){
        if (docs.length){            
            console.log('timesheet already exists')
        } else {
            const timesheet = new Timesheet({
                month: sheetDate.date.currentDate
            });
            timesheet.save();
        }
    })  
    res.redirect('/timesheets')
})

router.delete('/:id', async(req, res) =>{
    const { id } = req.params;
    await Timesheet.findByIdAndDelete(id);
    res.redirect('/timesheets')
})

module.exports = router;