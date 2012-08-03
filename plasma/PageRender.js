var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;
var cons = require("consolidate");
var fs = require("fs");

module.exports = function PageRender(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  this.on("renderPage", function(chemical){
    if(!chemical.page) {
      this.emit(new Error("recieving chemical without page"));
      return;
    }
  
    fs.exists(process.cwd()+config.templates+chemical.page+".jade", function(found){
      if(found)
        cons.jade(process.cwd()+config.templates+chemical.page+".jade", chemical.data || {}, self.render(chemical));
      else
        cons.jade(process.cwd()+config.templates+"/404.jade", chemical.data || {}, self.render(chemical));
    });
  });
}

util.inherits(module.exports, Organel);

module.exports.prototype.render = function(chemical) {
  
  var self = this;
  return function(err, renderedData){
    if(err) {
      err.message += " while trying to render "+chemical.page;
      self.emit(err);
      return;
    }

    var response = new Chemical();
    response.type = "httpResponse";
    response.data = renderedData;
    
    //  pass req to "httpResponse" chemical to return that through httpServer
    response.req = chemical.req;
    self.emit(response);
  }
}