const fs = require('fs');
// import ExcelJS from 'exceljs';
// import {months} from 'months';

const months = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
}

const date = new Date();
const day = date.toISOString().slice(8,10);
const month = date.toISOString().slice(5,7);
const year = date.toISOString().slice(0,4);
const progDir = process.cwd();
const tempDir = prog_dir + '/templates/template.xlsx';
const bookName = year + '_timebook.xslx';
const bookPath = prog_dir + '/timesheets/' + bookName;


class TimebookSetup {
    constructor () {
        
    }
}