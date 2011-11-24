$(document).ready(function(){
  $(".logoTop").animate({ opacity: "1", top: "20px" }, 300);
  $(".logoShadow").animate({ opacity: "1" }, 600);
  $(".logoTypo").delay(600).animate({ opacity: "1" }, 600);

  $(".shtrak").hover(function(){
    $(this).append("<div class='toolboxShtrak'></div>");
    $(".toolboxShtrak").animate({ opacity: "0.8", marginTop: "-70px"});
  }, function() { $(".toolboxShtrak").fadeOut(200); });	
    
  $(".gamecraft").hover(function(){
    $(this).append("<div class='toolbox'></div>");
    $(".toolBox").animate({ opacity: "0.8", marginTop: "-65px"});
  }, function() { $(".toolbox").fadeOut(200);});	
    
  $(".sr").hover(function(){
    $(this).append("<div class='toolboxSr'></div>");
    $(".toolboxSr").animate({ opacity: "0.8", marginTop: "-62px"});
  }, function() { $(".toolboxSr").fadeOut(200);});	

});
