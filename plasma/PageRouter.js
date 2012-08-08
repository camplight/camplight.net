var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

module.exports = function PageRouter(plasma){
  Organel.call(this, plasma);

  this.on("httpRequest", function(chemical){
    chemical.type = "handlePage";
    
    // default page - index
    chemical.page = "/index";
    
    // default layout - layout
    chemical.layout = "/common/layout";
    
    if(chemical.req.path != "/")
      chemical.page = chemical.req.path;
    
    this.emit(chemical);
  });
}

util.inherits(module.exports, Organel);