#!/usr/bin/env node
var util = require("util");
var Cell = require("organic-webapp/WebAppCell");

module.exports = function(dna) {
  Cell.call(this, dna);
}

util.inherits(module.exports, Cell);

// start the cell if this file is not required
if(!module.parent)
  new module.exports();