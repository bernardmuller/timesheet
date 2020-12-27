const fs = require('fs');
const ExcelJS = require('exceljs');
const prompt = require('prompt-sync')();

const date = new Date();
const day = date.toISOString().slice(8,10);
const month = months[date.toISOString().slice(5,7)];
// const month = 'July';
const year = date.toISOString().slice(0,4);
const progDir = process.cwd();
const bookName = year + '_timebook.xlsx';
const bookPath = progDir + '/timesheets/' + bookName;
const weekNum = Math.floor((day - 1) / 7 + 1);


function initialize() {
    if (!fs.existsSync(bookPath)) {
        timebook = new ExcelJS.Workbook();
        console.log('Timebook does not exist');
        this.createBook();
        this.createActiveSheet();            
    } else {
        try {
            console.log('timebook exists')
            await timebook.xlsx.readFile(bookPath)
                .then(function() {
                    console.log(activeSheet.getCell('A1').value)
                    
                });
        } catch (e) {
            console.log('something not right')
            console.log(e)
        }
        
        
    }     
}    

async function saveFile() {
    await timebook.xlsx.writeFile(bookPath); 
}

function createBook() {       
    this.saveFile();
}