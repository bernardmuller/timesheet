const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');

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
const { isLoggedIn } = require('../utils/isLoggedIn');
const { isOwner } = require('../utils/isOwner');

//Excel
const toExcel = require('../excelversion/auto');

router.get('/', isLoggedIn, catchAsync(async(req, res) => {   
    const timesheets = await Timesheet.find({owner: req.user._id});
    res.render('timesheets/index', { timesheets });
}))


router.get('/:id', isLoggedIn, isOwner ,catchAsync(async(req, res) => {
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id)
    .populate({
        path: 'submissions',
        options: {
            sort: {day: 1}
        }})
    .populate('owner')
    if (!timesheet) {
        req.flash('success', 'Timesheet does not exist.');
        return res.redirect('/timesheets');
    }
    res.render('timesheets/show', { timesheet }) 
}))


router.get('/:id/download', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id)
    .populate({
        path: 'submissions',
        options: {
            sort: {day: 1}
        }})
    toExcel.createFile(timesheet)
    const filePath = `../docs/${timesheet.month}.xlsx`;
    res.render('timesheets/download', {filePath})
}))


// router.get('/:id/pdf', catchAsync(async(req, res) => {
//     const { id } = req.params; 
//     const response = await axios.get(`http://localhost:8080/timesheets/${id}`)
//     console.log(response.data)
//     const filePath = path.join(__dirname, '../docs/works.xlsx')
//     res.redirect('/timesheets')
// }))


router.post('/', isLoggedIn, catchAsync(async (req, res) => {      
    Timesheet.find({name: sheetDate.date.currentDate, owner:req.user._id}, function(err, docs){
        if (docs.length){           
            req.flash('success', `Timesheet for ${sheetDate.date.currentDate} already exists.`);
            res.redirect('/timesheets')
        } else {
            const timesheet = new Timesheet({
                name: sheetDate.date.currentDate,
                month: sheetDate.date.currentMonth,
                year: sheetDate.date.currentYear,   
                owner: req.user._id             
            });
            timesheet.save();
            req.flash('success', `Timesheet for ${sheetDate.date.currentDate} created.`);
            res.redirect('/timesheets')
        }
    })     
    
}))



router.delete('/:id', isLoggedIn, catchAsync(async(req, res) =>{
    const { id } = req.params;
    await Timesheet.findByIdAndDelete(id);
    res.redirect('/timesheets')
}))

module.exports = router;