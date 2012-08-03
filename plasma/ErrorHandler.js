var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

module.exports = function ErrorHandler(plasma){
  Organel.call(this, plasma);

  this.on(Error, function(chemical){
    console.log("ERROR:".red+chemical);
  });
}

util.inherits(module.exports, Organel);