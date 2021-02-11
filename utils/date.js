const months = require('../utils/months');

const date = new Date();

const currentYear = date.toISOString().slice(0,4);
const currentMonth = months.months[date.toISOString().slice(6,7)];   
const currentDay = date.toISOString().slice(8,10);   
const currentDate =  currentMonth + " " + currentYear; 

module.exports.date = {
    'currentYear': currentYear,
    'currentMonth': currentMonth,
    'currentDay':  currentDay,
    'currentDate': currentDate
};