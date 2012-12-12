// #!/usr/bin/env node
process.env.CELL_MODE = process.env.CELL_MODE || "development";

var util = require("util");
var Cell = require("organic-webcell/WebCell");

module.exports = function(dna) {
  Cell.call(this, dna);
}

util.inherits(module.exports, Cell);

// start the cell if this file is not required
if(!module.parent)
  new module.exports();