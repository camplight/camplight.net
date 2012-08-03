$(document).ready(function(){
  
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