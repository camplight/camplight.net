#!/usr/bin/env node
var fs = require("fs");
var Cell = require("organic").Cell;

fs.readFile(process.cwd()+"/dna.json", function(err, data){
  if(err) throw err;
  try {
    var dnaData = JSON.parse(data.toString());
  } catch(e){
    throw new Error("could not parse DNA at "+dnaPATH);
  }
  var cell = new Cell(dnaData);
});