const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const months = require('../utils/months');


// date manager
const date = new Date();
const day = date.toISOString().slice(8,10);
const month = months.months[date.toISOString().slice(5,7)];
const year = date.toISOString().slice(0,4);

// not sure if im going to add in week of month
const weekNum = Math.floor((day - 1) / 7 + 1);


function addEntries(workbook, timesheet) {    
    const sheet = workbook.getWorksheet(`${timesheet.month}_${timesheet.year}`);
    const submissions = [...timesheet.submissions]    
    for (let submission of submissions) {        
        const rowValues = [];
        rowValues[0] = submission.day;
        rowValues[1] = submission.description;
        rowValues[2] = submission.project;
        console.log(rowValues)
        sheet.addRow(rowValues);        
    }  
}


function sizeColumns(workbook, timesheet) {
    const activeSheet = workbook.getWorksheet(`${timesheet.month}_${timesheet.year}`);
    activeSheet.getColumn('A').width = 17;
    activeSheet.getColumn('B').width = 48;
    activeSheet.getColumn('C').width = 17;  
}


function sheetinfo(workbook, timesheet) {
    const activeSheet = workbook.getWorksheet(`${timesheet.month}_${timesheet.year}`);
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


// this function doesn't really work
function borders(workbook, timesheet) {
    const sheet = workbook.getWorksheet(`${timesheet.month}_${timesheet.year}`);
    let last = sheet.lastRow;    
    for (let i = 5; i< last; i++) {
        activeSheet.getColumn(`A`).border = {            
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };
    }
}


async function create(timesheet) {
    const workbook = new ExcelJS.Workbook();    
    const sheet = workbook.addWorksheet(`${timesheet.month}_${timesheet.year}`);    

    sheet.getCell('A1').value = 'TIMESHEET';
    sheet.getCell('B1').value = 'cnr';
    sheet.getCell('C1').value = '.Architects';

    sheet.getCell('A3').value = 'Name:';
    sheet.getCell('B3').value = `${timesheet.owner.username}`;


    sheet.getCell('A4').value = 'Month:';
    sheet.getCell('B4').value = `${timesheet.month} ${timesheet.year}`;

    sheet.getCell('A6').value = 'DATE';
    sheet.getCell('B6').value = 'DESCRIPTION';
    sheet.getCell('C6').value = 'PROJECT';


    sheetinfo(workbook, timesheet);
    addEntries(workbook, timesheet);    

    const headers = ['A6', 'B6', 'C6'];
    for (let i = 0; i < headers.length; i++) {
        sheet.getCell(headers[i]).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'double'},
            right: {style:'thin'}
        };
    }

    sizeColumns(workbook, timesheet);
    borders(workbook, timesheet);
    
    
    try {  
       const file = await workbook.xlsx.writeFile(path.join(__dirname, `../docs/${timesheet.owner.username}_${timesheet.month}_${timesheet.year}.xlsx`)); 
    } catch(e){
        console.log(e)
    }
}



module.exports.createFile = (timesheet) => {
    create(timesheet)    
}










