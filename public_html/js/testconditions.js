
function testarrayinit()
{
    globalproperties['variables']={
        length:[1, 1.5, 2],
    }
}
function createTestArray()
{
    var variables = globallookup('variables');
    var temparray = createStimulusArray(variables);
    globalproperties.data = temparray;    
}

function createStimulusArray(ivobj)
{
    var count = 0;
    for(let key of Object.keys(ivobj))
    {
        var temparray = returnarray || [];
        var newarray = ivobj[key];
        var returnarray = combineArrays(temparray, key, newarray);
    }
    for(let i=0; i<returnarray.length; i++)
    {
        returnarray[i].name = count;
        count+=1;
    }
    return returnarray;
}

function createConditionArray(array1, array2 = array1)
{
    var temparray = [];
    for(let i = 0; i< array1.length;i++)
    {
        for(let j = i+1; j<array2.length;j++)
        {
            if(array1[i].lightness === array2[j].lightness) // condition for combination
            {
                let tempobj = {};
    //                console.log(array[i])
                for(const v of Object.keys(array1[i]))
                {
                    tempobj[String(v)+'1'] = array1[i][v];
                }
                for (const v of Object.keys(array2[j]))
                {
                    tempobj[String(v)+'2'] = array2[j][v];
                }
                temparray.push(tempobj);
            }
        }
    }
    return temparray;
}

function combineArrays(array1, key1, array2 = array1, key2=key1)
{
    var temparray = [];
    var limit1 = array1.length>0?array1.length:1;
    var limit2 = array2.length>0?array2.length:1;
    for(let i = 0; i< limit1;i++)
    {
        for(let j = 0; j< limit2;j++)
        {
            var tempobj = {};
            if(array1[i] instanceof Object)
            {
                for(let key of Object.keys(array1[i]))
                {
//                    console.log(key)
                    tempobj[key] = array1[i][key];
                }
            }
            else
            {
                tempobj[key1] = array1[i];
            }
            if(array2[j] instanceof Object)
            {
                for(let key of Object.keys(array2[j]))
                {
//                    console.log(key)
                    tempobj[key] = array2[j][key];
                }
            }
            else
            {
                tempobj[key2] = array2[j];
            }
            temparray.push(tempobj);
            
        }
    }
    return temparray;
}

function* genkeys(obj)
{
    for(let keys of Object.key(obj))
    {
        yield keys;
    }
}