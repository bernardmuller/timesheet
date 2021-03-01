const Timesheet = require('../models/timesheet');

const months = require('../utils/months');
const sheetDate = require('../utils/date');


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
    toExcel.createFile(timesheet)
    const filePath = `../docs/${timesheet.owner.id}/${timesheet.month}.xlsx`;
    res.render('timesheets/download', {filePath})
};


module.exports.createTimesheet = async (req, res) => {      
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