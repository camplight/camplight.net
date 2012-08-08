var util = require("util");
var express = require('express');

var Chemical = require("organic").Chemical;
var Organel = require("organic").Organel;

module.exports = function HttpServer(plasma, config){
  Organel.call(this, plasma);

  var app = express();
  var responseClients = [];
  var self = this;

  if(config.staticFolder)
    app.use(express.static(process.cwd()+config.staticFolder));

  app.get('*', function(req, res){
    var chemical = new Chemical();
    chemical.req = req;
    chemical.type = "httpRequest";

    // store incoming req, res to be able to respond on httpResponse chemical.
    responseClients.push({req: req, res: res});

    // finally emit to the plasma/membrane?
    self.emit(chemical);
  });

  self.on("httpResponse", function(chemical){
    for(var i = 0; i<responseClients.length; i++) {
      var client = responseClients[i];
      if(chemical.req.url == client.req.url) {
        client.res.send(chemical.data);
        responseClients.splice(i,1);
      }
    }
  });

  config.port = config.port || 1337;

  app.listen(config.port, function(){
    console.log('HttpServer running at http://127.0.0.1:'+config.port+'/');  
    self.emit(new Chemical("httpServerReady", this));
  });
  
}

util.inherits(module.exports, Organel);