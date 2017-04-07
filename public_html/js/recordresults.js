/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function resultsinit()
{
    globalproperties['results'] = {
        csvString: '',
        subject: 'test',
        headings: ['response']
    }
}

function createOutput(testarray, headingarray)
{
    var csvString = "";
    var tempobj = testarray[0];
    var tempkeys = Object.keys(tempobj);
    for(var k=0; k<headingarray.length; k++)
    {
        csvString += String(headingarray[k]) + ",";
        localStorage.tnsexp4 += String(headingarray[k]) + ",";
    }
    for(var i=0; i<tempkeys.length; i++)
    {
        csvString += tempkeys[i] + ",";
        localStorage.tnsexp4 += tempkeys[i] + ",";
    }
    csvString += "num,repeat\n";
    changeglobal('csvString', csvString)
    localStorage.tnsexp4 += "num,repeat\n";
}

function recResults(dataobj, resultobj)
{
    var csvString = globallookup('csvString');
    var resultkeys = Object.keys(resultobj);
    for(var i = 0 ; i < resultkeys.length; i++){
        csvString += resultobj[ resultkeys[i] ] + ",";
        localStorage.tnsexp4 += resultobj[ resultkeys[i] ] + ",";
    }    
    for(var keys of Object.keys(dataobj))
    {
        csvString += dataobj[keys] + ",";
        localStorage.tnsexp4 += dataobj[keys] + ",";
    }
    csvString += globallookup('num') + "," + globallookup('repeat') + ", \n";;
    localStorage.tnsexp4 += globallookup('num') + "," + globallookup('repeat') + ", \n";
    changeglobal('csvString', csvString)
//    console.log(localStorage.saves);
//    console.log(globallookup('csvString'));
}

function outputResponses(log)
{
    /* Add MIME type header to your data & encode it in URI format to download */
    var csvContent = "data:text/csv;charset=utf-8," + globallookup('csvString');
    csvContent = encodeURI(csvContent);

    /*Create a link to download from & force a click*/
    ////http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction
    var a = document.createElement('a');
    a.href = csvContent;
    a.target = '_blank';
    var subject = globallookup('subject');
    a.download = subject + 'results4.csv';
    a.innerHTML = "<h4>Click to download results!</h4>";
    //    
    document.body.appendChild(a);
    a.click();   
}
function toCSV(array)
{
    var tempstring = '';
    for(let key of Object.keys(array[0]))
    {
//        console.log(key);
        tempstring += key + ',';
    }
    for(var item of array)
    {
        tempstring += '\n'
        for (let key of Object.keys(item))
        {
            tempstring += item[key] + ','
        }
    }
    return tempstring;
}
function retrievesession()
{
    var csvContent = "data:text/csv;charset=utf-8,"
    csvContent += localStorage.tnsexp4;
    csvContent = encodeURI(csvContent);
    var subject = globallookup('subject');
    /*Create a link to download from & force a click*/
    ////http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction
    var a = document.createElement('a');
    a.href = csvContent;
    a.target = '_blank';
    a.download = subject+'(variant0)exp1results.csv';
    a.innerHTML = "<h4>Click to download results!</h4>";
    //    
    document.body.appendChild(a);
    a.click();
}