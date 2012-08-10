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
  
    fs.exists(process.cwd()+config.root+chemical.page+".jade", function(found){
      var renderData = {
        code: chemical.code,
        style: chemical.style
      };
      if(found)
        cons.jade(process.cwd()+config.root+chemical.page+".jade", renderData, self.render(chemical));
      else
        cons.jade(process.cwd()+config.root+"/404.jade", renderData, self.render(chemical));
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

    if(chemical.layout && !chemical.req.query.contentOnly)
      chemical.type = "renderPageLayout";
    else
      chemical.type = "httpResponse";
    chemical.data = renderedData;
    self.emit(chemical);
  }
}