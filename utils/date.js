const months = require('../utils/months');

const date = new Date();

const currentYear = date.toISOString().slice(0,4);
const currentMonth = months.months[date.toISOString().slice(6,7)];   
const currentDay = months.months[date.toISOString().slice(8,9)];   
const currentDate =  currentMonth + " " + currentYear; 

module.exports = currentYear;
module.exports = currentMonth;
module.exports = currentDay;
module.exports = currentDate;