var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

var fs = require("fs");

module.exports = function PageStyle(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  this.on("handlePage", function(chemical){
    chemical.type = "renderPage";
    fs.exists(process.cwd()+config.root+chemical.page+".css", function(exists){
      if(exists) {
        fs.readFile(process.cwd()+config.root+chemical.page+".css", function(err, data){
          chemical.style = "<style>"+data.toString()+"</style>";
          self.emit(chemical);
        });
      } else {
        chemical.style = "<link rel='stylesheet' href='/default.css' />";
        self.emit(chemical);
      }
    });
  });
}

util.inherits(module.exports, Organel);