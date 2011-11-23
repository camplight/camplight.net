
  $(document).ready(function() {
    $(".logoTop").animate({
      opacity: 1,
      top: '20px'
    }, 300);
    $(".logoShadow").animate({
      opacity: 1
    }, 600);
    $(".logoTypo").delay(600).animate({
      opacity: 1
    }, 600);
    $(".shtrak").hover(function() {
      $(this).append("<div class='toolboxShtrak'></div>");
      return $(".toolboxShtrak").animate({
        opacity: 0.8,
        marginTop: '-70px'
      }, function() {
        return $(".toolboxShtrak").fadeOut(200);
      });
    });
    $(".gamecraft").hover(function() {
      $(this).append("<div class='toolbox'></div>");
      return $(".toolBox").animate({
        opacity: 0.8,
        marginTop: "-65px"
      }, function() {
        return $(".toolbox").fadeOut(200);
      });
    });
    return $(".sr").hover(function() {
      $(this).append("<div class='toolboxSr'></div>");
      return $(".toolboxSr").animate({
        opacity: 0.8,
        marginTop: "-62px"
      }, function() {
        return $(".toolboxSr").fadeOut(200);
      });
    });
  });
