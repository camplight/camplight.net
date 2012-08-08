var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

var cons = require("consolidate");
var fs = require("fs");

module.exports = function BrowserCellRender(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  this.on("renderPageLayout", function(chemical){
    if(!chemical.data) {
      this.emit(new Error("Data missing for rendering layout"));
      return;
    }

    fs.exists(process.cwd()+config.root+chemical.layout+".jade", function(found){
      if(found) {
        var renderData = {
          content: chemical.data,
          code: chemical.code,
          style: chemical.style
        }
        cons.jade(process.cwd()+config.root+chemical.layout+".jade", renderData, self.render(chemical));
      }
      else
        this.emit(new Error(process.cwd()+config.root+chemical.layout+".jade was not found"));
    });
  });
}

util.inherits(module.exports, Organel);


module.exports.prototype.render = function(chemical) {
  
  var self = this;
  return function(err, renderedData){
    if(err) {
      err.message += " while trying to render layout at "+chemical.page;
      self.emit(err);
      return;
    }

    chemical.type = "httpResponse";
    chemical.data = renderedData;
    self.emit(chemical);
  }
}