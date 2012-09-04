require("ga");
jQuery = $ = require("jquery-browserify");
require("./libs/jquery.animate-colors-min");
require("./libs/jquery.idle-timer");

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
    $(".icon.colored", this).fadeIn();
  });

  target.mouseleave(function(){
    var self = this;
    $(".icon.colored", this).fadeOut();
  });
}

var animateWhenIdle = function(){
  var target = $('[effect-hover="blink"]');
  if(target.length == 0)
    return;

  var animationIntervalID;
  $.idleTimer(5000);
  $(document).bind("idle.idleTimer", function(){
    animationIntervalID = setInterval(function(){
      if(Math.random()*100 > 50)
        return;
      for(var i = target.length-1; i>=0; i--) {
        $(".icon.colored", target[i]).delay((target.length-i)*Math.random()*50).fadeIn().delay((target.length-i)*10).fadeOut();
      }
    }, 10000);
  });
  $(document).bind("active.idleTimer", function(){
    if(animationIntervalID)
      clearInterval(animationIntervalID);
  });
}

$(document).ready(function(){
  $("#header .wrap").html($("#animatedLogoTemplate").html());
  $(".logoTop").animate({ opacity: "1", top: "20px" }, 600);
  $(".logoShadow").animate({ opacity: "1" }, 600);
  $(".logoCamplightText").delay(800).animate({ opacity: "1" }, 600);
  showAll();
  hoverAll();
  animateWhenIdle();
});