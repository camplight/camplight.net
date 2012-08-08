require("./libs/ga.js");
_ = require("./libs/underscore");
Backbone = require("./libs/backbone");

$(document).ready(function(){

  require("./routes");
  Backbone.history.start({pushState: true, silent: true});
  
  var screenHeight = $(window).height()-20;
  var headerHeight = $("#header").height();
  var bottomHeight = $("#bottom").height()+30;
  var footerHeight = $("#footer").height();

  $("#bottom").css({
    position: "absolute",
    top: headerHeight,
    width: "100%"
  }).animate({top: screenHeight-bottomHeight-footerHeight});

  $("#footer").css({
    position: "absolute",
    top: headerHeight+bottomHeight,
    width: "100%"
  }).animate({top: screenHeight-footerHeight});

  $("#content").show();
});