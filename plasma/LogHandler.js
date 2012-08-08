var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

module.exports = function LogHandler(plasma){
  Organel.call(this, plasma);

  this.on("log", function(chemical){
    console.log("LOG:".blue+chemical.data);
  });
}

util.inherits(module.exports, Organel);