$(document).ready(function(){

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

  $("#skills").css({
    height: "0px"
  }).delay(1800).show().animate({
    height: "300px"
  }, 600);

  $("#team").css({
    height: "0px"
  }).delay(2600).show().animate({
    height: "300px"
  }, 600);
});