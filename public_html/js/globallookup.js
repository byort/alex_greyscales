/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function changeglobal(name, value)
{
    var tempglobal = globalproperties;
    for(var k of Object.keys(tempglobal))
    {
        if (tempglobal[k] instanceof Object)
        {
            for(var l in tempglobal[k])
            {
                if(l === name)
                {
                    tempglobal[k][l] = value;
                }
            }
        }
        else
        {
            if(tempglobal[k] === name)
            {
                tempglobal[k] = value;
            }
        }
    }
}

function globallookup(name) // by default creates deep copy
{
    var tempglobal = JSON.parse(JSON.stringify(globalproperties));
    var tempglobal1 = globalproperties;
//    console.log(tempglobal, JSON.parse(JSON.stringify(globalproperties)))
    for(var k in tempglobal)
    {
        for(var l in tempglobal[k])
        {
            if(l === name)
            {
                return tempglobal[k][l];
            }
        }
        if(k === name)
        {
            return tempglobal[k];
        }
    }
}
function globallookup_shallow(name) // returns reference
{
    var tempglobal = globalproperties;
    for(var k in tempglobal)
    {
        for(var l in tempglobal[k])
        {
            if(l === name)
            {
                return tempglobal[k][l];
            }
        }
        if(k === name)
        {
            return tempglobal[k];
        }
    }
}