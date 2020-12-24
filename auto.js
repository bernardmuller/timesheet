const fs = require('fs');
const ExcelJS = require('exceljs');
const prompt = require('prompt-sync')();
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
// const month = 'July';
const year = date.toISOString().slice(0,4);
const progDir = process.cwd();
// const tempPath = progDir + '/templates/template.xlsx';
const bookName = year + '_timebook.xlsx';
const bookPath = progDir + '/timesheets/' + bookName;
const weekNum = Math.floor((day - 1) / 7 + 1);
const timebook = new ExcelJS.Workbook();




class Setup {
    constructor () {
    }

    initialize() {
        if (!fs.existsSync(bookPath)) {
            console.log('Timebook does not exist');
            this.createBook();
            this.getActiveSheet();
            this.getCredentials();
        }       
    }    

    async createBook() {       
        this.saveFile();
    }

    async getActiveSheet() {
        if (!timebook.worksheets.includes(month)) {
            let activeSheet = timebook.addWorksheet(`${month}`);
            console.log(`Sheet: ${activeSheet.name} created`)
        } else {
            return timebook.getWorksheet(`${month}`);
        }
    }

    async saveFile() {
        await timebook.xlsx.writeFile(bookPath); 
    }

    getCredentials() {
        let userName = prompt('What is your name?');
        console.log(`Hello, ${userName}!`)
        let activeSheet = timebook.getWorksheet(`${month}`);
        activeSheet.getCell('A1').value = userName;
    }
}



class Styler {
    constructor() {
        
    }
    
    sizeColumns() {
        const activeSheet = timebook.getWorksheet(`${month}`)
        activeSheet.getColumn('A').width = 17;
        activeSheet.getColumn('B').width = 48;
        activeSheet.getColumn('C').width = 17;
        console.log('column sizes changed')
    }
}


let setup = new Setup();
let styler = new Styler();
setup.initialize()
styler.sizeColumns()
setup.saveFile();

    



