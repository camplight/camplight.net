var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

var fs = require("fs");

module.exports = function PageCode(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  this.on("handlePage", function(chemical){
    chemical.type = "renderPage";
    fs.exists(process.cwd()+config.root+chemical.page+".css", function(exists){
      if(exists) {
        fs.readFile(process.cwd()+config.root+chemical.page+".css", function(err, data){
          chemical.style = data.toString();
          self.emit(chemical);
        });
      } else
        self.emit(chemical);
    });
  });
}

util.inherits(module.exports, Organel);