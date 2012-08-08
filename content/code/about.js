require("./libs/ga.js");
_ = require("./libs/underscore");
Backbone = require("./libs/backbone");

$(document).ready(function(){

  require("./routes");
  Backbone.history.start({pushState: true, silent: true});
  
  $("#header").css({
    height: "0px"
  }).show().animate({
    height: "224px"
  });

  $("#bottom").css({
    opacity: "0"
  }).show().delay(1400).animate({
    opacity: "1"
  }, 200);

  $("#footer").css({
    opacity: "0"
  }).show().delay(1600).animate({
    opacity: "1"
  }, 200);

  $("#content").css({
    opacity: "0"
  }).delay(1800).show().animate({
    opacity: "1"
  });

  
});