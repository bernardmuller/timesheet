const express = require('express');
const router = express.Router({mergeParams: true});

//temp
const axios = require('axios').default;

// Models // 
const Timesheet = require('../models/timesheet');

// utils
const months = require('../utils/months');
const sheetDate = require('../utils/date');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Joi = require('joi');
const path = require('path');

//Excel
const toExcel = require('../excelversion/auto');

router.get('/', catchAsync(async(req, res) => {
    const timesheets = await Timesheet.find({});
    res.render('timesheets/index', { timesheets });
}))

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id)
    .populate({
        path: 'submissions',
        options: {
            sort: {day: 1}
        }})
     
    res.render('timesheets/show', { timesheet }) 
}))


router.get('/:id/download', catchAsync(async(req, res) => {
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id)
    .populate({
        path: 'submissions',
        options: {
            sort: {day: 1}
        }})
    toExcel.createFile(timesheet)
    const filePath = path.join(__dirname, '../docs/works.xlsx')
    res.render('timesheets/download', {filePath})
}))


router.get('/:id/pdf', catchAsync(async(req, res) => {
    const { id } = req.params; 
    const response = await axios.get(`http://localhost:8080/timesheets/${id}`)
    console.log(response.data)
    const filePath = path.join(__dirname, '../docs/works.xlsx')
    res.redirect('/timesheets')
}))


router.post('/', catchAsync(async (req, res, next) => {      
    Timesheet.find({name: sheetDate.date.currentDate}, function(err, docs){
        if (docs.length){            
            // insert flash message here
            console.log(`Timesheet for ${sheetDate.date.currentDate} already exists.`)
        } else {
            const timesheet = new Timesheet({
                month: sheetDate.date.currentMonth,
                year: sheetDate.date.currentYear,                
            });
            timesheet.save();
        }
    })  
    res.redirect('/timesheets')
}))



router.delete('/:id', catchAsync(async(req, res) =>{
    const { id } = req.params;
    await Timesheet.findByIdAndDelete(id);
    res.redirect('/timesheets')
}))

module.exports = router;