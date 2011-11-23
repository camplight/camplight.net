$(document).ready ->
  $(".logoTop").animate { opacity: 1, top: '20px' }, 300
  $(".logoShadow").animate { opacity: 1 }, 600
  $(".logoTypo").delay(600).animate { opacity: 1 }, 600

  $(".shtrak").hover ->
    $(this).append "<div class='toolboxShtrak'></div>"
    $(".toolboxShtrak").animate {opacity: 0.8, marginTop: '-70px'} , ->
      $(".toolboxShtrak").fadeOut 200	
    
  $(".gamecraft").hover ->
    $(this).append "<div class='toolbox'></div>"
    $(".toolBox").animate { opacity: 0.8, marginTop: "-65px"}, ->
      $(".toolbox").fadeOut 200	
    
  $(".sr").hover ->
    $(this).append "<div class='toolboxSr'></div>"
    $(".toolboxSr").animate { opacity: 0.8, marginTop: "-62px"} , ->
      $(".toolboxSr").fadeOut 200	
