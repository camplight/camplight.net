var util = require("util");
var fs = require("fs");

var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

module.exports = function ShopRequestHandler(plasma, config){
  Organel.call(this, plasma);

  this.on("renderPage", function(chemical){
    if(chemical.page == "/shop-request") {
      //console.log(chemical.req.body, chemical.req.params, chemical.req.query);
      this.emit(chemical);
    } else
      return false;
  });
}

util.inherits(module.exports, Organel);