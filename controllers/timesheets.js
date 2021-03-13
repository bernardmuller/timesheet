const Timesheet = require('../models/timesheet');
const path = require('path');

const months = require('../utils/months');
const sheetDate = require('../utils/date');

const toExcel = require('../excelversion/auto')

module.exports.index = async(req, res) => {   
    const timesheets = await Timesheet.find({owner: req.user._id});
    res.render('timesheets/index', { timesheets });
};

module.exports.renderTimesheet = async(req, res) => {
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
};


module.exports.renderDownload = async(req, res) => {
    const { id } = req.params;    
    const timesheet = await Timesheet.findById(id)
    .populate({
        path: 'submissions',
        options: {
            sort: {day: 1}
        }})
    .populate({
        path: 'owner'
    })
    toExcel.createFile(timesheet)
    const filePath = path.join(__dirname, `../docs/${timesheet.owner.username}/${timesheet.owner.username}_${timesheet.month}_${timesheet.year}.xlsx`);
    res.render('timesheets/download', {timesheet})
};





module.exports.deleteTimesheet = async(req, res) =>{
    const { id } = req.params;
    await Timesheet.findByIdAndDelete(id);
    res.redirect('/timesheets')
};


module.exports.downloadPDF = async(req, res) => {
        const { id } = req.params; 
        const response = await axios.get(`http://localhost:8080/timesheets/${id}`)
        console.log(response.data)
        const filePath = path.join(__dirname, '../docs/works.xlsx')
        res.redirect('/timesheets')
};