$(document).ready(function(){

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