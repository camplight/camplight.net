require("ga");
$ = require("jquery-browserify");

$(document).ready(function(){
  if($(document).height() < 800)
    $("#bottom").css({position: "fixed"});
  else
    $("#bottom").css({position: "relative"});
});