const fs = require('fs');
const ExcelJS = require('exceljs');
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
const month = months[date.toISOString().slice(5,7)];
const year = date.toISOString().slice(0,4);
const progDir = process.cwd();
// const tempPath = progDir + '/templates/template.xlsx';
const bookName = year + '_timebook.xslx';
const bookPath = progDir + '/timesheets/' + bookName;
const weekNum = Math.floor((day - 1) / 7 + 1);


class Setup {
    constructor (year ,bookPath, bookName, tempPath) {
        // this.year = year;
        // this.bookPath = bookPath;
        // this.bookName = bookName;
        // this.tempPath = tempPath;
    }

    checkDirs(bookPath) {
        if (!fs.existsSync(bookPath)) {
            console.log('Timebook does not exist');
            this.createBook();
        }      
    }

    moveToTimesheets() {
        fs.rename(progDir + `/${bookName}`, bookPath, function(err){
            if (err) throw err
            console.log(`Book saved to ${bookPath}`)
        })
    }

    async createBook() {
        const timebook = new ExcelJS.Workbook();
        const template = timebook.addWorksheet('TEMPLATE');
        await timebook.xlsx.writeFile(bookName);     
        this.moveToTimesheets();
    }
}

let timebook = new Setup();
timebook.checkDirs()
