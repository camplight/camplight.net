$(document).ready ->
  showFlybox = ->
    $(".blackoverlay").css 'display', 'block'
    $(".blackoverlay").animate { opacity: .8 }, 600 , ->
      $(".flybox").css 'display', 'block'
      $(".flybox").animate {opacity: 1 }, 600
  closeFlybox = ->
    $(".flybox").animate {opacity: 0 }, 600, ->
      $(".flybox").css 'display', 'none'
      $(".blackoverlay").animate { opacity: 0 }, 600, -> 
        $(".blackoverlay").css 'display', 'none'
    
  $('.contacts').click showFlybox
  $('.flybox_close').click closeFlybox

