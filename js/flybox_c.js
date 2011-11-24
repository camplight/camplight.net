
  $(document).ready(function() {
    var closeFlybox, showFlybox;
    showFlybox = function() {
      $(".blackoverlay").css('display', 'block');
      return $(".blackoverlay").animate({
        opacity: .8
      }, 600, function() {
        $(".flybox").css('display', 'block');
        return $(".flybox").animate({
          opacity: 1
        }, 600);
      });
    };
    closeFlybox = function() {
      return $(".flybox").animate({
        opacity: 0
      }, 600, function() {
        $(".flybox").css('display', 'none');
        return $(".blackoverlay").animate({
          opacity: 0
        }, 600, function() {
          return $(".blackoverlay").css('display', 'none');
        });
      });
    };
    $('.contacts').click(showFlybox);
    return $('.flybox_close').click(closeFlybox);
  });
