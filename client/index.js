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
    var self = this;
    $(this)
      .animate({
        opacity: 0
      }, function(){
        $(self).addClass("colored");
      })
      .delay(10)
      .animate({
        opacity: 1
      });
  });

  target.mouseleave(function(){
    var self = this;
    $(this)
      .animate({
        opacity: 0
      }, function(){
        $(self).removeClass("colored");
      })
      .delay(10)
      .animate({
        opacity: 1
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