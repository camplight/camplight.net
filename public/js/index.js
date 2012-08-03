$(document).ready(function(){

  $("#header").css({
    height: "0px"
  }).show().animate({
    height: "224px"
  });

  $("#skills").css({
    height: "0px"
  }).delay(1800).show().animate({
    height: "300px"
  });

  $("#team").css({
    height: "0px"
  }).delay(3600).show().animate({
    height: "300px"
  });
});