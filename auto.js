const fs = require('fs');
const XLSX = require('xlsx');
const prompt = require('prompt-sync')();
const figlet = require('figlet');
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
const bookName = year + '_timebook.xlsx';
const bookPath = progDir + '/timesheets/' + bookName;
const weekNum = Math.floor((day - 1) / 7 + 1);
// let timebook = new ExcelJS.Workbook();




class Setup {
    constructor () {
    }

    async initialize() {

        const timebook = XLSX.readFile(bookPath);
        if (!fs.existsSync(bookPath)) {
            console.log('Timebook does not exist');
            this.createBook(timebook);
            this.createActiveSheet(timebook);  
            editor.edit(timebook)
        } else {
            try {
                console.log('Opening Timebook...')
                //this.checkSheets(timebook);
                await timebook.xlsx.readFile(bookPath)
                    .then(() => {
                        editor.edit(timebook);
                        
                    });
            } catch (e) {
                console.log('something not right')
                console.log(e)
            }           
        }   
        this.saveFile(timebook)  
    } 
    
    

    checkSheets(timebook) {
        if(!timebook.getWorksheet(`${month}`)) {
            this.createActiveSheet(timebook);
        }
    }

    async createBook(timebook) {       
        this.saveFile(timebook);
    }

    async createActiveSheet(timebook) {
        if (!timebook.worksheets.includes(month)) {
            let activeSheet = timebook.addWorksheet(`${month}`);
            console.log(`Sheet: ${activeSheet.name} created`)

            activeSheet.getCell('A1').value = 'TIMESHEET';
            activeSheet.getCell('B1').value = 'cnr';
            activeSheet.getCell('C1').value = '.Architects';
            activeSheet.getCell('A3').value = 'Name:';
            activeSheet.getCell('A4').value = 'Month:';
            activeSheet.getCell('B3').value = this.getCredentials();
            activeSheet.getCell('B4').value = `${month} ${year}`;

        }
    }

    async saveFile(timebook) {
        await timebook.xlsx.writeFile(bookPath); 
    }

    getCredentials() {
        let userName = prompt('Please enter your name?');        
        return userName
    }

    
}


class Editor {
    constructor () {

    }

    edit(timebook) {
        const activeSheet = timebook.getWorksheet(`${month}`);
        const cellA6 = activeSheet.getCell('A6').value;
        if (cellA6 === null) {
            timebook.getWorksheet(`${month}`)
                .getCell('A6').value = "DATE";
            // activesheet.getCell('B6').value = "DESCRIPTION";
            // activesheet.getCell('C6').value = "PROJECT";
            
            this.addEntry(timebook);

            //-----TABLE-----//
            // this.mkTable(timebook);
            // console.log('new table created')
            // this.addDescription(timebook);

        } else {
            this.addEntry(timebook);

            //-----TABLE-----//
            // console.log('table already exists')
            // this.addDescription(timebook);
            // this.addEntry(timebook);
        }
        
    }

    async mkTable(timebook) {
        const activeSheet = timebook.getWorksheet(`${month}`);
        console.log('check')
        activeSheet.addTable({
            name: 'WORK DESCRIPTIONS',
            ref: 'A6',
            headerRow: true,
            totalsRow: false,
            displayName: false,
            columns : [
                {name: 'DATE'},
                {name: 'DESCRIPTION'},
                {name: 'PROJECT'}
            ],
            rows: [
                ['something']

            ],
        });
        let table = activeSheet.getTable('WORK DESCRIPTIONS');
        table.removeRows(0,1);
        await table.commit();
    }

    addEntry(timebook) {
        let activeSheet = timebook.getWorksheet(`${month}`);

        let lastRow = activeSheet.lastRow;
        let newEntryRow = activeSheet.getRow(lastRow++);
        newEntryRow.getCell('A').value = day;
        newEntryRow.getCell('B').value = prompt("Enter today's work description: ");
        newEntryRow.getCell('C').value = prompt('Project: ');
        newEntryRow.commit();
    }

    async addDescription(timebook) {
        let activeSheet = timebook.getWorksheet(`${month}`);
        let table = activeSheet.getTable('WORK DESCRIPTIONS');
        let submission = prompt("Enter today's work description: ");
        let project = prompt('Project: ');
        console.log('check 1')
        await table.addRow([day, submission, project]);
        console.log('check 2')
        await table.commit();
        console.log('check 3')
        setup.saveFile(timebook);
    }
}


class Styler {
    constructor() {
        
    }
    
    sizeColumns(timebook) {
        const activeSheet = timebook.getWorksheet(`${month}`);
        activeSheet.getColumn('A').width = 17;
        activeSheet.getColumn('B').width = 48;
        activeSheet.getColumn('C').width = 17;
        console.log('column sizes changed')

        
    }

    headers (timebook) {
        const activeSheet = timebook.getWorksheet(`${month}`);
        const fontM = { name: 'Calibri', bold: true, size: 16 };
        const fontL = { name: 'Calibri', bold: true, size: 18 };
        const center = { horizontal: 'center' };
        const left = { horizontal: 'left' };
        const right = { horizontal: 'right'};

        activeSheet.getCell('A1').font = fontL;
        activeSheet.getCell('B1').font = { name: 'bauhaus 93', size: 16, bold: true};
        activeSheet.getCell('C1').font = { name: 'New Times Roman', size: 16, bold: false};

        activeSheet.getCell('B1').alignment = right;
        activeSheet.getCell('C1').alignment = left;

        
    }
}


//----MAIN----//
const setup = new Setup();
const styler = new Styler();
const editor = new Editor();

// Setup

setup.initialize();
// editor
//editor.edit();
// styler
//styler.sizeColumns();
//styler.headers();


    



