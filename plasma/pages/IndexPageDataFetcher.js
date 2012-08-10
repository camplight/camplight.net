var util = require("util");
var fs = require("fs");

var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

module.exports = function IndexPageDataFetcher(plasma, config){
  Organel.call(this, plasma);

  var members = JSON.parse(fs.readFileSync(process.cwd()+config.store));

  this.on("renderPage", function(chemical){
    if(chemical.page == "/index") {
      if(!chemical.data)
        chemical.data = {};
      chemical.data.members = members;
      this.emit(chemical);
      return;
    }

    return false;// checmical not received.
  });
}

util.inherits(module.exports, Organel);