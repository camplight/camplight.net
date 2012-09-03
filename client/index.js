require("ga");
jQuery = $ = require("jquery-browserify");
require("./libs/jquery.animate-colors-min");

var showAll = function(){
  var target = $('[effect-show="dropin"]');
  target.hide();
  for(var i = 0; i<target.length; i++) {
    $(target[i]).delay(i*50).fadeIn();
  }
}

var hoverAll = function(){
  var target = $('[effect-hover="blink"]');
  target.mouseenter(function(){
    $(".fn", this)
      .animate({
        color: "#AAA"
      })
      .delay(10)
      .animate({
        color: "#333"
      });
  });
}

$(document).ready(function(){
  $("#header .wrap").html($("#animatedLogoTemplate").html());
  $(".logoTop").animate({ opacity: "1", top: "20px" }, 600);
  $(".logoShadow").animate({ opacity: "1" }, 600);
  $(".logoCamplightText").delay(800).animate({ opacity: "1" }, 600);
  showAll();
  hoverAll();
});