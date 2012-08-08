var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

var fs = require("fs");
var browserify = require('browserify');

module.exports = function PageCode(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  this.on("handlePage", function(chemical){
    fs.exists(process.cwd()+config.root+chemical.page+".js", function(exists){
      if(exists) {
        b = browserify({debug: true});
        b.addEntry(process.cwd()+config.root+chemical.page+".js");
        chemical.code = "<script>"+b.bundle()+"</script>";
        self.emit(chemical);
      } else
        self.emit(chemical);
    });
  });
}

util.inherits(module.exports, Organel);