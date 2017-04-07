/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

  var samplearray=[];
  for(i=1; i<=20; i++)
  {
      samplearray.push(i);
  }
//  console.log(shuffle(samplearray));
 
 /* create array constructor */

Array.prototype.shuffle = function()
{
    var currentIndex = this.length;
    var temporaryValue;
    var randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) 
    {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }
};

//samplearray.shuffle()
//console.log(samplearray);